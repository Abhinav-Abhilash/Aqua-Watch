'use client';

import React from 'react';

interface StatusFaceProps {
  severity: 'NORMAL' | 'HIGH_USAGE' | 'WATCH' | 'LEAK_DETECTED';
}

export default function StatusFace({ severity }: StatusFaceProps) {
  // LEAK: Red #F04438 droplet icon on light red #FEF3F2
  if (severity === 'LEAK_DETECTED') {
    return (
      <div
        id="status-face-alert"
        aria-label="Alert status indicator"
        className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all bg-[#FEF3F2] border border-[#F04438]/30 shadow-[0_4px_12px_rgba(240,68,56,0.15)]"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="animate-bounce">
          <defs>
            <radialGradient id="leakDropGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDA29B" />
              <stop offset="40%" stopColor="#F04438" />
              <stop offset="100%" stopColor="#B42318" />
            </radialGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#F04438" floodOpacity="0.35" />
            </filter>
          </defs>
          {/* Droplet Body in Red #F04438 */}
          <path
            d="M16 4 C16 4 7 15 7 21.5 C7 26.5 11 30 16 30 C21 30 25 26.5 25 21.5 C25 15 16 4 16 4 Z"
            fill="url(#leakDropGrad)"
            filter="url(#dropShadow)"
          />
          {/* Crisp Specular Water Highlight Glint #FFFFFF */}
          <ellipse cx="12" cy="18" rx="2.5" ry="5" transform="rotate(-25 12 18)" fill="#FFFFFF" opacity="0.85" />
          <circle cx="18" cy="24" r="1.5" fill="#FFFFFF" opacity="0.6" />
        </svg>
      </div>
    );
  }

  // HIGH USAGE: Vibrant Amber #F79009 triangle indicator on light amber #FFFAEB
  if (severity === 'HIGH_USAGE' || severity === 'WATCH') {
    return (
      <div
        id="status-face-elevated"
        aria-label="Elevated usage indicator"
        className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all bg-[#FFFAEB] border border-[#F79009]/30 shadow-[0_4px_10px_rgba(247,144,9,0.12)]"
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <defs>
            <linearGradient id="highUsageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEC84B" />
              <stop offset="100%" stopColor="#F79009" />
            </linearGradient>
            <filter id="triShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#F79009" floodOpacity="0.3" />
            </filter>
          </defs>
          <path
            d="M15 5 L26 24 L4 24 Z"
            fill="url(#highUsageGrad)"
            stroke="#B54708"
            strokeWidth="1.5"
            strokeLinejoin="round"
            filter="url(#triShadow)"
          />
          {/* Inner Exclamation point in White */}
          <line x1="15" y1="11" x2="15" y2="17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="15" cy="20.5" r="1.2" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // NORMAL: Green #12B76A sphere with white checkmark on light green #ECFDF3
  return (
    <div
      id="status-face-calm"
      aria-label="Normal status indicator"
      className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all bg-[#ECFDF3] border border-[#12B76A]/30 shadow-[0_3px_8px_rgba(18,183,106,0.12)]"
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <radialGradient id="normalGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#6CE9A6" />
            <stop offset="60%" stopColor="#12B76A" />
            <stop offset="100%" stopColor="#027A48" />
          </radialGradient>
          <filter id="normShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#12B76A" floodOpacity="0.3" />
          </filter>
        </defs>
        {/* Green spherical badge */}
        <circle cx="14" cy="14" r="11" fill="url(#normalGrad)" filter="url(#normShadow)" stroke="#027A48" strokeWidth="0.8" />
        {/* Crisp checkmark highlight in #FFFFFF */}
        <path
          d="M9.5 14 L12.5 17 L18.5 11"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Gentle sphere glint */}
        <ellipse cx="11" cy="9" rx="3.5" ry="1.8" transform="rotate(-30 11 9)" fill="#FFFFFF" opacity="0.45" />
      </svg>
    </div>
  );
}
