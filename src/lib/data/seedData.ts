import type { Household, MeterReading } from '../../types/index.ts';

export const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'h-henderson',
    name: 'The Henderson Residence (Demo Home)',
    occupants: 4,
    locality: 'Pine Valley',
    expectedOvernightLiters: 0,
    notes: 'Primary demo home — normal baseline, ready for live pitch demo'
  },
  {
    id: 'h-miller',
    name: 'The Miller Family',
    occupants: 4,
    locality: 'Pine Valley',
    expectedOvernightLiters: 0,
    notes: 'Active leak pre-seeded: running flapper valve (+145 L/night across all 5 hourly buckets — continuous trickle)'
  },
  {
    id: 'h-morales',
    name: 'The Morales Home',
    occupants: 3,
    locality: 'Pine Valley',
    expectedOvernightLiters: 0,
    notes: 'Overnight guest visiting: burst usage (+42 L at 2am, rest 1 L) for 3 consecutive nights'
  },
  {
    id: 'h-chen',
    name: 'Oakridge Villa (Chen Family)',
    occupants: 3,
    locality: 'Oakridge Suburb',
    expectedOvernightLiters: 0,
    notes: 'Consistent low-flow fixtures installed'
  },
  {
    id: 'h-jenkins',
    name: 'Greenwood Cottage (Sarah Jenkins)',
    occupants: 1,
    locality: 'Oakridge Suburb',
    expectedOvernightLiters: 0,
    notes: 'Single occupant eco-conscious home'
  },
  {
    id: 'h-patel',
    name: 'Harbor Crest (Patel Family)',
    occupants: 5,
    locality: 'Harborview District',
    expectedOvernightLiters: 0,
    notes: 'Scheduled appliance test home: overnight sprinkler running 35 L/night (flags when expectedOvernightLiters is 0; clears when set to 35)'
  },
  {
    id: 'h-taylor',
    name: 'The Taylor Loft',
    occupants: 2,
    locality: 'Harborview District',
    expectedOvernightLiters: 0,
    notes: 'Downtown duplex'
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
