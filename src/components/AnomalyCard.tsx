'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';

interface AnomalyCardProps {
  onInspect: () => void;
}

export default function AnomalyCard({ onInspect }: AnomalyCardProps) {
  const { leakStatus, selectedHousehold, resetHouseholdBaseline } = useAqua();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIsolated, setIsIsolated] = useState(false);

  if (leakStatus.severity !== 'LEAK_DETECTED' || isDismissed) {
    return null;
  }

  // Excess liters is strictly calculated as (current reading − rolling average)
  const excess = Math.max(0, Math.round(leakStatus.latestReadingLiters - leakStatus.rollingAvgLiters));
  const peerDivergence = leakStatus.peerDivergence;

  const handleConfirmExpected = () => {
    resetHouseholdBaseline(selectedHousehold.id);
    setIsDismissed(true);
  };

  return (
    <div
      className="bg-[#FEF3F2]/50 rounded-2xl p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between border border-[#F04438]/30 border-l-4 border-l-[#F04438] transition-all animate-in fade-in duration-200 shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-[#FEF3F2] text-[#F04438] text-xs font-bold flex items-center gap-1.5 border border-[#F04438]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F04438] animate-ping" />
            Flagged Anomaly
          </span>
          <span className="text-xs text-[#667085]">Telemetry event #9928</span>
        </div>
        <span className="text-xs text-[#667085]">Updated just now</span>
      </div>

      {/* Main Metric Callout */}
      <div className="my-4 flex flex-col md:flex-row md:items-baseline justify-between gap-3">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#F04438] tracking-tight leading-none">
            +{excess} L / day
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F04438] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F04438]" />
            </span>
            <p className="text-xs sm:text-sm text-[#101828] font-medium">
              Possible leak — excess continuous flow detected ({leakStatus.latestReadingLiters} L vs {Math.round(leakStatus.rollingAvgLiters)} L 14-day baseline) in{' '}
              <span className="text-[#F04438] font-bold">Zone 2 (Irrigation / Backyard)</span>
            </p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E4E7EC] px-3.5 py-2 rounded-xl text-right shrink-0 shadow-xs">
          <span className="text-xs text-[#667085] block">Flow Rate Strain</span>
          <span className="text-lg font-bold text-[#F04438]">4.8 L/min</span>
        </div>
      </div>

      {/* Peer Divergence Confidence Box */}
      <div
        id="peer-divergence-confidence-box"
        className="my-2 p-3.5 rounded-xl border border-[#E4E7EC] bg-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            id="peer-divergence-badge"
            className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20"
          >
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>{peerDivergence.label}</span>
          </span>
          <span id="peer-divergence-text" className="text-xs font-medium text-[#101828]">
            {peerDivergence.description}
          </span>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] text-[#667085] block font-normal">Peer group status</span>
          <span className="text-xs font-semibold text-[#101828]">
            {peerDivergence.isPeerFlat ? 'Local peers flat (±0%)' : `Peers co-elevated (+${peerDivergence.peerTrendPercent}%)`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E4E7EC] mt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary CTA: Solid Blue */}
          <button
            onClick={onInspect}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2458C7] font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">query_stats</span>
            <span>Inspect Telemetry</span>
          </button>

          {/* Secondary CTA: White bg, Blue border, Blue text */}
          <button
            onClick={() => setIsDismissed(true)}
            className="px-4 py-2 rounded-lg bg-[#FFFFFF] border border-[#2F6FED] text-[#2F6FED] hover:bg-[#EFF4FF] font-semibold text-xs transition-colors cursor-pointer"
          >
            Dismiss Alert
          </button>

          {/* Text-only link */}
          <button
            id="btn-confirm-baseline-anomaly"
            onClick={handleConfirmExpected}
            className="text-xs text-[#2F6FED] hover:underline ml-1 cursor-pointer transition-colors"
          >
            This is expected now
          </button>
        </div>

        {/* Emergency isolate valve button */}
        <button
          onClick={() => setIsIsolated(!isIsolated)}
          className={`font-semibold text-xs flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            isIsolated
              ? 'bg-[#FFFFFF] text-[#12B76A] border border-[#12B76A]'
              : 'bg-[#F04438] hover:bg-[#D92D20] text-white shadow-sm'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">
            {isIsolated ? 'check_circle' : 'cancel'}
          </span>
          <span>{isIsolated ? 'Zone 2 Valve Isolated [Secured]' : 'Isolate Zone 2 Valve'}</span>
        </button>
      </div>

    </div>
  );
}
