'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';

interface AnomalyCardProps {
  onInspect: () => void;
}

export default function AnomalyCard({ onInspect }: AnomalyCardProps) {
  const { leakStatus, selectedHousehold } = useAqua();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIsolated, setIsIsolated] = useState(false);

  if (leakStatus.severity !== 'LEAK_DETECTED' || isDismissed) {
    return null;
  }

  // Excess liters is strictly calculated as (current reading − rolling average)
  const excess = Math.max(0, Math.round(leakStatus.latestReadingLiters - leakStatus.rollingAvgLiters));
  const peerDivergence = leakStatus.peerDivergence;

  return (
    <div
      className="bg-white rounded-2xl shadow-xs p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between border border-slate-200/80 transition-all animate-in fade-in duration-300"
      style={{ boxShadow: 'inset 5px 0 0 #ba1a1a' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-full bg-red-100 text-error text-xs tracking-wider font-bold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-error animate-ping" />
            FLAGGED ANOMALY
          </span>
          <span className="text-xs text-slate-500">Telemetry Event #9928</span>
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
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs ${
              peerDivergence.isPeerFlat
                ? 'bg-primary text-white'
                : 'bg-amber-500 text-white'
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
          <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Peer Group Status</span>
          <span className={`text-xs font-bold ${peerDivergence.isPeerFlat ? 'text-primary' : 'text-amber-700'}`}>
            {peerDivergence.isPeerFlat ? 'Local Peers Flat (±0%)' : `Peers Co-elevated (+${peerDivergence.peerTrendPercent}%)`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-2.5">
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
