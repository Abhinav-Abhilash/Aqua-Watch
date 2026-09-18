'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';

interface ThemeToggleSwitchProps {
  id?: string;
  className?: string;
}

export default function ThemeToggleSwitch({
  id = 'theme-toggle-switch',
  className = ''
}: ThemeToggleSwitchProps) {
  const { theme, toggleTheme } = useAqua();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      id={id}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`relative w-[64px] h-[30px] rounded-full p-[3px] overflow-hidden cursor-pointer select-none transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6FED] border ${
        isDark ? 'border-[#363C4E] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' : 'border-[#468CC8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]'
      } ${className}`}
    >
      {/* ─────────────────────────────────────────────────────────────
          LIGHT MODE BACKGROUND: Sky Blue + Concentric Bands + Clouds
         ───────────────────────────────────────────────────────────── */}
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-350 ease-in-out ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <svg
          viewBox="0 0 64 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E65A8" />
              <stop offset="40%" stopColor="#2E7EBE" />
              <stop offset="100%" stopColor="#559FD7" />
            </linearGradient>
          </defs>

          {/* Base Sky */}
          <rect width="64" height="30" fill="url(#skyGrad)" />

          {/* Concentric expanding ripples around sun */}
          <circle cx="15" cy="15" r="22" fill="#3D8DCB" opacity="0.45" />
          <circle cx="15" cy="15" r="30" fill="#4B98D3" opacity="0.35" />
          <circle cx="15" cy="15" r="38" fill="#5BA3DB" opacity="0.25" />

          {/* Multi-layered soft cloud puffs on the right (matching reference image) */}
          {/* Layer 1 (Darker sky-blue rear cloud) */}
          <path
            d="M 38 30 C 38 23 44 20 48 22 C 50 18 57 18 60 22 C 63 20 67 22 67 30 Z"
            fill="#80BAE5"
            opacity="0.65"
          />
          {/* Layer 2 (Soft mid-cloud) */}
          <path
            d="M 42 30 C 42 24 47 21 51 23 C 53 19 60 19 62 23 C 65 22 68 25 68 30 Z"
            fill="#B2D8F4"
            opacity="0.8"
          />
          {/* Layer 3 (Foreground pure white cloud billows) */}
          <path
            d="M 44 30 C 44 26 48 23 52 25 C 55 21 61 21 64 25 C 66 24 69 27 69 30 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          <path
            d="M 50 30 C 50 27 53 25 57 26 C 59 23 64 24 66 28 C 67 27 70 29 70 30 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DARK MODE BACKGROUND: Deep Night + Concentric Bands + Stars
         ───────────────────────────────────────────────────────────── */}
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-350 ease-in-out ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg
          viewBox="0 0 64 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="nightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B0D13" />
              <stop offset="60%" stopColor="#171C28" />
              <stop offset="100%" stopColor="#252C3D" />
            </linearGradient>
          </defs>

          {/* Base Night Gradient */}
          <rect width="64" height="30" fill="url(#nightGrad)" />

          {/* Concentric circular depth bands around moon position (x=49, y=15) */}
          <circle cx="49" cy="15" r="22" fill="#202737" opacity="0.6" />
          <circle cx="49" cy="15" r="30" fill="#1C2230" opacity="0.5" />
          <circle cx="49" cy="15" r="38" fill="#151A26" opacity="0.4" />

          {/* Scattered sparkle stars on left side (matching reference image) */}
          {/* Prominent 4-point sparkle star */}
          <path
            d="M 15 8 Q 15 12 11 12 Q 15 12 15 16 Q 15 12 19 12 Q 15 12 15 8 Z"
            fill="#FFFFFF"
          />
          {/* Second smaller 4-point sparkle star */}
          <path
            d="M 27 16 Q 27 19 24 19 Q 27 19 27 22 Q 27 19 30 19 Q 27 19 27 16 Z"
            fill="#FFFFFF"
            opacity="0.9"
          />
          {/* Star dots */}
          <circle cx="8" cy="18" r="0.9" fill="#FFFFFF" opacity="0.9" />
          <circle cx="10" cy="7" r="0.8" fill="#FFFFFF" opacity="0.8" />
          <circle cx="21" cy="6" r="0.75" fill="#FFFFFF" opacity="0.85" />
          <circle cx="21" cy="24" r="0.85" fill="#FFFFFF" opacity="0.85" />
          <circle cx="34" cy="9" r="0.7" fill="#FFFFFF" opacity="0.75" />
          <circle cx="35" cy="23" r="0.8" fill="#FFFFFF" opacity="0.8" />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SLIDING THUMB: Sun (Left) ↔ Moon (Right)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative w-[24px] h-[24px] rounded-full transition-transform duration-350 cubic-bezier(0.4, 0, 0.2, 1) z-10"
        style={{
          transform: isDark ? 'translateX(34px)' : 'translateX(0px)'
        }}
      >
        {/* SUN FACE (Visible in Light Mode) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-full transition-opacity duration-300 ease-in-out flex items-center justify-center ${
            isDark ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          <div className="w-full h-full rounded-full bg-[#C9D94A] shadow-[0_0_8px_rgba(201,217,74,0.7),0_1px_3px_rgba(0,0,0,0.3)] border border-[#DFEE63]/50 flex items-center justify-center">
            {/* Subtle inner highlight */}
            <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-b from-[#E2F06C] to-[#C0CF3E] opacity-90" />
          </div>
        </div>

        {/* MOON FACE (Visible in Dark Mode) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-full transition-opacity duration-300 ease-in-out ${
            isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="w-full h-full rounded-full bg-[#E5E2D6] shadow-[0_0_8px_rgba(229,226,214,0.5),0_1px_3px_rgba(0,0,0,0.4)] border border-[#F4F1E8]/60 relative overflow-hidden">
            {/* Subtle lunar gradient shading */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#EFECE0] via-[#E2DFD2] to-[#CEC9BA] rounded-full" />

            {/* Crater 1 (Major crater - bottom left) */}
            <div className="absolute left-[3px] bottom-[3px] w-[9px] h-[9px] rounded-full bg-[#BCB8A9] shadow-[inset_0.8px_0.8px_1.5px_rgba(0,0,0,0.35)] border border-[#AAA596]/40" />

            {/* Crater 2 (Small crater - top right) */}
            <div className="absolute right-[5px] top-[4px] w-[4px] h-[4px] rounded-full bg-[#BCB8A9] shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]" />

            {/* Crater 3 (Small crater - mid right) */}
            <div className="absolute right-[3px] bottom-[6px] w-[4.5px] h-[4.5px] rounded-full bg-[#BCB8A9] shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]" />
          </div>
        </div>
      </div>
    </button>
  );
}
