'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

interface HouseFlowIllustrationProps {
  isValveOpen?: boolean;
  selectedZone?: string | null;
  onSelectZone?: (zone: string) => void;
}

export default function HouseFlowIllustration({
  isValveOpen = true,
  selectedZone = null,
  onSelectZone
}: HouseFlowIllustrationProps = {}) {
  const { leakStatus, selectedHousehold, theme } = useAqua();
  const isDarkMode = theme === 'dark';
  const waterColor = isDarkMode ? '#5B8DEF' : '#2F6FED';
  const waterDeep = isDarkMode ? '#2563EB' : '#1D4ED8';
  const waterGleam = isDarkMode ? '#BAE6FD' : '#93C5FD';
  const leakRed = isDarkMode ? '#F97066' : '#F04438';
  const leakRedLight = isDarkMode ? '#FFB6AF' : '#FDA29B';
  const leakRedDeep = isDarkMode ? '#D92D20' : '#B42318';
  const textMuted = isDarkMode ? '#9AA0AC' : '#667085';
  const borderTone = isDarkMode ? '#3E4554' : '#D0D5DD';
  const fixtureBg = isDarkMode ? '#1E2128' : '#FFFFFF';
  
  const isLeak = leakStatus.severity === 'LEAK_DETECTED';
  const isHighUsage = leakStatus.severity === 'HIGH_USAGE';

  const excessLiters = isLeak ? (leakStatus.estimatedExcessLitersPerDay || 180) : 0;
  const hourlyLoss = (excessLiters * 0.0015).toFixed(2);

  // Real-time flow in L/min
  const leakLpm = (excessLiters / 60).toFixed(1);
  const dynamicInflow = !isValveOpen
    ? '0.0'
    : isLeak
    ? (1.8 + Number(leakLpm)).toFixed(1)
    : isHighUsage
    ? (selectedHousehold.occupants * 1.5 + 1.2).toFixed(1)
    : (selectedHousehold.occupants * 0.45 + 0.5).toFixed(1);

  const handleFixtureClick = (zoneId: string) => {
    if (onSelectZone) {
      onSelectZone(selectedZone === zoneId ? '' : zoneId);
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden transition-all shadow-xs">
      
      {/* Header: White and Blue Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E7EC]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-[#101828] tracking-tight">
              Real-time household water flow
            </h2>
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                !isValveOpen ? 'bg-[#98A2B3]' : isLeak ? (isDarkMode ? 'bg-[#F97066]' : 'bg-[#F04438]') : isHighUsage ? (isDarkMode ? 'bg-[#FDB022]' : 'bg-[#F79009]') : (isDarkMode ? 'bg-[#32D583]' : 'bg-[#12B76A]')
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                !isValveOpen ? 'bg-[#98A2B3]' : isLeak ? (isDarkMode ? 'bg-[#F97066]' : 'bg-[#F04438]') : isHighUsage ? (isDarkMode ? 'bg-[#FDB022]' : 'bg-[#F79009]') : (isDarkMode ? 'bg-[#32D583]' : 'bg-[#12B76A]')
              }`} />
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            Cross-section architectural telemetry for {selectedHousehold.name} ({selectedHousehold.locality})
          </p>
        </div>

        {/* Status Indicator */}
        {!isValveOpen ? (
          <div className="bg-[#F2F4F7] border border-[#E4E7EC] rounded-full px-3.5 py-1.5 flex items-center gap-2 self-start sm:self-auto transition-all shrink-0">
            <span className="material-symbols-outlined text-[#667085] text-[18px]">lock</span>
            <span className="text-xs font-bold text-[#344054]">Main Valve Closed (0.0 L/m)</span>
          </div>
        ) : isLeak ? (
          <div className="bg-[#FEF3F2] border border-[#F04438]/40 rounded-full px-4 py-1.5 flex items-center gap-2 self-start sm:self-auto transition-all shrink-0 shadow-xs">
            <div className={`w-4 h-4 rounded-full ${isDarkMode ? 'bg-[#F97066]' : 'bg-[#F04438]'} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-[12px] text-[#FFFFFF]">water_drop</span>
            </div>
            <div className="flex items-baseline gap-1 text-xs">
              <span className="text-[#B42318] font-medium">Continuous leak:</span>
              <strong className="font-extrabold text-[#B42318]">+{excessLiters} L/day</strong>
              <span className={`text-[10px] ${isDarkMode ? 'text-[#F97066]' : 'text-[#F04438]'} ml-1`}>(~${hourlyLoss}/hr)</span>
            </div>
          </div>
        ) : isHighUsage ? (
          <div className="bg-[#FFFAEB] border border-[#F79009]/40 rounded-full px-3.5 py-1.5 flex items-center gap-2 self-start sm:self-auto transition-all shrink-0">
            <span className={`material-symbols-outlined ${isDarkMode ? 'text-[#FDB022]' : 'text-[#F79009]'} text-[16px]`}>change_history</span>
            <span className="text-xs font-bold text-[#B54708]">Elevated Daytime Usage ({dynamicInflow} L/m)</span>
          </div>
        ) : (
          <div className="bg-[#ECFDF3] border border-[#12B76A]/40 rounded-full px-3.5 py-1.5 flex items-center gap-2 self-start sm:self-auto transition-all shrink-0">
            <div className={`w-4 h-4 rounded-full ${isDarkMode ? 'bg-[#32D583]' : 'bg-[#12B76A]'} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-[11px] text-[#FFFFFF]">check</span>
            </div>
            <span className="text-xs font-bold text-[#027A48]">Sealed Baseline ({dynamicInflow} L/m)</span>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ILLUSTRATED HOUSE ARCHITECTURE & 3D PIPES (Blue water flow)
         ════════════════════════════════════════════════════════════════════ */}
      <div className="relative my-2 sm:my-3 w-full bg-[#F8F9FB] rounded-2xl p-2 sm:p-4 flex-1 flex items-center justify-center overflow-hidden min-h-[220px] sm:min-h-[260px] border border-[#E4E7EC]">
        <svg
          className="w-full h-auto max-h-[260px] sm:max-h-[300px] select-none"
          fill="none"
          viewBox="0 0 740 290"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 1. Soft Realistic Drop Shadows */}
            <filter id="softHouseShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#101828" floodOpacity={isDarkMode ? 0.3 : 0.08} />
            </filter>
            <filter id="fixtureShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#101828" floodOpacity={isDarkMode ? 0.3 : 0.1} />
            </filter>
            <filter id="pipeDropShadow" x="-10%" y="-10%" width="120%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#101828" floodOpacity={isDarkMode ? 0.35 : 0.12} />
            </filter>

            {/* 2. Roof Shading Gradients (Neutral architecture) */}
            <linearGradient id="roofLitSlope" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? '#3E4452' : '#FFFFFF'} />
              <stop offset="25%" stopColor={isDarkMode ? '#323744' : '#EAECF0'} />
              <stop offset="70%" stopColor={isDarkMode ? '#282C37' : '#D0D5DD'} />
              <stop offset="100%" stopColor={isDarkMode ? '#1E222B' : '#98A2B3'} />
            </linearGradient>

            <linearGradient id="roofFascia" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? '#4B5363' : '#98A2B3'} />
              <stop offset="100%" stopColor={isDarkMode ? '#222631' : '#475467'} />
            </linearGradient>

            {/* 3. House Wall Shading: Neutral tonal shading */}
            <linearGradient id="houseWallShading" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? '#282C37' : '#FFFFFF'} />
              <stop offset="30%" stopColor={isDarkMode ? '#222630' : '#F8F9FB'} />
              <stop offset="75%" stopColor={isDarkMode ? '#1C2028' : '#F2F4F7'} />
              <stop offset="100%" stopColor={isDarkMode ? '#171A21' : '#E4E7EC'} />
            </linearGradient>

            {/* Room Ambient Depth Gradients */}
            <linearGradient id="roomDepthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? '#2E3340' : '#FFFFFF'} stopOpacity={isDarkMode ? 0.6 : 0.4} />
              <stop offset="100%" stopColor={isDarkMode ? '#1E222A' : '#EAECF0'} stopOpacity={isDarkMode ? 0.7 : 0.5} />
            </linearGradient>

            {/* 4. Cylindrical 3D Metallic Pipe Gradient */}
            <linearGradient id="cylindricalPipeHoriz" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? '#2A303C' : '#475467'} />
              <stop offset="18%" stopColor={isDarkMode ? '#4F5869' : '#98A2B3'} />
              <stop offset="35%" stopColor={isDarkMode ? '#E2E8F0' : '#FFFFFF'} />
              <stop offset="55%" stopColor={isDarkMode ? '#4A5364' : '#D0D5DD'} />
              <stop offset="80%" stopColor={isDarkMode ? '#383F4D' : '#98A2B3'} />
              <stop offset="95%" stopColor={isDarkMode ? '#252B36' : '#475467'} />
              <stop offset="100%" stopColor={isDarkMode ? '#171A21' : '#1D2939'} />
            </linearGradient>

            <linearGradient id="cylindricalPipeVert" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDarkMode ? '#2A303C' : '#475467'} />
              <stop offset="18%" stopColor={isDarkMode ? '#4F5869' : '#98A2B3'} />
              <stop offset="35%" stopColor={isDarkMode ? '#E2E8F0' : '#FFFFFF'} />
              <stop offset="55%" stopColor={isDarkMode ? '#4A5364' : '#D0D5DD'} />
              <stop offset="80%" stopColor={isDarkMode ? '#383F4D' : '#98A2B3'} />
              <stop offset="95%" stopColor={isDarkMode ? '#252B36' : '#475467'} />
              <stop offset="100%" stopColor={isDarkMode ? '#171A21' : '#1D2939'} />
            </linearGradient>

            {/* 5. Glistening Water Flow Gradients — Pure Blue #2F6FED (Light) / #5B8DEF (Dark) */}
            <linearGradient id="waterFlowCore" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={waterDeep} />
              <stop offset="35%" stopColor={waterGleam} />
              <stop offset="65%" stopColor={waterColor} />
              <stop offset="100%" stopColor={waterDeep} />
            </linearGradient>

            <linearGradient id="waterGleamDash" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={waterColor} stopOpacity="0.3" />
              <stop offset="50%" stopColor={isDarkMode ? '#E0F2FE' : '#FFFFFF'} stopOpacity="0.95" />
              <stop offset="100%" stopColor={waterColor} stopOpacity="0.3" />
            </linearGradient>

            {/* 6. Spherical 3D Droplet Gradient */}
            <radialGradient id="dropletSphere" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor={waterGleam} />
              <stop offset="70%" stopColor={waterColor} />
              <stop offset="100%" stopColor={waterDeep} />
            </radialGradient>

            {/* 7. Leak Drip Droplet Gradient */}
            <radialGradient id="leakDropletSphere" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor={leakRedLight} />
              <stop offset="70%" stopColor={leakRed} />
              <stop offset="100%" stopColor={leakRedDeep} />
            </radialGradient>
          </defs>

          {/* ════════════════════════════════════════════════════════════
              GROUND FOUNDATION & CAST SHADOWS
             ════════════════════════════════════════════════════════════ */}
          <ellipse cx="430" cy="254" rx="285" ry="10" fill="#101828" opacity={isDarkMode ? 0.3 : 0.07} />

          {/* Soil Cross-Section */}
          <path d="M 20 252 H 720 V 275 H 20 Z" fill={isDarkMode ? '#1A1D24' : '#EAECF0'} opacity="0.6" />
          <line x1="20" y1="252" x2="720" y2="252" stroke={borderTone} strokeWidth="2" strokeLinecap="round" />

          {/* ════════════════════════════════════════════════════════════
              HOUSE STRUCTURE
             ════════════════════════════════════════════════════════════ */}
          <path
            d="M 160 252 V 105 L 340 32 L 520 105 L 685 105 V 252 Z"
            fill="url(#houseWallShading)"
            stroke={borderTone}
            strokeWidth="1.5"
            strokeLinejoin="round"
            filter="url(#softHouseShadow)"
          />

          {/* Roof Overhang Eaves & Fascia */}
          <path d="M 148 114 L 340 36 L 532 114" fill="none" stroke="#667085" strokeWidth="5" strokeLinecap="round" opacity="0.2" />
          <path d="M 520 112 H 700" stroke="#667085" strokeWidth="5" strokeLinecap="round" opacity="0.2" />

          <path
            d="M 145 110 L 340 26 L 535 110"
            fill="none"
            stroke="url(#roofLitSlope)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path d="M 145 110 L 340 26 L 535 110" fill="none" stroke="url(#roofFascia)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 520 105 H 700" stroke="url(#roofLitSlope)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 520 105 H 700" stroke="url(#roofFascia)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Windows */}
          <g filter="url(#fixtureShadow)">
            <rect x="315" y="70" width="50" height="38" rx="4" fill="#FFFFFF" stroke="#D0D5DD" strokeWidth="1.5" />
            <line x1="340" y1="70" x2="340" y2="108" stroke="#D0D5DD" strokeWidth="1.5" />
            <line x1="315" y1="89" x2="365" y2="89" stroke="#D0D5DD" strokeWidth="1.5" />
            <line x1="322" y1="102" x2="335" y2="76" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="344" y1="102" x2="357" y2="76" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* Interior Room Depth Shading Panels */}
          <rect x="162" y="112" width="168" height="138" fill="url(#roomDepthGrad)" />
          <rect x="333" y="112" width="168" height="138" fill="url(#roomDepthGrad)" />
          <rect x="504" y="112" width="179" height="138" fill="url(#roomDepthGrad)" />

          {/* Room Partition Columns */}
          <line x1="332" y1="108" x2="332" y2="252" stroke={borderTone} strokeWidth="1.5" strokeDasharray="6 4" />
          <line x1="503" y1="108" x2="503" y2="252" stroke={borderTone} strokeWidth="1.5" strokeDasharray="6 4" />

          {/* ════════════════════════════════════════════════════════════
              FIXTURES
             ════════════════════════════════════════════════════════════ */}
          {/* FIXTURE 1: Water Heater */}
          <g
            className="cursor-pointer group"
            onClick={() => handleFixtureClick('zone-1')}
            filter="url(#fixtureShadow)"
          >
            <ellipse cx="245" cy="248" rx="20" ry="3.5" fill="#101828" opacity={isDarkMode ? 0.3 : 0.15} />
            <rect x="228" y="186" width="34" height="58" rx="6" fill={fixtureBg} stroke={isDarkMode ? '#4F5869' : '#98A2B3'} strokeWidth="1.5" />
            <rect x="233" y="191" width="24" height="8" rx="2" fill={isDarkMode ? 'rgba(91,141,239,0.15)' : '#EFF4FF'} />
            <circle cx="245" cy="180" r="3.5" fill={waterColor} stroke={waterDeep} strokeWidth="1" />
            <line x1="245" y1="183" x2="245" y2="186" stroke={isDarkMode ? '#4F5869' : '#98A2B3'} strokeWidth="2" />
            <line x1="236" y1="210" x2="254" y2="210" stroke={borderTone} strokeWidth="1.5" />
            <line x1="236" y1="218" x2="254" y2="218" stroke={borderTone} strokeWidth="1.5" />
          </g>
          <text x="245" y="264" textAnchor="middle" fill={textMuted} fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600">
            Water Heater
          </text>

          {/* FIXTURE 2: Yard Sub-Meter (Zone 2) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleFixtureClick('zone-2')}
            filter="url(#fixtureShadow)"
          >
            <path d="M 410 220 V 162" stroke="url(#cylindricalPipeVert)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 410 220 V 162" stroke={waterColor} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
            <rect x="388" y="148" width="44" height="26" rx="5" fill={fixtureBg} stroke={isDarkMode ? '#4F5869' : '#475467'} strokeWidth="1.5" />
            <circle cx="410" cy="161" r="7" fill={isDarkMode ? 'rgba(91,141,239,0.15)' : '#EFF4FF'} stroke={waterColor} strokeWidth="1.5" />
            <circle cx="410" cy="161" r="2" fill={waterColor} />
            <path d="M 410 161 L 414 158" stroke={waterColor} strokeWidth="1.2" strokeLinecap="round" />
          </g>
          <text x="410" y="264" textAnchor="middle" fill={textMuted} fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600">
            Sub-Meter (Yard)
          </text>

          {/* FIXTURE 3: Bath Shower (Zone 3) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleFixtureClick('zone-3')}
            filter="url(#fixtureShadow)"
          >
            <path d="M 590 220 V 155 H 625 V 168" fill="none" stroke="url(#cylindricalPipeVert)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 590 220 V 155 H 625 V 168" fill="none" stroke={waterColor} strokeWidth="4.5" strokeLinecap="round" opacity="1" />
            <path d="M 614 168 L 636 168 L 642 178 L 608 178 Z" fill={isDarkMode ? '#383F4D' : '#475467'} stroke={isDarkMode ? '#222631' : '#1D2939'} strokeWidth="1.5" />
            {/* Fine Falling Water Droplet Lines — Blue */}
            <line x1="616" y1="182" x2="615" y2="190" stroke={waterColor} strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="625" y1="182" x2="625" y2="192" stroke={waterColor} strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="634" y1="182" x2="635" y2="190" stroke={waterColor} strokeWidth="1.5" strokeDasharray="2 2" />
          </g>
          <text x="625" y="264" textAnchor="middle" fill={textMuted} fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600">
            Bath Shower
          </text>

          {/* ════════════════════════════════════════════════════════════
              STREET METER PIT
             ════════════════════════════════════════════════════════════ */}
          <g filter="url(#fixtureShadow)">
            <rect x="45" y="202" width="62" height="38" rx="8" fill={fixtureBg} stroke={isDarkMode ? '#4F5869' : '#98A2B3'} strokeWidth="1.5" />
            <circle cx="76" cy="221" r="12" fill={isDarkMode ? 'rgba(91,141,239,0.15)' : '#EFF4FF'} stroke={waterColor} strokeWidth="2" />
            <circle cx="76" cy="221" r="3.5" fill={waterColor} />
            <path d="M 76 221 L 81 217" stroke={waterColor} strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <text x="76" y="254" textAnchor="middle" fill={textMuted} fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
            Street meter
          </text>
          <text x="76" y="194" textAnchor="middle" fill={waterColor} fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="800">
            INFLOW {dynamicInflow} L/m
          </text>

          {/* ════════════════════════════════════════════════════════════
              MAIN WATER SUPPLY PIPE (CYLINDRICAL TUBE)
             ════════════════════════════════════════════════════════════ */}
          <path d="M 76 223 H 625" stroke="#101828" strokeWidth="18" strokeLinecap="round" opacity="0.1" />

          {/* Cylindrical Metallic Outer Casing */}
          <path
            d="M 76 220 H 625"
            stroke="url(#cylindricalPipeHoriz)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Metallic Joint Collars */}
          <rect x="238" y="210" width="8" height="20" rx="2" fill="#98A2B3" stroke="#475467" strokeWidth="1" />
          <rect x="406" y="210" width="8" height="20" rx="2" fill="#98A2B3" stroke="#475467" strokeWidth="1" />
          <rect x="586" y="210" width="8" height="20" rx="2" fill="#98A2B3" stroke="#475467" strokeWidth="1" />

          {/* Pipe Interior Channel (Clean Bed) */}
          <path
            d="M 76 220 H 625"
            stroke={isDarkMode ? '#0F172A' : '#D0D5DD'}
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* ════════════════════════════════════════════════════════════
              ANIMATED WATER FLOW — Blue #2F6FED (Light) / #5B8DEF (Dark)
             ════════════════════════════════════════════════════════════ */}
          {isValveOpen ? (
            <>
              {/* Layer A: Fluid Base Flow Stream (Solid Blue #2F6FED / #5B8DEF) */}
              <path
                d="M 76 220 H 625"
                stroke={waterColor}
                strokeWidth={isHighUsage ? 7.5 : 6.5}
                strokeLinecap="round"
                opacity={1}
              />

              {/* Layer B: VISIBLY ANIMATED Glistening Water Highlights */}
              <path
                className={isHighUsage ? 'water-flow-highlight-fast' : 'water-flow-highlight'}
                d="M 76 220 H 625"
                stroke={isDarkMode ? '#E0F2FE' : '#FFFFFF'}
                strokeWidth={isHighUsage ? 3.5 : 2.6}
                strokeLinecap="round"
                opacity={0.95}
              />
            </>
          ) : (
            /* Valve Shut: Water is cut off */
            <path
              d="M 76 220 H 410"
              stroke="#D0D5DD"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.5"
            />
          )}

          {/* ════════════════════════════════════════════════════════════
              LEAK RUPTURE (ZONE 2) — SPECIFICALLY SHIFTS TO RED #F04438
             ════════════════════════════════════════════════════════════ */}
          {isLeak && isValveOpen && (
            <g id="leakIllustration">
              {/* Cast Shadow under Puddle */}
              <ellipse cx="410" cy="253" rx="26" ry="6" fill="#101828" opacity="0.15" />

              {/* Accumulating Puddle in leakRed */}
              <ellipse cx="410" cy="252" rx="20" ry="5" fill={leakRed} opacity="0.35" />
              <ellipse cx="410" cy="252" rx="13" ry="3.5" fill={leakRed} opacity="0.85" />
              <ellipse cx="406" cy="251" rx="4" ry="1.2" fill="#FFFFFF" opacity="0.9" />
              {/* Concentric Ripple in leakRed */}
              <ellipse className="puddle-ripple" cx="410" cy="252" rx="24" ry="6" fill="none" stroke={leakRed} strokeWidth="1.5" opacity="0.75" />

              {/* Pipe Rupture Crack Collar: Core in leakRed */}
              <circle cx="410" cy="220" r="10" fill={isDarkMode ? '#0B0D13' : '#101828'} filter="url(#fixtureShadow)" />
              <circle cx="410" cy="220" r="7" fill={leakRed} />

              {/* Jagged Fracture Line in White */}
              <path
                d="M 405 214 L 409 219 L 407 222 L 414 226 L 411 228"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated Falling Droplets in Red #F04438 */}
              <g className="drip-drop-1" style={{ transformOrigin: '410px 222px' }}>
                <circle cx="410" cy="224" r="3.6" fill="url(#leakDropletSphere)" />
                <circle cx="409" cy="223" r="1.2" fill="#FFFFFF" />
              </g>
              <g className="drip-drop-2" style={{ transformOrigin: '413px 222px' }}>
                <circle cx="413" cy="224" r="3" fill="url(#leakDropletSphere)" />
                <circle cx="412" cy="223" r="1" fill="#FFFFFF" />
              </g>
            </g>
          )}

        </svg>
      </div>

      {/* Footer Note */}
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#E4E7EC] text-xs text-[#667085] gap-2">
        <span className="flex items-center gap-1.5 font-medium text-[#101828]">
          <span className={`w-2 h-2 rounded-full ${!isValveOpen ? 'bg-[#98A2B3]' : isLeak ? 'bg-[#F04438]' : isHighUsage ? 'bg-[#F79009]' : 'bg-[#12B76A]'}`} />
          <span>
            {!isValveOpen
              ? 'Main shut-off valve is closed. Flow to all fixtures is isolated.'
              : isLeak
              ? `Pipe rupture detected in yard irrigation circuit at ~${leakLpm} L/min.`
              : isHighUsage
              ? 'Usage is higher than usual — elevated daytime domestic flow detected.'
              : 'Continuous sealed baseline flow — zero unaccounted water loss.'}
          </span>
        </span>
        <span className="text-[#667085]">Ultrasonic sub-meter nodes</span>
      </div>

    </div>
  );
}
