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
  } = useAqua();

  return (
    <div className="bg-[#FAFAFA] text-[#1A1A1A] rounded-2xl p-4 sm:p-5 border border-[#DCDCDC]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Pitch Demo Banner Info */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E0E0E0] text-[#1A1A1A] border border-[#DCDCDC] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#1A1A1A]">Pitch Demo Controls</span>
              {isSimulatedLeakActive ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E0E0E0] text-[#1A1A1A] border border-[#DCDCDC]">
                  <AlertTriangle className="w-3 h-3 mr-1 text-[#1A1A1A]" />
                  Leak Injected (+48% across 4 days)
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#E0E0E0] text-[#1A1A1A] border border-[#DCDCDC]">
                  <CheckCircle className="w-3 h-3 mr-1 text-[#1A1A1A]" />
                  Clean Baseline
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Target: <strong className="text-[#1A1A1A]">{selectedHousehold.name}</strong>. Click below to inject a multi-day continuous leak and observe instant anomaly detection.
            </p>
          </div>
        </div>

        {/* Right: Pitch Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => simulateLeak()}
            id="simulate-leak-btn"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition transform active:scale-95 cursor-pointer bg-[#1A1A1A] text-white hover:bg-black shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatedLeakActive ? 'fill-current' : ''}`} />
            <span>{isSimulatedLeakActive ? 'Re-inject leak spikes' : 'Simulate leak'}</span>
          </button>

          <button
            onClick={resetDemoData}
            id="reset-demo-btn"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#E0E0E0] hover:bg-[#D5D5D5] text-[#6B6B6B] hover:text-[#1A1A1A] border border-[#DCDCDC] transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#6B6B6B]" />
            <span>Reset Demo Data</span>
          </button>

          {/* Quick presets */}
          <div className="hidden lg:flex items-center space-x-1.5 pl-2 border-l border-[#DCDCDC] text-xs">
            <span className="text-[#8A8A8A] text-[11px]">Presets:</span>
            <button
              onClick={() => setSelectedHouseholdId('h-henderson')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                selectedHousehold.id === 'h-henderson'
                  ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                  : 'bg-[#E0E0E0] text-[#6B6B6B] hover:text-[#1A1A1A]'
              }`}
            >
              Henderson (Pitch)
            </button>
            <button
              onClick={() => setSelectedHouseholdId('h-miller')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                selectedHousehold.id === 'h-miller'
                  ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                  : 'bg-[#E0E0E0] text-[#6B6B6B] hover:text-[#1A1A1A]'
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
