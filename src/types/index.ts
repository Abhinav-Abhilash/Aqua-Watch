export interface Household {
  id: string;
  name: string;
  occupants: number;
  locality: string;
  notes?: string;
  created_at?: string;
}

export interface MeterReading {
  id: string;
  household_id: string;
  date: string; // YYYY-MM-DD
  daytimeLiters: number;   // ~6am - 11pm
  overnightLiters: number; // ~11pm - 6am (normally near-zero)
  liters: number;          // daytimeLiters + overnightLiters
  is_simulated?: boolean;
}

export interface DayAnalysis {
  date: string;
  daytimeLiters: number;
  overnightLiters: number;
  liters: number;
  rolling_daytime_avg: number;
  rolling_overnight_avg: number;
  rolling_avg: number;
  rolling_stddev: number;
  rolling_overnight_stddev: number;
  is_daytime_anomalous: boolean;
  is_overnight_anomalous: boolean;
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

export interface LeakStatus {
  hasLeak: boolean;
  hasHighUsage: boolean;
  severity: 'NORMAL' | 'HIGH_USAGE' | 'LEAK_DETECTED';
  consecutiveDays: number;
  anomalyStartDate?: string;
  latestReadingLiters: number;
  latestDaytimeLiters: number;
  latestOvernightLiters: number;
  rollingAvgLiters: number;
  rollingStdDev: number;
  rollingOvernightAvgLiters: number;
  estimatedExcessLitersPerDay: number;
  peerComparisonDiffPercent: number;
  peerAvgLiters: number;
  peerDivergence: PeerDivergenceInfo;
  title: string;
  explanation: string;
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
}
