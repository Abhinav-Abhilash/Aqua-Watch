'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

export default function HouseFlowIllustration() {
  const { leakStatus } = useAqua();
  const isLeak = leakStatus.severity === 'LEAK_DETECTED';
  const isHighUsage = leakStatus.severity === 'HIGH_USAGE';

  const excessLiters = leakStatus.estimatedExcessLitersPerDay || 182;
  const hourlyLoss = (excessLiters * 0.0015).toFixed(2);

  return (
    <div className="bg-white rounded-lg border border-slate-200/80 shadow-none p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* Header with Live Ticking Wasted Drip Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-slate-900 tracking-tight">
              Real-time household water flow
            </h2>
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLeak ? 'bg-red-500' : isHighUsage ? 'bg-amber-500' : 'bg-[#2F6FED]'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isLeak ? 'bg-red-500' : isHighUsage ? 'bg-amber-500' : 'bg-[#2F6FED]'
              }`} />
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Water flowing into your home right now, architectural cross-section
          </p>
        </div>

        {/* Real-Time Status Pill */}
        {isLeak ? (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 flex items-center gap-2.5 self-start sm:self-auto transition-all shrink-0">
            <div className="relative flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px] animate-bounce">
                water_drop
              </span>
            </div>
            <div className="flex flex-col text-right">
              <div className="flex items-baseline gap-1 text-xs">
                <span className="text-slate-500 font-medium">Excess lost:</span>
                <span className="font-extrabold text-error tracking-tight text-sm">
                  +{excessLiters} L / day
                </span>
              </div>
              <div className="flex items-center justify-end gap-1 text-[11px] text-error font-medium">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                <span>Accumulating ~+${hourlyLoss}/hr</span>
              </div>
            </div>
          </div>
        ) : isHighUsage ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-2.5 self-start sm:self-auto transition-all shrink-0">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">
              trending_up
            </span>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-amber-800">Elevated domestic demand</span>
              <span className="text-[10px] text-amber-700">Overnight baseline intact</span>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 flex items-center gap-2.5 self-start sm:self-auto transition-all shrink-0">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
              verified
            </span>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-emerald-800">Sealed baseline flow</span>
              <span className="text-[10px] text-emerald-600">Zero unaccounted loss</span>
            </div>
          </div>
        )}
      </div>

      {/* SVG Illustrated House Cross-Section & Pipe Flow (Vector Scaled on PC & Mobile) */}
      <div className="relative my-2 sm:my-3 w-full bg-slate-50/60 rounded-lg p-1 sm:p-3 flex-1 flex items-center justify-center overflow-hidden min-h-[180px] sm:min-h-[220px]">
        <svg
          className="w-full h-auto max-h-[240px] sm:max-h-[280px] select-none"
          fill="none"
          viewBox="0 0 740 280"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="shadowPin" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Ground / Foundation Line */}
          <line x1="20" y1="245" x2="720" y2="245" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 245 H720 V260 H20 Z" fill="#F1F5F9" opacity="0.6" />

          {/* House Silhouette (Gable Roof) */}
          <path
            d="M 170 245 V 105 L 340 35 L 510 105 L 680 105 V 245 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Roof Overhang Accent */}
          <path d="M 155 110 L 340 28 L 525 110" fill="none" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <path d="M 510 105 H 695" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

          {/* Interior Dividing Room Walls */}
          <line x1="330" y1="105" x2="330" y2="245" stroke="#E2E8F0" strokeWidth="1.8" strokeDasharray="4 3" />
          <line x1="500" y1="105" x2="500" y2="245" stroke="#E2E8F0" strokeWidth="1.8" strokeDasharray="4 3" />
          <line x1="170" y1="130" x2="500" y2="130" stroke="#F1F5F9" strokeWidth="2" />

          {/* Room Labels (sentence-case, no middle dots) */}
          <text x="250" y="125" textAnchor="middle" fill="#64748B" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="500">
            Zone 1: Utility
          </text>
          <text x="415" y="125" textAnchor="middle" fill="#64748B" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="500">
            Zone 2: Yard and irrigation
          </text>
          <text x="590" y="125" textAnchor="middle" fill="#64748B" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="500">
            Zone 3: Bath and fixtures
          </text>

          {/* Street Meter Pit (Left) */}
          <rect x="55" y="210" width="60" height="35" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="85" cy="227" r="11" fill="#FFFFFF" stroke="#2F6FED" strokeWidth="2" />
          <circle cx="85" cy="227" r="4" fill="#2F6FED" />
          <path d="M85 227 L89 223" stroke="#2F6FED" strokeWidth="1.5" strokeLinecap="round" />
          <text x="85" y="260" textAnchor="middle" fill="#334155" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="600">
            Street meter
          </text>
          <text x="85" y="198" textAnchor="middle" fill={isLeak ? "#BA1A1A" : isHighUsage ? "#B45309" : "#0055CE"} fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="800">
            {isLeak ? 'INFLOW 4.8 L/m' : isHighUsage ? 'INFLOW 6.4 L/m' : 'INFLOW 1.8 L/m'}
          </text>

          {/* Fixtures: Heater (Zone 1) */}
          <rect x="235" y="195" width="32" height="50" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="242" y1="210" x2="260" y2="210" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="251" y="235" textAnchor="middle" fill="#475569" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
            Heater
          </text>

          {/* Fixtures: Sprinkler Sub-meter 2 (Zone 2) */}
          <path d="M 400 220 V 170 H 430" fill="none" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <rect x="380" y="160" width="40" height="22" rx="4" fill={isHighUsage ? "#FEF3C7" : "#EFF6FF"} stroke={isHighUsage ? "#D97706" : "#2F6FED"} strokeWidth="1.5" />
          <path d="M 393 171 H 407" stroke={isHighUsage ? "#D97706" : "#2F6FED"} strokeWidth="2" strokeLinecap="round" />
          <text x="400" y="153" textAnchor="middle" fill="#334155" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
            Sub-meter 2
          </text>

          {/* Fixtures: Shower (Zone 3) */}
          <path d="M 580 220 V 165 H 610 V 180" fill="none" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <path d="M 602 180 L 618 180 L 622 188 L 598 188 Z" fill={isHighUsage ? "#D97706" : "#94A3B8"} />
          <text x="610" y="153" textAnchor="middle" fill="#475569" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
            Shower
          </text>

          {/* Outer Pipe Casing */}
          <path d="M 85 220 H 250" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
          <path d="M 250 220 H 400 H 600" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />

          {/* Animated Active Water Stream */}
          <path
            className="flow-line-active"
            d="M 85 220 H 400"
            stroke={isHighUsage ? "#D97706" : "#2F6FED"}
            strokeWidth={isHighUsage ? 7 : 6}
            strokeLinecap="round"
          />

          {/* Outflow Pipe */}
          <path
            className={isLeak ? '' : 'flow-line-active'}
            d="M 400 220 H 600"
            stroke={isLeak ? "#94A3B8" : isHighUsage ? "#D97706" : "#2F6FED"}
            opacity={isLeak ? 0.6 : 1}
            strokeWidth={isLeak ? 5 : isHighUsage ? 7 : 6}
            strokeLinecap="round"
          />

          {/* LEAK ANIMATION */}
          {isLeak ? (
            <g id="leakVisualGroup">
              {/* Pipe Fracture */}
              <circle cx="400" cy="220" r="9" fill="#FEE2E2" stroke="#F04438" strokeWidth="2" />
              <path d="M 397 215 L 401 219 L 399 221 L 403 225" fill="none" stroke="#BA1A1A" strokeWidth="2" strokeLinecap="round" />

              {/* Animated Falling Droplets */}
              <g className="drip-drop-1" style={{ transformOrigin: '400px 222px' }}>
                <circle cx="400" cy="224" r="3.2" fill="#F04438" />
                <path d="M 400 220 L 402.5 224 L 397.5 224 Z" fill="#F04438" />
              </g>
              <g className="drip-drop-2" style={{ transformOrigin: '403px 222px' }}>
                <circle cx="403" cy="224" r="2.8" fill="#38BDF8" />
                <path d="M 403 221 L 405 224 L 401 224 Z" fill="#38BDF8" />
              </g>

              {/* Water Puddle & Pulse Ripple */}
              <ellipse cx="401" cy="245" rx="18" ry="4.5" fill="#FCA5A5" opacity="0.75" />
              <ellipse cx="401" cy="245" rx="12" ry="3" fill="#F04438" opacity="0.9" />
              <ellipse className="puddle-ripple" cx="401" cy="245" rx="22" ry="5.5" fill="none" stroke="#F04438" strokeWidth="1.5" />

              {/* Annotation Callout Pin */}
              <g filter="url(#shadowPin)" transform="translate(325, 48)">
                <rect x="0" y="0" width="186" height="52" rx="10" fill="#FFFFFF" stroke="#FCA5A5" strokeWidth="1.5" />
                <polygon points="75,52 82,62 89,52" fill="#FFFFFF" stroke="#FCA5A5" strokeWidth="1.5" />
                <polygon points="76,51 82,60 88,51" fill="#FFFFFF" />
                <circle cx="18" cy="18" r="7" fill="#FEE2E2" />
                <circle cx="18" cy="18" r="3" fill="#BA1A1A" />
                <text x="32" y="21" fill="#BA1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="800">
                  Break detected here
                </text>
                <text x="14" y="38" fill="#334155" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="500">
                  Zone 2 Irrigation line: 4.8 L/min escaping
                </text>
              </g>
            </g>
          ) : isHighUsage ? (
            /* High Usage Amber State Badge */
            <g transform="translate(320, 52)">
              <rect x="0" y="0" width="186" height="44" rx="8" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.5" />
              <circle cx="20" cy="22" r="7" fill="#D97706" />
              <path d="M16 25 L20 18 L24 25" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="36" y="21" fill="#92400E" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700">
                Elevated daytime draw
              </text>
              <text x="36" y="34" fill="#B45309" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="600">
                Overnight baseline sealed
              </text>
            </g>
          ) : (
            /* Normal State Indicator Badge */
            <g transform="translate(320, 52)">
              <rect x="0" y="0" width="176" height="44" rx="8" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.5" />
              <circle cx="20" cy="22" r="7" fill="#10B981" />
              <path d="M17 22 L19 24 L23 20" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="36" y="21" fill="#065F46" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700">
                Pipes intact and optimal
              </text>
              <text x="36" y="34" fill="#047857" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="600">
                Laminar baseline flow
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Caption Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className={`w-2 h-2 rounded-full ${isLeak ? 'bg-error' : isHighUsage ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span>
            {isLeak
              ? 'Leak detected — water escaping between the meter and tap at ~4.8 L/min.'
              : isHighUsage
              ? 'High usage — elevated daytime demand detected, but overnight flow is sealed.'
              : 'Laminar baseline flow — zero leakage detected across monitored zones.'}
          </span>
        </span>
        <span className="text-slate-400 hidden sm:inline">Sensors: Smart Meter + Ultrasonic Nodes</span>
      </div>

    </div>
  );
}
