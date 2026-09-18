'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

export default function SemiCircleGauge() {
  const { leakStatus, selectedHousehold } = useAqua();

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
    <div className="bg-[#FAFAFA] rounded-2xl border border-[#DCDCDC] p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-0.5">
          <h2 className="font-bold text-sm sm:text-base text-[#1A1A1A] tracking-tight">
            Today&apos;s Consumption vs Usual Amount
          </h2>
          <span className="text-xs font-semibold text-[#6B6B6B] px-2.5 py-0.5 rounded-full bg-[#E0E0E0]">
            {selectedHousehold.locality}
          </span>
        </div>
        <p className="text-xs text-[#8A8A8A]">
          Calculated against your usual daily amount ({baselineLiters} L)
        </p>
      </div>

      {/* Semi-Circle Gauge Visualization */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-3 pt-1">
        <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[2/1] flex items-end justify-center">
          <svg className="w-full h-full overflow-visible select-none" viewBox="0 0 200 105">
            <defs>
              <filter id="gaugeCenterShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* Background Track (Soft Light Grey) */}
            <path
              d="M 15 95 A 85 85 0 0 1 185 95"
              fill="none"
              stroke="#E0E0E0"
              strokeLinecap="round"
              strokeWidth="16"
            />

            {/* Active Track: Solid Black (#1A1A1A) */}
            <path
              className="transition-all duration-1000 ease-out"
              d="M 15 95 A 85 85 0 0 1 185 95"
              fill="none"
              stroke="#1A1A1A"
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
              stroke="#8A8A8A"
              strokeDasharray="2 2"
              strokeWidth="2"
            />

            {/* Center Floating Badge */}
            <circle
              cx="100"
              cy="95"
              r="44"
              fill="#FAFAFA"
              stroke="#DCDCDC"
              strokeWidth="1.5"
              filter="url(#gaugeCenterShadow)"
            />
            <text
              x="100"
              y="85"
              textAnchor="middle"
              fill="#1A1A1A"
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
              fill="#8A8A8A"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
            >
              of usual
            </text>
          </svg>
        </div>

        {/* Scale Limits */}
        <div className="w-full max-w-[280px] sm:max-w-[340px] flex justify-between items-center text-xs text-[#6B6B6B] mt-2 px-1">
          <span className="font-semibold">0 L</span>
          <span className="flex items-center gap-1 font-medium text-[#1A1A1A] text-[11px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
            {baselineLiters} L Usual
          </span>
          <span className="font-semibold">{maxScale} L Max</span>
        </div>
      </div>

      {/* Footer Micro-Callout */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#E0E0E0]/60 border border-[#DCDCDC] mt-1">
        <span className="material-symbols-outlined text-[#1A1A1A] text-[18px] shrink-0 mt-0.5">
          info
        </span>
        <p className="text-xs text-[#6B6B6B] leading-relaxed">
          {isExcess ? (
            <>
              Consumption is elevated by <strong className="text-[#1A1A1A] font-bold">+{percentage - 100}%</strong>. Main supply draw exceeding normal profile.
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
