'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

export default function SemiCircleGauge() {
  const { leakStatus, selectedHousehold } = useAqua();

  const currentLiters = leakStatus.latestReadingLiters || 0;
  const baselineLiters = Math.round(leakStatus.rollingAvgLiters) || (selectedHousehold.occupants * 130);
  const maxScale = Math.max(Math.round(baselineLiters * 1.5), 600);

  // Percentage of baseline
  const percentage = baselineLiters > 0
    ? Math.round((currentLiters / baselineLiters) * 100)
    : 100;

  // Arc calculations:
  // Semi-circle path: M 15 95 A 85 85 0 0 1 185 95
  // Total arc length = pi * 85 = 267.03
  const totalLength = 267.03;
  // Normalized value (0 to 1) clamped between 0 and 1.0
  const ratio = Math.min(Math.max(currentLiters / maxScale, 0.05), 1.0);
  const dashOffset = Math.max(0, totalLength * (1 - ratio));

  const isExcess = currentLiters > baselineLiters;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* Subtle Ambient Background Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-1">
          <h2 className="font-bold text-base text-slate-900 tracking-tight">
            Today&apos;s Consumption vs Baseline
          </h2>
          <span className="text-xs font-semibold text-primary">
            {selectedHousehold.locality}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Calculated against 14-day rolling baseline ({baselineLiters} L)
        </p>
      </div>

      {/* Semi-Circle Gauge Visualization (100% Vector Scalable on PC & Mobile) */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-3 pt-1">
        <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[2/1] flex items-end justify-center">
          <svg className="w-full h-full overflow-visible select-none" viewBox="0 0 200 105">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#2F6FED" />
                <stop offset="100%" stopColor={isExcess ? "#F04438" : "#0055ce"} />
              </linearGradient>
              <filter id="gaugeCenterShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* Background Track (Grey) */}
            <path
              d="M 15 95 A 85 85 0 0 1 185 95"
              fill="none"
              stroke="#E8EEFF"
              strokeLinecap="round"
              strokeWidth="16"
            />

            {/* Active Blue/Red Track */}
            <path
              className="transition-all duration-1000 ease-out"
              d="M 15 95 A 85 85 0 0 1 185 95"
              fill="none"
              stroke="url(#gaugeGradient)"
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
              stroke="#737786"
              strokeDasharray="2 2"
              strokeWidth="2"
            />

            {/* Center Floating Badge (Scales proportionally on all screen sizes) */}
            <circle
              cx="100"
              cy="95"
              r="44"
              fill="#FFFFFF"
              stroke="#F1F5F9"
              strokeWidth="1.5"
              filter="url(#gaugeCenterShadow)"
            />
            <text
              x="100"
              y="85"
              textAnchor="middle"
              fill={percentage > 125 ? "#BA1A1A" : "#0F172A"}
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
              fill="#64748B"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
            >
              of baseline
            </text>
          </svg>
        </div>

        {/* Scale Limits */}
        <div className="w-full max-w-[280px] sm:max-w-[340px] flex justify-between items-center text-xs text-slate-500 mt-2 px-1">
          <span className="font-semibold">0 L</span>
          <span className="flex items-center gap-1 font-medium text-slate-600 text-[11px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {baselineLiters} L Baseline
          </span>
          <span className="font-semibold">{maxScale} L Max</span>
        </div>
      </div>

      {/* Footer Micro-Callout */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 mt-1">
        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
          info
        </span>
        <p className="text-xs text-slate-600 leading-relaxed">
          {isExcess ? (
            <>
              Consumption is elevated by <strong className="text-error font-semibold">+{percentage - 100}%</strong>. Main supply draw exceeding normal profile.
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
