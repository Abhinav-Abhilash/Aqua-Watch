'use client';

import React from 'react';

export default function AppFooter() {
  return (
    <footer className="w-full py-2.5 px-6 border-t border-slate-200/70 bg-white text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1 z-20 shrink-0">
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-slate-700">
          AquaWatch — Smart Water Ledger
        </span>
      </div>
      <div className="text-[11px] text-slate-400">
        Built with Antigravity, Stitch, Claude
      </div>
    </footer>
  );
}
