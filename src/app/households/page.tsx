'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import { useRouter } from 'next/navigation';
import TopHeader from '@/components/TopHeader';
import ManualReadingModal from '@/components/ManualReadingModal';
import { analyzeReadings } from '@/lib/leakDetection';

export default function HouseholdsPage() {
  const { households, readings, setSelectedHouseholdId } = useAqua();
  const router = useRouter();
  const [filter, setFilter] = useState('ALL');
  const [isLogReadingOpen, setIsLogReadingOpen] = useState(false);

  const handleSelectHousehold = (id: string) => {
    setSelectedHouseholdId(id);
    router.push('/');
  };

  // Precompute metrics and status for each household
  const householdCards = households.map(h => {
    const hReadings = readings.filter(r => r.household_id === h.id);
    const analysis = analyzeReadings(hReadings, readings, h, households);
    const latestReading = analysis.status.latestReadingLiters || Math.round(h.occupants * 130);
    const baseline = Math.round(analysis.status.rollingAvgLiters) || (h.occupants * 130);
    const percentage = baseline > 0 ? Math.round((latestReading / baseline) * 100) : 100;
    const isLeak = analysis.status.severity === 'LEAK_DETECTED';

    return {
      household: h,
      latestReading,
      baseline,
      percentage,
      isLeak,
      analysis
    };
  });

  const filteredCards = householdCards.filter(({ household, isLeak }) => {
    if (filter === 'ALERTS') return isLeak;
    if (filter === 'PINE_VALLEY') return household.locality === 'Pine Valley';
    if (filter === 'OAKRIDGE') return household.locality === 'Oakridge Suburb';
    if (filter === 'HARBORVIEW') return household.locality === 'Harborview District';
    return true;
  });

  return (
    <>
      <TopHeader onOpenLogReading={() => setIsLogReadingOpen(true)} />

      <main className="relative pt-20 bg-background min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col w-full gap-6 max-w-[1600px] mx-auto">
          
          {/* Header & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <span>District telemetry</span>
                <span className="text-slate-300">/</span>
                <span className="text-[#2F6FED] font-semibold">Property directory</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Monitored households
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {households.length} residential properties enrolled across 3 sub-districts
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-md border border-slate-200 shadow-none flex-wrap">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  filter === 'ALL' ? 'bg-[#2F6FED] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({households.length})
              </button>
              <button
                onClick={() => setFilter('ALERTS')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  filter === 'ALERTS' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Alerts ({householdCards.filter(c => c.isLeak).length})
              </button>
              <button
                onClick={() => setFilter('PINE_VALLEY')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  filter === 'PINE_VALLEY' ? 'bg-[#2F6FED] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pine Valley
              </button>
              <button
                onClick={() => setFilter('OAKRIDGE')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  filter === 'OAKRIDGE' ? 'bg-[#2F6FED] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Oakridge
              </button>
              <button
                onClick={() => setFilter('HARBORVIEW')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  filter === 'HARBORVIEW' ? 'bg-[#2F6FED] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Harborview
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCards.map(({ household, latestReading, baseline, percentage, isLeak, analysis }) => {
              // Mini arc dash calculations
              const arcLength = 125;
              const ratio = Math.min(Math.max(percentage / 150, 0.1), 1.0);
              const dashOffset = Math.max(0, arcLength * (1 - ratio));

              return (
                <div
                  key={household.id}
                  className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden group"
                >
                  {/* Top Status Bar Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    isLeak ? 'bg-red-600' : 'bg-emerald-600'
                  }`} />

                  <div>
                    {/* Top Row: Name & Badge */}
                    <div className="flex items-start justify-between gap-3 mb-1 pt-1">
                      <div>
                        <h2 className="font-bold text-base text-slate-900 group-hover:text-[#2F6FED] transition-colors">
                          {household.name}
                        </h2>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                          <span>{household.locality}, {household.occupants} occupants</span>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium shrink-0 ${
                        isLeak
                          ? 'bg-red-50 text-red-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isLeak ? 'bg-red-600 animate-ping' : 'bg-emerald-600'
                        }`} />
                        {isLeak ? 'Leak alert' : 'Normal'}
                      </span>
                    </div>

                    {/* Subtitle & Feature Tags */}
                    <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs my-3 pb-2 border-b border-slate-100">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[11px] font-mono">
                        MTR-{household.id.slice(-4).toLowerCase()}
                      </span>
                      {household.expectedOvernightLiters && household.expectedOvernightLiters > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2F6FED] text-[11px] font-medium">
                          {household.expectedOvernightLiters} L/night scheduled
                        </span>
                      ) : null}
                      {analysis.status.hasUnusualOvernightActivity ? (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                          Guest burst activity
                        </span>
                      ) : null}
                      {household.baselineResetDate ? (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2F6FED] text-[11px] font-medium">
                          Reset: {household.baselineResetDate}
                        </span>
                      ) : null}
                    </div>

                    {/* Visual Flow Comparison + Mini Arc Gauge */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-4 flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500">
                          Current load
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className={`text-2xl font-extrabold ${isLeak ? 'text-error' : 'text-slate-900'}`}>
                            {percentage}
                          </span>
                          <span className="text-xs text-slate-500">% of usual</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <span className={`material-symbols-outlined text-[14px] ${
                            isLeak ? 'text-error' : 'text-emerald-600'
                          }`}>
                            {isLeak ? 'warning' : 'energy_savings_leaf'}
                          </span>
                          <span>{isLeak ? 'Continuous loss' : 'Stable pattern'}</span>
                        </span>
                      </div>

                      {/* Mini Gauge SVG */}
                      <div className="relative w-20 h-12 flex items-end justify-center">
                        <svg className="w-full h-full overflow-visible select-none" viewBox="0 0 100 55">
                          {/* Background Track */}
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                          {/* Active Gauge Arc */}
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke={isLeak ? "#BA1A1A" : "#2F6FED"}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="125"
                            strokeDashoffset={dashOffset}
                          />
                          <text
                            x="50"
                            y="48"
                            textAnchor="middle"
                            fontSize="13"
                            fontWeight="900"
                            fill={isLeak ? "#BA1A1A" : "#0F172A"}
                            fontFamily="system-ui, sans-serif"
                          >
                            {percentage}%
                          </text>
                        </svg>
                      </div>
                    </div>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div className="bg-slate-50 rounded-lg p-2.5 flex flex-col">
                        <span className="text-[11px] text-slate-500">Today</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5">{latestReading} L</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2.5 flex flex-col">
                        <span className="text-[11px] text-slate-500">Usual</span>
                        <span className="text-xs font-bold text-slate-600 mt-0.5">{baseline} L</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2.5 flex flex-col">
                        <span className={`text-[11px] font-medium ${isLeak ? 'text-error' : 'text-slate-500'}`}>
                          Flow
                        </span>
                        <span className={`text-xs font-bold mt-0.5 ${isLeak ? 'text-error' : 'text-slate-900'}`}>
                          {isLeak ? '4.8 L/m' : '0.4 L/m'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => alert(`Connecting with resident at ${household.name}...`)}
                      type="button"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span>Contact</span>
                    </button>
                    <button
                      onClick={() => handleSelectHousehold(household.id)}
                      type="button"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-[#2F6FED] text-white hover:bg-[#2558c4] font-medium text-xs shadow-none transition-colors cursor-pointer"
                    >
                      <span>Telemetry</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </main>

      <ManualReadingModal
        isOpen={isLogReadingOpen}
        onClose={() => setIsLogReadingOpen(false)}
      />
    </>
  );
}
