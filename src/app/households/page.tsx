'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import { useRouter } from 'next/navigation';
import TopHeader from '@/components/TopHeader';
import ManualReadingModal from '@/components/ManualReadingModal';
import { analyzeReadings } from '@/lib/leakDetection';

export default function HouseholdsPage() {
  const { households, readings, setSelectedHouseholdId, setDashboardView } = useAqua();
  const router = useRouter();
  const [filter, setFilter] = useState('ALL');
  const [isLogReadingOpen, setIsLogReadingOpen] = useState(false);

  const handleSelectHousehold = (id: string) => {
    setSelectedHouseholdId(id);
    setDashboardView('overview');
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

      <main className="bg-[#EDEDED] min-h-[calc(100vh-3.5rem)] p-3 sm:p-5 lg:p-6">
        <div className="flex flex-col w-full gap-5 max-w-[1440px] mx-auto">
          
          {/* Header & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FAFAFA] p-4 sm:p-5 rounded-2xl border border-[#DCDCDC]">
            <div>
              <div className="flex items-center gap-1.5 text-[#8A8A8A] text-xs font-medium">
                <span>District Telemetry</span>
                <span>/</span>
                <span className="text-[#1A1A1A] font-semibold">Property Directory</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight mt-1">
                Monitored Households
              </h1>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                {households.length} residential properties enrolled across 3 sub-districts
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-[#E0E0E0] p-1 rounded-full border border-[#DCDCDC] flex-wrap">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  filter === 'ALL' ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}
              >
                All ({households.length})
              </button>
              <button
                onClick={() => setFilter('ALERTS')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  filter === 'ALERTS' ? 'bg-[#B8564A] text-white shadow-[0_2px_6px_rgba(184,86,74,0.3)]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${filter === 'ALERTS' ? 'bg-white' : 'bg-[#B8564A]'}`} />
                Alerts ({householdCards.filter(c => c.isLeak).length})
              </button>
              <button
                onClick={() => setFilter('PINE_VALLEY')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  filter === 'PINE_VALLEY' ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}
              >
                Pine Valley
              </button>
              <button
                onClick={() => setFilter('OAKRIDGE')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  filter === 'OAKRIDGE' ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}
              >
                Oakridge
              </button>
              <button
                onClick={() => setFilter('HARBORVIEW')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  filter === 'HARBORVIEW' ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}
              >
                Harborview
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCards.map(({ household, latestReading, baseline, percentage, isLeak, analysis }) => {
              const arcLength = 125;
              const ratio = Math.min(Math.max(percentage / 150, 0.1), 1.0);
              const dashOffset = Math.max(0, arcLength * (1 - ratio));

              return (
                <div
                  key={household.id}
                  className={`bg-[#FAFAFA] rounded-2xl p-5 border transition-all flex flex-col justify-between relative overflow-hidden group ${
                    isLeak
                      ? 'border-[#DCDCDC] border-t-4 border-t-[#B8564A]'
                      : 'border-[#DCDCDC]'
                  }`}
                >
                  <div>
                    {/* Top Row: Name & Badge */}
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <h2 className="font-bold text-base text-[#1A1A1A] group-hover:text-black transition-colors">
                          {household.name}
                        </h2>
                        <div className="flex items-center gap-1 text-xs text-[#8A8A8A] mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                          <span>{household.locality}, {household.occupants} occupants</span>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold shrink-0 border ${
                        isLeak
                          ? 'bg-[#F9ECEB] text-[#B8564A] border-[#B8564A]/40'
                          : 'bg-[#E0E0E0] text-[#1A1A1A] border-[#DCDCDC]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isLeak ? 'bg-[#B8564A] animate-ping' : 'bg-[#1A1A1A]'
                        }`} />
                        {isLeak ? 'Leak Alert' : 'Normal'}
                      </span>
                    </div>

                    {/* Subtitle & Feature Tags */}
                    <div className="flex flex-wrap items-center gap-2 text-[#8A8A8A] text-xs my-3 pb-2 border-b border-[#DCDCDC]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E0E0E0] text-[11px] font-mono text-[#1A1A1A]">
                        MTR-{household.id.slice(-4).toLowerCase()}
                      </span>
                      {household.expectedOvernightLiters && household.expectedOvernightLiters > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E0E0E0] text-[#1A1A1A] text-[11px] font-medium border border-[#DCDCDC]">
                          {household.expectedOvernightLiters} L/night scheduled
                        </span>
                      ) : null}
                      {analysis.status.hasUnusualOvernightActivity ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E0E0E0] text-[#6B6B6B] text-[11px] font-medium border border-[#DCDCDC]">
                          Guest activity
                        </span>
                      ) : null}
                    </div>

                    {/* Visual Flow Comparison + Mini Arc Gauge */}
                    <div className="bg-[#EDEDED] rounded-2xl p-4 mb-4 flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-[#8A8A8A]">
                          Current load
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className={`text-2xl font-extrabold ${isLeak ? 'text-[#B8564A]' : 'text-[#1A1A1A]'}`}>
                            {percentage}
                          </span>
                          <span className="text-xs text-[#8A8A8A]">% of usual</span>
                        </div>
                        <span className="text-xs text-[#6B6B6B] mt-0.5 flex items-center gap-1">
                          <span className={`material-symbols-outlined text-[15px] ${
                            isLeak ? 'text-[#B8564A]' : 'text-[#1A1A1A]'
                          }`}>
                            {isLeak ? 'water_damage' : 'check_circle'}
                          </span>
                          <span>{isLeak ? 'Continuous loss' : 'Normal flow'}</span>
                        </span>
                      </div>

                      {/* Mini Gauge SVG */}
                      <div className="relative w-20 h-12 flex items-end justify-center">
                        <svg className="w-full h-full overflow-visible select-none" viewBox="0 0 100 55">
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke="#DCDCDC"
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke={isLeak ? "#B8564A" : "#1A1A1A"}
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
                            fill={isLeak ? "#B8564A" : "#1A1A1A"}
                            fontFamily="system-ui, sans-serif"
                          >
                            {percentage}%
                          </text>
                        </svg>
                      </div>
                    </div>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div className="bg-[#EDEDED] rounded-xl p-2.5 flex flex-col border border-[#DCDCDC]">
                        <span className="text-[11px] text-[#8A8A8A]">Today</span>
                        <span className="text-xs font-bold text-[#1A1A1A] mt-0.5">{latestReading} L</span>
                      </div>
                      <div className="bg-[#EDEDED] rounded-xl p-2.5 flex flex-col border border-[#DCDCDC]">
                        <span className="text-[11px] text-[#8A8A8A]">Usual</span>
                        <span className="text-xs font-bold text-[#6B6B6B] mt-0.5">{baseline} L</span>
                      </div>
                      <div className="bg-[#EDEDED] rounded-xl p-2.5 flex flex-col border border-[#DCDCDC]">
                        <span className={`text-[11px] font-medium ${isLeak ? 'text-[#B8564A]' : 'text-[#8A8A8A]'}`}>
                          Flow
                        </span>
                        <span className={`text-xs font-bold mt-0.5 ${isLeak ? 'text-[#B8564A]' : 'text-[#1A1A1A]'}`}>
                          {isLeak ? '4.8 L/m' : '0.4 L/m'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions: Solid Black & Grey Pills */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#DCDCDC]">
                    <button
                      onClick={() => alert(`Connecting with resident at ${household.name}...`)}
                      type="button"
                      className="flex-1 flex items-center justify-center gap-1 px-3.5 py-2 rounded-full bg-[#E0E0E0] hover:bg-[#D5D5D5] text-[#1A1A1A] font-semibold text-xs transition-colors cursor-pointer border border-[#DCDCDC]"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span>Contact</span>
                    </button>
                    <button
                      onClick={() => handleSelectHousehold(household.id)}
                      type="button"
                      className="flex-1 flex items-center justify-center gap-1 px-3.5 py-2 rounded-full bg-[#1A1A1A] text-white hover:bg-black font-semibold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors cursor-pointer"
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
