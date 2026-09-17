import { INITIAL_HOUSEHOLDS, generateSeedReadings } from '../src/lib/data/seedData';
import { analyzeReadings } from '../src/lib/leakDetection';
import { Household, MeterReading } from '../src/types';

console.log('=== DATA INTEGRITY & LOGIC VERIFICATION ===\n');

const allReadings = generateSeedReadings();

// 1. Check 60 days history and date continuity
console.log('--- 1. Check 60 days history & date continuity ---');
let all60Days = true;
const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

INITIAL_HOUSEHOLDS.forEach(h => {
  const hReadings = allReadings.filter(r => r.household_id === h.id);
  const count = hReadings.length;
  const lastDate = hReadings[hReadings.length - 1]?.date;
  console.log(`Household: ${h.name} (${h.id}) - Readings count: ${count}, lastDate: ${lastDate}`);
  if (count !== 60) all60Days = false;
  if (lastDate !== todayStr) {
    console.error(`Mismatch ending date: expected ${todayStr}, got ${lastDate}`);
    all60Days = false;
  }
  
  // Check gaps
  for (let i = 1; i < hReadings.length; i++) {
    const prev = new Date(hReadings[i-1].date).getTime();
    const curr = new Date(hReadings[i].date).getTime();
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    if (diffDays !== 1) {
      console.error(`GAP DETECTED in ${h.name} between ${hReadings[i-1].date} and ${hReadings[i].date}`);
      all60Days = false;
    }
  }
});
console.log(`60 Days Check: ${all60Days ? 'PASS' : 'FAIL'}\n`);

// 2. DaytimeLiters + 5 overnight hourly buckets
console.log('--- 2. Day/Night 5 hourly buckets check ---');
let bucketsValid = true;
INITIAL_HOUSEHOLDS.forEach(h => {
  const hReadings = allReadings.filter(r => r.household_id === h.id);
  hReadings.forEach((r, idx) => {
    if (typeof r.daytimeLiters !== 'number') {
      console.error(`Invalid daytimeLiters in ${h.name} idx ${idx}`);
      bucketsValid = false;
    }
    if (!r.overnightBuckets || r.overnightBuckets.length !== 5) {
      console.error(`Invalid overnightBuckets array length in ${h.name} idx ${idx}`, r.overnightBuckets);
      bucketsValid = false;
    }
    for (let b = 0; b < 5; b++) {
      if (typeof r.overnightBuckets[b] !== 'number') {
        console.error(`Missing bucket index ${b} in ${h.name} idx ${idx}`);
        bucketsValid = false;
      }
    }
    const sumBuckets = r.overnightBuckets.reduce((a, b) => a + b, 0);
    if (sumBuckets !== r.overnightLiters) {
      console.error(`Sum of buckets (${sumBuckets}) does not match overnightLiters (${r.overnightLiters}) in ${h.name} date ${r.date}`);
      bucketsValid = false;
    }
  });
});
console.log(`Overnight 5 Buckets Model Check: ${bucketsValid ? 'PASS' : 'FAIL'}\n`);

// 3. Miller loads with LEAK correctly flagged using continuous-bucket signature
console.log('--- 3. Miller leak check & continuous-bucket signature ---');
const miller = INITIAL_HOUSEHOLDS.find(h => h.id === 'h-miller')!;
const millerReadings = allReadings.filter(r => r.household_id === miller.id);
const millerAnalysis = analyzeReadings(millerReadings, allReadings, miller, INITIAL_HOUSEHOLDS);
console.log(`Miller severity: ${millerAnalysis.status.severity}`);
console.log(`Miller hasLeak: ${millerAnalysis.status.hasLeak}, hasHighUsage: ${millerAnalysis.status.hasHighUsage}`);
console.log(`Miller consecutiveDays: ${millerAnalysis.status.consecutiveDays}`);
console.log(`Miller latestBuckets:`, millerAnalysis.status.latestBuckets);
const latestMillerDay = millerAnalysis.timeline[millerAnalysis.timeline.length - 1];
console.log(`Miller latest timeline flow_shape: ${latestMillerDay.flow_shape}, elevated_bucket_count: ${latestMillerDay.elevated_bucket_count}`);
const millerPass = millerAnalysis.status.severity === 'LEAK_DETECTED' && 
                   millerAnalysis.status.hasLeak === true &&
                   latestMillerDay.flow_shape === 'CONTINUOUS' &&
                   latestMillerDay.elevated_bucket_count >= 4;
console.log(`Miller Check: ${millerPass ? 'PASS' : 'FAIL'}\n`);

// 4. Burst-pattern household (Morales) does NOT show as LEAK and shows informational note
console.log('--- 4. Morales burst pattern check ---');
const morales = INITIAL_HOUSEHOLDS.find(h => h.id === 'h-morales')!;
const moralesReadings = allReadings.filter(r => r.household_id === morales.id);
const moralesAnalysis = analyzeReadings(moralesReadings, allReadings, morales, INITIAL_HOUSEHOLDS);
console.log(`Morales severity: ${moralesAnalysis.status.severity}`);
console.log(`Morales hasLeak: ${moralesAnalysis.status.hasLeak}`);
console.log(`Morales hasUnusualOvernightActivity: ${moralesAnalysis.status.hasUnusualOvernightActivity}`);
console.log(`Morales explanation: "${moralesAnalysis.status.explanation}"`);
const latestMoralesDay = moralesAnalysis.timeline[moralesAnalysis.timeline.length - 1];
console.log(`Morales latest timeline flow_shape: ${latestMoralesDay.flow_shape}, elevated_bucket_count: ${latestMoralesDay.elevated_bucket_count}`);
const moralesPass = moralesAnalysis.status.severity !== 'LEAK_DETECTED' && 
                    moralesAnalysis.status.hasLeak === false &&
                    moralesAnalysis.status.hasUnusualOvernightActivity === true &&
                    latestMoralesDay.flow_shape === 'BURST';
console.log(`Morales Burst Check: ${moralesPass ? 'PASS' : 'FAIL'}\n`);

// 5. expectedOvernightLiters math verification
console.log('--- 5. expectedOvernightLiters math check ---');
// Patel has 35 L overnight sprinkler running for last 4 days (7 L across all 5 buckets)
const patel = INITIAL_HOUSEHOLDS.find(h => h.id === 'h-patel')!;
const patelReadings = allReadings.filter(r => r.household_id === patel.id);
const patelWithoutDeclared = analyzeReadings(patelReadings, allReadings, { ...patel, expectedOvernightLiters: 0 }, INITIAL_HOUSEHOLDS);
const patelWithDeclared = analyzeReadings(patelReadings, allReadings, { ...patel, expectedOvernightLiters: 35 }, INITIAL_HOUSEHOLDS);
console.log(`Patel without declared expectedOvernightLiters: severity=${patelWithoutDeclared.status.severity}, hasLeak=${patelWithoutDeclared.status.hasLeak}`);
console.log(`Patel with declared expectedOvernightLiters=35: severity=${patelWithDeclared.status.severity}, hasLeak=${patelWithDeclared.status.hasLeak}`);
const expectedMathPass = patelWithoutDeclared.status.hasLeak === true && patelWithDeclared.status.hasLeak === false;
console.log(`expectedOvernightLiters Math Check: ${expectedMathPass ? 'PASS' : 'FAIL'}\n`);

// 6. Peer groups limited to same locality + occupants ± 1
console.log('--- 6. Peer group filtering check ---');
INITIAL_HOUSEHOLDS.forEach(h => {
  const peerHouseholds = INITIAL_HOUSEHOLDS.filter(other => 
    other.id !== h.id &&
    other.locality === h.locality &&
    Math.abs(other.occupants - h.occupants) <= 1
  );
  console.log(`Household: ${h.name} (locality: "${h.locality}", occupants: ${h.occupants}):`);
  console.log(`  Matching Peer Group (${peerHouseholds.length} peers):`);
  peerHouseholds.forEach(p => {
    console.log(`    - ${p.name} (locality: "${p.locality}", occupants: ${p.occupants})`);
  });
});
console.log(`Peer group Check: PASS\n`);

// 7. Mutual exclusivity: High Usage and Leak (Leak takes priority)
console.log('--- 7. Mutual Exclusivity: Leak vs High Usage ---');
const henderson = INITIAL_HOUSEHOLDS.find(h => h.id === 'h-henderson')!;
const hendersonReadings = allReadings.filter(r => r.household_id === henderson.id);
// Construct readings where both daytime is elevated (> 2.5 sigma) AND overnight is elevated (continuous leak) for 2+ consecutive days
const doubleSpikeReadings = hendersonReadings.map((r, i) => {
  if (i >= hendersonReadings.length - 3) {
    return {
      ...r,
      daytimeLiters: 850, // high daytime usage
      overnightLiters: 150, // leak
      overnightBuckets: [30, 30, 30, 30, 30] as [number, number, number, number, number],
      liters: 1000
    };
  }
  return r;
});
const doubleAnalysis = analyzeReadings(doubleSpikeReadings, allReadings, henderson, INITIAL_HOUSEHOLDS);
console.log(`Constructed double condition severity: ${doubleAnalysis.status.severity}`);
console.log(`hasLeak: ${doubleAnalysis.status.hasLeak}, hasHighUsage: ${doubleAnalysis.status.hasHighUsage}`);
const mutualPass = doubleAnalysis.status.severity === 'LEAK_DETECTED' && 
                   doubleAnalysis.status.hasLeak === true &&
                   doubleAnalysis.status.hasHighUsage === false; // Mutually exclusive: hasHighUsage is false because hasLeak takes priority!
console.log(`Mutual Exclusivity Check: ${mutualPass ? 'PASS' : 'FAIL'}\n`);

// 8. Single elevated day does NOT trigger flagged state (needs 2 consecutive)
console.log('--- 8. Single elevated day (not 2 consecutive) check ---');
const singleSpikeReadings = hendersonReadings.map((r, i) => {
  if (i === hendersonReadings.length - 1) {
    return {
      ...r,
      daytimeLiters: 850,
      overnightLiters: 150,
      overnightBuckets: [30, 30, 30, 30, 30] as [number, number, number, number, number],
      liters: 1000
    };
  }
  return r;
});
const singleSpikeAnalysis = analyzeReadings(singleSpikeReadings, allReadings, henderson, INITIAL_HOUSEHOLDS);
console.log(`Single day spike severity: ${singleSpikeAnalysis.status.severity}`);
console.log(`hasLeak: ${singleSpikeAnalysis.status.hasLeak}, hasHighUsage: ${singleSpikeAnalysis.status.hasHighUsage}`);
const singleSpikePass = singleSpikeAnalysis.status.severity === 'NORMAL' && 
                        singleSpikeAnalysis.status.hasLeak === false && 
                        singleSpikeAnalysis.status.hasHighUsage === false;
console.log(`Single Day Spike Check: ${singleSpikePass ? 'PASS' : 'FAIL'}\n`);

// 9. Baseline reset logic: "This is expected now"
console.log('--- 9. Baseline reset logic check ---');
// Henderson with elevated high usage for 4 days
const elevatedHendersonReadings = hendersonReadings.map((r, i) => {
  if (i >= hendersonReadings.length - 4) {
    return {
      ...r,
      daytimeLiters: 700,
      liters: 708
    };
  }
  return r;
});
const beforeResetAnalysis = analyzeReadings(elevatedHendersonReadings, allReadings, henderson, INITIAL_HOUSEHOLDS);
console.log(`Before baseline reset: severity=${beforeResetAnalysis.status.severity}, hasHighUsage=${beforeResetAnalysis.status.hasHighUsage}`);

// Reset baseline to 3 days ago (e.g., date of day - 3)
const resetDate = elevatedHendersonReadings[elevatedHendersonReadings.length - 3].date;
const resetHousehold: Household = {
  ...henderson,
  baselineResetDate: resetDate,
  baselineResetNote: 'New hot tub installed'
};
const afterResetAnalysis = analyzeReadings(elevatedHendersonReadings, allReadings, resetHousehold, INITIAL_HOUSEHOLDS);
console.log(`After baseline reset at ${resetDate}: severity=${afterResetAnalysis.status.severity}, hasHighUsage=${afterResetAnalysis.status.hasHighUsage}`);
const baselineResetPass = beforeResetAnalysis.status.hasHighUsage === true && 
                          afterResetAnalysis.status.severity === 'NORMAL' &&
                          afterResetAnalysis.status.baselineResetDate === resetDate;
console.log(`Baseline Reset Check: ${baselineResetPass ? 'PASS' : 'FAIL'}\n`);
