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
      className={`rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 bg-[#FFFFFF] border border-[#E4E7EC] shadow-xs ${
        isLeak
          ? 'border-l-4 border-l-[#F04438] bg-[#FEF3F2]/40'
          : ''
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4.5">
        <StatusFace severity={leakStatus.severity} />

        {/* Status Sentence - LARGEST TEXT ON PAGE */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              id="glance-status-pill"
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium border ${
                isLeak
                  ? 'bg-[#FEF3F2] text-[#F04438] border-[#F04438]/30 font-semibold'
                  : isHighUsage
                  ? 'bg-[#FFFAEB] text-[#F79009] border-[#F79009]/30 font-semibold'
                  : 'bg-[#ECFDF3] text-[#12B76A] border-[#12B76A]/30 font-semibold'
              }`}
            >
              {isLeak ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F04438] animate-ping" />
              ) : isHighUsage ? (
                <span className="material-symbols-outlined text-[12px] text-[#F79009]">change_history</span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
              )}
              {isLeak ? 'Leak alert' : isHighUsage ? 'Usage is higher than usual' : 'All clear'}
            </span>
            <span className="text-xs text-[#667085] font-normal">Household status</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-[24px] font-extrabold text-[#101828] tracking-tight leading-snug">
            {isLeak
              ? "Possible leak detected — water is running when no one's using it."
              : isHighUsage
              ? 'Usage is higher than usual — daytime consumption is elevated.'
              : 'All systems normal — no signs of water waste in your home.'}
          </h1>

          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            {isLeak ? (
              <>
                Continuous flow of{' '}
                <strong className="text-[#F04438] font-semibold">
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
              className="text-xs text-[#2F6FED] hover:underline mt-1.5 inline-block cursor-pointer transition-colors"
            >
              This is expected now (reset baseline)
            </button>
          )}

          {/* Informational burst note */}
          {!isLeak && !isHighUsage && leakStatus.hasUnusualOvernightActivity && leakStatus.unusualActivityNote && (
            <p
              id="glance-overnight-activity-note"
              className="text-xs text-[#667085] mt-1.5 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px] text-[#2F6FED]">nights_stay</span>
              <span>{leakStatus.unusualActivityNote}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
