'use client';

import React from 'react';
import { Zap, RotateCcw, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { useAqua } from '@/context/AquaContext';

export default function DemoControlBar() {
  const {
    selectedHousehold,
    simulateLeak,
    resetDemoData,
    isSimulatedLeakActive,
    setSelectedHouseholdId,
    households
  } = useAqua();

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-4 shadow-sm border border-slate-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Pitch Demo Banner Info */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Live Hackathon Pitch Demo</span>
              {isSimulatedLeakActive ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/30 text-rose-300 border border-rose-500/50">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Leak Injected (+48% across 4 days)
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Clean Baseline
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Target: <strong className="text-white">{selectedHousehold.name}</strong>. Click below to inject a multi-day continuous leak and observe instant detection without waiting for real time.
            </p>
          </div>
        </div>

        {/* Right: Pitch Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => simulateLeak()}
            id="simulate-leak-btn"
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold shadow-md transition transform active:scale-95 ${
              isSimulatedLeakActive
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20 ring-2 ring-amber-300'
                : 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/30'
            }`}
          >
            <Zap className={`w-4 h-4 ${isSimulatedLeakActive ? 'fill-current' : ''}`} />
            <span>{isSimulatedLeakActive ? 'Re-Inject Leak Spikes' : '⚡ Simulate Leak'}</span>
          </button>

          <button
            onClick={resetDemoData}
            id="reset-demo-btn"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo Data</span>
          </button>

          {/* Quick presets for judges */}
          <div className="hidden lg:flex items-center space-x-1.5 pl-2 border-l border-slate-700 text-xs">
            <span className="text-slate-400 text-[11px]">Presets:</span>
            <button
              onClick={() => setSelectedHouseholdId('h-henderson')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                selectedHousehold.id === 'h-henderson'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Henderson (Pitch)
            </button>
            <button
              onClick={() => setSelectedHouseholdId('h-miller')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                selectedHousehold.id === 'h-miller'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Miller (Pre-seeded Leak)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
