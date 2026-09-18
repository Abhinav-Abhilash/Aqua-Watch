'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

interface ZoneStatusStripProps {
  selectedZone?: string | null;
  onSelectZone?: (zone: string) => void;
  isValveOpen?: boolean;
}

export default function ZoneStatusStrip({
  selectedZone = null,
  onSelectZone,
  isValveOpen = true
}: ZoneStatusStripProps = {}) {
  const { leakStatus } = useAqua();
  const isLeak = leakStatus.severity === 'LEAK_DETECTED';
  const excessLiters = isLeak ? (leakStatus.estimatedExcessLitersPerDay || 180) : 0;
  const zone2Lpm = !isValveOpen
    ? '0.0'
    : isLeak
    ? (excessLiters / 60).toFixed(1)
    : '0.4';

  const handleClick = (zoneId: string) => {
    if (onSelectZone) {
      onSelectZone(selectedZone === zoneId ? '' : zoneId);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      
      {/* Zone 1 */}
      <div
        onClick={() => handleClick('zone-1')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
          selectedZone === 'zone-1'
            ? 'bg-[#E0E0E0]/80 border-[#1A1A1A] ring-2 ring-[#1A1A1A]/20'
            : 'bg-[#FAFAFA] border-[#DCDCDC] hover:border-[#8A8A8A]'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#6B6B6B]">kitchen</span>
            <span className="font-semibold text-[#1A1A1A]">Zone 1: Utility &amp; Kitchen</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${!isValveOpen ? 'bg-[#8A8A8A]' : 'bg-[#1A1A1A]'}`} />
        </div>
        <div className="my-2.5">
          <div className="text-xl font-bold text-[#1A1A1A]">
            0.0 L/m
          </div>
          <span className="text-xs text-[#6B6B6B] font-medium">
            {!isValveOpen ? 'Circuit isolated' : 'Idle baseline normal'}
          </span>
        </div>
        <div className="h-3 w-full flex items-end gap-1 opacity-70">
          <span className="w-1/6 bg-[#DCDCDC] h-1.5 rounded-full" />
          <span className="w-1/6 bg-[#DCDCDC] h-2.5 rounded-full" />
          <span className="w-1/6 bg-[#DCDCDC] h-2 rounded-full" />
          <span className="w-1/6 bg-[#DCDCDC] h-3 rounded-full" />
          <span className="w-1/6 bg-[#DCDCDC] h-1.5 rounded-full" />
          <span className="w-1/6 bg-[#1A1A1A] h-1 rounded-full" />
        </div>
      </div>

      {/* Zone 2 (Reactive to Leak — Monochrome shape and weight distinction) */}
      <div
        onClick={() => handleClick('zone-2')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
          selectedZone === 'zone-2'
            ? 'ring-2 ring-[#1A1A1A]/20'
            : ''
        } ${
          !isValveOpen
            ? 'bg-[#E0E0E0]/60 border-[#DCDCDC] text-[#6B6B6B]'
            : isLeak
            ? 'bg-[#FAFAFA] border-[#1A1A1A] border-l-4'
            : 'bg-[#FAFAFA] border-[#DCDCDC] hover:border-[#8A8A8A]'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[16px] ${!isValveOpen ? 'text-[#6B6B6B]' : 'text-[#1A1A1A]'}`}>
              yard
            </span>
            <span className={`font-semibold ${!isValveOpen ? 'text-[#6B6B6B]' : 'text-[#1A1A1A]'}`}>
              Zone 2: Yard &amp; Irrigation
            </span>
          </div>
          <span
            className={`w-2 h-2 rounded-full ${
              !isValveOpen
                ? 'bg-[#8A8A8A]'
                : isLeak
                ? 'bg-[#1A1A1A] ring-2 ring-[#DCDCDC]'
                : 'bg-[#1A1A1A]'
            }`}
          />
        </div>
        <div className="my-2.5">
          <div className={`text-xl font-bold ${!isValveOpen ? 'text-[#6B6B6B]' : 'text-[#1A1A1A]'}`}>
            {!isValveOpen ? '0.0 L/m' : `${zone2Lpm} L/m`}
          </div>
          <span className={`text-xs font-medium ${!isValveOpen ? 'text-[#8A8A8A]' : isLeak ? 'text-[#1A1A1A] font-bold' : 'text-[#6B6B6B]'}`}>
            {!isValveOpen
              ? 'Circuit shut off'
              : isLeak
              ? `+${Math.round((excessLiters / (leakStatus.rollingOvernightAvgLiters || 12)) * 100)}% anomalous draw`
              : 'Low flow steady'}
          </span>
        </div>
        <div className="h-3 w-full flex items-end gap-1">
          {!isValveOpen ? (
            <>
              <span className="w-1/6 bg-[#DCDCDC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#DCDCDC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#DCDCDC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#DCDCDC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#DCDCDC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#DCDCDC] h-1 rounded-full" />
            </>
          ) : isLeak ? (
            <>
              <span className="w-1/6 bg-[#DCDCDC] h-2 rounded-full" />
              <span className="w-1/6 bg-[#9A9A9A] h-2.5 rounded-full" />
              <span className="w-1/6 bg-[#6B6B6B] h-3 rounded-full" />
              <span className="w-1/6 bg-[#4A4A4A] h-3 rounded-full" />
              <span className="w-1/6 bg-[#1A1A1A] h-3 rounded-full" />
              <span className="w-1/6 bg-[#1A1A1A] h-3 rounded-full" />
            </>
          ) : (
            <>
              <span className="w-1/6 bg-[#DCDCDC] h-1.5 rounded-full" />
              <span className="w-1/6 bg-[#DCDCDC] h-1.5 rounded-full" />
              <span className="w-1/6 bg-[#DCDCDC] h-2 rounded-full" />
              <span className="w-1/6 bg-[#DCDCDC] h-1.5 rounded-full" />
              <span className="w-1/6 bg-[#1A1A1A] h-2 rounded-full" />
              <span className="w-1/6 bg-[#1A1A1A] h-1.5 rounded-full" />
            </>
          )}
        </div>
      </div>

      {/* Zone 3 */}
      <div
        onClick={() => handleClick('zone-3')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
          selectedZone === 'zone-3'
            ? 'bg-[#E0E0E0]/80 border-[#1A1A1A] ring-2 ring-[#1A1A1A]/20'
            : 'bg-[#FAFAFA] border-[#DCDCDC] hover:border-[#8A8A8A]'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#6B6B6B]">bathtub</span>
            <span className="font-semibold text-[#1A1A1A]">Zone 3: Bath &amp; Fixtures</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${!isValveOpen ? 'bg-[#8A8A8A]' : 'bg-[#1A1A1A]'}`} />
        </div>
        <div className="my-2.5">
          <div className="text-xl font-bold text-[#1A1A1A]">
            {!isValveOpen ? '0.0 L/m' : '1.2 L/m'}
          </div>
          <span className="text-xs text-[#6B6B6B] font-medium">
            {!isValveOpen ? 'Circuit isolated' : 'Standard domestic draw'}
          </span>
        </div>
        <div className="h-3 w-full flex items-end gap-1 opacity-70">
          <span className="w-1/6 bg-[#DCDCDC] h-2.5 rounded-full" />
          <span className="w-1/6 bg-[#DCDCDC] h-2 rounded-full" />
          <span className="w-1/6 bg-[#DCDCDC] h-3 rounded-full" />
          <span className="w-1/6 bg-[#DCDCDC] h-2.5 rounded-full" />
          <span className="w-1/6 bg-[#DCDCDC] h-1.5 rounded-full" />
          <span className="w-1/6 bg-[#1A1A1A] h-2 rounded-full" />
        </div>
      </div>

    </div>
  );
}
