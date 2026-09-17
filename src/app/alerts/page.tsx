'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import { useRouter } from 'next/navigation';
import TopHeader from '@/components/TopHeader';
import ManualReadingModal from '@/components/ManualReadingModal';

export default function AlertsPage() {
  const { allActiveAlerts, setSelectedHouseholdId, resetDemoData, simulateLeak, resetHouseholdBaseline } = useAqua();
  const router = useRouter();
  const [isLogReadingOpen, setIsLogReadingOpen] = useState(false);
  const [shutoffStates, setShutoffStates] = useState<Record<string, boolean>>({});

  const handleInspect = (householdId: string) => {
    setSelectedHouseholdId(householdId);
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

      <main className="relative pt-20 bg-background min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col w-full gap-6 max-w-[1600px] mx-auto">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <span>Network integrity</span>
                <span className="text-slate-300">/</span>
                <span className="text-red-700 font-semibold">Active alerts</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Active alerts
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Algorithmic detection: &gt;2.5σ rolling deviation sustained across 2+ consecutive readings
              </p>
            </div>

            {/* Demo Controls */}
            <div className="flex items-center gap-2">
              <button
                id="btn-trigger-demo-leak-alerts"
                onClick={() => {
                  simulateLeak('h-henderson');
                  router.push('/');
                }}
                className="px-3 py-2 rounded-md text-xs font-medium bg-red-600 hover:bg-red-700 text-white shadow-none transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Simulate leak (Henderson)</span>
              </button>
              <button
                id="btn-reset-alerts"
                onClick={resetDemoData}
                className="px-3 py-2 rounded-md text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-none transition-colors cursor-pointer"
              >
                Reset demo
              </button>
            </div>
          </div>

          {allActiveAlerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-none border border-slate-200 py-16 text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero active anomalies detected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                All properties are consuming water within normal 14-day statistical bounds.
              </p>
              <button
                onClick={() => {
                  simulateLeak('h-henderson');
                  router.push('/');
                }}
                className="mt-4 px-4 py-2 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 shadow-none transition-colors cursor-pointer"
              >
                Simulate leak to test alert flow
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* SECTION 1: Possible Leaks (Red) */}
              <div className="bg-white rounded-lg shadow-none border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-red-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-red-700 text-[20px]">
                      crisis_alert
                    </span>
                    <h2 className="font-bold text-base text-slate-900">Possible leaks — urgent action recommended</h2>
                    <span className="bg-red-100 text-red-700 font-medium text-xs px-2 py-0.5 rounded">
                      {leakAlerts.length} Flagged
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Overnight continuous flow elevated &gt;2.5σ for 2+ consecutive nights
                  </span>
                </div>

                {leakAlerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No active leaks detected at this time.
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200">
                          <th className="py-3 px-6">Household / Location</th>
                          <th className="py-3 px-4">Telemetry Incident</th>
                          <th className="py-3 px-4">Excess Liters</th>
                          <th className="py-3 px-4">Duration</th>
                          <th className="py-3 px-4">Confidence / Peer Divergence</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {leakAlerts.map(alert => {
                          const isShutoff = shutoffStates[alert.householdId];
                          const estLoss = (alert.excessLitersPerDay * 0.035).toFixed(2);

                          return (
                            <tr key={alert.householdId} className="hover:bg-slate-50/70 transition-colors">
                              {/* Household */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-10 bg-red-600 rounded-full shrink-0" />
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm text-slate-900 truncate">
                                      {alert.householdName}
                                    </span>
                                    <span className="text-xs text-slate-500 truncate">
                                      {alert.locality}, {alert.occupants} occupants
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Incident */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <div className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                                    <span className="material-symbols-outlined text-[16px] text-error">
                                      water_damage
                                    </span>
                                    Overnight Continuous Flow
                                  </div>
                                  <span className="text-xs text-slate-500">
                                    Overnight draw: {alert.overnightUsage} L (baseline ~6 L)
                                  </span>
                                </div>
                              </td>

                              {/* Excess Volume */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-error">
                                    +{alert.excessLitersPerDay} L / day
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    Est. loss ${estLoss}/day
                                  </span>
                                </div>
                              </td>

                              {/* Duration */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-900">
                                    {alert.daysActive} Consecutive Nights
                                  </span>
                                  <span className="text-xs text-error font-medium">
                                    Active since {alert.anomalyStartDate}
                                  </span>
                                </div>
                              </td>

                              {/* Confidence */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    alert.isPeerFlat ? 'bg-blue-100 text-primary' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {alert.confidenceLabel}
                                  </span>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-error text-[11px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                                  {isShutoff ? 'Valve Isolated' : 'Active Leak'}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2.5 flex-wrap">
                                  <button
                                    onClick={() => handleInspect(alert.householdId)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                                  >
                                    Inspect
                                  </button>
                                  <button
                                    onClick={() => handleToggleShutoff(alert.householdId)}
                                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors shadow-xs ${
                                      isShutoff
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        : 'bg-error hover:bg-red-700 text-white'
                                    }`}
                                  >
                                    {isShutoff ? 'Restore' : 'Shutoff'}
                                  </button>
                                  <button
                                    onClick={() => resetHouseholdBaseline(alert.householdId)}
                                    className="text-xs text-slate-500 hover:text-slate-800 underline decoration-slate-300 underline-offset-2 ml-1 cursor-pointer transition-colors"
                                    title="Confirm this lifestyle/usage change and reset 14-day baseline"
                                  >
                                    This is expected now
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

              {/* SECTION 2: Higher Usage than Normal (Amber) */}
              <div className="bg-white rounded-lg shadow-none border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-amber-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-amber-700 text-[20px]">
                      trending_up
                    </span>
                    <h2 className="font-bold text-base text-slate-900">Higher usage than usual — domestic activity</h2>
                    <span className="bg-amber-100 text-amber-800 font-medium text-xs px-2 py-0.5 rounded">
                      {highUsageAlerts.length} Monitored
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Daytime draw elevated while overnight flow remains flat (domestic use, not a plumbing leak)
                  </span>
                </div>

                {highUsageAlerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No properties currently in high usage watch state.
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200">
                          <th className="py-3 px-6">Household</th>
                          <th className="py-3 px-4">Pattern</th>
                          <th className="py-3 px-4">Excess Volume</th>
                          <th className="py-3 px-4">Duration</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {highUsageAlerts.map(alert => (
                          <tr key={alert.householdId} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-6 font-bold text-slate-900">
                              {alert.householdName}
                            </td>
                            <td className="py-4 px-4 text-slate-600">
                              Daytime surge ({alert.currentUsage} L vs baseline {alert.normalUsage} L)
                            </td>
                            <td className="py-4 px-4 font-bold text-amber-800">
                              +{alert.excessLitersPerDay} L/day
                            </td>
                            <td className="py-4 px-4 text-slate-600">
                              {alert.daysActive} days
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
                                Elevated Usage
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2.5">
                                <button
                                  onClick={() => handleInspect(alert.householdId)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
                                >
                                  Inspect
                                </button>
                                <button
                                  onClick={() => resetHouseholdBaseline(alert.householdId)}
                                  className="text-xs text-slate-500 hover:text-slate-800 underline decoration-slate-300 underline-offset-2 ml-1 cursor-pointer transition-colors"
                                  title="Confirm this lifestyle/usage change and reset 14-day baseline"
                                >
                                  This is expected now
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
