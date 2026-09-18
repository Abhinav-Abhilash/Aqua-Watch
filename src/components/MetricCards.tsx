'use client';

import React from 'react';
import { Activity, Users, Droplets, AlertOctagon, TrendingUp, TrendingDown } from 'lucide-react';
import { LeakStatus, Household } from '@/types';

interface MetricCardsProps {
  status: LeakStatus;
  household: Household;
}

export default function MetricCards({ status, household }: MetricCardsProps) {
  const diffFromRolling = status.latestReadingLiters - status.rollingAvgLiters;
  const isUpFromRolling = diffFromRolling > 0;
  const percentFromRolling = status.rollingAvgLiters > 0
    ? Math.round((Math.abs(diffFromRolling) / status.rollingAvgLiters) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Today's Consumption */}
      <div className="bg-white dark:bg-[#1E2128] rounded-xl p-5 border border-slate-200 dark:border-[#2A2D35] shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-[#9AA0AC]">
          <span className="text-xs font-medium text-slate-600 dark:text-[#9AA0AC]">Latest reading</span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-[rgba(91,141,239,0.15)] flex items-center justify-center text-sky-600 dark:text-[#5B8DEF]">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-[#F0F1F3] tracking-tight">
            {status.latestReadingLiters.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-[#9AA0AC]">L / day</span>
        </div>
        <div className="mt-2 flex items-center text-xs">
          {isUpFromRolling ? (
            <span className={`inline-flex items-center font-medium ${status.severity === 'LEAK_DETECTED' ? 'text-rose-600 dark:text-[#F97066]' : 'text-amber-600 dark:text-[#FDB022]'}`}>
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              +{percentFromRolling}% vs 14d baseline
            </span>
          ) : (
            <span className="inline-flex items-center font-medium text-emerald-600 dark:text-[#32D583]">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              -{percentFromRolling}% vs 14d baseline
            </span>
          )}
        </div>
      </div>

      {/* Card 2: 14-Day Rolling Baseline */}
      <div className="bg-white dark:bg-[#1E2128] rounded-xl p-5 border border-slate-200 dark:border-[#2A2D35] shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-[#9AA0AC]">
          <span className="text-xs font-medium text-slate-600 dark:text-[#9AA0AC]">14-day baseline</span>
          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#242832] flex items-center justify-center text-slate-600 dark:text-[#9AA0AC]">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-[#F0F1F3] tracking-tight">
            {Math.round(status.rollingAvgLiters).toLocaleString()}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-[#9AA0AC]">L / day</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-[#9AA0AC]">
          ~{Math.round(status.rollingAvgLiters / (household.occupants || 1))} L / occupant / day
        </div>
      </div>

      {/* Card 3: Peer Group Benchmark */}
      <div className="bg-white dark:bg-[#1E2128] rounded-xl p-5 border border-slate-200 dark:border-[#2A2D35] shadow-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-[#9AA0AC]">
          <span className="text-xs font-medium text-slate-600 dark:text-[#9AA0AC]">Peer group benchmark</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-[rgba(91,141,239,0.15)] flex items-center justify-center text-indigo-600 dark:text-[#5B8DEF]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className={`text-2xl font-extrabold tracking-tight ${
            status.peerComparisonDiffPercent > 25 ? 'text-rose-600 dark:text-[#F97066]' : 'text-slate-900 dark:text-[#F0F1F3]'
          }`}>
            {status.peerComparisonDiffPercent > 0 ? `+${status.peerComparisonDiffPercent}%` : `${status.peerComparisonDiffPercent}%`}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-[#9AA0AC]">vs {household.locality} peers</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-[#9AA0AC] truncate">
          Similar size ({household.occupants} occupants) in locality
        </div>
      </div>

      {/* Card 4: Statistical Health Status */}
      <div className={`rounded-xl p-5 border shadow-xs transition ${
        status.severity === 'LEAK_DETECTED'
          ? 'bg-rose-50/70 border-rose-300 dark:bg-[rgba(249,112,102,0.15)] dark:border-[#F97066]/35'
          : status.severity === 'HIGH_USAGE'
          ? 'bg-amber-50/70 border-amber-300 dark:bg-[rgba(253,176,34,0.15)] dark:border-[#FDB022]/35'
          : 'bg-emerald-50/60 border-emerald-200 dark:bg-[rgba(50,213,131,0.15)] dark:border-[#32D583]/35'
      }`}>
        <div className="flex items-center justify-between text-slate-500 dark:text-[#9AA0AC]">
          <span className="text-xs font-medium text-slate-600 dark:text-[#9AA0AC]">Health status</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            status.severity === 'LEAK_DETECTED'
              ? 'bg-rose-200 text-rose-800 dark:bg-[#F97066]/20 dark:text-[#F97066]'
              : status.severity === 'HIGH_USAGE'
              ? 'bg-amber-200 text-amber-800 dark:bg-[#FDB022]/20 dark:text-[#FDB022]'
              : 'bg-emerald-200 text-emerald-800 dark:bg-[#32D583]/20 dark:text-[#32D583]'
          }`}>
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              status.severity === 'LEAK_DETECTED'
                ? 'bg-rose-600 dark:bg-[#F97066] animate-ping'
                : status.severity === 'HIGH_USAGE'
                ? 'bg-amber-500 dark:bg-[#FDB022]'
                : 'bg-emerald-500 dark:bg-[#32D583]'
            }`} />
            <span className={`text-base font-bold ${
              status.severity === 'LEAK_DETECTED'
                ? 'text-rose-900 dark:text-[#F97066]'
                : status.severity === 'HIGH_USAGE'
                ? 'text-amber-900 dark:text-[#FDB022]'
                : 'text-emerald-900 dark:text-[#32D583]'
            }`}>
              {status.severity === 'LEAK_DETECTED'
                ? 'Leak Triggered'
                : status.severity === 'HIGH_USAGE'
                ? 'Elevated Usage'
                : 'Normal Consumption'}
            </span>
          </div>
        </div>
        <div className="mt-2 text-xs font-medium text-slate-600 dark:text-[#9AA0AC]">
          {status.severity === 'LEAK_DETECTED'
            ? `${status.consecutiveDays} days > 2.5σ threshold`
            : status.severity === 'HIGH_USAGE'
            ? `${status.consecutiveDays} days elevated domestic draw`
            : 'Variance within statistical bounds'}
        </div>
      </div>

    </div>
  );
}
