'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import TopHeader from '@/components/TopHeader';
import AnomalyCard from '@/components/AnomalyCard';
import DemoControlBar from '@/components/DemoControlBar';
import StatCardsRow from '@/components/StatCardsRow';
import SemiCircleGauge from '@/components/SemiCircleGauge';
import HouseFlowIllustration from '@/components/HouseFlowIllustration';
import ZoneStatusStrip from '@/components/ZoneStatusStrip';
import TrendsView from '@/components/TrendsView';
import TelemetryTable from '@/components/TelemetryTable';
import StatusFace from '@/components/StatusFace';
import ManualReadingModal from '@/components/ManualReadingModal';

export default function DashboardPage() {
  const { selectedHousehold, isLoaded, leakStatus, dashboardView, setDashboardView, resetHouseholdBaseline } = useAqua();
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isValveOpen, setIsValveOpen] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 bg-[#F5F7FA]">
        <div className="w-10 h-10 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#667085]">Loading AquaWatch Telemetry...</p>
      </div>
    );
  }

  const isLeak = leakStatus.severity === 'LEAK_DETECTED';
  const isHighUsage = leakStatus.severity === 'HIGH_USAGE';

  return (
    <>
      <TopHeader onOpenLogReading={() => setIsReadingModalOpen(true)} />

      <main className="bg-[#F5F7FA] min-h-[calc(100vh-3.5rem)] p-3 sm:p-5 lg:p-6">
        <div className="flex flex-col w-full gap-4 max-w-[1440px] mx-auto">

          {/* Sub-Header: Property info, active view title, and main valve switch */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] px-4 py-3 rounded-2xl border border-[#E4E7EC] shadow-xs">
            
            {/* Breadcrumb / Locality info */}
            <div className="flex flex-wrap items-center gap-2 text-xs min-w-0">
              <span className="text-[#667085]">Locality:</span>
              <span className="font-medium text-[#101828]">{selectedHousehold.locality}</span>
              <span className="text-[#E4E7EC]">/</span>
              <span className="font-bold text-[#101828]">{selectedHousehold.name}</span>
              <span className="text-[#667085] text-[11px] hidden sm:inline">({selectedHousehold.occupants} occupants)</span>
              
              {/* Status dot */}
              <span className={`w-2 h-2 rounded-full ml-1 shrink-0 ${
                isLeak ? 'bg-[#F04438]' : isHighUsage ? 'bg-[#F79009]' : 'bg-[#12B76A]'
              }`} />
            </div>

            {/* View indicator + Main Valve Switch */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20 capitalize">
                {dashboardView}
              </span>

              {/* Main Shut-off Valve Switch — Solid Blue when Open, Outline when Shut */}
              <button
                id="btn-main-valve-toggle"
                type="button"
                onClick={() => setIsValveOpen(!isValveOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                  isValveOpen
                    ? 'bg-[#2F6FED] text-white shadow-sm hover:bg-[#2458C7]'
                    : 'bg-[#FFFFFF] text-[#2F6FED] border border-[#2F6FED] hover:bg-[#EFF4FF]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isValveOpen ? 'lock_open' : 'lock'}
                </span>
                <span>
                  Valve: <strong>{isValveOpen ? 'Open' : 'Shut'}</strong>
                </span>
              </button>
            </div>

          </div>

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 1: OVERVIEW (Default Landing View)
             ════════════════════════════════════════════════════════════════════ */}
          {dashboardView === 'overview' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              
              {/* 1. Status Statement Line + Icon */}
              <div
                id="household-status-line"
                className={`bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border transition-all flex flex-wrap items-center justify-between gap-3 shadow-xs ${
                  isLeak
                    ? 'border-[#F04438]/30 border-l-4 border-l-[#F04438] bg-[#FEF3F2]/40'
                    : 'border-[#E4E7EC]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <StatusFace severity={leakStatus.severity} />

                  <div className="flex flex-col min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          isLeak
                            ? 'bg-[#FEF3F2] text-[#F04438] border-[#F04438]/30'
                            : isHighUsage
                            ? 'bg-[#FFFAEB] text-[#F79009] border-[#F79009]/30'
                            : 'bg-[#ECFDF3] text-[#12B76A] border-[#12B76A]/30'
                        }`}
                      >
                        {isLeak ? 'Leak Alert' : isHighUsage ? 'Usage is higher than usual' : 'All Clear'}
                      </span>
                      <span className="text-xs text-[#667085]">Household Status</span>
                    </div>

                    <p className="text-sm sm:text-base font-bold text-[#101828] leading-snug">
                      {isLeak
                        ? `Possible leak detected — water is running continuously (+${leakStatus.estimatedExcessLitersPerDay || 180} L/day excess) across ${leakStatus.consecutiveDays || 3} consecutive nights.`
                        : isHighUsage
                        ? `Usage is higher than usual — daytime draw is elevated while overnight baseline remains normal.`
                        : `Everything's normal — daily water flow is calibrated within standard 14-day baseline.`}
                    </p>
                  </div>
                </div>

                {(isLeak || isHighUsage) && (
                  <button
                    id="btn-confirm-baseline-status"
                    onClick={() => resetHouseholdBaseline(selectedHousehold.id)}
                    className="text-xs text-[#2F6FED] hover:underline shrink-0 cursor-pointer transition-colors"
                  >
                    This is expected now (reset baseline)
                  </button>
                )}
              </div>

              {/* Anomaly Card (Visible directly when leak is flagged) */}
              {isLeak && (
                <AnomalyCard
                  onInspect={() => {
                    setDashboardView('trends');
                  }}
                />
              )}

              {/* 2. Stat Cards Row */}
              <StatCardsRow />

              {/* 3. Gauge + House-Flow Illustration */}
              <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E4E7EC] gap-2">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[#101828]">
                      Live Consumption &amp; Pipe Flow
                    </h2>
                    <p className="text-xs text-[#667085]">
                      Architectural cross-section, dynamic gauge, and ultrasonic zone sub-metering
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    !isValveOpen
                      ? 'bg-[#F2F4F7] text-[#667085] border-[#E4E7EC]'
                      : isLeak
                      ? 'bg-[#FEF3F2] text-[#F04438] border-[#F04438]/30'
                      : 'bg-[#ECFDF3] text-[#12B76A] border-[#12B76A]/30'
                  }`}>
                    {!isValveOpen ? 'Valve Closed' : isLeak ? 'Zone 2 Irregular Loss' : 'Optimal Flow'}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  <div className="lg:col-span-5 flex flex-col">
                    <SemiCircleGauge />
                  </div>
                  <div className="lg:col-span-7 flex flex-col">
                    <HouseFlowIllustration
                      isValveOpen={isValveOpen}
                      selectedZone={selectedZone}
                      onSelectZone={(zone) => setSelectedZone(zone)}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E7EC]">
                  <div className="flex flex-wrap items-center justify-between mb-2 gap-1">
                    <span className="text-xs font-semibold text-[#101828]">Monitored Zone Ultrasonic Nodes:</span>
                    <span className="text-[11px] text-[#667085]">Click any zone to highlight fixture in illustration</span>
                  </div>
                  <ZoneStatusStrip
                    selectedZone={selectedZone}
                    onSelectZone={(zone) => setSelectedZone(zone)}
                    isValveOpen={isValveOpen}
                  />
                </div>
              </div>

              {/* Pitch Demo Control Bar */}
              <DemoControlBar />

            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 2: TRENDS (Shown when selected from sidebar dropdown)
             ════════════════════════════════════════════════════════════════════ */}
          {dashboardView === 'trends' && (
            <div id="trends-content" className="animate-in fade-in duration-200 flex flex-col gap-4">
              <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E4E7EC] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#101828]">
                    60-Day Multi-Signal Trends &amp; Overnight Analysis
                  </h2>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Dual-signal daytime/overnight flow, 4-week peer comparison, and 1am–5am overnight bucket shape for {selectedHousehold.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDashboardView('overview')}
                  className="text-xs font-semibold text-[#2F6FED] bg-[#EFF4FF] hover:bg-[#DBEAFE] px-3.5 py-1.5 rounded-lg border border-[#2F6FED]/20 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Overview</span>
                </button>
              </div>

              <TrendsView />
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 3: HISTORY (Shown when selected from sidebar dropdown)
             ════════════════════════════════════════════════════════════════════ */}
          {dashboardView === 'history' && (
            <div id="history-content" className="animate-in fade-in duration-200 flex flex-col gap-4">
              <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E4E7EC] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#101828]">
                    Meter Telemetry Ledger &amp; Reading History
                  </h2>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Full reading log with 5-hourly overnight buckets, anomaly tags, and CSV export for {selectedHousehold.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDashboardView('overview')}
                  className="text-xs font-semibold text-[#2F6FED] bg-[#EFF4FF] hover:bg-[#DBEAFE] px-3.5 py-1.5 rounded-lg border border-[#2F6FED]/20 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Overview</span>
                </button>
              </div>

              <TelemetryTable onOpenDetails={() => {}} />
            </div>
          )}

        </div>
      </main>

      {/* Manual Reading Log Modal */}
      {isReadingModalOpen && (
        <ManualReadingModal isOpen={isReadingModalOpen} onClose={() => setIsReadingModalOpen(false)} />
      )}
    </>
  );
}
