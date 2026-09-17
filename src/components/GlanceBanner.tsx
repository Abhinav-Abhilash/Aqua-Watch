'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';
import StatusFace from '@/components/StatusFace';

export default function GlanceBanner() {
  const { leakStatus, simulateLeak, resetDemoData, isSimulatedLeakActive, selectedHousehold } = useAqua();

  const isLeak = leakStatus.severity === 'LEAK_DETECTED';
  const isHighUsage = leakStatus.severity === 'HIGH_USAGE';

  return (
    <div
      id="glance-banner"
      className={`border rounded-2xl shadow-xs p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 ${
        isLeak
          ? 'bg-gradient-to-r from-red-50/90 via-white to-slate-50 border-red-200'
          : isHighUsage
          ? 'bg-gradient-to-r from-amber-50/90 via-white to-slate-50 border-amber-200'
          : 'bg-gradient-to-r from-emerald-50/70 via-white to-slate-50 border-emerald-200/80'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Swapping Status Face Indicator */}
        <StatusFace severity={leakStatus.severity} />

        {/* Narrative */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              id="glance-status-pill"
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isLeak
                  ? 'bg-red-100 text-error'
                  : isHighUsage
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLeak
                    ? 'bg-error animate-ping'
                    : isHighUsage
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              {isLeak ? 'Leak Detected' : isHighUsage ? 'Higher Usage' : 'All Clear'}
            </span>
            <span className="text-xs text-slate-500 font-medium">Glance Overview</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            {isLeak
              ? "Possible leak — water is running when no one's using it"
              : isHighUsage
              ? 'Usage is higher than usual — daytime draw elevated'
              : 'Pipes intact & optimal — steady baseline consumption profile'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {isLeak ? (
              <>
                Continuous excess of{' '}
                <strong className="text-error font-semibold">
                  +{leakStatus.estimatedExcessLitersPerDay} L/day
                </strong>{' '}
                persisting for {leakStatus.consecutiveDays} days. Take a quick look below to inspect fixtures.
              </>
            ) : isHighUsage ? (
              <>
                Daytime usage elevated (+{leakStatus.estimatedExcessLitersPerDay} L/day) for {leakStatus.consecutiveDays} days. Overnight flow remains clean at ~{Math.round(leakStatus.rollingOvernightAvgLiters)} L.
              </>
            ) : (
              <>
                {selectedHousehold.name} is tracking at {leakStatus.latestReadingLiters} L/day (within ±2.5σ of the {Math.round(leakStatus.rollingAvgLiters)} L 14-day baseline, σ = {leakStatus.rollingStdDev} L).
              </>
            )}
          </p>
        </div>
      </div>

      {/* Pitch Demo Controls */}
      <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-xl border border-slate-200/80 shadow-xs self-stretch md:self-auto shrink-0">
        <button
          onClick={() => simulateLeak()}
          id="btn-simulate-leak-glance"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            isSimulatedLeakActive
              ? 'bg-amber-50 text-amber-900 border border-amber-300'
              : 'bg-red-600 text-white hover:bg-red-700 shadow-xs'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          <span>{isSimulatedLeakActive ? 'Leak Active (Re-inject)' : 'Simulate Leak'}</span>
        </button>

        <button
          onClick={resetDemoData}
          id="btn-reset-glance"
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>Reset Demo</span>
        </button>
      </div>

    </div>
  );
}
