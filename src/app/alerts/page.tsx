'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import { useRouter } from 'next/navigation';
import TopHeader from '@/components/TopHeader';
import ManualReadingModal from '@/components/ManualReadingModal';
import { LeakSeverityTier } from '@/types';

export default function AlertsPage() {
  const {
    allActiveAlerts,
    setSelectedHouseholdId,
    resetDemoData,
    simulateLeak,
    resetHouseholdBaseline,
    setDashboardView
  } = useAqua();
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

  // Filter categorized alerts
  const acuteLeaks = allActiveAlerts.filter(a => a.alertCategory === 'ACUTE_LEAK');
  const vacationLeaks = allActiveAlerts.filter(a => a.alertCategory === 'VACATION_LEAK');
  const slowCreepAlerts = allActiveAlerts.filter(a => a.alertCategory === 'SLOW_CREEP');
  const highUsageAlerts = allActiveAlerts.filter(a => a.alertCategory === 'HIGH_USAGE');
  const meterStallAlerts = allActiveAlerts.filter(a => a.alertCategory === 'METER_STALL');

  const renderSeverityBadge = (tier?: LeakSeverityTier, rate?: number) => {
    if (tier === 'SEVERE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FEF3F2] text-[#D92D20] border border-[#F04438]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D92D20] animate-ping" />
          Severe ({rate ? `${rate} L/hr` : '20+ L/hr'})
        </span>
      );
    }
    if (tier === 'MODERATE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFAEB] text-[#B54708] border border-[#F79009]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F79009]" />
          Moderate ({rate ? `${rate} L/hr` : '5-20 L/hr'})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F2F4F7] text-[#344054] border border-[#D0D5DD]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#667085]" />
        Minor ({rate ? `${rate} L/hr` : '<5 L/hr'})
      </span>
    );
  };

  return (
    <>
      <TopHeader onOpenLogReading={() => setIsLogReadingOpen(true)} />

      <main className="bg-[#F5F7FA] min-h-[calc(100vh-3.5rem)] p-3 sm:p-5 lg:p-6">
        <div className="flex flex-col w-full gap-5 max-w-[1440px] mx-auto">
          
          {/* Header & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E4E7EC] shadow-xs">
            <div>
              <div className="flex items-center gap-1.5 text-[#667085] text-xs font-medium">
                <span>District Telemetry</span>
                <span>/</span>
                <span className="text-[#101828] font-semibold">Active Anomaly Ledger</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#101828] tracking-tight mt-1">
                Active Anomaly Ledger & Multi-Scenario Detection
              </h1>
              <p className="text-xs text-[#667085] mt-0.5">
                Dynamic surveillance: acute plumbing ruptures, vacation absence leaks, gradual slow-creep, domestic surges, and meter stalls.
              </p>
            </div>

            {/* Demo Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="btn-trigger-demo-leak-alerts"
                onClick={() => {
                  simulateLeak('h-henderson');
                  setDashboardView('overview');
                  router.push('/');
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#2F6FED] hover:bg-[#2458C7] text-white shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Simulate leak (Henderson)</span>
              </button>
              <button
                id="btn-reset-alerts"
                onClick={resetDemoData}
                className="px-3 py-2 text-xs font-semibold text-[#2F6FED] hover:underline transition-colors cursor-pointer"
              >
                Reset Demo Data
              </button>
            </div>
          </div>

          {allActiveAlerts.length === 0 ? (
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] py-14 text-center p-6 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#ECFDF3] text-[#12B76A] flex items-center justify-center mx-auto mb-3 border border-[#12B76A]/30">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <h3 className="text-base font-bold text-[#101828]">Zero Active Anomalies Detected</h3>
              <p className="text-xs text-[#667085] max-w-sm mx-auto mt-1">
                All monitored properties are consuming water strictly inside standard baseline parameters.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* ─────────────────────────────────────────────────────────────
                  CATEGORY 1: Acute Possible Leaks (Red #F04438)
                 ───────────────────────────────────────────────────────────── */}
              {acuteLeaks.length > 0 && (
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] border-l-4 border-l-[#F04438] overflow-hidden shadow-xs">
                  <div className="p-4 sm:p-5 border-b border-[#E4E7EC] bg-[#FEF3F2]/40 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#F04438] text-[20px]">
                        water_damage
                      </span>
                      <h2 className="font-bold text-base text-[#101828]">Possible Leaks — Urgent Inspection Recommended</h2>
                      <span className="bg-[#FEF3F2] text-[#F04438] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#F04438]/30">
                        {acuteLeaks.length} Flagged
                      </span>
                    </div>
                    <span className="text-xs text-[#667085]">
                      Overnight continuous flow elevated &gt;2.5σ for 2+ consecutive nights (sorted by severity)
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F8F9FB] text-[#101828] font-semibold text-xs border-b border-[#E4E7EC]">
                          <th className="py-3 px-4 sm:px-6">Household / Location</th>
                          <th className="py-3 px-3 sm:px-4">Severity Tier & Rate</th>
                          <th className="py-3 px-3 sm:px-4">Telemetry Incident</th>
                          <th className="py-3 px-3 sm:px-4">Excess Volume</th>
                          <th className="py-3 px-3 sm:px-4">Cost Impact (₹50/1kL)</th>
                          <th className="py-3 px-3 sm:px-4">Confidence</th>
                          <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4E7EC] text-[#101828] font-medium bg-[#FFFFFF]">
                        {acuteLeaks.map(alert => {
                          const isShutoff = shutoffStates[alert.householdId];
                          return (
                            <tr key={alert.householdId} className="hover:bg-[#F8F9FB] transition-colors">
                              <td className="py-4 px-4 sm:px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-10 bg-[#F04438] rounded-full shrink-0" />
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm text-[#101828]">
                                      {alert.householdName}
                                    </span>
                                    <span className="text-xs text-[#667085]">
                                      {alert.locality}, {alert.occupants} occupants
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-3 sm:px-4">
                                <div className="flex flex-col gap-1">
                                  {renderSeverityBadge(alert.severityTier, alert.estimatedRateLph)}
                                  <span className="text-[11px] text-[#667085]">
                                    {alert.severityTier === 'SEVERE' ? 'Check immediately' : alert.severityTier === 'MODERATE' ? 'Check today' : 'Worth checking soon'}
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-3 sm:px-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#101828]">Overnight Continuous Flow</span>
                                  <span className="text-xs text-[#667085]">
                                    Overnight draw: {alert.overnightUsage} L (baseline ~6 L)
                                  </span>
                                  <span className="text-[10px] text-[#F04438] mt-0.5">
                                    Active for {alert.daysActive} consecutive nights
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-3 sm:px-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-[#F04438]">
                                    +{alert.excessLitersPerDay} L / day
                                  </span>
                                  <span className="text-xs text-[#667085]">
                                    ~{alert.estimatedRateLph ?? Math.round(alert.excessLitersPerDay / 7)} L / hr
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-3 sm:px-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#101828]">
                                    ₹{alert.estimatedCostSoFar ?? 0} so far
                                  </span>
                                  <span className="text-[11px] text-[#667085]">
                                    ~₹{alert.estimatedCostPerMonth ?? 0} / month
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-3 sm:px-4">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20">
                                  {alert.confidenceLabel}
                                </span>
                              </td>

                              <td className="py-4 px-4 sm:px-6 text-right">
                                <div className="flex items-center justify-end gap-2 flex-wrap">
                                  <button
                                    onClick={() => handleInspect(alert.householdId)}
                                    className="px-3 py-1.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2458C7] font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                                  >
                                    Inspect
                                  </button>
                                  <button
                                    onClick={() => handleToggleShutoff(alert.householdId)}
                                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                                      isShutoff
                                        ? 'bg-[#FFFFFF] text-[#12B76A] border border-[#12B76A]'
                                        : 'bg-[#FFFFFF] text-[#F04438] border border-[#F04438] hover:bg-[#FEF3F2]'
                                    }`}
                                  >
                                    {isShutoff ? 'Restore' : 'Shutoff'}
                                  </button>
                                  <button
                                    onClick={() => resetHouseholdBaseline(alert.householdId)}
                                    className="text-xs text-[#2F6FED] hover:underline ml-1 cursor-pointer transition-colors"
                                  >
                                    Expected
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  CATEGORY 2: Vacation Mode Alerts (Scenario A)
                 ───────────────────────────────────────────────────────────── */}
              {vacationLeaks.length > 0 && (
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] border-l-4 border-l-[#7A5AF8] overflow-hidden shadow-xs">
                  <div className="p-4 sm:p-5 border-b border-[#E4E7EC] bg-[#F4F3FF] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#7A5AF8] text-[20px]">
                        flight_takeoff
                      </span>
                      <h2 className="font-bold text-base text-[#101828]">Unusual Absence-Period Usage (Vacation Mode)</h2>
                      <span className="bg-[#ECE9FE] text-[#7A5AF8] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#7A5AF8]/30">
                        {vacationLeaks.length} High-Confidence Leak
                      </span>
                    </div>
                    <span className="text-xs text-[#667085]">
                      Declared away: single-reading immediate flag (bypasses 2-night persistence)
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F8F9FB] text-[#101828] font-semibold text-xs border-b border-[#E4E7EC]">
                          <th className="py-3 px-4 sm:px-6">Household / Location</th>
                          <th className="py-3 px-3 sm:px-4">Vacation State</th>
                          <th className="py-3 px-3 sm:px-4">Unexpected Draw</th>
                          <th className="py-3 px-3 sm:px-4">Cost Impact</th>
                          <th className="py-3 px-3 sm:px-4">Confidence</th>
                          <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4E7EC] text-[#101828] font-medium bg-[#FFFFFF]">
                        {vacationLeaks.map(alert => (
                          <tr key={alert.householdId} className="hover:bg-[#F8F9FB] transition-colors">
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-10 bg-[#7A5AF8] rounded-full shrink-0" />
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-sm text-[#101828]">
                                    {alert.householdName}
                                  </span>
                                  <span className="text-xs text-[#667085]">
                                    {alert.locality}, {alert.occupants} occupants
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECE9FE] text-[#7A5AF8] font-bold text-[11px] border border-[#7A5AF8]/30">
                                <span className="material-symbols-outlined text-[13px]">flight</span>
                                Declared Away
                              </span>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-[#7A5AF8]">
                                  {alert.currentUsage} L Recorded
                                </span>
                                <span className="text-xs text-[#667085]">
                                  Expected 0 L while premises vacant
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#101828]">
                                  ₹{alert.estimatedCostSoFar ?? 0}
                                </span>
                                <span className="text-[11px] text-[#667085]">
                                  ~₹{alert.estimatedCostPerMonth ?? 0} / month continuing
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF3] text-[#12B76A] border border-[#12B76A]/30">
                                High Confidence (99%)
                              </span>
                            </td>

                            <td className="py-4 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleInspect(alert.householdId)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2458C7] font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                                >
                                  Inspect Flow
                                </button>
                                <button
                                  onClick={() => handleToggleShutoff(alert.householdId)}
                                  className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] text-[#F04438] border border-[#F04438] hover:bg-[#FEF3F2] font-semibold text-xs transition-colors cursor-pointer"
                                >
                                  Remote Shutoff
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  CATEGORY 3: Gradual Increase / Slow-Creep (Scenario B)
                 ───────────────────────────────────────────────────────────── */}
              {slowCreepAlerts.length > 0 && (
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] border-l-4 border-l-[#0BA5EC] overflow-hidden shadow-xs">
                  <div className="p-4 sm:p-5 border-b border-[#E4E7EC] bg-[#F0F9FF] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#0BA5EC] text-[20px]">
                        trending_up
                      </span>
                      <h2 className="font-bold text-base text-[#101828]">Gradual Increase Detected — 45-Day Baseline Drift</h2>
                      <span className="bg-[#E0F2FE] text-[#026AA2] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#0BA5EC]/30">
                        {slowCreepAlerts.length} Monitored
                      </span>
                    </div>
                    <span className="text-xs text-[#667085]">
                      Catches slow-leaks absorbed by 14-day rolling window (&gt;25% drift over 45 days)
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F8F9FB] text-[#101828] font-semibold text-xs border-b border-[#E4E7EC]">
                          <th className="py-3 px-4 sm:px-6">Household / Location</th>
                          <th className="py-3 px-3 sm:px-4">Baseline Drift</th>
                          <th className="py-3 px-3 sm:px-4">Overnight Creep</th>
                          <th className="py-3 px-3 sm:px-4">Diagnosis</th>
                          <th className="py-3 px-3 sm:px-4">Est. Recurring Cost</th>
                          <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4E7EC] text-[#101828] font-medium bg-[#FFFFFF]">
                        {slowCreepAlerts.map(alert => (
                          <tr key={alert.householdId} className="hover:bg-[#F8F9FB] transition-colors">
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-10 bg-[#0BA5EC] rounded-full shrink-0" />
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-sm text-[#101828]">
                                    {alert.householdName}
                                  </span>
                                  <span className="text-xs text-[#667085]">
                                    {alert.locality}, {alert.occupants} occupants
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="inline-flex items-center gap-1 font-extrabold text-sm text-[#026AA2]">
                                +{alert.slowCreepDriftPercent ?? 200}% Rise
                              </span>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#101828]">
                                  {alert.overnightUsage} L / night (was ~5 L)
                                </span>
                                <span className="text-xs text-[#667085]">
                                  Gradually risen over 45 days
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="text-xs text-[#667085]">
                                Slow fixture creep or deteriorating flapper valve slowly absorbed into rolling average.
                              </span>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="font-bold text-[#101828]">
                                ~₹{alert.estimatedCostPerMonth ?? 25} / month
                              </span>
                            </td>

                            <td className="py-4 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleInspect(alert.householdId)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2458C7] font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                                >
                                  Inspect Trends
                                </button>
                                <button
                                  onClick={() => resetHouseholdBaseline(alert.householdId)}
                                  className="text-xs text-[#2F6FED] hover:underline ml-1 cursor-pointer transition-colors"
                                >
                                  Accept New Baseline
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  CATEGORY 4: Higher Daytime Usage than Normal (Amber #F79009)
                 ───────────────────────────────────────────────────────────── */}
              {highUsageAlerts.length > 0 && (
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] border-l-4 border-l-[#F79009] overflow-hidden shadow-xs">
                  <div className="p-4 sm:p-5 border-b border-[#E4E7EC] bg-[#FFFAEB]/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#F79009] text-[20px]">
                        change_history
                      </span>
                      <h2 className="font-bold text-base text-[#101828]">Higher Usage than Normal — Domestic Activity</h2>
                      <span className="bg-[#FFFAEB] text-[#F79009] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#F79009]/30">
                        {highUsageAlerts.length} Monitored
                      </span>
                    </div>
                    <span className="text-xs text-[#667085]">
                      Daytime draw &gt;2.5σ baseline; overnight clean (lifestyle/guests)
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F8F9FB] text-[#101828] font-semibold text-xs border-b border-[#E4E7EC]">
                          <th className="py-3 px-4 sm:px-6">Household / Location</th>
                          <th className="py-3 px-3 sm:px-4">Observed Pattern</th>
                          <th className="py-3 px-3 sm:px-4">Excess Daytime</th>
                          <th className="py-3 px-3 sm:px-4">Overnight Flow</th>
                          <th className="py-3 px-3 sm:px-4">Diagnosis</th>
                          <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4E7EC] text-[#101828] font-medium bg-[#FFFFFF]">
                        {highUsageAlerts.map(alert => (
                          <tr key={alert.householdId} className="hover:bg-[#F8F9FB] transition-colors">
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-10 bg-[#F79009] rounded-full shrink-0" />
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-sm text-[#101828]">
                                    {alert.householdName}
                                  </span>
                                  <span className="text-xs text-[#667085]">
                                    {alert.locality}, {alert.occupants} occupants
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#101828]">
                                  Elevated Daytime Consumption
                                </span>
                                <span className="text-xs text-[#667085]">
                                  Active for {alert.daysActive} consecutive days
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="font-bold text-sm text-[#F79009]">
                                +{alert.excessLitersPerDay} L / day
                              </span>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF3] text-[#12B76A] font-semibold text-[11px] border border-[#12B76A]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
                                Clean (~{alert.overnightUsage} L)
                              </span>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="text-xs text-[#667085]">
                                Elevated daytime draw with clean overnight baseline indicates high domestic activity, not plumbing rupture.
                              </span>
                            </td>

                            <td className="py-4 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleInspect(alert.householdId)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2458C7] font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                                >
                                  Inspect
                                </button>
                                <button
                                  onClick={() => resetHouseholdBaseline(alert.householdId)}
                                  className="text-xs text-[#2F6FED] hover:underline ml-1 cursor-pointer transition-colors"
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
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  CATEGORY 5: Zero-Flow / Meter Stall (Scenario E)
                 ───────────────────────────────────────────────────────────── */}
              {meterStallAlerts.length > 0 && (
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] border-l-4 border-l-[#475467] overflow-hidden shadow-xs">
                  <div className="p-4 sm:p-5 border-b border-[#E4E7EC] bg-[#F2F4F7] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#475467] text-[20px]">
                        speed
                      </span>
                      <h2 className="font-bold text-base text-[#101828]">No Usage Detected — Meter Stall or Disconnect</h2>
                      <span className="bg-[#EAECF0] text-[#344054] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#D0D5DD]">
                        {meterStallAlerts.length} Stalled
                      </span>
                    </div>
                    <span className="text-xs text-[#667085]">
                      Near-zero flow (&lt;5 L/day) for 2+ days on active residence without vacation declaration
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F8F9FB] text-[#101828] font-semibold text-xs border-b border-[#E4E7EC]">
                          <th className="py-3 px-4 sm:px-6">Household / Location</th>
                          <th className="py-3 px-3 sm:px-4">Duration</th>
                          <th className="py-3 px-3 sm:px-4">Current Reading</th>
                          <th className="py-3 px-3 sm:px-4">Diagnosis</th>
                          <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4E7EC] text-[#101828] font-medium bg-[#FFFFFF]">
                        {meterStallAlerts.map(alert => (
                          <tr key={alert.householdId} className="hover:bg-[#F8F9FB] transition-colors">
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-10 bg-[#475467] rounded-full shrink-0" />
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-sm text-[#101828]">
                                    {alert.householdName}
                                  </span>
                                  <span className="text-xs text-[#667085]">
                                    {alert.locality}, {alert.occupants} occupants
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="font-bold text-sm text-[#101828]">
                                {alert.stalledConsecutiveDays ?? alert.daysActive} Consecutive Days
                              </span>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="font-bold text-sm text-[#475467]">
                                {alert.currentUsage} L / day
                              </span>
                            </td>

                            <td className="py-4 px-3 sm:px-4">
                              <span className="text-xs text-[#667085]">
                                Check for a jammed mechanical impeller, dead IoT transmitter battery, or unannounced resident absence.
                              </span>
                            </td>

                            <td className="py-4 px-4 sm:px-6 text-right">
                              <button
                                onClick={() => handleInspect(alert.householdId)}
                                className="px-3.5 py-1.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2458C7] font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                              >
                                Test Sensor
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
