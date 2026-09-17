import { Household, MeterReading } from '@/types';

export const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'h-henderson',
    name: 'The Henderson Residence (Demo Home)',
    occupants: 4,
    locality: 'Pine Valley',
    notes: 'Primary demo home — normal baseline, ready for live pitch demo'
  },
  {
    id: 'h-miller',
    name: 'The Miller Family',
    occupants: 4,
    locality: 'Pine Valley',
    notes: 'Active leak pre-seeded (running toilet flapper valve: +140 L/night)'
  },
  {
    id: 'h-morales',
    name: 'The Morales Home',
    occupants: 3,
    locality: 'Pine Valley',
    notes: 'Peer group household in Pine Valley'
  },
  {
    id: 'h-chen',
    name: 'Oakridge Villa (Chen Family)',
    occupants: 3,
    locality: 'Oakridge Suburb',
    notes: 'Consistent low-flow fixtures installed'
  },
  {
    id: 'h-jenkins',
    name: 'Greenwood Cottage (Sarah Jenkins)',
    occupants: 1,
    locality: 'Oakridge Suburb',
    notes: 'Single occupant eco-conscious home'
  },
  {
    id: 'h-patel',
    name: 'Harbor Crest (Patel Family)',
    occupants: 5,
    locality: 'Harborview District',
    notes: 'Large family home with high garden usage'
  },
  {
    id: 'h-taylor',
    name: 'The Taylor Loft',
    occupants: 2,
    locality: 'Harborview District',
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
 * Miller has elevated overnightLiters for the last 4 days (+140 L/night).
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

      // Flat, near-zero overnight baseline: 4-8 L/night
      let overnightLiters = 4 + (hash % 5);

      // Normal daytime usage
      let daytimeLiters = Math.round(baseDaily * weekendMultiplier * noise);

      // Pre-seed Miller's active leak: elevated overnight flow for the last 4 days
      // (+145 L overnight continuous flow from leaking toilet valve)
      if (household.id === 'h-miller' && dayOffset <= 3) {
        overnightLiters = Math.round(overnightLiters + 145);
      }

      const liters = daytimeLiters + overnightLiters;

      readings.push({
        id: `r-${household.id}-${dateStr}`,
        household_id: household.id,
        date: dateStr,
        daytimeLiters,
        overnightLiters,
        liters
      });
    }
  });

  return readings;
}
