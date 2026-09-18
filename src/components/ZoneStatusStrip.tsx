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
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
          selectedZone === 'zone-1'
            ? 'bg-[#EFF4FF] border-[#2F6FED] ring-2 ring-[#2F6FED]/20'
            : 'bg-[#FFFFFF] border-[#E4E7EC] hover:border-[#2F6FED]/50'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#2F6FED]">kitchen</span>
            <span className="font-semibold text-[#101828]">Zone 1: Utility &amp; Kitchen</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${!isValveOpen ? 'bg-[#98A2B3]' : 'bg-[#12B76A]'}`} />
        </div>
        <div className="my-2.5">
          <div className="text-xl font-bold text-[#101828]">
            0.0 L/m
          </div>
          <span className="text-xs text-[#667085] font-medium">
            {!isValveOpen ? 'Circuit isolated' : 'Idle baseline normal'}
          </span>
        </div>
        <div className="h-3 w-full flex items-end gap-1 opacity-80">
          <span className="w-1/6 bg-[#E4E7EC] h-1.5 rounded-full" />
          <span className="w-1/6 bg-[#E4E7EC] h-2.5 rounded-full" />
          <span className="w-1/6 bg-[#E4E7EC] h-2 rounded-full" />
          <span className="w-1/6 bg-[#E4E7EC] h-3 rounded-full" />
          <span className="w-1/6 bg-[#E4E7EC] h-1.5 rounded-full" />
          <span className="w-1/6 bg-[#2F6FED] h-1 rounded-full" />
        </div>
      </div>

      {/* Zone 2 (Reactive to Leak — Red accent when leak active) */}
      <div
        onClick={() => handleClick('zone-2')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
          selectedZone === 'zone-2'
            ? 'ring-2 ring-[#2F6FED]/20'
            : ''
        } ${
          !isValveOpen
            ? 'bg-[#F8F9FB] border-[#E4E7EC] text-[#667085]'
            : isLeak
            ? 'bg-[#FEF3F2] border-[#F04438] border-l-4'
            : 'bg-[#FFFFFF] border-[#E4E7EC] hover:border-[#2F6FED]/50'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[16px] ${!isValveOpen ? 'text-[#667085]' : isLeak ? 'text-[#F04438]' : 'text-[#2F6FED]'}`}>
              yard
            </span>
            <span className={`font-semibold ${!isValveOpen ? 'text-[#667085]' : 'text-[#101828]'}`}>
              Zone 2: Yard &amp; Irrigation
            </span>
          </div>
          <span
            className={`w-2 h-2 rounded-full ${
              !isValveOpen
                ? 'bg-[#98A2B3]'
                : isLeak
                ? 'bg-[#F04438] ring-2 ring-[#FDA29B]'
                : 'bg-[#12B76A]'
            }`}
          />
        </div>
        <div className="my-2.5">
          <div className={`text-xl font-bold ${!isValveOpen ? 'text-[#667085]' : isLeak ? 'text-[#F04438]' : 'text-[#101828]'}`}>
            {!isValveOpen ? '0.0 L/m' : `${zone2Lpm} L/m`}
          </div>
          <span className={`text-xs font-medium ${!isValveOpen ? 'text-[#667085]' : isLeak ? 'text-[#F04438] font-bold' : 'text-[#667085]'}`}>
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
              <span className="w-1/6 bg-[#E4E7EC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#E4E7EC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#E4E7EC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#E4E7EC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#E4E7EC] h-1 rounded-full" />
              <span className="w-1/6 bg-[#E4E7EC] h-1 rounded-full" />
            </>
          ) : isLeak ? (
            <>
              <span className="w-1/6 bg-[#FDA29B] h-2 rounded-full" />
              <span className="w-1/6 bg-[#F04438] h-2.5 rounded-full" />
              <span className="w-1/6 bg-[#F04438] h-3 rounded-full" />
              <span className="w-1/6 bg-[#D92D20] h-3 rounded-full" />
              <span className="w-1/6 bg-[#D92D20] h-3 rounded-full" />
              <span className="w-1/6 bg-[#B42318] h-3 rounded-full" />
            </>
          ) : (
            <>
              <span className="w-1/6 bg-[#E4E7EC] h-1.5 rounded-full" />
              <span className="w-1/6 bg-[#E4E7EC] h-1.5 rounded-full" />
              <span className="w-1/6 bg-[#E4E7EC] h-2 rounded-full" />
              <span className="w-1/6 bg-[#E4E7EC] h-1.5 rounded-full" />
              <span className="w-1/6 bg-[#2F6FED] h-2 rounded-full" />
              <span className="w-1/6 bg-[#2F6FED] h-1.5 rounded-full" />
            </>
          )}
        </div>
      </div>

      {/* Zone 3 */}
      <div
        onClick={() => handleClick('zone-3')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
          selectedZone === 'zone-3'
            ? 'bg-[#EFF4FF] border-[#2F6FED] ring-2 ring-[#2F6FED]/20'
            : 'bg-[#FFFFFF] border-[#E4E7EC] hover:border-[#2F6FED]/50'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#2F6FED]">bathtub</span>
            <span className="font-semibold text-[#101828]">Zone 3: Bath &amp; Fixtures</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${!isValveOpen ? 'bg-[#98A2B3]' : 'bg-[#12B76A]'}`} />
        </div>
        <div className="my-2.5">
          <div className="text-xl font-bold text-[#101828]">
            {!isValveOpen ? '0.0 L/m' : '1.2 L/m'}
          </div>
          <span className="text-xs text-[#667085] font-medium">
            {!isValveOpen ? 'Circuit isolated' : 'Standard domestic draw'}
          </span>
        </div>
        <div className="h-3 w-full flex items-end gap-1 opacity-80">
          <span className="w-1/6 bg-[#E4E7EC] h-2.5 rounded-full" />
          <span className="w-1/6 bg-[#E4E7EC] h-2 rounded-full" />
          <span className="w-1/6 bg-[#E4E7EC] h-3 rounded-full" />
          <span className="w-1/6 bg-[#E4E7EC] h-2.5 rounded-full" />
          <span className="w-1/6 bg-[#E4E7EC] h-1.5 rounded-full" />
          <span className="w-1/6 bg-[#2F6FED] h-2 rounded-full" />
        </div>
      </div>

    </div>
  );
}
