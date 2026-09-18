'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

export default function SemiCircleGauge() {
  const { leakStatus, selectedHousehold, theme } = useAqua();
  const isDark = theme === 'dark';

  const isLeak = leakStatus.severity === 'LEAK_DETECTED';
  const currentLiters = leakStatus.latestReadingLiters || 0;
  const baselineLiters = Math.round(leakStatus.rollingAvgLiters) || (selectedHousehold.occupants * 130);
  const maxScale = Math.max(Math.round(baselineLiters * 1.5), 600);

  // Percentage of baseline
  const percentage = baselineLiters > 0
    ? Math.round((currentLiters / baselineLiters) * 100)
    : 100;

  // Semi-circle path: M 15 95 A 85 85 0 0 1 185 95 (totalLength = pi * 85 = 267.03)
  const totalLength = 267.03;
  const ratio = Math.min(Math.max(currentLiters / maxScale, 0.05), 1.0);
  const dashOffset = Math.max(0, totalLength * (1 - ratio));

  const isExcess = currentLiters > baselineLiters;

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden shadow-xs">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-0.5">
          <h2 className="font-bold text-sm sm:text-base text-[#101828] tracking-tight">
            Today&apos;s Consumption vs Usual Amount
          </h2>
          <span className="text-xs font-semibold text-[#2F6FED] px-2.5 py-0.5 rounded-full bg-[#EFF4FF]">
            {selectedHousehold.locality}
          </span>
        </div>
        <p className="text-xs text-[#667085]">
          Calculated against your usual daily amount ({baselineLiters} L)
        </p>
      </div>

      {/* Semi-Circle Gauge Visualization: Blue filled + Track */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-3 pt-1">
        <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[2/1] flex items-end justify-center">
          <svg className="w-full h-full overflow-visible select-none" viewBox="0 0 200 105">
            <defs>
              <filter id="gaugeCenterShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity={isDark ? 0.3 : 0.08} floodColor={isDark ? '#000000' : '#101828'} />
              </filter>
            </defs>

            {/* Unfilled / Remainder Track */}
            <path
              d="M 15 95 A 85 85 0 0 1 185 95"
              fill="none"
              stroke={isDark ? '#2A2D35' : '#101828'}
              strokeLinecap="round"
              strokeWidth="16"
            />

            {/* Filled / Used Portion */}
            <path
              className="transition-all duration-1000 ease-out"
              d="M 15 95 A 85 85 0 0 1 185 95"
              fill="none"
              stroke={isDark ? '#5B8DEF' : '#2F6FED'}
              strokeDasharray="267.03"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth="16.5"
            />

            {/* Baseline Marker Indicator at ~70% of scale */}
            <line
              x1="100"
              y1="10"
              x2="100"
              y2="24"
              stroke={isDark ? '#9AA0AC' : '#667085'}
              strokeDasharray="2 2"
              strokeWidth="2"
            />

            {/* Center Floating Badge */}
            <circle
              cx="100"
              cy="95"
              r="44"
              fill={isDark ? '#1E2128' : '#FFFFFF'}
              stroke={isDark ? '#2A2D35' : '#E4E7EC'}
              strokeWidth="1.5"
              filter="url(#gaugeCenterShadow)"
            />
            <text
              x="100"
              y="85"
              textAnchor="middle"
              fill={isDark ? '#F0F1F3' : '#101828'}
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="23"
              fontWeight="900"
              letterSpacing="-0.03em"
            >
              {percentage}%
            </text>
            <text
              x="100"
              y="97"
              textAnchor="middle"
              fill={isDark ? '#9AA0AC' : '#667085'}
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
            >
              of usual
            </text>
          </svg>
        </div>

        {/* Scale Limits */}
        <div className="w-full max-w-[280px] sm:max-w-[340px] flex justify-between items-center text-xs text-[#667085] mt-2 px-1">
          <span className="font-semibold">0 L</span>
          <span className="flex items-center gap-1 font-medium text-[#101828] text-[11px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED]" />
            {baselineLiters} L Usual
          </span>
          <span className="font-semibold">{maxScale} L Max</span>
        </div>
      </div>

      {/* Footer Micro-Callout */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC] mt-1">
        <span className="material-symbols-outlined text-[#2F6FED] text-[18px] shrink-0 mt-0.5">
          info
        </span>
        <p className="text-xs text-[#667085] leading-relaxed">
          {isExcess ? (
            <>
              Consumption is elevated by <strong className="text-[#F04438] font-bold">+{percentage - 100}%</strong>. Main supply draw exceeding normal profile.
            </>
          ) : (
            <>
              Pacing within optimal conservation envelope. Normal variance observed across domestic cycles.
            </>
          )}
        </p>
      </div>

    </div>
  );
}
