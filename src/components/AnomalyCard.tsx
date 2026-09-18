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
      className="bg-[#FAFAFA] rounded-2xl p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between border border-[#DCDCDC] border-l-4 border-l-[#B8564A] transition-all animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-[#F9ECEB] text-[#B8564A] text-xs font-bold flex items-center gap-1.5 border border-[#B8564A]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8564A] animate-ping" />
            Flagged Anomaly
          </span>
          <span className="text-xs text-[#8A8A8A]">Telemetry event #9928</span>
        </div>
        <span className="text-xs text-[#8A8A8A]">Updated just now</span>
      </div>

      {/* Main Metric Callout */}
      <div className="my-4 flex flex-col md:flex-row md:items-baseline justify-between gap-3">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#B8564A] tracking-tight leading-none">
            +{excess} L / day
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8564A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B8564A]" />
            </span>
            <p className="text-xs sm:text-sm text-[#1A1A1A] font-medium">
              Possible leak — excess continuous flow detected ({leakStatus.latestReadingLiters} L vs {Math.round(leakStatus.rollingAvgLiters)} L 14-day baseline) in{' '}
              <span className="text-[#B8564A] font-bold">Zone 2 (Irrigation / Backyard)</span>
            </p>
          </div>
        </div>

        <div className="bg-[#EDEDED] border border-[#DCDCDC] px-3.5 py-2 rounded-2xl text-right shrink-0">
          <span className="text-xs text-[#8A8A8A] block">Flow Rate Strain</span>
          <span className="text-lg font-bold text-[#B8564A]">4.8 L/min</span>
        </div>
      </div>

      {/* Peer Divergence Confidence Box */}
      <div
        id="peer-divergence-confidence-box"
        className="my-2 p-3.5 rounded-2xl border border-[#DCDCDC] bg-[#EDEDED] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            id="peer-divergence-badge"
            className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
          >
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>{peerDivergence.label}</span>
          </span>
          <span id="peer-divergence-text" className="text-xs font-medium text-[#1A1A1A]">
            {peerDivergence.description}
          </span>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] text-[#8A8A8A] block font-normal">Peer group status</span>
          <span className="text-xs font-semibold text-[#1A1A1A]">
            {peerDivergence.isPeerFlat ? 'Local peers flat (±0%)' : `Peers co-elevated (+${peerDivergence.peerTrendPercent}%)`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DCDCDC] mt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onInspect}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A1A1A] text-white hover:bg-black font-semibold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">query_stats</span>
            <span>Inspect Telemetry</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="px-4 py-2 rounded-full bg-[#E0E0E0] hover:bg-[#D5D5D5] text-[#6B6B6B] hover:text-[#1A1A1A] font-semibold text-xs transition-colors cursor-pointer"
          >
            Dismiss Alert
          </button>
          <button
            id="btn-confirm-baseline-anomaly"
            onClick={handleConfirmExpected}
            className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] underline decoration-[#DCDCDC] underline-offset-2 ml-1 cursor-pointer transition-colors"
          >
            This is expected now
          </button>
        </div>

        <button
          onClick={() => setIsIsolated(!isIsolated)}
          className={`font-semibold text-xs flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
            isIsolated
              ? 'bg-[#E0E0E0] text-[#1A1A1A] border border-[#DCDCDC]'
              : 'bg-[#1A1A1A] text-white hover:bg-black shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
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
