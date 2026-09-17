'use client';

import React from 'react';

interface StatusFaceProps {
  severity: 'NORMAL' | 'HIGH_USAGE' | 'WATCH' | 'LEAK_DETECTED';
}

export default function StatusFace({ severity }: StatusFaceProps) {
  if (severity === 'LEAK_DETECTED') {
    return (
      <div
        id="status-face-alert"
        aria-label="Alert status face"
        className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-lg bg-red-50 flex items-center justify-center border border-red-200 transition-colors duration-200"
      >
        <svg className="w-10 h-10" fill="none" viewBox="0 0 36 36">
          {/* Cheeks */}
          <circle cx="9" cy="22" fill="#FCA5A5" opacity="0.6" r="2.5" />
          <circle cx="27" cy="22" fill="#FCA5A5" opacity="0.6" r="2.5" />
          {/* Slanted Worried Eyebrows */}
          <path d="M9 11.5L14.5 13.5" stroke="#BA1A1A" strokeLinecap="round" strokeWidth="2" />
          <path d="M27 11.5L21.5 13.5" stroke="#BA1A1A" strokeLinecap="round" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="12" cy="17" fill="#BA1A1A" r="2.5" />
          <circle cx="24" cy="17" fill="#BA1A1A" r="2.5" />
          {/* Downward Wavy Worried Mouth */}
          <path d="M12.5 26.5C14.5 24 17 24 18 24C19 24 21.5 24 23.5 26.5" fill="none" stroke="#BA1A1A" strokeLinecap="round" strokeWidth="2.2" />
          {/* Sweat / Water drop on brow */}
          <path d="M28 8.5C28 8.5 26 11 26 12C26 13.1 26.9 14 28 14C29.1 14 30 13.1 30 12C30 11 28 8.5 28 8.5Z" fill="#2F6FED" />
        </svg>
      </div>
    );
  }

  if (severity === 'HIGH_USAGE' || severity === 'WATCH') {
    return (
      <div
        id="status-face-elevated"
        aria-label="Elevated status face"
        className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-200 transition-colors duration-200"
      >
        <svg className="w-10 h-10" fill="none" viewBox="0 0 36 36">
          <circle cx="9" cy="22" fill="#FDE68A" opacity="0.7" r="2.5" />
          <circle cx="27" cy="22" fill="#FDE68A" opacity="0.7" r="2.5" />
          {/* Curious Eyebrows */}
          <path d="M10 12L15 11.5" stroke="#B45309" strokeLinecap="round" strokeWidth="2" />
          <path d="M21 11.5L26 12" stroke="#B45309" strokeLinecap="round" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="12" cy="16.5" fill="#B45309" r="2.4" />
          <circle cx="24" cy="16.5" fill="#B45309" r="2.4" />
          {/* Inquisitive / Surprised O-Mouth */}
          <ellipse cx="18" cy="24" fill="none" rx="3.5" ry="4" stroke="#B45309" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // NORMAL / CHEERFUL (Calm)
  return (
    <div
      id="status-face-calm"
      aria-label="Calm status face"
      className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-200 transition-colors duration-200"
    >
      <svg className="w-10 h-10" fill="none" viewBox="0 0 36 36">
        <circle cx="9" cy="21" fill="#A7F3D0" opacity="0.6" r="2.5" />
        <circle cx="27" cy="21" fill="#A7F3D0" opacity="0.6" r="2.5" />
        {/* Calm Eyebrows */}
        <path d="M9.5 12C11.5 11.2 13.5 11.2 15 12" stroke="#006C3C" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M21 12C22.5 11.2 24.5 11.2 26.5 12" stroke="#006C3C" strokeLinecap="round" strokeWidth="1.8" />
        {/* Cheerful Eyes */}
        <circle cx="12" cy="16.5" fill="#006C3C" r="2.2" />
        <circle cx="24" cy="16.5" fill="#006C3C" r="2.2" />
        {/* Happy Smile */}
        <path d="M11 22C13 26 23 26 25 22" fill="none" stroke="#006C3C" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    </div>
  );
}
