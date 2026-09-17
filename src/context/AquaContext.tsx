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
  addReading: (data: { householdId: string; date: string; daytimeLiters?: number; overnightLiters?: number; liters?: number }) => void;
  simulateLeak: (householdId?: string) => void;
  resetDemoData: () => void;
  isSimulatedLeakActive: boolean;
  isLoaded: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

const STORAGE_KEY_HOUSEHOLDS = 'aquawatch_households_v3';
const STORAGE_KEY_READINGS = 'aquawatch_readings_v3';

const AquaContext = createContext<AquaContextType | undefined>(undefined);

export function AquaProvider({ children }: { children: React.ReactNode }) {
  const [households, setHouseholds] = useState<Household[]>(INITIAL_HOUSEHOLDS);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('h-henderson');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  // Initialize from LocalStorage or seed data on mount
  useEffect(() => {
    try {
      const savedHouseholds = localStorage.getItem(STORAGE_KEY_HOUSEHOLDS);
      const savedReadings = localStorage.getItem(STORAGE_KEY_READINGS);

      if (savedHouseholds && savedReadings) {
        setHouseholds(JSON.parse(savedHouseholds));
        setReadings(JSON.parse(savedReadings));
      } else {
        const seeded = generateSeedReadings();
        setHouseholds(INITIAL_HOUSEHOLDS);
        setReadings(seeded);
        localStorage.setItem(STORAGE_KEY_HOUSEHOLDS, JSON.stringify(INITIAL_HOUSEHOLDS));
        localStorage.setItem(STORAGE_KEY_READINGS, JSON.stringify(seeded));
      }
    } catch {
      const seeded = generateSeedReadings();
      setHouseholds(INITIAL_HOUSEHOLDS);
      setReadings(seeded);
    }
    setIsLoaded(true);
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
            reason: analysis.status.explanation
          });
        }
      }
    });

    return alerts;
  }, [households, readings]);

  // Add a new household and generate 60 days of baseline
  const addHousehold = (data: Omit<Household, 'id'>): string => {
    const newId = `h-${Date.now()}`;
    const newHousehold: Household = {
      ...data,
      id: newId,
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
      const overnightLiters = 5 + (dayOffset % 4);
      const daytimeLiters = Math.round(baseDaily * weekendMultiplier * noise);

      newReadings.push({
        id: `r-${newId}-${dateStr}`,
        household_id: newId,
        date: dateStr,
        daytimeLiters,
        overnightLiters,
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
    liters
  }: {
    householdId: string;
    date: string;
    daytimeLiters?: number;
    overnightLiters?: number;
    liters?: number;
  }) => {
    let effectiveDaytime = daytimeLiters;
    let effectiveOvernight = overnightLiters;
    if (effectiveDaytime === undefined && effectiveOvernight === undefined && liters !== undefined) {
      // Proportional allocation: if reading is normal (~500L), overnight is ~6L; if reading is elevated, overnight gets a realistic share
      effectiveDaytime = Math.round(liters * 0.96);
      effectiveOvernight = Math.round(liters * 0.04);
    } else {
      effectiveDaytime = effectiveDaytime ?? (liters ? Math.round(liters * 0.96) : 480);
      effectiveOvernight = effectiveOvernight ?? (liters ? Math.round(liters * 0.04) : 6);
    }
    const total = effectiveDaytime + effectiveOvernight;

    const newReading: MeterReading = {
      id: `r-${householdId}-${date}-${Date.now()}`,
      household_id: householdId,
      date,
      daytimeLiters: effectiveDaytime,
      overnightLiters: effectiveOvernight,
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

    // Elevate the last 4 days' overnight flow by +200L (+40% of baseline daily consumption)
    const updatedReadings = readings.map(r => {
      if (r.household_id !== targetId) return r;
      const idx = hReadings.findIndex(hr => hr.id === r.id);
      if (idx >= hReadings.length - 4) {
        const elevatedOvernight = Math.round(r.overnightLiters + 200);
        return {
          ...r,
          overnightLiters: elevatedOvernight,
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
        addReading,
        simulateLeak,
        resetDemoData,
        isSimulatedLeakActive,
        isLoaded,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu
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
