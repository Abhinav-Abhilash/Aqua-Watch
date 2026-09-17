'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAqua } from '@/context/AquaContext';

export default function Header() {
  const pathname = usePathname();
  const { allActiveAlerts, simulateLeak, resetDemoData, isSimulatedLeakActive, selectedHousehold } = useAqua();

  const activeAlertCount = allActiveAlerts.length;

  return (
    <header className="w-full bg-[#FAF8F3] border-b border-primary/30 z-30 sticky top-0 font-mono">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2">
        
        {/* Topmost Folio Strip */}
        <div className="flex items-center justify-between text-[10px] text-on-surface-variant pb-1 border-b border-primary/10">
          <span>sheet fol. 42-B // page 18 of 50</span>
          <span>ledger no. 04-2026 (q3 audit)</span>
          <span className="hidden sm:inline">cycle ref: 2026-w38 / 14-day cycle</span>
        </div>

        {/* Main Ledger Title & Pitch Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1.5 pb-1 gap-2">
          <div className="flex items-baseline gap-2">
            <Link href="/" className="font-bold text-[16px] lowercase tracking-tight text-primary hover:text-secondary transition">
              aquawatch — household water ledger
            </Link>
            <span className="text-[10px] text-on-surface-variant">
              [ id: {selectedHousehold?.id?.replace('h-', '') || '882-01a'} ]
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px]">
            <button
              onClick={() => simulateLeak()}
              id="header-simulate-leak"
              className={`px-2 py-0.5 border text-[11px] font-medium transition ${
                isSimulatedLeakActive
                  ? 'border-secondary bg-secondary text-background hover:bg-secondary/90'
                  : 'border-secondary text-secondary hover:bg-secondary hover:text-background'
              }`}
            >
              {isSimulatedLeakActive ? '[ leak active (re-inject) ]' : '[ simulate leak ]'}
            </button>

            <span className="text-outline-variant">/</span>

            <button
              onClick={resetDemoData}
              id="header-reset-demo"
              className="text-on-surface-variant hover:text-primary underline text-[11px]"
            >
              [ reset demo ]
            </button>

            <span className="text-outline-variant hidden sm:inline">/</span>
            <span className="text-[10px] text-outline hidden sm:inline">[ clk: #092 ]</span>
          </div>
        </div>

        {/* Ledger Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 text-[12px] border-t border-primary/10 mt-1">
          <nav className="flex items-center flex-wrap gap-2 py-0.5">
            <Link
              href="/"
              className={`transition ${
                pathname === '/'
                  ? 'text-primary font-bold underline'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              [ reading &amp; logbook ]
            </Link>

            <span className="text-outline-variant">/</span>

            <Link
              href="/alerts"
              className={`transition flex items-center gap-1 ${
                pathname === '/alerts'
                  ? 'text-primary font-bold underline'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span>[ flagged households ({activeAlertCount}) ]</span>
              {activeAlertCount > 0 && (
                <span className="text-secondary font-bold text-[11px]">*</span>
              )}
            </Link>

            <span className="text-outline-variant">/</span>

            <Link
              href="/onboarding"
              className={`transition ${
                pathname === '/onboarding'
                  ? 'text-primary font-bold underline'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              [ + register household ]
            </Link>
          </nav>

          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest hidden sm:inline">
            operator: municipal auditor [signed]
          </span>
        </div>

      </div>
    </header>
  );
}
