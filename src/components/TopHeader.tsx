'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

interface TopHeaderProps {
  onOpenLogReading: () => void;
}

export default function TopHeader({ onOpenLogReading }: TopHeaderProps) {
  const { households, selectedHouseholdId, setSelectedHouseholdId, toggleMobileMenu } = useAqua();

  return (
    <header className="sticky top-0 w-full min-h-[3.5rem] bg-[#FAFAFA]/95 backdrop-blur-xl border-b border-[#DCDCDC] z-30 flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-6 py-2.5">

      {/* Left */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-1.5 rounded-full text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#E0E0E0] transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Household Selector Pill */}
        <div className="relative flex items-center min-w-0 bg-[#E0E0E0] hover:bg-[#D5D5D5] transition-colors px-3 py-1.5 rounded-full border border-[#DCDCDC]">
          <select
            id="header-household-select"
            value={selectedHouseholdId}
            onChange={(e) => setSelectedHouseholdId(e.target.value)}
            className="appearance-none font-semibold text-xs sm:text-sm text-[#1A1A1A] bg-transparent cursor-pointer pr-6 focus:outline-none max-w-[12rem] sm:max-w-xs md:max-w-md truncate"
          >
            {households.map(h => (
              <option key={h.id} value={h.id} className="bg-white text-[#1A1A1A]">
                {h.name} — {h.locality}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined text-[#6B6B6B] text-[18px] pointer-events-none absolute right-2">
            expand_more
          </span>
        </div>

        {/* Monitored Active Badge — Simple near-black dot */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E0E0E0] text-[#6B6B6B] font-medium text-xs border border-[#DCDCDC] shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#1A1A1A]" />
          <span>Monitored Active</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
        <span className="text-xs text-[#8A8A8A] hidden sm:inline">Last sync 2m ago</span>
        
        {/* Solid Black Pill Button */}
        <button
          onClick={onOpenLogReading}
          id="btn-log-reading-header"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-all text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          <span>Log Reading</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white font-bold text-xs flex items-center justify-center border border-[#1A1A1A] shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
          SJ
        </div>
      </div>
    </header>
  );
}
