'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Household, MeterReading, DayAnalysis, LeakStatus, ActiveAlert } from '@/types';
import { INITIAL_HOUSEHOLDS, generateSeedReadings } from '@/lib/data/seedData';
import { analyzeReadings } from '@/lib/leakDetection';

interface AquaContextType {
  households: Household[];
  selectedHouseholdId: string;
  setSelectedHouseholdId: (id: string) => void;
  selectedHousehold: Household;
  readings: MeterReading[];
  selectedHouseholdReadings: MeterReading[];
  timeline: DayAnalysis[];
  leakStatus: LeakStatus;
  allActiveAlerts: ActiveAlert[];
  addHousehold: (data: Omit<Household, 'id'>) => string;
  updateHousehold: (householdId: string, updates: Partial<Household>) => void;
  resetHouseholdBaseline: (householdId: string, resetDate?: string) => void;
  addReading: (data: { householdId: string; date: string; daytimeLiters?: number; overnightLiters?: number; liters?: number; overnightBuckets?: [number, number, number, number, number] }) => void;
  simulateLeak: (householdId?: string) => void;
  resetDemoData: () => void;
  isSimulatedLeakActive: boolean;
  isLoaded: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  isLoggedIn: boolean;
  login: (demo?: boolean) => void;
  logout: () => void;
  dashboardView: 'overview' | 'trends' | 'history';
  setDashboardView: (view: 'overview' | 'trends' | 'history') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const STORAGE_KEY_HOUSEHOLDS = 'aquawatch_v6_enhanced_households';
const STORAGE_KEY_READINGS = 'aquawatch_v6_enhanced_readings';
const STORAGE_KEY_AUTH = 'aquawatch_v6_enhanced_auth';
const STORAGE_KEY_THEME = 'aquawatch_theme';

const AquaContext = createContext<AquaContextType | undefined>(undefined);

export function AquaProvider({ children }: { children: React.ReactNode }) {
  const [households, setHouseholds] = useState<Household[]>(INITIAL_HOUSEHOLDS);
  const [readings, setReadings] = useState<MeterReading[]>(() => generateSeedReadings());
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('h-henderson');
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [dashboardView, setDashboardView] = useState<'overview' | 'trends' | 'history'>('overview');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const toggleTheme = () => {
    setThemeState(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY_THEME, next);
      } catch {}
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const login = (demo?: boolean) => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    } catch (e) {
      // ignore
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      // ignore
    }
  };

  // Hydrate from LocalStorage on mount if valid
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedAuth === 'true') {
        setIsLoggedIn(true);
      }

      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as 'light' | 'dark' | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      const savedHouseholds = localStorage.getItem(STORAGE_KEY_HOUSEHOLDS);
      const savedReadings = localStorage.getItem(STORAGE_KEY_READINGS);

      if (savedHouseholds && savedReadings) {
        const parsedH = JSON.parse(savedHouseholds);
        const parsedR = JSON.parse(savedReadings);
        if (
          Array.isArray(parsedH) && 
          parsedH.some(h => h.id === 'h-henderson') && 
          Array.isArray(parsedR) && 
          parsedR.length > 0 && 
          parsedR[0].overnightBuckets
        ) {
          setHouseholds(parsedH);
          setReadings(parsedR);
        }
      }
    } catch {
      // Keep default initialized seed state
    }
  }, []);

  const persistState = (newHouseholds: Household[], newReadings: MeterReading[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_HOUSEHOLDS, JSON.stringify(newHouseholds));
      localStorage.setItem(STORAGE_KEY_READINGS, JSON.stringify(newReadings));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  const selectedHousehold = useMemo(() => {
    return households.find(h => h.id === selectedHouseholdId) || households[0] || INITIAL_HOUSEHOLDS[0];
  }, [households, selectedHouseholdId]);

  const selectedHouseholdReadings = useMemo(() => {
    return readings.filter(r => r.household_id === selectedHouseholdId);
  }, [readings, selectedHouseholdId]);

  // Compute timeline and leak status for current selected household
  const { timeline, status: leakStatus } = useMemo(() => {
    if (!selectedHousehold || selectedHouseholdReadings.length === 0) {
      return analyzeReadings([], readings, selectedHousehold, households);
    }
    return analyzeReadings(selectedHouseholdReadings, readings, selectedHousehold, households);
  }, [selectedHouseholdReadings, readings, selectedHousehold, households]);

  // Check if current household has simulated leak injected
  const isSimulatedLeakActive = useMemo(() => {
    return selectedHouseholdReadings.some(r => r.is_simulated);
  }, [selectedHouseholdReadings]);

  // Compute all active alerts across all households
  const allActiveAlerts = useMemo(() => {
    const alerts: ActiveAlert[] = [];

    households.forEach(h => {
      const hReadings = readings.filter(r => r.household_id === h.id);
      if (hReadings.length >= 3) {
        const analysis = analyzeReadings(hReadings, readings, h, households);
        if (analysis.status.severity !== 'NORMAL') {
          alerts.push({
            householdId: h.id,
            householdName: h.name,
            locality: h.locality,
            occupants: h.occupants,
            anomalyStartDate: analysis.status.anomalyStartDate || 'Recent',
            daysActive: analysis.status.consecutiveDays,
            currentUsage: analysis.status.latestReadingLiters,
            overnightUsage: analysis.status.latestOvernightLiters,
            normalUsage: Math.round(analysis.status.rollingAvgLiters),
            excessLitersPerDay: analysis.status.estimatedExcessLitersPerDay,
            severity: analysis.status.severity as 'HIGH_USAGE' | 'LEAK_DETECTED',
            confidenceLabel: analysis.status.peerDivergence.label,
            confidencePercent: analysis.status.peerDivergence.confidencePercent,
            isPeerFlat: analysis.status.peerDivergence.isPeerFlat,
            reason: analysis.status.explanation,
            canResetBaseline: true,

            // Expanded detection scenarios (A - E)
            alertCategory: analysis.status.alertCategory || 'ACUTE_LEAK',
            severityTier: analysis.status.severityTier,
            estimatedRateLph: analysis.status.estimatedRateLph,
            estimatedCostSoFar: analysis.status.estimatedCostSoFar,
            estimatedCostPerMonth: analysis.status.estimatedCostPerMonth,
            waterRatePer1000L: analysis.status.waterRatePer1000L,
            slowCreepDriftPercent: analysis.status.slowCreepDriftPercent,
            stalledConsecutiveDays: analysis.status.stalledConsecutiveDays
          });
        }
      }
    });

    // Prioritize order: Severe leaks first, then moderate, minor, slow-creep, high-usage, meter stall
    alerts.sort((a, b) => {
      const catPriority = (cat: string) => {
        if (cat === 'ACUTE_LEAK' || cat === 'VACATION_LEAK') return 1;
        if (cat === 'SLOW_CREEP') return 2;
        if (cat === 'HIGH_USAGE') return 3;
        if (cat === 'METER_STALL') return 4;
        return 5;
      };
      const tierPriority = (tier?: string) => {
        if (tier === 'SEVERE') return 1;
        if (tier === 'MODERATE') return 2;
        if (tier === 'MINOR') return 3;
        return 4;
      };

      const cDiff = catPriority(a.alertCategory) - catPriority(b.alertCategory);
      if (cDiff !== 0) return cDiff;

      const tDiff = tierPriority(a.severityTier) - tierPriority(b.severityTier);
      if (tDiff !== 0) return tDiff;

      return (b.excessLitersPerDay || 0) - (a.excessLitersPerDay || 0);
    });

    return alerts;
  }, [households, readings]);

  // Update an existing household (e.g. expectedOvernightLiters)
  const updateHousehold = (householdId: string, updates: Partial<Household>) => {
    const updated = households.map(h => {
      if (h.id === householdId) {
        return { ...h, ...updates };
      }
      return h;
    });
    setHouseholds(updated);
    persistState(updated, readings);
  };

  // Lifestyle Change / Human-confirmed baseline reset
  const resetHouseholdBaseline = (householdId: string, resetDate?: string) => {
    const targetDate = resetDate || new Date().toISOString().split('T')[0];
    const updated = households.map(h => {
      if (h.id === householdId) {
        return {
          ...h,
          baselineResetDate: targetDate,
          baselineResetNote: `baseline reset by user on ${targetDate}`
        };
      }
      return h;
    });
    setHouseholds(updated);
    persistState(updated, readings);
  };

  // Add a new household and generate 60 days of baseline
  const addHousehold = (data: Omit<Household, 'id'>): string => {
    const newId = `h-${Date.now()}`;
    const newHousehold: Household = {
      ...data,
      id: newId,
      expectedOvernightLiters: data.expectedOvernightLiters || 0,
      created_at: new Date().toISOString()
    };

    const newHouseholds = [...households, newHousehold];
    const today = new Date();
    const newReadings: MeterReading[] = [];
    const baseDaily = data.occupants * 125;

    for (let dayOffset = 59; dayOffset >= 0; dayOffset--) {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() - dayOffset);
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      const dayOfWeek = dateObj.getDay();
      const weekendMultiplier = (dayOfWeek === 6 || dayOfWeek === 0) ? 1.16 : 1.0;
      const noise = 1 + (((dayOffset * 19) % 20) - 10) / 100;
      const daytimeLiters = Math.round(baseDaily * weekendMultiplier * noise);

      const b1 = 1 + (dayOffset % 2);
      const b2 = 1 + ((dayOffset + 1) % 2);
      const b3 = 1 + ((dayOffset + 2) % 2);
      const b4 = 1 + ((dayOffset + 3) % 2);
      const b5 = 1 + ((dayOffset + 4) % 2);
      const overnightBuckets: [number, number, number, number, number] = [b1, b2, b3, b4, b5];
      const overnightLiters = b1 + b2 + b3 + b4 + b5;

      newReadings.push({
        id: `r-${newId}-${dateStr}`,
        household_id: newId,
        date: dateStr,
        daytimeLiters,
        overnightLiters,
        overnightBuckets,
        liters: daytimeLiters + overnightLiters
      });
    }

    const updatedReadings = [...readings, ...newReadings];
    setHouseholds(newHouseholds);
    setReadings(updatedReadings);
    setSelectedHouseholdId(newId);
    persistState(newHouseholds, updatedReadings);
    return newId;
  };

  // Add a manual reading
  const addReading = ({
    householdId,
    date,
    daytimeLiters,
    overnightLiters,
    liters,
    overnightBuckets
  }: {
    householdId: string;
    date: string;
    daytimeLiters?: number;
    overnightLiters?: number;
    liters?: number;
    overnightBuckets?: [number, number, number, number, number];
  }) => {
    let effectiveDaytime = daytimeLiters;
    let effectiveOvernight = overnightLiters;
    if (effectiveDaytime === undefined && effectiveOvernight === undefined && liters !== undefined) {
      effectiveDaytime = Math.round(liters * 0.96);
      effectiveOvernight = Math.round(liters * 0.04);
    } else {
      effectiveDaytime = effectiveDaytime ?? (liters ? Math.round(liters * 0.96) : 480);
      effectiveOvernight = effectiveOvernight ?? (liters ? Math.round(liters * 0.04) : 6);
    }
    const total = effectiveDaytime + effectiveOvernight;

    const effectiveBuckets: [number, number, number, number, number] = overnightBuckets || [
      Math.round(effectiveOvernight * 0.2),
      Math.round(effectiveOvernight * 0.2),
      Math.round(effectiveOvernight * 0.2),
      Math.round(effectiveOvernight * 0.2),
      Math.round(effectiveOvernight * 0.2)
    ];

    const newReading: MeterReading = {
      id: `r-${householdId}-${date}-${Date.now()}`,
      household_id: householdId,
      date,
      daytimeLiters: effectiveDaytime,
      overnightLiters: effectiveOvernight,
      overnightBuckets: effectiveBuckets,
      liters: total
    };

    const filtered = readings.filter(r => !(r.household_id === householdId && r.date === date));
    const updated = [...filtered, newReading].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setReadings(updated);
    persistState(households, updated);
  };

  // Live pitch demo: inject 4 consecutive days of elevated readings (+40% via elevated continuous overnight leak)
  const simulateLeak = (targetHouseholdId?: string) => {
    const targetId = targetHouseholdId || selectedHouseholdId;
    const targetH = households.find(h => h.id === targetId);
    if (!targetH) return;

    if (targetHouseholdId) {
      setSelectedHouseholdId(targetHouseholdId);
    }

    const hReadings = readings
      .filter(r => r.household_id === targetId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (hReadings.length < 5) return;

    // Elevate the last 4 days' overnight flow by +200L continuously across all 5 buckets
    const updatedReadings = readings.map(r => {
      if (r.household_id !== targetId) return r;
      const idx = hReadings.findIndex(hr => hr.id === r.id);
      if (idx >= hReadings.length - 4) {
        const elevatedOvernight = Math.round(r.overnightLiters + 200);
        const elevatedBuckets: [number, number, number, number, number] = [
          (r.overnightBuckets?.[0] || 1) + 40,
          (r.overnightBuckets?.[1] || 1) + 40,
          (r.overnightBuckets?.[2] || 1) + 40,
          (r.overnightBuckets?.[3] || 1) + 40,
          (r.overnightBuckets?.[4] || 1) + 40
        ];
        return {
          ...r,
          overnightLiters: elevatedOvernight,
          overnightBuckets: elevatedBuckets,
          liters: r.daytimeLiters + elevatedOvernight,
          is_simulated: true
        };
      }
      return r;
    });

    setReadings(updatedReadings);
    persistState(households, updatedReadings);
  };

  // Reset demo back to clean baseline
  const resetDemoData = () => {
    const freshReadings = generateSeedReadings();
    setHouseholds(INITIAL_HOUSEHOLDS);
    setReadings(freshReadings);
    setSelectedHouseholdId('h-henderson');
    persistState(INITIAL_HOUSEHOLDS, freshReadings);
  };

  return (
    <AquaContext.Provider
      value={{
        households,
        selectedHouseholdId,
        setSelectedHouseholdId,
        selectedHousehold,
        readings,
        selectedHouseholdReadings,
        timeline,
        leakStatus,
        allActiveAlerts,
        addHousehold,
        updateHousehold,
        resetHouseholdBaseline,
        addReading,
        simulateLeak,
        resetDemoData,
        isSimulatedLeakActive,
        isLoaded,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        isLoggedIn,
        login,
        logout,
        dashboardView,
        setDashboardView,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AquaContext.Provider>
  );
}

export function useAqua() {
  const context = useContext(AquaContext);
  if (!context) {
    throw new Error('useAqua must be used within an AquaProvider');
  }
  return context;
}
