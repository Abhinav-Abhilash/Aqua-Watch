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
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 bg-[#EDEDED]">
        <div className="w-10 h-10 border-4 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#6B6B6B]">Loading AquaWatch Telemetry...</p>
      </div>
    );
  }

  const isLeak = leakStatus.severity === 'LEAK_DETECTED';
  const isHighUsage = leakStatus.severity === 'HIGH_USAGE';

  return (
    <>
      <TopHeader onOpenLogReading={() => setIsReadingModalOpen(true)} />

      <main className="bg-[#EDEDED] min-h-[calc(100vh-3.5rem)] p-3 sm:p-5 lg:p-6">
        <div className="flex flex-col w-full gap-4 max-w-[1440px] mx-auto">

          {/* Sub-Header: Property info, active view title, and main valve switch */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAFAFA] px-4 py-3 rounded-2xl border border-[#DCDCDC]">
            
            {/* Breadcrumb / Locality info */}
            <div className="flex flex-wrap items-center gap-2 text-xs min-w-0">
              <span className="text-[#8A8A8A]">Locality:</span>
              <span className="font-medium text-[#1A1A1A]">{selectedHousehold.locality}</span>
              <span className="text-[#DCDCDC]">/</span>
              <span className="font-bold text-[#1A1A1A]">{selectedHousehold.name}</span>
              <span className="text-[#8A8A8A] text-[11px] hidden sm:inline">({selectedHousehold.occupants} occupants)</span>
              
              {/* Single status dot: near-black dot */}
              <span className="w-2 h-2 rounded-full ml-1 shrink-0 bg-[#1A1A1A]" />
            </div>

            {/* View indicator + Main Valve Switch */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E0E0E0] text-[#1A1A1A] border border-[#DCDCDC] capitalize">
                {dashboardView}
              </span>

              {/* Main Shut-off Valve Switch — Solid Black Pill when Open, Grey when Shut */}
              <button
                id="btn-main-valve-toggle"
                type="button"
                onClick={() => setIsValveOpen(!isValveOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all text-xs font-semibold cursor-pointer ${
                  isValveOpen
                    ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-black'
                    : 'bg-[#E0E0E0] text-[#1A1A1A] border border-[#DCDCDC] hover:bg-[#D5D5D5]'
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
              VIEW 1: OVERVIEW (Default Landing View — Directly Shown, Zero Accordions)
             ════════════════════════════════════════════════════════════════════ */}
          {dashboardView === 'overview' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              
              {/* 1. Plain Status Statement Line + Icon (Replaces collapsible Household Status) */}
              <div
                id="household-status-line"
                className={`bg-[#FAFAFA] rounded-2xl p-4 sm:p-5 border transition-all flex flex-wrap items-center justify-between gap-3 ${
                  isLeak
                    ? 'border-[#DCDCDC] border-l-4 border-l-[#B8564A]'
                    : 'border-[#DCDCDC]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Status marker icon with dimensional greyscale shading */}
                  <StatusFace severity={leakStatus.severity} />

                  <div className="flex flex-col min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          isLeak
                            ? 'bg-[#F9ECEB] text-[#B8564A] border-[#B8564A]/40'
                            : 'bg-[#E0E0E0] text-[#1A1A1A] border-[#DCDCDC]'
                        }`}
                      >
                        {isLeak ? 'Leak Alert' : isHighUsage ? 'Usage is higher than usual' : 'All Clear'}
                      </span>
                      <span className="text-xs text-[#8A8A8A]">Household Status</span>
                    </div>

                    {/* Single plain sentence carrying meaning */}
                    <p className="text-sm sm:text-base font-bold text-[#1A1A1A] leading-snug">
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
                    className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] underline decoration-[#DCDCDC] underline-offset-2 shrink-0 cursor-pointer transition-colors"
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

              {/* 2. Stat Cards Row (Replaces "Usage at a Glance") */}
              <StatCardsRow />

              {/* 3. Gauge + House-Flow Illustration (Replaces "Live Consumption & Water Flow") */}
              <div className="bg-[#FAFAFA] border border-[#DCDCDC] rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#DCDCDC] gap-2">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                      Live Consumption &amp; Pipe Flow
                    </h2>
                    <p className="text-xs text-[#8A8A8A]">
                      Architectural cross-section, dynamic gauge, and ultrasonic zone sub-metering
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    !isValveOpen
                      ? 'bg-[#E0E0E0] text-[#6B6B6B] border-[#DCDCDC]'
                      : isLeak
                      ? 'bg-[#E0E0E0] text-[#1A1A1A] border-[#1A1A1A]'
                      : 'bg-[#E0E0E0] text-[#1A1A1A] border-[#DCDCDC]'
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

                <div className="pt-3 border-t border-[#DCDCDC]">
                  <div className="flex flex-wrap items-center justify-between mb-2 gap-1">
                    <span className="text-xs font-semibold text-[#1A1A1A]">Monitored Zone Ultrasonic Nodes:</span>
                    <span className="text-[11px] text-[#8A8A8A]">Click any zone to highlight fixture in illustration</span>
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
              VIEW 2: TRENDS (Shown only when selected from sidebar dropdown)
             ════════════════════════════════════════════════════════════════════ */}
          {dashboardView === 'trends' && (
            <div id="trends-content" className="animate-in fade-in duration-200 flex flex-col gap-4">
              <div className="bg-[#FAFAFA] p-4 sm:p-5 rounded-2xl border border-[#DCDCDC] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                    60-Day Multi-Signal Trends &amp; Overnight Analysis
                  </h2>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">
                    Dual-signal daytime/overnight flow, 4-week peer comparison, and 1am–5am overnight bucket shape for {selectedHousehold.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDashboardView('overview')}
                  className="text-xs font-semibold text-[#1A1A1A] hover:bg-[#E0E0E0] px-3.5 py-1.5 rounded-full border border-[#DCDCDC] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Overview</span>
                </button>
              </div>

              <TrendsView />
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 3: HISTORY (Shown only when selected from sidebar dropdown)
             ════════════════════════════════════════════════════════════════════ */}
          {dashboardView === 'history' && (
            <div id="history-content" className="animate-in fade-in duration-200 flex flex-col gap-4">
              <div className="bg-[#FAFAFA] p-4 sm:p-5 rounded-2xl border border-[#DCDCDC] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                    Meter Telemetry Ledger &amp; Reading History
                  </h2>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">
                    Full reading log with 5-hourly overnight buckets, anomaly tags, and CSV export for {selectedHousehold.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDashboardView('overview')}
                  className="text-xs font-semibold text-[#1A1A1A] hover:bg-[#E0E0E0] px-3.5 py-1.5 rounded-full border border-[#DCDCDC] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
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
