'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

export default function StatCardsRow() {
  const { leakStatus, selectedHousehold } = useAqua();

  const todayLiters = leakStatus.latestReadingLiters || 0;
  const avg14dLiters = Math.round(leakStatus.rollingAvgLiters) || (selectedHousehold.occupants * 130);
  const diffFromRolling = todayLiters - avg14dLiters;
  const isDiffPositive = diffFromRolling > 0;

  const peerDiffPercent = leakStatus.peerComparisonDiffPercent;
  const isPeerAbove = peerDiffPercent > 0;
  const peerAvg = leakStatus.peerAvgLiters;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
      
      {/* Primary Card: Today's Usage (Has subtle elevation and clear focal hierarchy) */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-xs font-medium text-slate-600">Today&apos;s usage</span>
          <span className="text-[11px] text-slate-400">Current</span>
        </div>
        <div className="my-2.5">
          <div className="text-3xl font-bold text-slate-900 tracking-tight">
            {todayLiters}{' '}
            <span className="text-base text-slate-400 font-normal">L</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className={`inline-flex items-center font-medium ${isDiffPositive ? 'text-amber-700' : 'text-emerald-700'}`}>
            {isDiffPositive ? `+${diffFromRolling} L` : `${diffFromRolling} L`}
          </span>
          <span>vs your usual amount</span>
        </div>
      </div>

      {/* Secondary Card 1: Your Usual Amount (Flat border, no decorative icon box) */}
      <div className="bg-white border border-slate-200/80 rounded-lg p-4 sm:p-5 shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium text-slate-600">Your usual amount</span>
          <span className="text-[11px] text-slate-400">Past 14 days</span>
        </div>
        <div className="my-2.5 flex items-baseline gap-1.5">
          <div className="text-3xl font-bold text-slate-900 tracking-tight">
            {avg14dLiters}{' '}
            <span className="text-base text-slate-400 font-normal">L</span>
          </div>
          <span className="text-xs text-slate-400 font-normal">/ day</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>~{Math.round(avg14dLiters / (selectedHousehold.occupants || 1))} L per person</span>
          <span className="text-slate-400">{selectedHousehold.occupants} occupants</span>
        </div>
      </div>

      {/* Secondary Card 2: Compared to Neighbors (Flat border, no decorative icon box) */}
      <div className="bg-white border border-slate-200/80 rounded-lg p-4 sm:p-5 shadow-none flex flex-col justify-between sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium text-slate-600">Compared to neighbors</span>
          <span className="text-[11px] text-slate-400">{selectedHousehold.locality}</span>
        </div>
        <div className="my-2.5 flex items-baseline gap-2">
          <div className={`text-3xl font-bold tracking-tight ${isPeerAbove ? 'text-amber-700' : 'text-slate-900'}`}>
            {peerDiffPercent > 0 ? `+${peerDiffPercent}%` : `${peerDiffPercent}%`}
          </div>
          <span
            id="peer-stat-pill"
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              isPeerAbove
                ? 'bg-amber-50 text-amber-800'
                : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            {isPeerAbove ? `${peerDiffPercent}% above peers` : `${Math.abs(peerDiffPercent)}% below peers`}
          </span>
        </div>
        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span>Neighbors average: <strong className="text-slate-700 font-medium">{peerAvg} L/day</strong></span>
        </div>
      </div>

    </div>
  );
}
