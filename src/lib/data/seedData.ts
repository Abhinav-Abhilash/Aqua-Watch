import type { Household, MeterReading } from '../../types/index.ts';

export const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'h-henderson',
    name: 'The Henderson Residence (Demo Home)',
    occupants: 4,
    locality: 'Pine Valley',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Primary demo home — normal baseline, ready for live pitch demo'
  },
  {
    id: 'h-miller',
    name: 'The Miller Family',
    occupants: 4,
    locality: 'Pine Valley',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Active leak pre-seeded: running flapper valve (+145 L/night across all 5 hourly buckets — continuous trickle)'
  },
  {
    id: 'h-morales',
    name: 'The Morales Home',
    occupants: 3,
    locality: 'Pine Valley',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Overnight guest visiting: burst usage (+42 L at 2am, rest 1 L) for 3 consecutive nights'
  },
  {
    id: 'h-vance',
    name: 'The Vance Residence',
    occupants: 3,
    locality: 'Pine Valley',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    isVacationMode: true,
    vacationStartDate: '2026-09-12',
    vacationEndDate: '2026-09-25',
    notes: 'Scenario A test home: declared away on vacation, unexpected flow recorded'
  },
  {
    id: 'h-chen',
    name: 'Oakridge Villa (Chen Family)',
    occupants: 3,
    locality: 'Oakridge Suburb',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Consistent low-flow fixtures installed'
  },
  {
    id: 'h-bennett',
    name: 'The Bennett Family',
    occupants: 3,
    locality: 'Oakridge Suburb',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Scenario B test home: slow-creep baseline rise (+200% overnight drift over 45 days)'
  },
  {
    id: 'h-ramirez',
    name: 'Ramirez Residence',
    occupants: 2,
    locality: 'Oakridge Suburb',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Peer-bridge home ensuring Oakridge occupants ±1 connectivity'
  },
  {
    id: 'h-jenkins',
    name: 'Greenwood Cottage (Complan Neeraj)',
    occupants: 1,
    locality: 'Oakridge Suburb',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Single occupant eco-conscious home'
  },
  {
    id: 'h-patel',
    name: 'Harbor Crest (Patel Family)',
    occupants: 5,
    locality: 'Harborview District',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Scheduled appliance test home: overnight sprinkler running 35 L/night (flags when expectedOvernightLiters is 0; clears when set to 35)'
  },
  {
    id: 'h-foster',
    name: 'Foster Residence',
    occupants: 4,
    locality: 'Harborview District',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Peer-bridge home ensuring Harborview occupants ±1 connectivity'
  },
  {
    id: 'h-singh',
    name: 'Singh Family House',
    occupants: 3,
    locality: 'Harborview District',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Peer-bridge home ensuring Harborview occupants ±1 connectivity'
  },
  {
    id: 'h-taylor',
    name: 'The Taylor Loft',
    occupants: 2,
    locality: 'Harborview District',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Downtown duplex'
  },
  {
    id: 'h-gallagher',
    name: 'Gallagher Flat',
    occupants: 2,
    locality: 'Harborview District',
    expectedOvernightLiters: 0,
    waterRatePer1000L: 50,
    notes: 'Scenario E test home: zero flow detected for last 3 days with no vacation declared (stalled meter)'
  }
];

export const AVAILABLE_LOCALITIES = [
  'Pine Valley',
  'Oakridge Suburb',
  'Harborview District'
];

/**
 * Generates exactly 60 days of realistic daily readings for all households ending today.
 * Splits every day into:
 * - daytimeLiters (~6am-11pm): weekday/weekend natural variance (+15-20% weekend)
 * - overnightLiters (~11pm-6am): flat, near-zero baseline (~4-8 L/night for normal homes)
 * - overnightBuckets: [1am, 2am, 3am, 4am, 5am] hourly flow breakdown
 *
 * Scenarios:
 * 1. Miller (h-miller): continuous leak (+145 L) elevated across 4-5 buckets for last 4 days -> LEAK
 * 2. Morales (h-morales): burst pattern (elevated in only 2am bucket, rest ~1L) for last 3 days -> NOT leak, informational guest note
 * 3. Patel (h-patel): scheduled appliance (35 L continuous sprinkler) -> flags if expectedOvernightLiters=0, clears when set to 35
 */
export function generateSeedReadings(): MeterReading[] {
  const readings: MeterReading[] = [];
  const today = new Date();

  INITIAL_HOUSEHOLDS.forEach(household => {
    let efficiency = 1.0;
    if (household.id === 'h-jenkins') efficiency = 0.88;
    if (household.id === 'h-patel') efficiency = 1.10;
    if (household.id === 'h-chen') efficiency = 0.94;

    const basePerCapita = 125 * efficiency;
    const baseDaily = household.occupants * basePerCapita;

    // Generate exactly 60 days ending today (dayOffset 59 down to 0)
    for (let dayOffset = 59; dayOffset >= 0; dayOffset--) {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() - dayOffset);
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

      // Weekend effect on daytime activity: +18% Sat, +15% Sun
      const weekendMultiplier = (dayOfWeek === 6) ? 1.18 : (dayOfWeek === 0) ? 1.15 : 1.0;

      // Natural deterministic noise (-6% to +6%)
      const hash = (household.id.charCodeAt(2) * 31 + dayOffset * 17) % 100;
      const noise = 1 + ((hash - 50) / 50) * 0.06;

      // Normal daytime usage
      let daytimeLiters = Math.round(baseDaily * weekendMultiplier * noise);

      // Default baseline overnight hourly buckets (1am, 2am, 3am, 4am, 5am) ~1-2 L/hr
      let b1 = 1 + (hash % 2);
      let b2 = 1 + ((hash + 1) % 2);
      let b3 = 1 + ((hash + 2) % 2);
      let b4 = 1 + ((hash + 3) % 2);
      let b5 = 1 + ((hash + 4) % 2);

      // 1. Miller's active continuous leak: elevated across all 5 buckets (+28-30 L in each bucket) for last 4 days
      if (household.id === 'h-miller' && dayOffset <= 3) {
        b1 += 28;
        b2 += 30;
        b3 += 29;
        b4 += 28;
        b5 += 30;
      }

      // 2. Morales's overnight guest: burst pattern (only 2am bucket elevated +42 L, rest near-zero 1 L) for last 3 days
      if (household.id === 'h-morales' && dayOffset <= 2) {
        b1 = 1;
        b2 = 42; // single burst: guest shower/toilet at 2am
        b3 = 1;
        b4 = 1;
        b5 = 1;
      }

      // 3. Patel's scheduled appliance: 35 L overnight sprinkler running for last 4 days
      if (household.id === 'h-patel' && dayOffset <= 3) {
        b1 += 7;
        b2 += 7;
        b3 += 7;
        b4 += 7;
        b5 += 7;
      }

      // 4. Scenario A: Vance (h-vance) Vacation Mode test
      // Family declared away for last 6 days. For dayOffset 2..6: 0L. For dayOffset 0..1: unexpected flow!
      if (household.id === 'h-vance') {
        if (dayOffset >= 2 && dayOffset <= 6) {
          daytimeLiters = 0;
          b1 = 0; b2 = 0; b3 = 0; b4 = 0; b5 = 0;
        } else if (dayOffset <= 1) {
          daytimeLiters = 52;
          b1 = 3; b2 = 3; b3 = 3; b4 = 3; b5 = 3; // +15 L overnight
        }
      }

      // 5. Scenario B: Bennett (h-bennett) Slow-Creep leak test
      // 45-60 days ago: ~5L overnight. Over 45 days, creeps up smoothly to ~20L overnight
      if (household.id === 'h-bennett') {
        if (dayOffset <= 45) {
          const creep = Math.round(((45 - dayOffset) / 45) * 14);
          const perB = Math.floor(creep / 5);
          const rem = creep % 5;
          b1 += perB + (rem > 0 ? 1 : 0);
          b2 += perB + (rem > 1 ? 1 : 0);
          b3 += perB + (rem > 2 ? 1 : 0);
          b4 += perB + (rem > 3 ? 1 : 0);
          b5 += perB;
        }
      }

      // 6. Scenario E: Gallagher (h-gallagher) Meter Stall / Zero-Flow test
      // Active non-vacation home with 0L consumption for the last 3 days
      if (household.id === 'h-gallagher' && dayOffset <= 2) {
        daytimeLiters = 0;
        b1 = 0; b2 = 0; b3 = 0; b4 = 0; b5 = 0;
      }

      const overnightBuckets: [number, number, number, number, number] = [b1, b2, b3, b4, b5];
      const overnightLiters = b1 + b2 + b3 + b4 + b5;
      const liters = daytimeLiters + overnightLiters;

      readings.push({
        id: `r-${household.id}-${dateStr}`,
        household_id: household.id,
        date: dateStr,
        daytimeLiters,
        overnightLiters,
        overnightBuckets,
        liters
      });
    }
  });

  return readings;
}
