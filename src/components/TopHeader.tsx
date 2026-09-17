'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

interface TopHeaderProps {
  onOpenLogReading: () => void;
}

export default function TopHeader({ onOpenLogReading }: TopHeaderProps) {
  const { households, selectedHouseholdId, setSelectedHouseholdId, selectedHousehold, allActiveAlerts, toggleMobileMenu } = useAqua();

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-3 sm:px-8">
      
      {/* Left: Mobile Hamburger + Household Selector & Search */}
      <div className="flex items-center gap-2 sm:gap-6 min-w-0">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="relative flex items-center min-w-0">
          <select
            id="header-household-select"
            value={selectedHouseholdId}
            onChange={(e) => setSelectedHouseholdId(e.target.value)}
            className="appearance-none font-bold text-xs sm:text-sm md:text-base text-slate-900 bg-transparent hover:text-primary transition-colors cursor-pointer pr-6 py-1 focus:outline-none max-w-[170px] xs:max-w-[220px] sm:max-w-xs md:max-w-md truncate"
          >
            {households.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} — {h.locality}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined text-slate-400 text-[20px] pointer-events-none absolute right-0">
            arrow_drop_down
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Monitored Active</span>
        </div>

        <div className="relative hidden xl:flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Filter telemetry or nodes..."
            className="bg-slate-100/80 pl-8 pr-3 py-1.5 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-primary-container/20 w-52"
          />
        </div>
      </div>

      {/* Right: Quick actions & user */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <span className="text-xs text-slate-400 hidden md:inline">Last sync 2m ago</span>

        <button
          onClick={onOpenLogReading}
          id="btn-log-reading-header"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-container text-white hover:bg-primary transition-colors text-xs font-semibold shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Log Reading</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300">
          SJ
        </div>
      </div>

    </header>
  );
}
