'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';
import StatusFace from '@/components/StatusFace';

export default function GlanceBanner() {
  const { leakStatus, simulateLeak, resetDemoData, isSimulatedLeakActive, selectedHousehold, resetHouseholdBaseline } = useAqua();

  const isLeak = leakStatus.severity === 'LEAK_DETECTED';
  const isHighUsage = leakStatus.severity === 'HIGH_USAGE';

  return (
    <div
      id="glance-banner"
      className={`border rounded-lg p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 ${
        isLeak
          ? 'bg-red-50/40 border-red-200 shadow-sm'
          : isHighUsage
          ? 'bg-amber-50/40 border-amber-200 shadow-sm'
          : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4.5">
        {/* Prominent Level 1 Status Face Icon */}
        <StatusFace severity={leakStatus.severity} />

        {/* Level 1 Status Sentence - LARGEST TEXT ON PAGE */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              id="glance-status-pill"
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                isLeak
                  ? 'bg-red-100 text-red-700'
                  : isHighUsage
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLeak ? 'bg-red-600 animate-ping' : isHighUsage ? 'bg-amber-600' : 'bg-emerald-600'
                }`}
              />
              {isLeak ? 'Leak alert' : isHighUsage ? 'High usage' : 'All clear'}
            </span>
            <span className="text-xs text-slate-500 font-normal">Household status</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-[25px] font-extrabold text-slate-900 tracking-tight leading-snug">
            {isLeak
              ? "Possible leak detected — water is running when no one's using it."
              : isHighUsage
              ? 'Usage is higher than usual — daytime consumption is elevated.'
              : 'All systems normal — no signs of water waste in your home.'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isLeak ? (
              <>
                Continuous flow of{' '}
                <strong className="text-red-700 font-semibold">
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
              className="text-xs text-slate-500 hover:text-slate-800 underline decoration-slate-300 underline-offset-2 mt-1.5 inline-block cursor-pointer transition-colors"
            >
              This is expected now (reset baseline)
            </button>
          )}

          {/* Informational burst note — shown when burst pattern detected but NOT a leak (e.g. Morales guest) */}
          {!isLeak && !isHighUsage && leakStatus.hasUnusualOvernightActivity && leakStatus.unusualActivityNote && (
            <p
              id="glance-overnight-activity-note"
              className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px] text-slate-400">nights_stay</span>
              <span>{leakStatus.unusualActivityNote}</span>
            </p>
          )}
        </div>
      </div>

      {/* Pitch Demo Controls */}
      <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-xl border border-slate-200/80 shadow-xs self-stretch md:self-auto shrink-0">
        <button
          onClick={() => simulateLeak()}
          id="btn-simulate-leak-glance"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            isSimulatedLeakActive
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-red-50 text-error hover:bg-red-100 active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isSimulatedLeakActive ? 'check' : 'bug_report'}
          </span>
          {isSimulatedLeakActive ? 'Leak Active' : 'Simulate Leak'}
        </button>

        <button
          onClick={() => resetDemoData()}
          id="btn-reset-data-glance"
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1"
          title="Reset to clean baseline seed data"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Reset
        </button>
      </div>
    </div>
  );
}
