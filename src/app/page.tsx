'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import TopHeader from '@/components/TopHeader';
import GlanceBanner from '@/components/GlanceBanner';
import SemiCircleGauge from '@/components/SemiCircleGauge';
import HouseFlowIllustration from '@/components/HouseFlowIllustration';
import AnomalyCard from '@/components/AnomalyCard';
import ZoneStatusStrip from '@/components/ZoneStatusStrip';
import StatCardsRow from '@/components/StatCardsRow';
import TelemetryTable from '@/components/TelemetryTable';
import ManualReadingModal from '@/components/ManualReadingModal';

export default function DashboardPage() {
  const { selectedHousehold, isLoaded, leakStatus } = useAqua();
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isValveOpen, setIsValveOpen] = useState(true);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading AquaWatch Telemetry...</p>
      </div>
    );
  }

  const isLeak = leakStatus.severity === 'LEAK_DETECTED';

  return (
    <>
      {/* Top Header */}
      <TopHeader onOpenLogReading={() => setIsReadingModalOpen(true)} />

      {/* Main Content Area */}
      <main className="relative pt-18 sm:pt-20 bg-background min-h-screen p-3 sm:p-6 lg:p-8">
        <div className="flex flex-col w-full gap-5 sm:gap-6 max-w-[1600px] mx-auto">
          
          {/* Overview Context Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>{selectedHousehold.locality} Sub-District</span>
                <span>/</span>
                <span className="text-primary font-bold">Live Telemetry Feed</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 sm:mt-1">
                Water Demand &amp; Anomaly Dashboard
              </h1>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 self-start sm:self-auto flex-wrap">
              <div className="flex items-center bg-white shadow-xs border border-slate-200/80 rounded-xl p-1">
                <button
                  type="button"
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-primary-container text-white font-semibold text-xs transition-colors"
                >
                  Realtime
                </button>
                <button
                  type="button"
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
                >
                  Daily
                </button>
                <button
                  type="button"
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
                >
                  Monthly
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsValveOpen(!isValveOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-white border border-slate-200/80 text-slate-900 hover:bg-slate-50 transition-all shadow-xs text-xs font-semibold"
              >
                <span className={`material-symbols-outlined text-[16px] sm:text-[18px] ${
                  isValveOpen ? 'text-emerald-600' : 'text-error'
                }`}>
                  {isValveOpen ? 'lock_open' : 'lock'}
                </span>
                <span>
                  Main Valve:{' '}
                  <strong className={isValveOpen ? 'text-emerald-600 font-bold' : 'text-error font-bold'}>
                    {isValveOpen ? 'Open' : 'Shut'}
                  </strong>
                </span>
              </button>
            </div>
          </div>

          {/* 1. Status Face & Glance Banner */}
          <GlanceBanner />

          {/* 2. Top Hero Grid: Semi-Circle Gauge + Real-Time House Flow Illustration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            <div className="lg:col-span-5 flex flex-col h-full">
              <SemiCircleGauge />
            </div>
            <div className="lg:col-span-7 flex flex-col h-full">
              <HouseFlowIllustration />
            </div>
          </div>

          {/* 3. Middle Row: Flagged Anomaly Action Card (when leak) + Zone Status Strip */}
          {isLeak ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <AnomalyCard onInspect={() => {
                  const el = document.getElementById('telemetry-table-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }} />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-between">
                <ZoneStatusStrip />
              </div>
            </div>
          ) : (
            <div className="w-full">
              <ZoneStatusStrip />
            </div>
          )}

          {/* 4. Stat Cards Row (Today's Usage, 14-Day Average, vs Peer Group) */}
          <StatCardsRow />

          {/* 5. Telemetry Data Table & Recharts Trendline */}
          <div id="telemetry-table-section">
            <TelemetryTable onOpenDetails={(date) => {
              alert(`Telemetry details recorded for ${date}: Household calibrated reading stored.`);
            }} />
          </div>

        </div>
      </main>

      {/* Manual Reading Modal */}
      <ManualReadingModal
        isOpen={isReadingModalOpen}
        onClose={() => setIsReadingModalOpen(false)}
      />
    </>
  );
}
