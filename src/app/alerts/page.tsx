'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import { useRouter } from 'next/navigation';
import TopHeader from '@/components/TopHeader';
import ManualReadingModal from '@/components/ManualReadingModal';

export default function AlertsPage() {
  const { allActiveAlerts, setSelectedHouseholdId, resetDemoData, simulateLeak, resetHouseholdBaseline, setDashboardView } = useAqua();
  const router = useRouter();
  const [isLogReadingOpen, setIsLogReadingOpen] = useState(false);
  const [shutoffStates, setShutoffStates] = useState<Record<string, boolean>>({});

  const handleInspect = (householdId: string) => {
    setSelectedHouseholdId(householdId);
    setDashboardView('overview');
    router.push('/');
  };

  const handleToggleShutoff = (householdId: string) => {
    setShutoffStates(prev => ({
      ...prev,
      [householdId]: !prev[householdId]
    }));
  };

  const leakAlerts = allActiveAlerts.filter(a => a.severity === 'LEAK_DETECTED');
  const highUsageAlerts = allActiveAlerts.filter(a => a.severity === 'HIGH_USAGE');

  return (
    <>
      <TopHeader onOpenLogReading={() => setIsLogReadingOpen(true)} />

      <main className="bg-[#EDEDED] min-h-[calc(100vh-3.5rem)] p-3 sm:p-5 lg:p-6">
        <div className="flex flex-col w-full gap-5 max-w-[1440px] mx-auto">
          
          {/* Header & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FAFAFA] p-4 sm:p-5 rounded-2xl border border-[#DCDCDC]">
            <div>
              <div className="flex items-center gap-1.5 text-[#8A8A8A] text-xs font-medium">
                <span>District Telemetry</span>
                <span>/</span>
                <span className="text-[#1A1A1A] font-semibold">Active Alerts</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight mt-1">
                Active Anomaly Ledger
              </h1>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Statistical anomaly detection: &gt;2.5σ rolling deviation sustained across consecutive telemetry cycles
              </p>
            </div>

            {/* Demo Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-trigger-demo-leak-alerts"
                onClick={() => {
                  simulateLeak('h-henderson');
                  setDashboardView('overview');
                  router.push('/');
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1A1A1A] hover:bg-black text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Simulate leak (Henderson)</span>
              </button>
              <button
                id="btn-reset-alerts"
                onClick={resetDemoData}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E0E0E0] hover:bg-[#D5D5D5] text-[#1A1A1A] border border-[#DCDCDC] transition-colors cursor-pointer"
              >
                Reset Demo Data
              </button>
            </div>
          </div>

          {allActiveAlerts.length === 0 ? (
            <div className="bg-[#FAFAFA] rounded-2xl border border-[#DCDCDC] py-14 text-center p-6">
              <div className="w-12 h-12 rounded-full bg-[#E0E0E0] text-[#1A1A1A] flex items-center justify-center mx-auto mb-3 border border-[#DCDCDC]">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A]">Zero Active Anomalies Detected</h3>
              <p className="text-xs text-[#8A8A8A] max-w-sm mx-auto mt-1">
                All properties are consuming water within normal 14-day statistical bounds.
              </p>
              <button
                onClick={() => {
                  simulateLeak('h-henderson');
                  setDashboardView('overview');
                  router.push('/');
                }}
                className="mt-4 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#1A1A1A] hover:bg-black shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors cursor-pointer"
              >
                Simulate leak to test alert flow
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* SECTION 1: Possible Leaks (Reserved Muted Red Accent #B8564A) */}
              <div className="bg-[#FAFAFA] rounded-2xl border border-[#DCDCDC] border-l-4 border-l-[#B8564A] overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-[#DCDCDC] bg-[#F9ECEB]/40 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#B8564A] text-[20px]">
                      water_damage
                    </span>
                    <h2 className="font-bold text-base text-[#1A1A1A]">Possible leaks — urgent action recommended</h2>
                    <span className="bg-[#F9ECEB] text-[#B8564A] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#B8564A]/30">
                      {leakAlerts.length} Flagged
                    </span>
                  </div>
                  <span className="text-xs text-[#8A8A8A]">
                    Overnight continuous flow elevated &gt;2.5σ for 2+ consecutive nights
                  </span>
                </div>

                {leakAlerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#8A8A8A]">
                    No active leaks detected at this time.
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#EDEDED] text-[#1A1A1A] font-semibold text-xs border-b border-[#DCDCDC]">
                          <th className="py-3 px-4 sm:px-6">Household / Location</th>
                          <th className="py-3 px-3 sm:px-4">Telemetry Incident</th>
                          <th className="py-3 px-3 sm:px-4">Excess Liters</th>
                          <th className="py-3 px-3 sm:px-4">Duration</th>
                          <th className="py-3 px-3 sm:px-4">Confidence</th>
                          <th className="py-3 px-3 sm:px-4">Status</th>
                          <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCDCDC] text-[#1A1A1A] font-medium">
                        {leakAlerts.map(alert => {
                          const isShutoff = shutoffStates[alert.householdId];
                          const estLoss = (alert.excessLitersPerDay * 0.035).toFixed(2);

                          return (
                            <tr key={alert.householdId} className="hover:bg-[#F0F0F0] transition-colors">
                              {/* Household */}
                              <td className="py-4 px-4 sm:px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-10 bg-[#B8564A] rounded-full shrink-0" />
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm text-[#1A1A1A]">
                                      {alert.householdName}
                                    </span>
                                    <span className="text-xs text-[#8A8A8A]">
                                      {alert.locality}, {alert.occupants} occupants
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Incident */}
                              <td className="py-4 px-3 sm:px-4">
                                <div className="flex flex-col">
                                  <div className="inline-flex items-center gap-1.5 font-bold text-[#1A1A1A]">
                                    <span className="material-symbols-outlined text-[16px] text-[#B8564A]">
                                      water_damage
                                    </span>
                                    Overnight Continuous Flow
                                  </div>
                                  <span className="text-xs text-[#8A8A8A]">
                                    Overnight draw: {alert.overnightUsage} L (baseline ~6 L)
                                  </span>
                                </div>
                              </td>

                              {/* Excess Volume */}
                              <td className="py-4 px-3 sm:px-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-[#B8564A]">
                                    +{alert.excessLitersPerDay} L / day
                                  </span>
                                  <span className="text-xs text-[#8A8A8A]">
                                    Est. loss ${estLoss}/day
                                  </span>
                                </div>
                              </td>

                              {/* Duration */}
                              <td className="py-4 px-3 sm:px-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#1A1A1A]">
                                    {alert.daysActive} Consecutive Nights
                                  </span>
                                  <span className="text-xs text-[#B8564A] font-medium">
                                    Active since {alert.anomalyStartDate}
                                  </span>
                                </div>
                              </td>

                              {/* Confidence */}
                              <td className="py-4 px-3 sm:px-4">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E0E0E0] text-[#1A1A1A] border border-[#DCDCDC]">
                                  {alert.confidenceLabel}
                                </span>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-3 sm:px-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9ECEB] text-[#B8564A] text-[11px] font-bold border border-[#B8564A]/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8564A] animate-ping" />
                                  {isShutoff ? 'Valve Isolated' : 'Active Leak'}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4 sm:px-6 text-right">
                                <div className="flex items-center justify-end gap-2 flex-wrap">
                                  <button
                                    onClick={() => handleInspect(alert.householdId)}
                                    className="px-3.5 py-1.5 rounded-full bg-[#1A1A1A] text-white hover:bg-black font-semibold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors cursor-pointer"
                                  >
                                    Inspect
                                  </button>
                                  <button
                                    onClick={() => handleToggleShutoff(alert.householdId)}
                                    className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-colors cursor-pointer ${
                                      isShutoff
                                        ? 'bg-[#E0E0E0] text-[#1A1A1A] border border-[#DCDCDC]'
                                        : 'bg-[#1A1A1A] text-white hover:bg-black shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                                    }`}
                                  >
                                    {isShutoff ? 'Restore' : 'Shutoff'}
                                  </button>
                                  <button
                                    onClick={() => resetHouseholdBaseline(alert.householdId)}
                                    className="text-xs text-[#8A8A8A] hover:text-[#1A1A1A] underline decoration-[#DCDCDC] underline-offset-2 ml-1 cursor-pointer transition-colors"
                                  >
                                    Expected now
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION 2: Higher Usage than Normal (Monochrome, no amber) */}
              <div className="bg-[#FAFAFA] rounded-2xl border border-[#DCDCDC] overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-[#DCDCDC] bg-[#EDEDED]/50 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#1A1A1A] text-[20px]">
                      change_history
                    </span>
                    <h2 className="font-bold text-base text-[#1A1A1A]">Usage is higher than usual — domestic activity</h2>
                    <span className="bg-[#E0E0E0] text-[#1A1A1A] font-semibold text-xs px-2.5 py-0.5 rounded-full border border-[#DCDCDC]">
                      {highUsageAlerts.length} Monitored
                    </span>
                  </div>
                  <span className="text-xs text-[#8A8A8A]">
                    Daytime draw elevated while overnight flow remains flat (domestic use, not a plumbing leak)
                  </span>
                </div>

                {highUsageAlerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#8A8A8A]">
                    No properties currently in high usage watch state.
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#EDEDED] text-[#1A1A1A] font-semibold text-xs border-b border-[#DCDCDC]">
                          <th className="py-3 px-4 sm:px-6">Household</th>
                          <th className="py-3 px-3 sm:px-4">Pattern</th>
                          <th className="py-3 px-3 sm:px-4">Excess Volume</th>
                          <th className="py-3 px-3 sm:px-4">Duration</th>
                          <th className="py-3 px-3 sm:px-4">Status</th>
                          <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCDCDC] text-[#1A1A1A] font-medium">
                        {highUsageAlerts.map(alert => (
                          <tr key={alert.householdId} className="hover:bg-[#F0F0F0] transition-colors">
                            <td className="py-4 px-4 sm:px-6 font-bold text-[#1A1A1A]">
                              {alert.householdName}
                            </td>
                            <td className="py-4 px-3 sm:px-4 text-[#6B6B6B]">
                              Daytime surge ({alert.currentUsage} L vs baseline {alert.normalUsage} L)
                            </td>
                            <td className="py-4 px-3 sm:px-4 font-bold text-[#1A1A1A]">
                              +{alert.excessLitersPerDay} L/day
                            </td>
                            <td className="py-4 px-3 sm:px-4 text-[#8A8A8A]">
                              {alert.daysActive} days
                            </td>
                            <td className="py-4 px-3 sm:px-4">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E0E0E0] text-[#1A1A1A] text-[11px] font-medium border border-[#DCDCDC]">
                                <span className="material-symbols-outlined text-[13px]">change_history</span>
                                Elevated Usage
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-2 flex-wrap">
                                <button
                                  onClick={() => handleInspect(alert.householdId)}
                                  className="px-3.5 py-1.5 rounded-full bg-[#1A1A1A] text-white hover:bg-black font-semibold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] cursor-pointer"
                                >
                                  Inspect
                                </button>
                                <button
                                  onClick={() => resetHouseholdBaseline(alert.householdId)}
                                  className="text-xs text-[#8A8A8A] hover:text-[#1A1A1A] underline decoration-[#DCDCDC] underline-offset-2 ml-1 cursor-pointer transition-colors"
                                >
                                  Expected now
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      <ManualReadingModal
        isOpen={isLogReadingOpen}
        onClose={() => setIsLogReadingOpen(false)}
      />
    </>
  );
}
