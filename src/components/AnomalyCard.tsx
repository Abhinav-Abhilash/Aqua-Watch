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
      className="bg-white rounded-lg shadow-none p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between border border-slate-200 transition-all animate-in fade-in duration-200"
      style={{ boxShadow: 'inset 4px 0 0 #ba1a1a' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            Flagged anomaly
          </span>
          <span className="text-xs text-slate-500">Telemetry event #9928</span>
        </div>
        <span className="text-xs text-slate-400">Updated just now</span>
      </div>

      {/* Main Metric Callout */}
      <div className="my-4 flex flex-col md:flex-row md:items-baseline justify-between gap-3">
        <div>
          <div className="text-4xl font-black text-error tracking-tight leading-none">
            +{excess} L / day
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error" />
            </span>
            <p className="text-sm text-slate-800 font-medium">
              Possible leak — excess continuous usage detected ({leakStatus.latestReadingLiters} L vs {Math.round(leakStatus.rollingAvgLiters)} L 14-day baseline) in{' '}
              <span className="text-error font-semibold">Zone 2 (Irrigation / Backyard)</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-right shrink-0">
          <span className="text-xs text-slate-500 block">Flow Rate Strain</span>
          <span className="text-lg font-bold text-error">4.8 L/min</span>
        </div>
      </div>

      {/* Peer Divergence Confidence Boost Callout */}
      <div
        id="peer-divergence-confidence-box"
        className={`my-2 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
          peerDivergence.isPeerFlat
            ? 'bg-blue-50/80 border-blue-200 text-blue-950'
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            id="peer-divergence-badge"
            className={`px-2.5 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1 ${
              peerDivergence.isPeerFlat
                ? 'bg-[#2F6FED] text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {peerDivergence.isPeerFlat ? 'verified' : 'crisis_alert'}
            </span>
            <span>{peerDivergence.label}</span>
          </span>
          <span id="peer-divergence-text" className="text-xs font-medium text-slate-700">
            {peerDivergence.description}
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-500 block font-normal">Peer group status</span>
          <span className={`text-xs font-semibold ${peerDivergence.isPeerFlat ? 'text-[#2F6FED]' : 'text-amber-700'}`}>
            {peerDivergence.isPeerFlat ? 'Local peers flat (±0%)' : `Peers co-elevated (+${peerDivergence.peerTrendPercent}%)`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onInspect}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-container text-white hover:bg-primary font-semibold text-xs shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">query_stats</span>
            <span>Inspect Telemetry</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            Dismiss Alert
          </button>
          <button
            id="btn-confirm-baseline-anomaly"
            onClick={handleConfirmExpected}
            className="text-xs text-slate-500 hover:text-slate-800 underline decoration-slate-300 underline-offset-2 ml-1 cursor-pointer transition-colors"
          >
            This is expected now
          </button>
        </div>

        <button
          onClick={() => setIsIsolated(!isIsolated)}
          className={`font-semibold text-xs flex items-center gap-1.5 transition-colors ${
            isIsolated ? 'text-emerald-700 font-bold' : 'text-error hover:text-red-700'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isIsolated ? 'check_circle' : 'cancel'}
          </span>
          <span>{isIsolated ? 'Zone 2 Valve Isolated [Secured]' : 'Isolate Zone 2 Valve'}</span>
        </button>
      </div>

    </div>
  );
}
