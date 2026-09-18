'use client';

import React from 'react';

export default function AppFooter() {
  return (
    <footer className="w-full py-3 px-6 border-t border-[#E4E7EC] bg-[#FFFFFF] text-center text-xs text-[#667085] flex flex-wrap items-center justify-between gap-1 z-20 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <path d="M16 3C16 3 7 14.5 7 21C7 25.9706 11.0294 30 16 30C20.9706 30 25 25.9706 25 21C25 14.5 16 3 16 3Z" fill="#2F6FED"/>
            <path d="M16 7C16 7 10 15.5 10 20.5C10 24.0899 12.6863 27 16 27C17.2 27 18.3 26.6 19.2 25.9C18.2 25.4 17.5 24.3 17.5 23C17.5 21.3 18.8 20 20.5 20C21.4 20 22.2 20.4 22.7 21C22.9 20.3 23 19.7 23 19C23 14 16 7 16 7Z" fill="#1D4ED8" opacity="0.35"/>
            <circle cx="13" cy="22" r="2.5" fill="#FFFFFF" opacity="0.9"/>
          </svg>
        </div>
        <span className="font-medium text-[#101828]">
          AquaWatch — Smart Water Ledger
        </span>
      </div>
    </footer>
  );
}
