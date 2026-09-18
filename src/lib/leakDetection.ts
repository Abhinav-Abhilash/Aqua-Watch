import type { MeterReading, DayAnalysis, LeakStatus, Household, PeerDivergenceInfo, AlertCategory, LeakSeverityTier } from '../types/index.ts';

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
  currentHousehold?: Household,
  allHouseholds: Household[] = [],
  windowSize: number = 14
): {
  timeline: DayAnalysis[];
  status: LeakStatus;
} {
  const safeHousehold = currentHousehold || {
    id: 'h-henderson',
    name: 'The Henderson Residence (Demo Home)',
    occupants: 4,
    locality: 'Pine Valley',
    expectedOvernightLiters: 0
  };
  const declaredOvernight = Math.max(0, safeHousehold.expectedOvernightLiters || 0);

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
        effectiveOvernightLiters: 0,
        expectedOvernightLiters: declaredOvernight,
        hasUnusualOvernightActivity: false,
        baselineResetDate: safeHousehold.baselineResetDate,
        baselineResetNote: safeHousehold.baselineResetNote,
        latestBuckets: [0, 0, 0, 0, 0],
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
    h.id !== safeHousehold.id &&
    h.locality === safeHousehold.locality &&
    Math.abs(h.occupants - safeHousehold.occupants) <= 1
  );
  const effectivePeers = peerHouseholds.length > 0
    ? peerHouseholds
    : allHouseholds.filter(h => h.id !== safeHousehold.id);

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
  let burstStreak = 0;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];

    // Effective overnight flow after deducting declared scheduled recurring appliances
    const effectiveOvernight = Math.max(0, current.overnightLiters - declaredOvernight);

    // 5 hourly buckets: 1am, 2am, 3am, 4am, 5am
    const rawBuckets: [number, number, number, number, number] = current.overnightBuckets || [
      Math.round(current.overnightLiters * 0.2),
      Math.round(current.overnightLiters * 0.2),
      Math.round(current.overnightLiters * 0.2),
      Math.round(current.overnightLiters * 0.2),
      Math.round(current.overnightLiters * 0.2)
    ];

    const perBucketDeclared = declaredOvernight / 5;
    const effectiveBuckets: [number, number, number, number, number] = [
      Math.max(0, Math.round((rawBuckets[0] - perBucketDeclared) * 10) / 10),
      Math.max(0, Math.round((rawBuckets[1] - perBucketDeclared) * 10) / 10),
      Math.max(0, Math.round((rawBuckets[2] - perBucketDeclared) * 10) / 10),
      Math.max(0, Math.round((rawBuckets[3] - perBucketDeclared) * 10) / 10),
      Math.max(0, Math.round((rawBuckets[4] - perBucketDeclared) * 10) / 10)
    ];

    // Determine baseline items:
    // If household has a confirmed baselineResetDate, for readings on/after that date,
    // only use readings strictly from on/after baselineResetDate up to index i - 1.
    const isPostReset = Boolean(
      safeHousehold.baselineResetDate && current.date >= safeHousehold.baselineResetDate
    );

    let baseItems: Array<{ liters: number; overnightLiters: number; daytimeLiters: number; is_anomalous?: boolean }>;
    let oBaseItems: Array<{ overnightLiters: number }>;
    let isInitialResetStabilizing = false;

    if (isPostReset) {
      const postResetReadings = sorted.slice(0, i).filter(r => r.date >= safeHousehold.baselineResetDate!);
      const postResetWindow = postResetReadings.slice(-windowSize);
      const unflaggedPostReset = timeline.slice(0, i).filter(t => t.date >= safeHousehold.baselineResetDate! && !t.is_anomalous).slice(-windowSize);

      if (postResetWindow.length === 0) {
        // Day 0 of lifestyle change: reset all active streaks and initialize baseline around this reading
        isInitialResetStabilizing = true;
        baseItems = [];
        oBaseItems = [];
      } else if (postResetWindow.length < 3) {
        // First 1-2 days after reset: learn the new normal from available post-reset items + current
        isInitialResetStabilizing = true;
        const available = [...postResetWindow, current];
        baseItems = available.map(r => ({
          liters: r.liters,
          overnightLiters: Math.max(0, r.overnightLiters - declaredOvernight),
          daytimeLiters: r.daytimeLiters
        }));
        oBaseItems = baseItems;
      } else {
        const candidateItems = unflaggedPostReset.length >= 3 ? unflaggedPostReset : postResetWindow;
        baseItems = candidateItems.map(c => ({
          liters: c.liters,
          overnightLiters: Math.max(0, c.overnightLiters - declaredOvernight),
          daytimeLiters: c.daytimeLiters
        }));
        const cleanOvernight = unflaggedPostReset.filter(t => !t.is_overnight_anomalous && !t.is_overnight_burst);
        oBaseItems = (cleanOvernight.length >= 3 ? cleanOvernight : candidateItems).map(c => ({
          overnightLiters: Math.max(0, c.overnightLiters - declaredOvernight)
        }));
      }
    } else {
      const windowStart = Math.max(0, i - windowSize);
      const windowItems = sorted.slice(windowStart, i);
      const unflaggedItems = timeline.slice(windowStart, i).filter(t => !t.is_anomalous);
      const candidateItems = unflaggedItems.length >= 3 ? unflaggedItems : windowItems;
      baseItems = candidateItems.map(c => ({
        liters: c.liters,
        overnightLiters: Math.max(0, c.overnightLiters - declaredOvernight),
        daytimeLiters: c.daytimeLiters
      }));
      // Filter out overnight bursts or leak days from overnight baseline to prevent silent inflation
      const cleanOvernight = unflaggedItems.filter(t => !t.is_overnight_anomalous && !t.is_overnight_burst);
      oBaseItems = (cleanOvernight.length >= 3 ? cleanOvernight : candidateItems).map(c => ({
        overnightLiters: Math.max(0, c.overnightLiters - declaredOvernight)
      }));
    }

    // Baseline stats calculations
    let rolling_avg = current.liters;
    let rolling_stddev = 25;
    let rolling_overnight_avg = effectiveOvernight;
    let rolling_overnight_stddev = 2;
    let rolling_daytime_avg = current.daytimeLiters;
    let rolling_daytime_stddev = 15;

    if (baseItems.length >= 3 || isInitialResetStabilizing) {
      const sample = baseItems.length > 0 ? baseItems : [{ liters: current.liters, overnightLiters: effectiveOvernight, daytimeLiters: current.daytimeLiters }];
      const tVals = sample.map(b => b.liters);
      rolling_avg = Math.round((tVals.reduce((a, b) => a + b, 0) / tVals.length) * 10) / 10;
      rolling_stddev = Math.round(calculateStdDev(tVals, rolling_avg) * 10) / 10;

      const oSample = oBaseItems && oBaseItems.length > 0 ? oBaseItems : sample;
      const oVals = oSample.map(b => b.overnightLiters);
      rolling_overnight_avg = Math.round((oVals.reduce((a, b) => a + b, 0) / oVals.length) * 10) / 10;
      rolling_overnight_stddev = Math.round(calculateStdDev(oVals, rolling_overnight_avg) * 10) / 10;

      const dVals = sample.map(b => b.daytimeLiters);
      rolling_daytime_avg = Math.round((dVals.reduce((a, b) => a + b, 0) / dVals.length) * 10) / 10;
      rolling_daytime_stddev = Math.round(calculateStdDev(dVals, rolling_daytime_avg) * 10) / 10;
    }

    const minStdDev = Math.max(rolling_stddev, 15);
    const totalThreshold = Math.round((rolling_avg + (2.5 * minStdDev)) * 10) / 10;
    const is_total_anomalous = !isInitialResetStabilizing && baseItems.length >= 3 && current.liters > totalThreshold;

    const minOvernightStdDev = Math.max(rolling_overnight_stddev, 3);
    const overnightThreshold = Math.round((rolling_overnight_avg + (2.5 * minOvernightStdDev)) * 10) / 10;
    const is_overnight_volume_elevated = !isInitialResetStabilizing && baseItems.length >= 3 && effectiveOvernight > overnightThreshold;

    const minDaytimeStdDev = Math.max(rolling_daytime_stddev, rolling_daytime_avg * 0.08, 15);
    const daytimeThreshold = Math.round((rolling_daytime_avg + (2.5 * minDaytimeStdDev)) * 10) / 10;
    const is_daytime_anomalous = !isInitialResetStabilizing && baseItems.length >= 3 && current.daytimeLiters > daytimeThreshold;

    // 5 Hourly Buckets Flow Shape Analysis
    // Determine whether overnight elevation is Continuous Trickle (Leak) vs Burst (Guest / Late Night)
    let is_overnight_anomalous = false;
    let is_overnight_burst = false;
    let flow_shape: 'CONTINUOUS' | 'BURST' | 'NORMAL' = 'NORMAL';
    let elevatedBucketCount = 0;

    if (is_overnight_volume_elevated) {
      const hourlyBaseline = rolling_overnight_avg / 5;
      const bucketElevationThreshold = Math.max(4, Math.round(hourlyBaseline + 3));
      elevatedBucketCount = effectiveBuckets.filter(b => b >= bucketElevationThreshold).length;

      if (elevatedBucketCount >= 4) {
        // Continuous trickle across MOST of the 5 buckets (4 or 5 out of 5 elevated) -> flag LEAK candidate
        flow_shape = 'CONTINUOUS';
        is_overnight_anomalous = true;
      } else if (elevatedBucketCount >= 1 && elevatedBucketCount <= 2) {
        // Burst pattern: 1-2 buckets elevated and the rest near-zero -> do NOT flag as leak
        flow_shape = 'BURST';
        is_overnight_burst = true;
        is_overnight_anomalous = false;
      } else {
        flow_shape = 'NORMAL';
        is_overnight_anomalous = false;
      }
    }

    // Streaks
    if (isInitialResetStabilizing) {
      overnightStreak = 0;
      overnightStreakStartDate = undefined;
      daytimeStreak = 0;
      daytimeStreakStartDate = undefined;
      generalStreak = 0;
      burstStreak = 0;
    } else {
      if (is_overnight_burst) {
        burstStreak += 1;
      } else {
        burstStreak = 0;
      }

      if (is_overnight_anomalous) {
        overnightStreak += 1;
        if (!overnightStreakStartDate) overnightStreakStartDate = current.date;
      } else {
        overnightStreak = 0;
        overnightStreakStartDate = undefined;
      }

      if (is_daytime_anomalous) {
        daytimeStreak += 1;
        if (!daytimeStreakStartDate) daytimeStreakStartDate = current.date;
      } else {
        daytimeStreak = 0;
        daytimeStreakStartDate = undefined;
      }

      const is_any_elevated = is_overnight_anomalous || is_daytime_anomalous || (is_total_anomalous && !is_overnight_burst);
      if (is_any_elevated) {
        generalStreak += 1;
      } else {
        generalStreak = 0;
      }
    }

    // Flagged only when elevated reading persists for 2+ consecutive readings
    const is_anomalous = generalStreak >= 2;
    const is_elevated_unflagged = generalStreak === 1;

    // Peer average
    const peerVals = peerReadingsByDate[current.date] || [];
    const peer_avg = peerVals.length > 0
      ? Math.round(peerVals.reduce((a, b) => a + b, 0) / peerVals.length)
      : Math.round(safeHousehold.occupants * 130);

    timeline.push({
      date: current.date,
      daytimeLiters: current.daytimeLiters,
      overnightLiters: current.overnightLiters,
      effectiveOvernightLiters: effectiveOvernight,
      overnightBuckets: rawBuckets,
      liters: current.liters,
      rolling_daytime_avg,
      rolling_overnight_avg,
      rolling_avg,
      rolling_stddev: minStdDev,
      rolling_overnight_stddev: minOvernightStdDev,
      is_daytime_anomalous,
      is_overnight_anomalous,
      is_overnight_burst,
      elevated_bucket_count: elevatedBucketCount,
      flow_shape,
      is_anomalous,
      is_elevated_unflagged,
      streak: generalStreak,
      peer_avg,
      is_simulated: current.is_simulated
    });
  }

  const latest = timeline[timeline.length - 1];

  // LEAK requires 2+ consecutive nights of elevated continuous overnight flow
  const hasLeak = overnightStreak >= 2;

  // HIGH USAGE requires 2+ consecutive days of elevated daytime/total while overnight is normal
  const hasHighUsage = !hasLeak && (daytimeStreak >= 2 || generalStreak >= 2);

  // Informational burst notification (2+ nights of burst overnight activity)
  const hasUnusualOvernightActivity = burstStreak >= 2;
  const unusualActivityNote = hasUnusualOvernightActivity
    ? "unusual overnight activity — may be a guest or late-night use"
    : undefined;

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario A: Vacation Mode
  // If household declared vacation mode and latest reading has meaningful consumption (>10 L),
  // immediately flag HIGH-CONFIDENCE leak, bypassing the 2-night persistence rule.
  // ──────────────────────────────────────────────────────────────────────────
  const isVacationDeclared = Boolean(
    safeHousehold.isVacationMode ||
    (safeHousehold.vacationStartDate && safeHousehold.vacationEndDate &&
      latest.date >= safeHousehold.vacationStartDate && latest.date <= safeHousehold.vacationEndDate)
  );
  const isVacationLeak = isVacationDeclared && latest.liters >= 10;

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario B: Slow-Creep Leak Detection
  // Compare current 14-day overnight baseline against 14-day overnight baseline ~45 days ago
  // ──────────────────────────────────────────────────────────────────────────
  let isSlowCreep = false;
  let slowCreepDriftPercent = 0;
  let baseline45Overnight = 0;

  if (sorted.length >= 45) {
    const pastWindowEnd = Math.max(14, sorted.length - 45);
    const pastWindowStart = Math.max(0, pastWindowEnd - 14);
    const pastReadings = sorted.slice(pastWindowStart, pastWindowEnd);
    if (pastReadings.length >= 7) {
      baseline45Overnight = pastReadings.reduce((sum, r) => sum + r.overnightLiters, 0) / pastReadings.length;
      const currentOvernightAvg = latest.rolling_overnight_avg;
      if (baseline45Overnight > 0 && currentOvernightAvg >= baseline45Overnight + 4) {
        slowCreepDriftPercent = Math.round(((currentOvernightAvg - baseline45Overnight) / baseline45Overnight) * 100);
        if (slowCreepDriftPercent >= 25) {
          isSlowCreep = true;
        }
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario E: Meter Stall / Zero-Flow Detection
  // Active residence with no vacation declared, normally using water, suddenly shows <5 L/day for 2+ days
  // ──────────────────────────────────────────────────────────────────────────
  let isMeterStall = false;
  let stalledConsecutiveDays = 0;
  if (!isVacationDeclared && sorted.length >= 3 && latest.rolling_avg > 40) {
    for (let k = sorted.length - 1; k >= 0; k--) {
      if (sorted[k].liters < 5) {
        stalledConsecutiveDays++;
      } else {
        break;
      }
    }
    if (stalledConsecutiveDays >= 2) {
      isMeterStall = true;
    }
  }

  // Determine Severity and Category
  let severity: 'NORMAL' | 'HIGH_USAGE' | 'LEAK_DETECTED' = 'NORMAL';
  let alertCategory: AlertCategory = 'ACUTE_LEAK';
  let title = "Everything's normal";
  let explanation = 'Water consumption is within standard baseline limits.';
  let consecutiveDays = 0;
  let anomalyStartDate: string | undefined = undefined;

  // Excess liters is strictly calculated as (current reading − rolling average)
  const excess = Math.max(0, Math.round(latest.liters - latest.rolling_avg));

  if (isVacationLeak) {
    severity = 'LEAK_DETECTED';
    alertCategory = 'VACATION_LEAK';
    consecutiveDays = 1;
    anomalyStartDate = latest.date;
    title = "Unexpected usage while away — possible leak or burst pipe";
    explanation = `Household is declared away in Vacation Mode, but ${latest.liters} L of consumption was recorded on ${latest.date} (${latest.daytimeLiters} L daytime, ${latest.overnightLiters} L overnight). Immediate high-confidence alert (2-night persistence bypassed).`;
  } else if (hasLeak) {
    severity = 'LEAK_DETECTED';
    alertCategory = 'ACUTE_LEAK';
    consecutiveDays = overnightStreak;
    anomalyStartDate = overnightStreakStartDate;
    title = "Possible leak — water is running when no one's using it";
    const declaredNote = declaredOvernight > 0 ? ` (after ${declaredOvernight} L scheduled appliance allowance)` : '';
    explanation = `Overnight flow has stayed elevated across continuous hourly buckets (${latest.effectiveOvernightLiters ?? latest.overnightLiters} L effective vs normal ~${Math.round(latest.rolling_overnight_avg)} L)${declaredNote} for ${overnightStreak} consecutive nights.`;
  } else if (isSlowCreep) {
    severity = 'HIGH_USAGE';
    alertCategory = 'SLOW_CREEP';
    consecutiveDays = 14;
    anomalyStartDate = sorted[Math.max(0, sorted.length - 14)].date;
    title = "Gradual increase detected — your baseline usage has risen over the last month";
    explanation = `Your 14-day overnight baseline has drifted up by +${slowCreepDriftPercent}% over the last 45 days (from ~${Math.round(baseline45Overnight)} L/night to ~${Math.round(latest.rolling_overnight_avg)} L/night) with no declared lifestyle change. Likely a slow fixture creep or degrading seal.`;
  } else if (hasHighUsage) {
    severity = 'HIGH_USAGE';
    alertCategory = 'HIGH_USAGE';
    consecutiveDays = daytimeStreak || generalStreak;
    anomalyStartDate = daytimeStreakStartDate;
    title = 'Usage is higher than usual';
    explanation = `Daily usage is elevated above your 14-day average for ${consecutiveDays} consecutive days, but overnight flow remains within baseline. Likely domestic activity, not a plumbing fault.`;
  } else if (isMeterStall) {
    severity = 'HIGH_USAGE';
    alertCategory = 'METER_STALL';
    consecutiveDays = stalledConsecutiveDays;
    anomalyStartDate = sorted[sorted.length - stalledConsecutiveDays].date;
    title = "No usage detected — check your meter or contact us";
    explanation = `Zero or near-zero water flow (<5 L/day) recorded for ${stalledConsecutiveDays} consecutive days on an active residence with no vacation declared. Check for a stuck meter valve, telemetry gateway disconnection, or unannounced absence.`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario C: Severity Tiers
  // ──────────────────────────────────────────────────────────────────────────
  let estimatedRateLph = 0;
  let severityTier: LeakSeverityTier | undefined = undefined;

  if (severity === 'LEAK_DETECTED') {
    if (alertCategory === 'VACATION_LEAK') {
      estimatedRateLph = Math.round((latest.liters / 24) * 10) / 10;
    } else {
      const excessOvernight = Math.max(0, latest.overnightLiters - declaredOvernight - latest.rolling_overnight_avg);
      estimatedRateLph = Math.round((excessOvernight / 7) * 10) / 10;
    }

    if (estimatedRateLph >= 20) {
      severityTier = 'SEVERE';
    } else if (estimatedRateLph >= 5) {
      severityTier = 'MODERATE';
    } else {
      severityTier = 'MINOR';
    }
  } else if (isSlowCreep) {
    const creepExcess = Math.max(0, latest.rolling_overnight_avg - baseline45Overnight);
    estimatedRateLph = Math.round((creepExcess / 7) * 10) / 10;
    severityTier = estimatedRateLph >= 5 ? 'MODERATE' : 'MINOR';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario D: Cost / Impact Estimate
  // ──────────────────────────────────────────────────────────────────────────
  const waterRate = safeHousehold.waterRatePer1000L || 50; // ₹50 per 1,000L
  const dailyImpactLiters = severity === 'LEAK_DETECTED'
    ? (alertCategory === 'VACATION_LEAK' ? latest.liters : Math.max(excess, Math.round(estimatedRateLph * 24)))
    : isSlowCreep
    ? Math.max(5, Math.round(latest.rolling_overnight_avg - baseline45Overnight))
    : excess;

  const estimatedCostSoFar = Math.round((dailyImpactLiters * Math.max(1, consecutiveDays) * waterRate) / 1000);
  const estimatedCostPerMonth = Math.round((dailyImpactLiters * 30 * waterRate) / 1000);

  const peerDiffPercent = latest.peer_avg > 0
    ? Math.round(((latest.liters - latest.peer_avg) / latest.peer_avg) * 100)
    : 0;

  // Compute Peer Divergence Confidence Boost
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

  if (alertCategory === 'VACATION_LEAK') {
    peerDivergence = {
      confidence: 'HIGH',
      confidencePercent: 99,
      label: 'Optimal (99%)',
      description: 'Unexpected consumption while declared away in Vacation Mode. Immediate isolated event.',
      isPeerFlat: true,
      householdDiffPercent: 100,
      peerTrendPercent: 0
    };
  } else if (severity !== 'NORMAL' || hhDiffPercent > 15) {
    if (peerTrendPercent <= 5) {
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
      effectiveOvernightLiters: latest.effectiveOvernightLiters ?? Math.max(0, latest.overnightLiters - declaredOvernight),
      expectedOvernightLiters: declaredOvernight,
      hasUnusualOvernightActivity,
      unusualActivityNote,
      baselineResetDate: safeHousehold.baselineResetDate,
      baselineResetNote: safeHousehold.baselineResetNote,
      latestBuckets: latest.overnightBuckets,
      rollingAvgLiters: latest.rolling_avg,
      rollingStdDev: latest.rolling_stddev,
      rollingOvernightAvgLiters: latest.rolling_overnight_avg,
      estimatedExcessLitersPerDay: excess,
      peerComparisonDiffPercent: peerDiffPercent,
      peerAvgLiters: latest.peer_avg,
      peerDivergence,
      title,
      explanation,
      
      // Expanded detection fields (Scenarios A - E)
      alertCategory,
      severityTier,
      estimatedRateLph,
      estimatedCostSoFar,
      estimatedCostPerMonth,
      waterRatePer1000L: waterRate,
      isVacationActive: isVacationDeclared,
      slowCreepDriftPercent: isSlowCreep ? slowCreepDriftPercent : undefined,
      stalledConsecutiveDays: isMeterStall ? stalledConsecutiveDays : undefined
    }
  };
}
