'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';
import StatusFace from '@/components/StatusFace';

export default function GlanceBanner() {
  const { leakStatus, selectedHousehold, resetHouseholdBaseline } = useAqua();

  const isLeak = leakStatus.severity === 'LEAK_DETECTED';
  const isHighUsage = leakStatus.severity === 'HIGH_USAGE';

  return (
    <div
      id="glance-banner"
      className={`rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 bg-[#FAFAFA] border border-[#DCDCDC] ${
        isLeak
          ? 'border-l-4 border-l-[#B8564A]'
          : ''
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4.5">
        {/* Status Indicator Icon (circle for normal, triangle for high usage, red water drop for leak) */}
        <StatusFace severity={leakStatus.severity} />

        {/* Status Sentence - LARGEST TEXT ON PAGE */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              id="glance-status-pill"
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium border ${
                isLeak
                  ? 'bg-[#F9ECEB] text-[#B8564A] border-[#B8564A]/40 font-semibold'
                  : isHighUsage
                  ? 'bg-[#E0E0E0] text-[#1A1A1A] border-[#DCDCDC]'
                  : 'bg-[#E0E0E0] text-[#1A1A1A] border-[#DCDCDC]'
              }`}
            >
              {isLeak ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8564A] animate-ping" />
              ) : isHighUsage ? (
                <span className="material-symbols-outlined text-[12px] text-[#1A1A1A]">change_history</span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
              )}
              {isLeak ? 'Leak alert' : isHighUsage ? 'Usage is higher than usual' : 'All clear'}
            </span>
            <span className="text-xs text-[#8A8A8A] font-normal">Household status</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-[24px] font-extrabold text-[#1A1A1A] tracking-tight leading-snug">
            {isLeak
              ? "Possible leak detected — water is running when no one's using it."
              : isHighUsage
              ? 'Usage is higher than usual — daytime consumption is elevated.'
              : 'All systems normal — no signs of water waste in your home.'}
          </h1>

          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">
            {isLeak ? (
              <>
                Continuous flow of{' '}
                <strong className="text-[#B8564A] font-semibold">
                  +{leakStatus.estimatedExcessLitersPerDay} L/day
                </strong>{' '}
                persisting for {leakStatus.consecutiveDays} consecutive nights. Inspect fixtures or appliances.
              </>
            ) : isHighUsage ? (
              <>
                Daytime draw is ~{leakStatus.estimatedExcessLitersPerDay} L above your usual amount over the last {leakStatus.consecutiveDays} days. Overnight flow remains clean.
              </>
            ) : (
              <>
                {selectedHousehold.name} is tracking at {leakStatus.latestReadingLiters} L today, consistent with your regular household profile.
              </>
            )}
          </p>

          {(isLeak || isHighUsage) && (
            <button
              id="btn-glance-expected-now"
              onClick={() => resetHouseholdBaseline(selectedHousehold.id)}
              className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] underline decoration-[#DCDCDC] underline-offset-2 mt-1.5 inline-block cursor-pointer transition-colors"
            >
              This is expected now (reset baseline)
            </button>
          )}

          {/* Informational burst note */}
          {!isLeak && !isHighUsage && leakStatus.hasUnusualOvernightActivity && leakStatus.unusualActivityNote && (
            <p
              id="glance-overnight-activity-note"
              className="text-xs text-[#8A8A8A] mt-1.5 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px] text-[#8A8A8A]">nights_stay</span>
              <span>{leakStatus.unusualActivityNote}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
