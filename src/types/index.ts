export interface Household {
  id: string;
  name: string;
  occupants: number;
  locality: string;
  expectedOvernightLiters?: number; // default 0; declared scheduled recurring use excluded from leak check
  baselineResetDate?: string;       // YYYY-MM-DD; confirmed lifestyle reset
  baselineResetNote?: string;       // e.g. "baseline reset by user on [date]"
  notes?: string;
  created_at?: string;
  // Scenario A: Vacation Mode
  isVacationMode?: boolean;
  vacationStartDate?: string;
  vacationEndDate?: string;
  // Scenario D: Cost settings
  waterRatePer1000L?: number; // e.g. 50 (₹ or $ per 1,000L)
}

export interface MeterReading {
  id: string;
  household_id: string;
  date: string; // YYYY-MM-DD
  daytimeLiters: number;   // ~6am - 11pm
  overnightLiters: number; // ~11pm - 6am (normally near-zero)
  overnightBuckets: [number, number, number, number, number]; // 1am, 2am, 3am, 4am, 5am
  liters: number;          // daytimeLiters + overnightLiters
  is_simulated?: boolean;
}

export interface DayAnalysis {
  date: string;
  daytimeLiters: number;
  overnightLiters: number;
  effectiveOvernightLiters?: number;
  overnightBuckets?: [number, number, number, number, number];
  liters: number;
  rolling_daytime_avg: number;
  rolling_overnight_avg: number;
  rolling_avg: number;
  rolling_stddev: number;
  rolling_overnight_stddev: number;
  is_daytime_anomalous: boolean;
  is_overnight_anomalous: boolean;
  is_overnight_burst: boolean;
  elevated_bucket_count: number;
  flow_shape: 'CONTINUOUS' | 'BURST' | 'NORMAL';
  is_anomalous: boolean; // true ONLY when streak >= 2
  is_elevated_unflagged?: boolean; // single-day spike (streak = 1, monitoring)
  streak: number;
  peer_avg: number;
  is_simulated?: boolean;
}

export interface PeerDivergenceInfo {
  confidence: 'HIGH' | 'MODERATE' | 'LOW';
  confidencePercent: number;
  label: string;
  description: string;
  isPeerFlat: boolean;
  householdDiffPercent: number;
  peerTrendPercent: number;
}

export type LeakSeverityTier = 'MINOR' | 'MODERATE' | 'SEVERE';
export type AlertCategory = 'ACUTE_LEAK' | 'VACATION_LEAK' | 'SLOW_CREEP' | 'HIGH_USAGE' | 'METER_STALL';

export interface LeakStatus {
  hasLeak: boolean;
  hasHighUsage: boolean;
  severity: 'NORMAL' | 'HIGH_USAGE' | 'LEAK_DETECTED';
  consecutiveDays: number;
  anomalyStartDate?: string;
  latestReadingLiters: number;
  latestDaytimeLiters: number;
  latestOvernightLiters: number;
  effectiveOvernightLiters: number;
  expectedOvernightLiters: number;
  hasUnusualOvernightActivity?: boolean;
  unusualActivityNote?: string;
  baselineResetDate?: string;
  baselineResetNote?: string;
  latestBuckets?: [number, number, number, number, number];
  rollingAvgLiters: number;
  rollingStdDev: number;
  rollingOvernightAvgLiters: number;
  estimatedExcessLitersPerDay: number;
  peerComparisonDiffPercent: number;
  peerAvgLiters: number;
  peerDivergence: PeerDivergenceInfo;
  title: string;
  explanation: string;
  
  // Expanded detection scenarios (A - E)
  alertCategory?: AlertCategory;
  severityTier?: LeakSeverityTier;
  estimatedRateLph?: number;          // Excess liters / hr
  estimatedCostSoFar?: number;        // ₹ or $
  estimatedCostPerMonth?: number;     // ₹ or $ per month
  waterRatePer1000L?: number;         // Rate used
  isVacationActive?: boolean;
  slowCreepDriftPercent?: number;
  stalledConsecutiveDays?: number;
}

export interface ActiveAlert {
  householdId: string;
  householdName: string;
  locality: string;
  occupants: number;
  anomalyStartDate: string;
  daysActive: number;
  currentUsage: number;
  overnightUsage: number;
  normalUsage: number;
  excessLitersPerDay: number;
  severity: 'HIGH_USAGE' | 'LEAK_DETECTED';
  confidenceLabel: string;
  confidencePercent: number;
  isPeerFlat: boolean;
  reason: string;
  canResetBaseline?: boolean;

  // Expanded fields
  alertCategory: AlertCategory;
  severityTier?: LeakSeverityTier;
  estimatedRateLph?: number;
  estimatedCostSoFar?: number;
  estimatedCostPerMonth?: number;
  waterRatePer1000L?: number;
  slowCreepDriftPercent?: number;
  stalledConsecutiveDays?: number;
}
