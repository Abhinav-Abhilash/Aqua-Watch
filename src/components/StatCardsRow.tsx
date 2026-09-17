'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

export default function StatCardsRow() {
  const { leakStatus, selectedHousehold } = useAqua();

  const todayLiters = leakStatus.latestReadingLiters || 0;
  const avg14dLiters = Math.round(leakStatus.rollingAvgLiters) || (selectedHousehold.occupants * 130);
  const stdDev = leakStatus.rollingStdDev;
  const diffFromRolling = todayLiters - avg14dLiters;
  const isDiffPositive = diffFromRolling > 0;

  const peerDiffPercent = leakStatus.peerComparisonDiffPercent;
  const isPeerAbove = peerDiffPercent > 0;
  const peerAvg = leakStatus.peerAvgLiters;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      
      {/* Stat 1: Today's Usage */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold text-slate-600">Today&apos;s usage</span>
          <div className="p-2 rounded-xl bg-blue-50 text-primary">
            <span className="material-symbols-outlined text-[20px]">water_drop</span>
          </div>
        </div>
        <div className="my-3">
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {todayLiters}{' '}
            <span className="text-lg text-slate-500 font-normal">L</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <span className={`inline-flex items-center font-semibold ${isDiffPositive ? 'text-error' : 'text-emerald-600'}`}>
            <span className="material-symbols-outlined text-[16px]">
              {isDiffPositive ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {isDiffPositive ? `+${diffFromRolling} L` : `${diffFromRolling} L`}
          </span>
          <span>vs 14-day baseline • Main meter</span>
        </div>
      </div>

      {/* Stat 2: 14-Day Average & Standard Deviation */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold text-slate-600">14-day average &amp; deviation</span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </div>
        </div>
        <div className="my-3 flex items-baseline gap-2">
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {avg14dLiters}{' '}
            <span className="text-lg text-slate-500 font-normal">L</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            σ = {stdDev} L
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500">
          <span className="inline-flex items-center text-slate-600">
            Threshold (+2.5σ): <strong className="ml-1 text-slate-800 font-semibold">{Math.round(avg14dLiters + 2.5 * stdDev)} L</strong>
          </span>
          <span>~{Math.round(avg14dLiters / (selectedHousehold.occupants || 1))} L/occ</span>
        </div>
      </div>

      {/* Stat 3: vs Peer Group */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold text-slate-600">vs. Peer group</span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </div>
        </div>
        <div className="my-3 flex items-baseline gap-2">
          <div className={`text-3xl font-extrabold tracking-tight ${isPeerAbove ? 'text-error' : 'text-slate-900'}`}>
            {peerDiffPercent > 0 ? `+${peerDiffPercent}%` : `${peerDiffPercent}%`}
          </div>
          <span
            id="peer-stat-pill"
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
              isPeerAbove ? 'bg-red-100 text-error' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isPeerAbove ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {isPeerAbove ? `${peerDiffPercent}% above peers` : `${Math.abs(peerDiffPercent)}% below peers`}
          </span>
        </div>
        <div className="text-xs text-slate-500 flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span>Peer avg: <strong className="text-slate-700 font-semibold">{peerAvg} L/day</strong></span>
            <span>{selectedHousehold.locality} ({selectedHousehold.occupants} occupants)</span>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            * based on your local peer group
          </span>
        </div>
      </div>

    </div>
  );
}
