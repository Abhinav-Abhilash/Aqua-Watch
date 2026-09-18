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
    <div className="bg-[#FFFFFF] text-[#101828] rounded-2xl p-4 sm:p-5 border border-[#E4E7EC] shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Pitch Demo Banner Info */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#101828]">Pitch Demo Controls</span>
              {isSimulatedLeakActive ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3F2] text-[#F04438] border border-[#F04438]/30">
                  <AlertTriangle className="w-3 h-3 mr-1 text-[#F04438]" />
                  Leak Injected (+48% across 4 days)
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#ECFDF3] text-[#12B76A] border border-[#12B76A]/30">
                  <CheckCircle className="w-3 h-3 mr-1 text-[#12B76A]" />
                  Clean Baseline
                </span>
              )}
            </div>
            <p className="text-xs text-[#667085] mt-1">
              Target: <strong className="text-[#101828]">{selectedHousehold.name}</strong>. Click below to inject a multi-day continuous leak and observe instant anomaly detection.
            </p>
          </div>
        </div>

        {/* Right: Pitch Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Primary CTA: Solid Blue #2F6FED with rounded-lg */}
          <button
            onClick={() => simulateLeak()}
            id="simulate-leak-btn"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition transform active:scale-95 cursor-pointer bg-[#2F6FED] hover:bg-[#2458C7] text-white shadow-sm hover:shadow"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatedLeakActive ? 'fill-current' : ''}`} />
            <span>{isSimulatedLeakActive ? 'Re-inject leak spikes' : 'Simulate leak'}</span>
          </button>

          {/* Text-only link: blue text (#2F6FED), no background, underline on hover */}
          <button
            onClick={resetDemoData}
            id="reset-demo-btn"
            className="inline-flex items-center space-x-1.5 px-2 py-1 text-xs font-semibold text-[#2F6FED] hover:underline transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2F6FED]" />
            <span>Reset Demo Data</span>
          </button>

          {/* Quick presets */}
          <div className="hidden lg:flex items-center space-x-1.5 pl-2 border-l border-[#E4E7EC] text-xs">
            <span className="text-[#667085] text-[11px]">Presets:</span>
            <button
              onClick={() => setSelectedHouseholdId('h-henderson')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                selectedHousehold.id === 'h-henderson'
                  ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold border border-[#2F6FED]/20'
                  : 'text-[#667085] hover:text-[#101828] hover:bg-[#F2F4F7]'
              }`}
            >
              Henderson (Pitch)
            </button>
            <button
              onClick={() => setSelectedHouseholdId('h-miller')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                selectedHousehold.id === 'h-miller'
                  ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold border border-[#2F6FED]/20'
                  : 'text-[#667085] hover:text-[#101828] hover:bg-[#F2F4F7]'
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
