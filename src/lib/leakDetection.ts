import { MeterReading, DayAnalysis, LeakStatus, Household, PeerDivergenceInfo } from '@/types';

export function calculateStdDev(values: number[], mean: number): number {
  if (values.length <= 1) return 0;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Splits detection into two independent statuses:
 * 1. LEAK (red): overnightLiters > 14-day rolling mean + 2.5σ for 2+ consecutive nights.
 *    (Water running when no one's using it). Takes priority.
 * 2. HIGH USAGE (amber): daytimeLiters (or total) > 14-day rolling mean + 2.5σ for 2+ consecutive days,
 *    while overnight stays in baseline. (High domestic activity, nothing leaking).
 * 3. NORMAL (green): within statistical bounds.
 *
 * Persists for 2+ consecutive readings before flagging. Single-day spike (garden hose) does NOT flag.
 */
export function analyzeReadings(
  readings: MeterReading[],
  allReadings: MeterReading[],
  currentHousehold: Household,
  allHouseholds: Household[],
  windowSize: number = 14
): {
  timeline: DayAnalysis[];
  status: LeakStatus;
} {
  const defaultPeerDivergence: PeerDivergenceInfo = {
    confidence: 'HIGH',
    confidencePercent: 99,
    label: 'Optimal (99%)',
    description: 'Both household and peer consumption tracked inside normal baseline bounds.',
    isPeerFlat: true,
    householdDiffPercent: 0,
    peerTrendPercent: 0
  };

  if (!readings || readings.length === 0) {
    return {
      timeline: [],
      status: {
        hasLeak: false,
        hasHighUsage: false,
        severity: 'NORMAL',
        consecutiveDays: 0,
        latestReadingLiters: 0,
        latestDaytimeLiters: 0,
        latestOvernightLiters: 0,
        rollingAvgLiters: 0,
        rollingStdDev: 0,
        rollingOvernightAvgLiters: 0,
        estimatedExcessLitersPerDay: 0,
        peerComparisonDiffPercent: 0,
        peerAvgLiters: 0,
        peerDivergence: defaultPeerDivergence,
        title: "Everything's normal",
        explanation: 'No meter readings logged yet.'
      }
    };
  }

  // Sort readings chronologically
  const sorted = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Determine peer households (same locality, occupants ±1)
  const peerHouseholds = allHouseholds.filter(h => 
    h.id !== currentHousehold.id &&
    h.locality === currentHousehold.locality &&
    Math.abs(h.occupants - currentHousehold.occupants) <= 1
  );
  const effectivePeers = peerHouseholds.length > 0
    ? peerHouseholds
    : allHouseholds.filter(h => h.id !== currentHousehold.id);

  const peerReadingsByDate: Record<string, number[]> = {};
  allReadings.forEach(r => {
    if (effectivePeers.some(p => p.id === r.household_id)) {
      if (!peerReadingsByDate[r.date]) peerReadingsByDate[r.date] = [];
      peerReadingsByDate[r.date].push(r.liters);
    }
  });

  const timeline: DayAnalysis[] = [];
  let overnightStreak = 0;
  let overnightStreakStartDate: string | undefined = undefined;
  let daytimeStreak = 0;
  let daytimeStreakStartDate: string | undefined = undefined;
  let generalStreak = 0;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];

    // Rolling window of past 14 days
    const windowStart = Math.max(0, i - windowSize);
    const windowItems = sorted.slice(windowStart, i);
    const unflaggedItems = timeline.slice(windowStart, i).filter(t => !t.is_anomalous);

    const baseItems = unflaggedItems.length >= 3 ? unflaggedItems : windowItems;

    // Total baseline
    let rolling_avg = current.liters;
    let rolling_stddev = 25;
    if (baseItems.length >= 3) {
      const tVals = baseItems.map(b => b.liters);
      rolling_avg = Math.round((tVals.reduce((a, b) => a + b, 0) / tVals.length) * 10) / 10;
      rolling_stddev = Math.round(calculateStdDev(tVals, rolling_avg) * 10) / 10;
    }
    const minStdDev = Math.max(rolling_stddev, 15);
    const totalThreshold = Math.round((rolling_avg + (2.5 * minStdDev)) * 10) / 10;
    const is_total_anomalous = baseItems.length >= 3 && current.liters > totalThreshold;

    // Overnight baseline
    let rolling_overnight_avg = current.overnightLiters;
    let rolling_overnight_stddev = 2;
    if (baseItems.length >= 3) {
      const oVals = baseItems.map(b => b.overnightLiters);
      rolling_overnight_avg = Math.round((oVals.reduce((a, b) => a + b, 0) / oVals.length) * 10) / 10;
      rolling_overnight_stddev = Math.round(calculateStdDev(oVals, rolling_overnight_avg) * 10) / 10;
    }
    const minOvernightStdDev = Math.max(rolling_overnight_stddev, 3);
    const overnightThreshold = Math.round((rolling_overnight_avg + (2.5 * minOvernightStdDev)) * 10) / 10;
    const is_overnight_anomalous = baseItems.length >= 3 && current.overnightLiters > overnightThreshold;

    // Daytime baseline
    let rolling_daytime_avg = current.daytimeLiters;
    let rolling_daytime_stddev = 15;
    if (baseItems.length >= 3) {
      const dVals = baseItems.map(b => b.daytimeLiters);
      rolling_daytime_avg = Math.round((dVals.reduce((a, b) => a + b, 0) / dVals.length) * 10) / 10;
      rolling_daytime_stddev = Math.round(calculateStdDev(dVals, rolling_daytime_avg) * 10) / 10;
    }
    const minDaytimeStdDev = Math.max(rolling_daytime_stddev, rolling_daytime_avg * 0.08, 15);
    const daytimeThreshold = Math.round((rolling_daytime_avg + (2.5 * minDaytimeStdDev)) * 10) / 10;
    const is_daytime_anomalous = baseItems.length >= 3 && current.daytimeLiters > daytimeThreshold;

    const is_any_elevated = is_overnight_anomalous || is_daytime_anomalous || is_total_anomalous;

    // Streaks
    if (is_overnight_anomalous) {
      overnightStreak += 1;
      if (!overnightStreakStartDate) overnightStreakStartDate = current.date;
    } else {
      overnightStreak = 0;
      overnightStreakStartDate = undefined;
    }

    if (is_daytime_anomalous || is_total_anomalous) {
      daytimeStreak += 1;
      if (!daytimeStreakStartDate) daytimeStreakStartDate = current.date;
    } else {
      daytimeStreak = 0;
      daytimeStreakStartDate = undefined;
    }

    if (is_any_elevated) {
      generalStreak += 1;
    } else {
      generalStreak = 0;
    }

    // Flagged only when elevated reading persists for 2+ consecutive readings
    const is_anomalous = generalStreak >= 2;
    const is_elevated_unflagged = generalStreak === 1;

    // Peer average
    const peerVals = peerReadingsByDate[current.date] || [];
    const peer_avg = peerVals.length > 0
      ? Math.round(peerVals.reduce((a, b) => a + b, 0) / peerVals.length)
      : Math.round(currentHousehold.occupants * 130);

    timeline.push({
      date: current.date,
      daytimeLiters: current.daytimeLiters,
      overnightLiters: current.overnightLiters,
      liters: current.liters,
      rolling_daytime_avg,
      rolling_overnight_avg,
      rolling_avg,
      rolling_stddev: minStdDev,
      rolling_overnight_stddev: minOvernightStdDev,
      is_daytime_anomalous,
      is_overnight_anomalous,
      is_anomalous,
      is_elevated_unflagged,
      streak: generalStreak,
      peer_avg,
      is_simulated: current.is_simulated
    });
  }

  const latest = timeline[timeline.length - 1];

  // LEAK requires 2+ consecutive nights of elevated overnightLiters
  const hasLeak = overnightStreak >= 2;

  // HIGH USAGE requires 2+ consecutive days of elevated daytime/total while overnight is normal
  const hasHighUsage = !hasLeak && (daytimeStreak >= 2 || generalStreak >= 2);

  let severity: 'NORMAL' | 'HIGH_USAGE' | 'LEAK_DETECTED' = 'NORMAL';
  let title = "Everything's normal";
  let explanation = 'Water consumption is within standard baseline limits.';
  let consecutiveDays = 0;
  let anomalyStartDate: string | undefined = undefined;

  // Excess liters is strictly calculated as (current reading − rolling average)
  const excess = Math.max(0, Math.round(latest.liters - latest.rolling_avg));

  if (hasLeak) {
    severity = 'LEAK_DETECTED';
    consecutiveDays = overnightStreak;
    anomalyStartDate = overnightStreakStartDate;
    title = "Possible leak — water is running when no one's using it";
    explanation = `Overnight minimum flow has stayed elevated (${latest.overnightLiters} L vs normal ~${Math.round(latest.rolling_overnight_avg)} L) for ${overnightStreak} consecutive nights.`;
  } else if (hasHighUsage) {
    severity = 'HIGH_USAGE';
    consecutiveDays = daytimeStreak || generalStreak;
    anomalyStartDate = daytimeStreakStartDate;
    title = 'Usage is higher than usual';
    explanation = `Daily usage is elevated above your 14-day average for ${consecutiveDays} consecutive days, but overnight flow remains flat. Likely domestic activity, not a plumbing fault.`;
  }

  const peerDiffPercent = latest.peer_avg > 0
    ? Math.round(((latest.liters - latest.peer_avg) / latest.peer_avg) * 100)
    : 0;

  // Compute Peer Divergence Confidence Boost
  // Calculate peer baseline trend over the 14-day window
  const peerBaselineVals: number[] = [];
  for (let j = Math.max(0, sorted.length - 15); j < sorted.length - 1; j++) {
    const pVals = peerReadingsByDate[sorted[j].date] || [];
    if (pVals.length > 0) {
      peerBaselineVals.push(pVals.reduce((a, b) => a + b, 0) / pVals.length);
    }
  }
  const peerBaselineAvg = peerBaselineVals.length > 0
    ? peerBaselineVals.reduce((a, b) => a + b, 0) / peerBaselineVals.length
    : latest.peer_avg;

  const peerTrendPercent = peerBaselineAvg > 0
    ? Math.round(((latest.peer_avg - peerBaselineAvg) / peerBaselineAvg) * 100)
    : 0;

  const hhDiffPercent = latest.rolling_avg > 0
    ? Math.round(((latest.liters - latest.rolling_avg) / latest.rolling_avg) * 100)
    : 0;

  let peerDivergence: PeerDivergenceInfo;

  if (severity !== 'NORMAL' || hhDiffPercent > 15) {
    // Household usage rose
    if (peerTrendPercent <= 5) {
      // Peers stayed flat while household rose -> HIGH confidence isolated fault
      peerDivergence = {
        confidence: 'HIGH',
        confidencePercent: 98,
        label: 'High Confidence (98%)',
        description: `Household usage surged while local peers stayed flat (${peerTrendPercent >= 0 ? '+' : ''}${peerTrendPercent}%). Isolated property event.`,
        isPeerFlat: true,
        householdDiffPercent: hhDiffPercent,
        peerTrendPercent
      };
    } else {
      // Both rose together -> MODERATE confidence (possible collective weather/seasonal draw)
      peerDivergence = {
        confidence: 'MODERATE',
        confidencePercent: 64,
        label: 'Moderate Confidence (64%)',
        description: `Neighborhood peer usage also rose (+${peerTrendPercent}%). Possible collective weather or seasonal draw.`,
        isPeerFlat: false,
        householdDiffPercent: hhDiffPercent,
        peerTrendPercent
      };
    }
  } else {
    peerDivergence = defaultPeerDivergence;
  }

  return {
    timeline,
    status: {
      hasLeak,
      hasHighUsage,
      severity,
      consecutiveDays,
      anomalyStartDate,
      latestReadingLiters: latest.liters,
      latestDaytimeLiters: latest.daytimeLiters,
      latestOvernightLiters: latest.overnightLiters,
      rollingAvgLiters: latest.rolling_avg,
      rollingStdDev: latest.rolling_stddev,
      rollingOvernightAvgLiters: latest.rolling_overnight_avg,
      estimatedExcessLitersPerDay: excess,
      peerComparisonDiffPercent: peerDiffPercent,
      peerAvgLiters: latest.peer_avg,
      peerDivergence,
      title,
      explanation
    }
  };
}
