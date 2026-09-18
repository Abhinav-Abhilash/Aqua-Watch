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
  const { leakStatus, selectedHousehold } = useAqua();
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
    <div className="bg-[#FAFAFA] rounded-2xl border border-[#DCDCDC] p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden transition-all">
      
      {/* Header: Clean Pure Greyscale Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCDCDC]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-[#1A1A1A] tracking-tight">
              Real-time household water flow
            </h2>
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                !isValveOpen ? 'bg-[#7A7A7A]' : isLeak ? 'bg-[#1A1A1A]' : 'bg-[#4A4A4A]'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                !isValveOpen ? 'bg-[#7A7A7A]' : isLeak ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]'
              }`} />
            </span>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            Cross-section architectural telemetry for {selectedHousehold.name} ({selectedHousehold.locality})
          </p>
        </div>

        {/* Status Indicator — Pure Greyscale */}
        {!isValveOpen ? (
          <div className="bg-[#E0E0E0] border border-[#DCDCDC] rounded-full px-3.5 py-1.5 flex items-center gap-2 self-start sm:self-auto transition-all shrink-0">
            <span className="material-symbols-outlined text-[#1A1A1A] text-[18px]">lock</span>
            <span className="text-xs font-bold text-[#1A1A1A]">Main Valve Closed (0.0 L/m)</span>
          </div>
        ) : isLeak ? (
          <div className="bg-[#E0E0E0] border-2 border-[#1A1A1A] rounded-full px-4 py-1.5 flex items-center gap-2 self-start sm:self-auto transition-all shrink-0 shadow-[0_2px_8px_rgba(26,26,26,0.12)]">
            <div className="w-4 h-4 rounded-full bg-[#1A1A1A] flex items-center justify-center">
              <span className="material-symbols-outlined text-[12px] text-[#FFFFFF]">water_drop</span>
            </div>
            <div className="flex items-baseline gap-1 text-xs">
              <span className="text-[#4A4A4A] font-medium">Continuous leak:</span>
              <strong className="font-extrabold text-[#1A1A1A]">+{excessLiters} L/day</strong>
              <span className="text-[10px] text-[#7A7A7A] ml-1">(~${hourlyLoss}/hr)</span>
            </div>
          </div>
        ) : isHighUsage ? (
          <div className="bg-[#E0E0E0] border border-[#DCDCDC] rounded-full px-3.5 py-1.5 flex items-center gap-2 self-start sm:self-auto transition-all shrink-0">
            <span className="material-symbols-outlined text-[#1A1A1A] text-[16px]">change_history</span>
            <span className="text-xs font-bold text-[#1A1A1A]">Elevated Daytime Usage ({dynamicInflow} L/m)</span>
          </div>
        ) : (
          <div className="bg-[#E0E0E0] border border-[#DCDCDC] rounded-full px-3.5 py-1.5 flex items-center gap-2 self-start sm:self-auto transition-all shrink-0">
            <div className="w-4 h-4 rounded-full bg-[#1A1A1A] flex items-center justify-center">
              <span className="material-symbols-outlined text-[11px] text-[#FFFFFF]">check</span>
            </div>
            <span className="text-xs font-bold text-[#1A1A1A]">Sealed Baseline ({dynamicInflow} L/m)</span>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ILLUSTRATED HOUSE ARCHITECTURE & 3D CYLINDRICAL PIPES
          (Completely Pure Greyscale — Zero Non-Grey Values)
         ════════════════════════════════════════════════════════════════════ */}
      <div className="relative my-2 sm:my-3 w-full bg-[#EDEDED] rounded-2xl p-2 sm:p-4 flex-1 flex items-center justify-center overflow-hidden min-h-[220px] sm:min-h-[260px] border border-[#DCDCDC]">
        <svg
          className="w-full h-auto max-h-[260px] sm:max-h-[300px] select-none"
          fill="none"
          viewBox="0 0 740 290"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 1. Soft Realistic Drop Shadows */}
            <filter id="softHouseShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#1A1A1A" floodOpacity="0.14" />
            </filter>
            <filter id="fixtureShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1A1A1A" floodOpacity="0.16" />
            </filter>
            <filter id="pipeDropShadow" x="-10%" y="-10%" width="120%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1A1A1A" floodOpacity="0.2" />
            </filter>

            {/* 2. Roof Shading Gradients (Multi-facet dimensional shading) */}
            <linearGradient id="roofLitSlope" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E0E0E0" />
              <stop offset="70%" stopColor="#C4C4C4" />
              <stop offset="100%" stopColor="#9A9A9A" />
            </linearGradient>

            <linearGradient id="roofFascia" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7A7A7A" />
              <stop offset="100%" stopColor="#4A4A4A" />
            </linearGradient>

            {/* 3. House Wall Shading: Top-left light source to subtle bottom-right shadow */}
            <linearGradient id="houseWallShading" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FAFAFA" />
              <stop offset="75%" stopColor="#EDEDED" />
              <stop offset="100%" stopColor="#DCDCDC" />
            </linearGradient>

            {/* Room Ambient Depth Gradients */}
            <linearGradient id="roomDepthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FAFAFA" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#C4C4C4" stopOpacity="0.4" />
            </linearGradient>

            {/* 4. Cylindrical 3D Metallic Pipe Gradient (Top highlight -> Body mid-grey -> Dark shadow bottom) */}
            <linearGradient id="cylindricalPipeHoriz" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A4A4A" />
              <stop offset="18%" stopColor="#7A7A7A" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#C4C4C4" />
              <stop offset="80%" stopColor="#7A7A7A" />
              <stop offset="95%" stopColor="#4A4A4A" />
              <stop offset="100%" stopColor="#1A1A1A" />
            </linearGradient>

            <linearGradient id="cylindricalPipeVert" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A4A4A" />
              <stop offset="18%" stopColor="#7A7A7A" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#C4C4C4" />
              <stop offset="80%" stopColor="#7A7A7A" />
              <stop offset="95%" stopColor="#4A4A4A" />
              <stop offset="100%" stopColor="#1A1A1A" />
            </linearGradient>

            {/* 5. Glistening Water Flow Gradients (Calm Mid-Tone Blue #4A7FA5) */}
            <linearGradient id="waterFlowCore" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#355F7D" />
              <stop offset="35%" stopColor="#6C9BBF" />
              <stop offset="65%" stopColor="#4A7FA5" />
              <stop offset="100%" stopColor="#2D4F68" />
            </linearGradient>

            <linearGradient id="waterGleamDash" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A7FA5" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4A7FA5" stopOpacity="0.3" />
            </linearGradient>

            {/* 6. Spherical 3D Droplet Gradient (Monochrome for fixtures) */}
            <radialGradient id="dropletSphere" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#9A9A9A" />
              <stop offset="70%" stopColor="#4A4A4A" />
              <stop offset="100%" stopColor="#1A1A1A" />
            </radialGradient>

            {/* 7. Leak Drip Droplet Gradient (Brick Red #B8564A) */}
            <radialGradient id="leakDropletSphere" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E28B80" />
              <stop offset="70%" stopColor="#B8564A" />
              <stop offset="100%" stopColor="#7E332B" />
            </radialGradient>
          </defs>

          {/* ════════════════════════════════════════════════════════════
              GROUND FOUNDATION & CAST SHADOWS
             ════════════════════════════════════════════════════════════ */}
          {/* Ground Soft Cast Shadow beneath entire building */}
          <ellipse cx="430" cy="254" rx="285" ry="10" fill="#1A1A1A" opacity="0.12" />

          {/* Soil Cross-Section Strata */}
          <path d="M 20 252 H 720 V 275 H 20 Z" fill="#DCDCDC" opacity="0.5" />
          <line x1="20" y1="252" x2="720" y2="252" stroke="#7A7A7A" strokeWidth="2.5" strokeLinecap="round" />

          {/* ════════════════════════════════════════════════════════════
              HOUSE STRUCTURE: FACETS, SHADED WALLS & OVERHANGING ROOF
             ════════════════════════════════════════════════════════════ */}
          {/* Main House Walls Shell with Multi-Tone Gradient & Drop Shadow */}
          <path
            d="M 160 252 V 105 L 340 32 L 520 105 L 685 105 V 252 Z"
            fill="url(#houseWallShading)"
            stroke="#9A9A9A"
            strokeWidth="1.5"
            strokeLinejoin="round"
            filter="url(#softHouseShadow)"
          />

          {/* Roof Overhang Eaves & Fascia */}
          {/* Soffit Cast Shadow */}
          <path d="M 148 114 L 340 36 L 532 114" fill="none" stroke="#4A4A4A" strokeWidth="6" strokeLinecap="round" opacity="0.25" />
          <path d="M 520 112 H 700" stroke="#4A4A4A" strokeWidth="6" strokeLinecap="round" opacity="0.25" />

          {/* Dimensional Roof Eaves */}
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

          {/* Architectural Windows with Glass Glint Reflections */}
          {/* Upstairs Window */}
          <g filter="url(#fixtureShadow)">
            <rect x="315" y="70" width="50" height="38" rx="4" fill="#F0F0F0" stroke="#7A7A7A" strokeWidth="1.5" />
            <line x1="340" y1="70" x2="340" y2="108" stroke="#9A9A9A" strokeWidth="1.5" />
            <line x1="315" y1="89" x2="365" y2="89" stroke="#9A9A9A" strokeWidth="1.5" />
            {/* Glass Glint Angle Lines in White */}
            <line x1="322" y1="102" x2="335" y2="76" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <line x1="344" y1="102" x2="357" y2="76" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* Interior Room Depth Shading Panels */}
          <rect x="162" y="112" width="168" height="138" fill="url(#roomDepthGrad)" />
          <rect x="333" y="112" width="168" height="138" fill="url(#roomDepthGrad)" />
          <rect x="504" y="112" width="179" height="138" fill="url(#roomDepthGrad)" />

          {/* Structural Room Partition Columns (Minimal, quiet vertical lines) */}
          <line x1="332" y1="108" x2="332" y2="252" stroke="#9A9A9A" strokeWidth="1.5" strokeDasharray="6 4" />
          <line x1="503" y1="108" x2="503" y2="252" stroke="#9A9A9A" strokeWidth="1.5" strokeDasharray="6 4" />

          {/* ════════════════════════════════════════════════════════════
              FIXTURES WITH CAST SHADOWS & CLEAN UNOBTRUSIVE LABELS
             ════════════════════════════════════════════════════════════ */}
          {/* FIXTURE 1: Water Heater */}
          <g
            className="cursor-pointer group"
            onClick={() => handleFixtureClick('zone-1')}
            filter="url(#fixtureShadow)"
          >
            {/* Soft Cast Shadow under Heater */}
            <ellipse cx="245" cy="248" rx="20" ry="3.5" fill="#1A1A1A" opacity="0.25" />
            {/* Heater Tank Body */}
            <rect x="228" y="186" width="34" height="58" rx="6" fill="#FAFAFA" stroke="#4A4A4A" strokeWidth="1.5" />
            <rect x="233" y="191" width="24" height="8" rx="2" fill="#DCDCDC" />
            {/* Top Relief Valve & Gauge */}
            <circle cx="245" cy="180" r="3.5" fill="#7A7A7A" stroke="#1A1A1A" strokeWidth="1" />
            <line x1="245" y1="183" x2="245" y2="186" stroke="#4A4A4A" strokeWidth="2" />
            {/* Temperature Dials */}
            <line x1="236" y1="210" x2="254" y2="210" stroke="#7A7A7A" strokeWidth="1.5" />
            <line x1="236" y1="218" x2="254" y2="218" stroke="#7A7A7A" strokeWidth="1.5" />
          </g>
          {/* Quiet, clean fixture label below */}
          <text x="245" y="264" textAnchor="middle" fill="#7A7A7A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600">
            Water Heater
          </text>

          {/* FIXTURE 2: Yard Sub-Meter (Zone 2) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleFixtureClick('zone-2')}
            filter="url(#fixtureShadow)"
          >
            {/* Vertical Feeder Pipe with Cylindrical Shading */}
            <path d="M 410 220 V 162" stroke="url(#cylindricalPipeVert)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 410 220 V 162" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
            {/* Sub-Meter Enclosure */}
            <rect x="388" y="148" width="44" height="26" rx="5" fill="#FAFAFA" stroke="#2E2E2E" strokeWidth="1.8" />
            <circle cx="410" cy="161" r="7" fill="#E0E0E0" stroke="#1A1A1A" strokeWidth="1.5" />
            <circle cx="410" cy="161" r="2" fill="#1A1A1A" />
            <path d="M 410 161 L 414 158" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round" />
          </g>
          {/* Quiet, clean fixture label below */}
          <text x="410" y="264" textAnchor="middle" fill="#7A7A7A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600">
            Sub-Meter (Yard)
          </text>

          {/* FIXTURE 3: Bath Shower (Zone 3) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleFixtureClick('zone-3')}
            filter="url(#fixtureShadow)"
          >
            {/* Shower Riser Pipe with Cylindrical Gradient */}
            <path d="M 590 220 V 155 H 625 V 168" fill="none" stroke="url(#cylindricalPipeVert)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 590 220 V 155 H 625 V 168" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
            {/* Shower Head with Shaded Depth */}
            <path d="M 614 168 L 636 168 L 642 178 L 608 178 Z" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="1.5" />
            {/* Fine Falling Water Droplet Lines (Water is calm blue #4A7FA5) */}
            <line x1="616" y1="182" x2="615" y2="190" stroke="#4A7FA5" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="625" y1="182" x2="625" y2="192" stroke="#4A7FA5" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="634" y1="182" x2="635" y2="190" stroke="#4A7FA5" strokeWidth="1.2" strokeDasharray="2 2" />
          </g>
          {/* Quiet, clean fixture label below */}
          <text x="625" y="264" textAnchor="middle" fill="#7A7A7A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600">
            Bath Shower
          </text>

          {/* ════════════════════════════════════════════════════════════
              STREET METER PIT (LEFT SIDE SUPPLY)
             ════════════════════════════════════════════════════════════ */}
          <g filter="url(#fixtureShadow)">
            <rect x="45" y="202" width="62" height="38" rx="8" fill="#F0F0F0" stroke="#7A7A7A" strokeWidth="1.5" />
            <circle cx="76" cy="221" r="12" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="2" />
            <circle cx="76" cy="221" r="3.5" fill="#1A1A1A" />
            <path d="M 76 221 L 81 217" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          {/* Street Meter Label */}
          <text x="76" y="254" textAnchor="middle" fill="#7A7A7A" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
            Street meter
          </text>
          <text x="76" y="194" textAnchor="middle" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="800">
            INFLOW {dynamicInflow} L/m
          </text>

          {/* ════════════════════════════════════════════════════════════
              MAIN WATER SUPPLY PIPE (TRUE 3D CYLINDRICAL TUBE)
             ════════════════════════════════════════════════════════════ */}
          {/* Pipe Drop Shadow on Foundation */}
          <path d="M 76 223 H 625" stroke="#1A1A1A" strokeWidth="18" strokeLinecap="round" opacity="0.18" />

          {/* 1. Cylindrical Metallic Outer Casing (Highlight along top, shadow on bottom) */}
          <path
            d="M 76 220 H 625"
            stroke="url(#cylindricalPipeHoriz)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Metallic Joint Collars at Intersections */}
          <rect x="238" y="210" width="8" height="20" rx="2" fill="#7A7A7A" stroke="#2E2E2E" strokeWidth="1" />
          <rect x="406" y="210" width="8" height="20" rx="2" fill="#7A7A7A" stroke="#2E2E2E" strokeWidth="1" />
          <rect x="586" y="210" width="8" height="20" rx="2" fill="#7A7A7A" stroke="#2E2E2E" strokeWidth="1" />

          {/* 2. Pipe Interior Channel (Lumen) */}
          <path
            d="M 76 220 H 625"
            stroke="#1A1A1A"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* ════════════════════════════════════════════════════════════
              ANIMATED WATER FLOW (MOVING SPECULAR HIGHLIGHTS INSIDE PIPE)
             ════════════════════════════════════════════════════════════ */}
          {isValveOpen ? (
            <>
              {/* Layer A: Fluid Base Flow Stream (Calm Blue #4A7FA5) */}
              <path
                d="M 76 220 H 625"
                stroke="url(#waterFlowCore)"
                strokeWidth={isHighUsage ? 6.5 : 5.5}
                strokeLinecap="round"
                opacity={isLeak ? 0.75 : 0.9}
              />

              {/* Layer B: VISIBLY ANIMATED Glistening Water Highlights */}
              <path
                className={isHighUsage ? 'water-flow-highlight-fast' : 'water-flow-highlight'}
                d="M 76 220 H 625"
                stroke="url(#waterGleamDash)"
                strokeWidth={isHighUsage ? 4 : 3}
                strokeLinecap="round"
                opacity={isLeak ? 0.8 : 0.95}
              />
            </>
          ) : (
            /* Valve Shut: Water is cut off / stagnant */
            <path
              d="M 76 220 H 410"
              stroke="#7A7A7A"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.25"
            />
          )}

          {/* ════════════════════════════════════════════════════════════
              LEAK RUPTURE (ZONE 2 SUB-METER JUNCTION)
              (Flow at the crack point shifts to muted brick-red #B8564A)
             ════════════════════════════════════════════════════════════ */}
          {isLeak && isValveOpen && (
            <g id="leakIllustration">
              {/* Cast Shadow under Accumulating Puddle */}
              <ellipse cx="410" cy="253" rx="26" ry="6" fill="#1A1A1A" opacity="0.25" />

              {/* Accumulating Puddle on Floor in Brick Red #B8564A */}
              <ellipse cx="410" cy="252" rx="20" ry="5" fill="#B8564A" opacity="0.35" />
              <ellipse cx="410" cy="252" rx="13" ry="3.5" fill="#B8564A" opacity="0.85" />
              {/* Specular Glint on Puddle Water */}
              <ellipse cx="406" cy="251" rx="4" ry="1.2" fill="#FFFFFF" opacity="0.9" />
              {/* Concentric Water Ripple in Brick Red #B8564A */}
              <ellipse className="puddle-ripple" cx="410" cy="252" rx="24" ry="6" fill="none" stroke="#B8564A" strokeWidth="1.5" opacity="0.75" />

              {/* Pipe Rupture Crack Collar: Collar in near-black, core in brick-red #B8564A */}
              <circle cx="410" cy="220" r="10" fill="#1A1A1A" filter="url(#fixtureShadow)" />
              <circle cx="410" cy="220" r="7" fill="#B8564A" />

              {/* Jagged, Rough Fracture Line */}
              <path
                d="M 405 214 L 409 219 L 407 222 L 414 226 L 411 228"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated Falling 3D Droplets with Specular Highlights in Brick Red #B8564A */}
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
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#DCDCDC] text-xs text-[#7A7A7A] gap-2">
        <span className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
          <span className={`w-2 h-2 rounded-full ${!isValveOpen ? 'bg-[#7A7A7A]' : isLeak ? 'bg-[#1A1A1A]' : 'bg-[#4A4A4A]'}`} />
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
        <span className="text-[#8A8A8A]">Ultrasonic sub-meter nodes</span>
      </div>

    </div>
  );
}
