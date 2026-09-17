'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, CheckCircle2, ArrowUpRight, Wrench, Droplets } from 'lucide-react';
import { LeakStatus } from '@/types';

interface LeakBannerProps {
  status: LeakStatus;
  householdName: string;
  peerLocality: string;
}

export default function LeakBanner({ status, householdName, peerLocality }: LeakBannerProps) {
  if (status.severity === 'NORMAL') {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-center justify-between transition-all">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-emerald-900">Normal Consumption Pattern</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                Within ±2.5σ
              </span>
            </div>
            <p className="text-xs text-emerald-700 mt-0.5">
              Current daily usage ({status.latestReadingLiters} L) aligns with the 14-day rolling average ({status.rollingAvgLiters} L) and {peerLocality} peers.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center text-xs text-emerald-800 font-medium space-x-1 bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-200/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>No anomalies detected</span>
        </div>
      </div>
    );
  }

  if (status.severity === 'HIGH_USAGE') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-amber-900">Single-Day Spike Detected (Monitoring)</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-200/80 text-amber-900">
                  Day 1 of 2
                </span>
                <span className="text-xs text-amber-700 font-medium">
                  +{status.estimatedExcessLitersPerDay} L above rolling average
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Reading was {status.latestReadingLiters} L (expected ~{status.rollingAvgLiters} L). Single-day anomalies are filtered to allow for periodic activities (gardening, car wash). System is watching for consecutive elevated readings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Leak Detected Banner
  return (
    <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-5 shadow-xs transition-all animate-in fade-in-50 duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* Main Alert Info */}
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-rose-500/20">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-rose-950 flex items-center space-x-2">
                <span>Possible Leak Detected</span>
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-200 text-rose-900 border border-rose-300">
                CRITICAL ALERT
              </span>
              <span className="text-xs font-semibold text-rose-800 bg-white/80 px-2 py-0.5 rounded border border-rose-200">
                {status.consecutiveDays} Consecutive Days Elevated
              </span>
            </div>

            <p className="text-xs font-medium text-rose-900 mt-1.5 leading-relaxed">
              {status.explanation}
            </p>

            {/* Peer Divergence Validation */}
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center font-semibold text-rose-800 bg-rose-100/90 px-2.5 py-1 rounded-md">
                <Droplets className="w-3.5 h-3.5 mr-1 text-rose-600" />
                Est. Excess: ~{status.estimatedExcessLitersPerDay} Liters / Day
              </span>

              {status.anomalyStartDate && (
                <span className="text-slate-600 bg-white/70 px-2 py-1 rounded border border-rose-200/70">
                  Anomaly started: <strong>{status.anomalyStartDate}</strong>
                </span>
              )}

              <span className="text-slate-600 bg-white/70 px-2 py-1 rounded border border-rose-200/70">
                Peer Variance: <strong>{status.peerComparisonDiffPercent > 0 ? `+${status.peerComparisonDiffPercent}%` : `${status.peerComparisonDiffPercent}%`} vs {peerLocality} avg</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:border-l lg:border-rose-200 lg:pl-6 flex flex-col justify-center space-y-2 flex-shrink-0">
          <div className="text-xs font-semibold text-rose-950 flex items-center space-x-1.5">
            <Wrench className="w-3.5 h-3.5 text-rose-700" />
            <span>Recommended Checks:</span>
          </div>
          <ul className="text-[11px] text-rose-800 space-y-0.5 list-disc list-inside">
            <li>Check toilet tank flapper valve (silent run)</li>
            <li>Inspect exterior hose bibs & irrigation solenoids</li>
            <li>Examine water heater pressure relief valve</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
