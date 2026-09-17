import { analyzeReadings } from '../src/lib/leakDetection.ts';
import { INITIAL_HOUSEHOLDS, generateSeedReadings } from '../src/lib/data/seedData.ts';

console.log('=== AQUAWATCH LEAK DETECTION VERIFICATION SUITE ===\n');

const allHouseholds = INITIAL_HOUSEHOLDS;
const allReadings = generateSeedReadings();

let allPassed = true;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       Details: ${details}`);
    allPassed = false;
  }
}

// -------------------------------------------------------------
// TEST 1: Miller's Continuous Leak (Requirement 1 & Verification 4)
// Confirm Miller's pre-seeded leak (continuous, 4-5 buckets) correctly flags as LEAK
// -------------------------------------------------------------
console.log('--- TEST 1: Miller Pre-Seeded Leak (Continuous Trickle) ---');
const miller = allHouseholds.find(h => h.id === 'h-miller');
const millerReadings = allReadings.filter(r => r.household_id === miller.id);
const millerAnalysis = analyzeReadings(millerReadings, allReadings, miller, allHouseholds);

assert(millerAnalysis.status.hasLeak === true, "Miller hasLeak is true");
assert(millerAnalysis.status.severity === 'LEAK_DETECTED', "Miller severity is LEAK_DETECTED");
assert(millerAnalysis.status.consecutiveDays >= 2, `Miller consecutive days is ${millerAnalysis.status.consecutiveDays} (>= 2)`);
assert(millerAnalysis.status.latestBuckets !== undefined, "Miller has 5-hourly buckets defined");
const millerElevatedBuckets = (millerAnalysis.status.latestBuckets || []).filter(b => b >= 4).length;
assert(millerElevatedBuckets >= 4, `Miller has elevation across ${millerElevatedBuckets}/5 buckets (continuous signature)`);

// -------------------------------------------------------------
// TEST 2: Morales Overnight Guest (Requirement 1 & Verification 1)
// Confirm burst-pattern household does NOT get flagged as LEAK, and DOES show informational note
// -------------------------------------------------------------
console.log('\n--- TEST 2: Morales Overnight Guest (Burst Pattern) ---');
const morales = allHouseholds.find(h => h.id === 'h-morales');
const moralesReadings = allReadings.filter(r => r.household_id === morales.id);
const moralesAnalysis = analyzeReadings(moralesReadings, allReadings, morales, allHouseholds);

assert(moralesAnalysis.status.hasLeak === false, "Morales hasLeak is false (burst is not a leak)");
assert(moralesAnalysis.status.severity === 'NORMAL', `Morales severity is NORMAL (actual: ${moralesAnalysis.status.severity})`);
assert(moralesAnalysis.status.hasUnusualOvernightActivity === true, "Morales hasUnusualOvernightActivity is true (burst persists 2+ nights)");
assert(
  moralesAnalysis.status.unusualActivityNote === "unusual overnight activity — may be a guest or late-night use",
  "Morales note matches exact requested wording: 'unusual overnight activity — may be a guest or late-night use'",
  `Received: "${moralesAnalysis.status.unusualActivityNote}"`
);
const moralesElevatedBuckets = (moralesAnalysis.status.latestBuckets || []).filter(b => b >= 4).length;
assert(moralesElevatedBuckets >= 1 && moralesElevatedBuckets <= 2, `Morales has only ${moralesElevatedBuckets} elevated bucket (burst pattern)`);

// -------------------------------------------------------------
// TEST 3: Scheduled Appliances (Requirement 2 & Verification 2)
// Set expectedOvernightLiters: confirm flags when 0, clears when set to declared amount
// -------------------------------------------------------------
console.log('\n--- TEST 3: Scheduled Appliances Exclusion ---');
const patel = allHouseholds.find(h => h.id === 'h-patel');
const patelReadings = allReadings.filter(r => r.household_id === patel.id);

// 3a. When expectedOvernightLiters = 0 (default):
const patelWithZero = { ...patel, expectedOvernightLiters: 0 };
const patelAnalysisZero = analyzeReadings(patelReadings, allReadings, patelWithZero, allHouseholds);
assert(patelAnalysisZero.status.hasLeak === true, "Patel flags as LEAK when expectedOvernightLiters = 0");

// 3b. When expectedOvernightLiters = 35 (matching seeded sprinkler volume):
const patelWithDeclared = { ...patel, expectedOvernightLiters: 35 };
const patelAnalysisDeclared = analyzeReadings(patelReadings, allReadings, patelWithDeclared, allHouseholds);
assert(patelAnalysisDeclared.status.hasLeak === false, "Patel no longer flags as LEAK once expectedOvernightLiters is set to 35");
assert(patelAnalysisDeclared.status.severity === 'NORMAL', `Patel severity is NORMAL once allowance is deducted (actual: ${patelAnalysisDeclared.status.severity})`);
assert(patelAnalysisDeclared.status.expectedOvernightLiters === 35, "Patel status correctly reports expectedOvernightLiters = 35");

// -------------------------------------------------------------
// TEST 4: Lifestyle Change Baseline Reset (Requirement 3 & Verification 3)
// Trigger alert, confirm 'This is expected now' resets baseline, stops flagging for same pattern,
// while a NEW slow-building leak starting AFTER reset date still gets correctly flagged.
// -------------------------------------------------------------
console.log('\n--- TEST 4: Lifestyle Change Baseline Reset ---');
// Step 4a: Create a household with sustained high usage pattern starting 10 days ago
const henderson = allHouseholds.find(h => h.id === 'h-henderson');
const baseHendersonReadings = allReadings.filter(r => r.household_id === henderson.id);

// Inject 4 consecutive days of high usage (+250 L/day daytime surge)
const todayObj = new Date();
const dates = [];
for (let d = 3; d >= 0; d--) {
  const dt = new Date(todayObj);
  dt.setDate(todayObj.getDate() - d);
  dates.push(dt.toISOString().split('T')[0]);
}

const highUsageReadings = baseHendersonReadings.map(r => {
  if (dates.includes(r.date)) {
    return {
      ...r,
      daytimeLiters: r.daytimeLiters + 250,
      liters: r.liters + 250
    };
  }
  return r;
});

// Without reset: should flag HIGH_USAGE
const beforeResetAnalysis = analyzeReadings(highUsageReadings, allReadings, henderson, allHouseholds);
assert(beforeResetAnalysis.status.hasHighUsage === true, "Before reset: Henderson flags HIGH_USAGE alert due to sustained surge");

// Step 4b: Click "This is expected now" -> records baselineResetDate = dates[0]
const resetHenderson = {
  ...henderson,
  baselineResetDate: dates[0],
  baselineResetNote: `baseline reset by user on ${dates[0]}`
};
const afterResetAnalysis = analyzeReadings(highUsageReadings, allReadings, resetHenderson, allHouseholds);
assert(afterResetAnalysis.status.hasHighUsage === false, "After reset: Henderson alert is dismissed and stops flagging for the same pattern");
assert(afterResetAnalysis.status.severity === 'NORMAL', `After reset: status is NORMAL (actual: ${afterResetAnalysis.status.severity})`);
assert(afterResetAnalysis.status.baselineResetDate === dates[0], "After reset: baselineResetDate is recorded on status");

// Step 4c: A NEW slow-building leak develops AFTER the reset date
// Add 4 days of confirmed new normal after reset date, THEN 3 days of progressive overnight leak (+100L, +120L, +140L)
const readingsWithNewLeak = [...highUsageReadings];

// 4 days of post-reset normal usage (establishing the post-reset 14-day baseline)
for (let normalDay = 1; normalDay <= 4; normalDay++) {
  const normDt = new Date(todayObj);
  normDt.setDate(todayObj.getDate() + normalDay);
  const normDateStr = normDt.toISOString().split('T')[0];
  readingsWithNewLeak.push({
    id: `r-test-normal-${normDateStr}`,
    household_id: henderson.id,
    date: normDateStr,
    daytimeLiters: 650, // confirmed new higher daytime level
    overnightLiters: 6,  // normal overnight
    overnightBuckets: [1, 1, 2, 1, 1],
    liters: 656
  });
}

// Then 3 subsequent days of a new slow-building leak (continuous trickle across all 5 buckets)
for (let leakDay = 5; leakDay <= 7; leakDay++) {
  const leakDt = new Date(todayObj);
  leakDt.setDate(todayObj.getDate() + leakDay);
  const leakDateStr = leakDt.toISOString().split('T')[0];
  const leakAmt = 80 + (leakDay - 4) * 25; // 105, 130, 155
  readingsWithNewLeak.push({
    id: `r-test-newleak-${leakDateStr}`,
    household_id: henderson.id,
    date: leakDateStr,
    daytimeLiters: 650,
    overnightLiters: leakAmt,
    overnightBuckets: [
      Math.round(leakAmt / 5),
      Math.round(leakAmt / 5),
      Math.round(leakAmt / 5),
      Math.round(leakAmt / 5),
      Math.round(leakAmt / 5)
    ],
    liters: 650 + leakAmt
  });
}

const newLeakAnalysis = analyzeReadings(readingsWithNewLeak, allReadings, resetHenderson, allHouseholds);
assert(newLeakAnalysis.status.hasLeak === true, "New slow-building leak developing after reset date IS correctly flagged as LEAK");
assert(newLeakAnalysis.status.severity === 'LEAK_DETECTED', `New leak severity is LEAK_DETECTED (actual: ${newLeakAnalysis.status.severity})`);

console.log('\n===================================================');
if (allPassed) {
  console.log('🎉 ALL 4 VERIFICATION CRITERIA PASSED SUCCESSFULLY!');
} else {
  console.error('❌ SOME TESTS FAILED. CHECK DETAILS ABOVE.');
  process.exit(1);
}
