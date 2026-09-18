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
      
      {/* Primary Card: Today's Usage */}
      <div className="bg-[#FAFAFA] border border-[#DCDCDC] rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B6B6B]">
          <span className="text-xs font-medium text-[#6B6B6B]">Today&apos;s usage</span>
          <span className="text-[11px] text-[#8A8A8A] px-2 py-0.5 rounded-full bg-[#E0E0E0]/60">Current</span>
        </div>
        <div className="my-2.5">
          <div className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {todayLiters}{' '}
            <span className="text-base text-[#8A8A8A] font-normal">L</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
          <span className="inline-flex items-center gap-0.5 font-semibold text-[#1A1A1A]">
            <span className="material-symbols-outlined text-[13px]">
              {isDiffPositive ? 'north' : 'south'}
            </span>
            {isDiffPositive ? `+${diffFromRolling} L` : `${diffFromRolling} L`}
          </span>
          <span>vs your usual amount</span>
        </div>
      </div>

      {/* Secondary Card 1: Your Usual Amount */}
      <div className="bg-[#FAFAFA] border border-[#DCDCDC] rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B6B6B]">
          <span className="text-xs font-medium text-[#6B6B6B]">Your usual amount</span>
          <span className="text-[11px] text-[#8A8A8A] px-2 py-0.5 rounded-full bg-[#E0E0E0]/60">Past 14 days</span>
        </div>
        <div className="my-2.5 flex items-baseline gap-1.5">
          <div className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {avg14dLiters}{' '}
            <span className="text-base text-[#8A8A8A] font-normal">L</span>
          </div>
          <span className="text-xs text-[#8A8A8A] font-normal">/ day</span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
          <span>~{Math.round(avg14dLiters / (selectedHousehold.occupants || 1))} L per person</span>
          <span className="text-[#8A8A8A]">{selectedHousehold.occupants} occupants</span>
        </div>
      </div>

      {/* Secondary Card 2: Compared to Neighbors */}
      <div className="bg-[#FAFAFA] border border-[#DCDCDC] rounded-2xl p-4 sm:p-5 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between text-[#6B6B6B]">
          <span className="text-xs font-medium text-[#6B6B6B]">Compared to neighbors</span>
          <span className="text-[11px] text-[#8A8A8A] px-2 py-0.5 rounded-full bg-[#E0E0E0]/60">{selectedHousehold.locality}</span>
        </div>
        <div className="my-2.5 flex items-baseline gap-2">
          <div className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            {peerDiffPercent > 0 ? `+${peerDiffPercent}%` : `${peerDiffPercent}%`}
          </div>
          <span
            id="peer-stat-pill"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E0E0E0] text-[#1A1A1A] border border-[#DCDCDC]"
          >
            <span className="material-symbols-outlined text-[13px]">
              {isPeerAbove ? 'north' : 'south'}
            </span>
            {isPeerAbove ? `${peerDiffPercent}% above peers` : `${Math.abs(peerDiffPercent)}% below peers`}
          </span>
        </div>
        <div className="text-xs text-[#6B6B6B] flex items-center justify-between">
          <span>Neighbors average: <strong className="text-[#1A1A1A] font-semibold">{peerAvg} L/day</strong></span>
        </div>
      </div>

    </div>
  );
}
