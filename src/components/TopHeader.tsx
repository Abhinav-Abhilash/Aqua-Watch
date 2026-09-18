'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';
import UserAvatarDropdown from '@/components/UserAvatarDropdown';
import ThemeToggleSwitch from '@/components/ThemeToggleSwitch';

interface TopHeaderProps {
  onOpenLogReading: () => void;
}

export default function TopHeader({ onOpenLogReading }: TopHeaderProps) {
  const { households, selectedHouseholdId, setSelectedHouseholdId, toggleMobileMenu, theme, toggleTheme } = useAqua();

  return (
    <header className="sticky top-0 w-full min-h-[3.5rem] bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#E4E7EC] z-30 flex flex-wrap items-center justify-between gap-2.5 px-4 sm:px-6 py-2.5 shadow-xs">

      {/* Left */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-[#667085] hover:text-[#101828] hover:bg-[#F2F4F7] transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Household Selector Pill */}
        <div className="relative flex items-center min-w-0 bg-[#F8F9FB] hover:bg-[#F2F4F7] transition-colors px-3.5 py-1.5 rounded-lg border border-[#E4E7EC]">
          <select
            id="header-household-select"
            value={selectedHouseholdId}
            onChange={(e) => setSelectedHouseholdId(e.target.value)}
            className="appearance-none font-semibold text-xs sm:text-sm text-[#101828] bg-transparent cursor-pointer pr-6 focus:outline-none max-w-[12rem] sm:max-w-xs md:max-w-md truncate"
          >
            {households.map(h => (
              <option key={h.id} value={h.id} className="bg-white text-[#101828]">
                {h.name} — {h.locality}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined text-[#667085] text-[18px] pointer-events-none absolute right-2">
            expand_more
          </span>
        </div>

        {/* Monitored Active Badge — Green dot + green pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF3] text-[#12B76A] font-semibold text-xs border border-[#12B76A]/20 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
          <span>Monitored Active</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
        <span className="text-xs text-[#667085] hidden sm:inline">Last sync 2m ago</span>
        
        {/* Solid Blue Button with standard rounded corners */}
        <button
          onClick={onOpenLogReading}
          id="btn-log-reading-header"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2F6FED] hover:bg-[#2458C7] text-white transition-all text-xs font-semibold shadow-sm hover:shadow cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          <span>Log Reading</span>
        </button>

        {/* Pill-shaped Sun/Moon Theme Toggle Switch */}
        <ThemeToggleSwitch id="header-theme-toggle-switch" />

        {/* User Profile Avatar Dropdown */}
        <UserAvatarDropdown
          placement="down"
          align="right"
          triggerSize="md"
          idPrefix="header"
        />
      </div>
    </header>
  );
}
