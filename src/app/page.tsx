'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import TopHeader from '@/components/TopHeader';
import GlanceBanner from '@/components/GlanceBanner';
import SemiCircleGauge from '@/components/SemiCircleGauge';
import HouseFlowIllustration from '@/components/HouseFlowIllustration';
import StatCardsRow from '@/components/StatCardsRow';
import TrendsView from '@/components/TrendsView';
import TelemetryTable from '@/components/TelemetryTable';
import ManualReadingModal from '@/components/ManualReadingModal';

type DashboardTab = 'overview' | 'trends' | 'history';

export default function DashboardPage() {
  const { selectedHousehold, isLoaded, leakStatus } = useAqua();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isValveOpen, setIsValveOpen] = useState(true);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading AquaWatch Telemetry...</p>
      </div>
    );
  }

  return (
    <>
      {/* Fixed Top Header with Household Selector */}
      <TopHeader onOpenLogReading={() => setIsReadingModalOpen(true)} />

      {/* Main Viewport Content */}
      <main className="relative pt-18 sm:pt-20 bg-background min-h-[calc(100vh-42px)] p-3 sm:p-5 lg:p-6 flex flex-col justify-start">
        <div className="flex flex-col w-full gap-4 sm:gap-5 max-w-[1600px] mx-auto flex-1">
          
          {/* Household Context & Sub-navigation Tabs directly under Household Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                  <span>{selectedHousehold.locality}</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-[#2F6FED] font-semibold">{selectedHousehold.name}</span>
                </div>
              </div>

              {/* Subsection Tabs */}
              <div
                id="dashboard-tabs"
                className="flex items-center bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600 ml-2"
              >
                <button
                  id="tab-overview"
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">dashboard</span>
                  <span>Overview</span>
                </button>

                <button
                  id="tab-trends"
                  type="button"
                  onClick={() => setActiveTab('trends')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                    activeTab === 'trends'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>Trends</span>
                </button>

                <button
                  id="tab-history"
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">history</span>
                  <span>History</span>
                </button>
              </div>
            </div>

            {/* Quick Status Pill / Main Valve toggle */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                id="btn-main-valve-toggle"
                type="button"
                onClick={() => setIsValveOpen(!isValveOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-all shadow-none text-xs font-medium"
              >
                <span className={`material-symbols-outlined text-[16px] ${
                  isValveOpen ? 'text-emerald-600' : 'text-error'
                }`}>
                  {isValveOpen ? 'lock_open' : 'lock'}
                </span>
                <span>
                  Valve:{' '}
                  <strong className={isValveOpen ? 'text-emerald-700 font-semibold' : 'text-error font-semibold'}>
                    {isValveOpen ? 'Open' : 'Shut'}
                  </strong>
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW — Level 1 + Level 2 Only (Zero vertical scroll on 1440x900) */}
          {activeTab === 'overview' && (
            <div id="overview-content" className="flex flex-col gap-4 animate-in fade-in duration-200">
              {/* Level 1: One plain sentence + icon stating household status (LARGEST ELEMENT ON PAGE) */}
              <GlanceBanner />

              {/* Level 2: The 3 key numbers (Today's usage, Your usual amount, Compared to neighbors) */}
              <StatCardsRow />

              {/* Level 2: Gauge & House Flow Illustration Grouped Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-5 flex flex-col">
                  <SemiCircleGauge />
                </div>
                <div className="lg:col-span-7 flex flex-col">
                  <HouseFlowIllustration />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRENDS — Dual-signal chart, 4-week peer comparison bar chart, zoomed-in overnight leak trendline */}
          {activeTab === 'trends' && (
            <div id="trends-content" className="animate-in fade-in duration-200">
              <TrendsView />
            </div>
          )}

          {/* TAB 3: HISTORY — Full reading table (date, daytime, overnight, status, 5-hourly buckets) */}
          {activeTab === 'history' && (
            <div id="history-content" className="animate-in fade-in duration-200">
              <TelemetryTable onOpenDetails={(date) => {
                // Table details modal handled internally
              }} />
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
