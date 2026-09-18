'use client';

import React from 'react';

interface StatusFaceProps {
  severity: 'NORMAL' | 'HIGH_USAGE' | 'WATCH' | 'LEAK_DETECTED';
}

export default function StatusFace({ severity }: StatusFaceProps) {
  // LEAK: Muted brick-red #B8564A droplet icon with dimensional shading on the leak alert card
  if (severity === 'LEAK_DETECTED') {
    return (
      <div
        id="status-face-alert"
        aria-label="Alert status indicator"
        className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all"
        style={{
          background: 'linear-gradient(135deg, #F9ECEB 0%, #F1D4D1 100%)',
          border: '1px solid #B8564A',
          boxShadow: '0 4px 12px rgba(184, 86, 74, 0.2), inset 0 1px 0 #FFFFFF'
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="animate-bounce">
          <defs>
            <radialGradient id="leakDropGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E28B80" />
              <stop offset="40%" stopColor="#B8564A" />
              <stop offset="100%" stopColor="#8C3A30" />
            </radialGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#B8564A" floodOpacity="0.35" />
            </filter>
          </defs>
          {/* Droplet Body in Brick Red #B8564A */}
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

  // HIGH USAGE: High contrast triangle indicator with dark shadow and sharp highlight
  if (severity === 'HIGH_USAGE' || severity === 'WATCH') {
    return (
      <div
        id="status-face-elevated"
        aria-label="Elevated usage indicator"
        className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all"
        style={{
          background: 'linear-gradient(135deg, #F0F0F0 0%, #DCDCDC 100%)',
          border: '1px solid #9A9A9A',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08), inset 0 1px 0 #FFFFFF'
        }}
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <defs>
            <linearGradient id="highUsageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A4A4A" />
              <stop offset="100%" stopColor="#1A1A1A" />
            </linearGradient>
            <filter id="triShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#1A1A1A" floodOpacity="0.3" />
            </filter>
          </defs>
          <path
            d="M15 5 L26 24 L4 24 Z"
            fill="url(#highUsageGrad)"
            stroke="#1A1A1A"
            strokeWidth="1.5"
            strokeLinejoin="round"
            filter="url(#triShadow)"
          />
          {/* Inner Accent Line */}
          <path d="M15 11 L21 21 L9 21 Z" fill="#DCDCDC" opacity="0.9" />
          {/* Top Peak Glint */}
          <circle cx="15" cy="8" r="1" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // NORMAL: Soft, gentle gradients throughout, clean lines, calm dimensional sphere
  return (
    <div
      id="status-face-calm"
      aria-label="Normal status indicator"
      className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all"
      style={{
        background: 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)',
        border: '1px solid #DCDCDC',
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 #FFFFFF'
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <radialGradient id="normalGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#4A4A4A" />
            <stop offset="60%" stopColor="#2E2E2E" />
            <stop offset="100%" stopColor="#1A1A1A" />
          </radialGradient>
          <filter id="normShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#1A1A1A" floodOpacity="0.25" />
          </filter>
        </defs>
        {/* Soft spherical badge */}
        <circle cx="14" cy="14" r="11" fill="url(#normalGrad)" filter="url(#normShadow)" stroke="#7A7A7A" strokeWidth="0.8" />
        {/* Crisp checkmark highlight in #FFFFFF */}
        <path
          d="M9.5 14 L12.5 17 L18.5 11"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Gentle sphere glint */}
        <ellipse cx="11" cy="9" rx="3.5" ry="1.8" transform="rotate(-30 11 9)" fill="#FFFFFF" opacity="0.35" />
      </svg>
    </div>
  );
}
