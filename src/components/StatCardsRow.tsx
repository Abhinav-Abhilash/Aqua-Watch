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
      <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-[#667085]">
          <span className="text-xs font-semibold text-[#667085]">Today&apos;s usage</span>
          <span className="text-[11px] font-medium text-[#2F6FED] px-2.5 py-0.5 rounded-full bg-[#EFF4FF]">Current</span>
        </div>
        <div className="my-2.5">
          <div className="text-3xl font-bold text-[#101828] tracking-tight">
            {todayLiters}{' '}
            <span className="text-base text-[#667085] font-normal">L</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#667085]">
          <span className={`inline-flex items-center gap-0.5 font-semibold ${isDiffPositive ? 'text-[#F04438]' : 'text-[#12B76A]'}`}>
            <span className="material-symbols-outlined text-[14px]">
              {isDiffPositive ? 'north' : 'south'}
            </span>
            {isDiffPositive ? `+${diffFromRolling} L` : `${diffFromRolling} L`}
          </span>
          <span>vs your usual amount</span>
        </div>
      </div>

      {/* Secondary Card 1: Your Usual Amount */}
      <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-[#667085]">
          <span className="text-xs font-semibold text-[#667085]">Your usual amount</span>
          <span className="text-[11px] font-medium text-[#667085] px-2.5 py-0.5 rounded-full bg-[#F2F4F7]">Past 14 days</span>
        </div>
        <div className="my-2.5 flex items-baseline gap-1.5">
          <div className="text-3xl font-bold text-[#101828] tracking-tight">
            {avg14dLiters}{' '}
            <span className="text-base text-[#667085] font-normal">L</span>
          </div>
          <span className="text-xs text-[#667085] font-normal">/ day</span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#667085]">
          <span>~{Math.round(avg14dLiters / (selectedHousehold.occupants || 1))} L per person</span>
          <span className="text-[#667085]">{selectedHousehold.occupants} occupants</span>
        </div>
      </div>

      {/* Secondary Card 2: Compared to Neighbors */}
      <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-2xl p-4 sm:p-5 flex flex-col justify-between sm:col-span-2 lg:col-span-1 shadow-xs">
        <div className="flex items-center justify-between text-[#667085]">
          <span className="text-xs font-semibold text-[#667085]">Compared to neighbors</span>
          <span className="text-[11px] font-medium text-[#667085] px-2.5 py-0.5 rounded-full bg-[#F2F4F7]">{selectedHousehold.locality}</span>
        </div>
        <div className="my-2.5 flex items-baseline gap-2">
          <div className="text-3xl font-bold tracking-tight text-[#101828]">
            {peerDiffPercent > 0 ? `+${peerDiffPercent}%` : `${peerDiffPercent}%`}
          </div>
          <span
            id="peer-stat-pill"
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isPeerAbove
                ? 'bg-[#FEF3F2] text-[#F04438]'
                : 'bg-[#ECFDF3] text-[#12B76A]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">
              {isPeerAbove ? 'north' : 'south'}
            </span>
            {isPeerAbove ? `${peerDiffPercent}% above peers` : `${Math.abs(peerDiffPercent)}% below peers`}
          </span>
        </div>
        <div className="text-xs text-[#667085] flex items-center justify-between">
          <span>Neighbors average: <strong className="text-[#101828] font-semibold">{peerAvg} L/day</strong></span>
        </div>
      </div>

    </div>
  );
}
