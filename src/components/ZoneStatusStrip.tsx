'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

export default function ZoneStatusStrip() {
  const { leakStatus } = useAqua();
  const isLeak = leakStatus.severity === 'LEAK_DETECTED';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      
      {/* Zone 1 */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">Zone 1: Kitchen</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <div className="my-2">
          <div className="text-lg font-bold text-slate-900">0.0 L/m</div>
          <span className="text-xs text-emerald-600 font-medium">Idle normal</span>
        </div>
        <div className="h-5 w-full flex items-end gap-1">
          <span className="w-1/6 bg-slate-100 h-2 rounded-xs" />
          <span className="w-1/6 bg-slate-100 h-4 rounded-xs" />
          <span className="w-1/6 bg-slate-100 h-3 rounded-xs" />
          <span className="w-1/6 bg-slate-100 h-5 rounded-xs" />
          <span className="w-1/6 bg-slate-100 h-2 rounded-xs" />
          <span className="w-1/6 bg-primary-container h-1 rounded-xs" />
        </div>
      </div>

      {/* Zone 2 (Reactive to Leak) */}
      <div
        className={`p-4 rounded-lg shadow-none flex flex-col justify-between transition-all ${
          isLeak
            ? 'bg-red-50/60 border border-red-300'
            : 'bg-white border border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <span className={`font-semibold ${isLeak ? 'text-error' : 'text-slate-500'}`}>
            Zone 2: Irrigation
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              isLeak ? 'bg-error animate-pulse' : 'bg-emerald-500'
            }`}
          />
        </div>
        <div className="my-2">
          <div className={`text-lg font-bold ${isLeak ? 'text-error' : 'text-slate-900'}`}>
            {isLeak ? '4.8 L/m' : '0.4 L/m'}
          </div>
          <span className={`text-xs font-medium ${isLeak ? 'text-error' : 'text-slate-500'}`}>
            {isLeak ? '+310% abnormal' : 'Low flow steady'}
          </span>
        </div>
        <div className="h-5 w-full flex items-end gap-1">
          {isLeak ? (
            <>
              <span className="w-1/6 bg-red-200 h-3 rounded-xs" />
              <span className="w-1/6 bg-red-300 h-4 rounded-xs" />
              <span className="w-1/6 bg-red-400 h-5 rounded-xs" />
              <span className="w-1/6 bg-red-500 h-5 rounded-xs" />
              <span className="w-1/6 bg-red-600 h-5 rounded-xs" />
              <span className="w-1/6 bg-red-700 h-5 rounded-xs" />
            </>
          ) : (
            <>
              <span className="w-1/6 bg-slate-100 h-2 rounded-xs" />
              <span className="w-1/6 bg-slate-100 h-2 rounded-xs" />
              <span className="w-1/6 bg-slate-100 h-3 rounded-xs" />
              <span className="w-1/6 bg-slate-100 h-2 rounded-xs" />
              <span className="w-1/6 bg-primary-container h-3 rounded-xs" />
              <span className="w-1/6 bg-primary-container h-2 rounded-xs" />
            </>
          )}
        </div>
      </div>

      {/* Zone 3 */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">Zone 3: Bath</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <div className="my-2">
          <div className="text-lg font-bold text-slate-900">1.2 L/m</div>
          <span className="text-xs text-slate-500 font-medium">Standard load</span>
        </div>
        <div className="h-5 w-full flex items-end gap-1">
          <span className="w-1/6 bg-slate-100 h-4 rounded-xs" />
          <span className="w-1/6 bg-slate-100 h-3 rounded-xs" />
          <span className="w-1/6 bg-slate-100 h-5 rounded-xs" />
          <span className="w-1/6 bg-slate-100 h-4 rounded-xs" />
          <span className="w-1/6 bg-slate-100 h-2 rounded-xs" />
          <span className="w-1/6 bg-primary-container h-3 rounded-xs" />
        </div>
      </div>

    </div>
  );
}
