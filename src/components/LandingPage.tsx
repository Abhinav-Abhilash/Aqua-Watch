'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggleSwitch from '@/components/ThemeToggleSwitch';
import { useAqua } from '@/context/AquaContext';

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useAqua();
  const isDarkMode = theme === 'dark';

  // Live ticking simulation for the preview card
  const [currentFlow, setCurrentFlow] = useState('0.4');
  const [lastTickSeconds, setLastTickSeconds] = useState(0);

  useEffect(() => {
    // Ticking flow value between 0.38 and 0.42 L/min
    const values = ['0.4', '0.39', '0.41', '0.4', '0.42', '0.38', '0.41'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % values.length;
      setCurrentFlow(values[idx]);
      setLastTickSeconds(0);
    }, 2800);

    const secondsInterval = setInterval(() => {
      setLastTickSeconds(prev => (prev < 60 ? prev + 1 : prev));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(secondsInterval);
    };
  }, []);

  const handleScrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#101828] flex flex-col selection:bg-[#2F6FED]/20">
      
      {/* ─────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR
         ───────────────────────────────────────────────────────────── */}
      <header className="w-full bg-[#FFFFFF]/90 border-b border-[#E4E7EC] sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo + Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 3C16 3 7 14.5 7 21C7 25.9706 11.0294 30 16 30C20.9706 30 25 25.9706 25 21C25 14.5 16 3 16 3Z" fill="#2F6FED"/>
                <path d="M16 7C16 7 10 15.5 10 20.5C10 24.0899 12.6863 27 16 27C17.2 27 18.3 26.6 19.2 25.9C18.2 25.4 17.5 24.3 17.5 23C17.5 21.3 18.8 20 20.5 20C21.4 20 22.2 20.4 22.7 21C22.9 20.3 23 19.7 23 19C23 14 16 7 16 7Z" fill="#1D4ED8" opacity="0.35"/>
                <circle cx="13" cy="22" r="2.5" fill="#FFFFFF" opacity="0.9"/>
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[18px] text-[#101828] tracking-tight">AquaWatch</span>
              <span className="text-[11px] font-medium text-[#667085] mt-0.5">Household Utility</span>
            </div>
          </Link>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="#how-it-works"
              onClick={handleScrollToHowItWorks}
              className="text-sm font-medium text-[#667085] hover:text-[#101828] transition-colors"
            >
              How it works
            </a>

            {/* Solid button (not a link element) routing to /login */}
            <button
              id="btn-nav-signin"
              type="button"
              onClick={() => router.push('/login')}
              className="px-4 py-2 rounded-lg bg-[#2F6FED] hover:bg-[#2458C7] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Sign in
            </button>

            {/* Theme Toggle Pill Switch */}
            <ThemeToggleSwitch id="landing-theme-toggle" />
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION (Asymmetric 2-Column)
         ───────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column (~55%) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Eyebrow */}
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2F6FED] mb-4">
              Household water monitoring
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#101828] leading-[1.12]">
              Know it&apos;s a leak.
              <span className="block text-[#2F6FED] mt-1.5 sm:mt-2">
                Not just a busy day.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-[#667085] leading-relaxed max-w-xl">
              AquaWatch tells you when your water use is normal, higher than usual, or an actual leak &mdash; and shows you which, not just that something changed.
            </p>

            {/* Two Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5">
              <button
                id="btn-hero-signin"
                type="button"
                onClick={() => router.push('/login')}
                className="px-6 py-3 rounded-lg bg-[#2F6FED] hover:bg-[#2458C7] text-white text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                Sign in
              </button>

              <a
                href="#how-it-works"
                onClick={handleScrollToHowItWorks}
                className="px-5 py-3 rounded-lg bg-[#FFFFFF] border border-[#E4E7EC] hover:bg-[#F2F4F7] text-[#101828] text-sm font-semibold transition-all cursor-pointer"
              >
                See how it works
              </a>
            </div>

          </div>

          {/* Right Column (~45%): Live-Feeling Status Preview Widget */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] p-5 sm:p-6 shadow-xs relative overflow-hidden">
              
              {/* Card Header: Live Household Status + Timestamp */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E4E7EC]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B76A] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12B76A]" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#101828]">
                    Live household status
                  </span>
                </div>
                <span className="text-[11px] text-[#667085] font-mono">
                  {lastTickSeconds === 0 ? 'just now' : `${lastTickSeconds}s ago`}
                </span>
              </div>

              {/* Simplified Mini House Flow Illustration */}
              <div className="py-4">
                <svg
                  viewBox="0 0 420 170"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto select-none"
                >
                  <defs>
                    <linearGradient id="miniRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={isDarkMode ? '#5B8DEF' : '#2F6FED'} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={isDarkMode ? '#3B82F6' : '#1D4ED8'} stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="miniHouseWall" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={isDarkMode ? '#222630' : '#FFFFFF'} />
                      <stop offset="100%" stopColor={isDarkMode ? '#1A1C22' : '#F2F4F7'} />
                    </linearGradient>
                    <linearGradient id="miniPipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={isDarkMode ? '#384152' : '#667085'} />
                      <stop offset="50%" stopColor={isDarkMode ? '#E2E8F0' : '#FFFFFF'} />
                      <stop offset="100%" stopColor={isDarkMode ? '#1E2430' : '#344054'} />
                    </linearGradient>
                  </defs>

                  {/* Ground Line */}
                  <line x1="15" y1="145" x2="405" y2="145" stroke={isDarkMode ? '#2A2D35' : '#E4E7EC'} strokeWidth="2" strokeLinecap="round" />

                  {/* House Silhouette */}
                  <path
                    d="M 95 145 V 65 L 205 18 L 315 65 L 390 65 V 145 Z"
                    fill="url(#miniHouseWall)"
                    stroke={isDarkMode ? '#2A2D35' : '#E4E7EC'}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  {/* Roof Eaves */}
                  <path d="M 85 68 L 205 14 L 325 68" stroke="url(#miniRoofGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <path d="M 315 65 H 398" stroke="url(#miniRoofGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none" />

                  {/* Interior Room Divider */}
                  <line x1="205" y1="65" x2="205" y2="145" stroke={isDarkMode ? '#2A2D35' : '#E4E7EC'} strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="305" y1="65" x2="305" y2="145" stroke={isDarkMode ? '#2A2D35' : '#E4E7EC'} strokeWidth="1" strokeDasharray="3 3" />

                  {/* Street Meter Pit (left) */}
                  <rect x="25" y="125" width="40" height="22" rx="4" fill={isDarkMode ? '#1E2128' : '#FFFFFF'} stroke={isDarkMode ? '#384152' : '#D0D5DD'} strokeWidth="1" />
                  <circle cx="45" cy="136" r="7" fill={isDarkMode ? '#252D3D' : '#EFF4FF'} stroke="#2F6FED" strokeWidth="1.5" />
                  <circle cx="45" cy="136" r="2" fill="#2F6FED" />
                  <text x="45" y="157" textAnchor="middle" fill="#667085" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
                    METER
                  </text>

                  {/* Utility Zone: Water Heater */}
                  <rect x="140" y="112" width="22" height="32" rx="3" fill={isDarkMode ? '#1E2128' : '#FFFFFF'} stroke={isDarkMode ? '#384152' : '#D0D5DD'} strokeWidth="1" />
                  <text x="151" y="132" textAnchor="middle" fill="#2F6FED" fontSize="7.5" fontWeight="700" fontFamily="system-ui, sans-serif">
                    TANK
                  </text>

                  {/* Yard Sub-Meter */}
                  <circle cx="255" cy="120" r="6" fill={isDarkMode ? '#1E2128' : '#FFFFFF'} stroke={isDarkMode ? '#384152' : '#D0D5DD'} strokeWidth="1" />
                  <text x="255" y="138" textAnchor="middle" fill="#667085" fontSize="7.5" fontWeight="600" fontFamily="system-ui, sans-serif">
                    YARD
                  </text>

                  {/* Fixture: Shower */}
                  <path d="M 350 135 V 98 H 368" stroke={isDarkMode ? '#384152' : '#98A2B3'} strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M 364 98 L 372 98 L 375 103 L 361 103 Z" fill={isDarkMode ? '#5B8DEF' : '#2F6FED'} />

                  {/* Main Supply Pipe */}
                  <path d="M 45 136 H 360" stroke="url(#miniPipeGrad)" strokeWidth="7" strokeLinecap="round" />

                  {/* Active Calm Water Flow Line */}
                  <path
                    className="flow-line-active"
                    d="M 45 136 H 360"
                    stroke="#2F6FED"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Branch Pipes */}
                  <path d="M 151 136 V 128" stroke="#2F6FED" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 255 136 V 126" stroke="#2F6FED" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Status Details Bar */}
              <div className="pt-3 border-t border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                {/* Live-updating flow counter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#667085]">Current flow:</span>
                  <span className="font-mono font-bold text-[#101828] bg-[#EFF4FF] text-[#2F6FED] px-2 py-0.5 rounded transition-all duration-300">
                    {currentFlow} L/min
                  </span>
                </div>

                {/* Status summary */}
                <div className="flex items-center gap-1.5 text-[#667085]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A] shrink-0" />
                  <span>3 households monitored, 0 leaks detected right now</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          HOW IT WORKS SECTION (Distinct Card-Surface Tone)
         ───────────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="w-full bg-[#FFFFFF] border-y border-[#E4E7EC] py-20 sm:py-24 lg:py-28"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Column 01 */}
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-[#2F6FED] tracking-wider mb-5">
                01
              </span>
              <h2 className="text-xl font-bold text-[#101828] tracking-tight mb-3">
                Log your usage
              </h2>
              <p className="text-sm text-[#667085] leading-relaxed">
                Enter a daily reading, or connect a meter later &mdash; AquaWatch tracks daytime and overnight flow separately from day one.
              </p>
            </div>

            {/* Column 02 */}
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-[#2F6FED] tracking-wider mb-5">
                02
              </span>
              <h2 className="text-xl font-bold text-[#101828] tracking-tight mb-3">
                We learn your normal
              </h2>
              <p className="text-sm text-[#667085] leading-relaxed">
                Over two weeks, AquaWatch builds your household&apos;s own baseline &mdash; no generic thresholds, no one-size-fits-all limits.
              </p>
            </div>

            {/* Column 03 */}
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-[#2F6FED] tracking-wider mb-5">
                03
              </span>
              <h2 className="text-xl font-bold text-[#101828] tracking-tight mb-3">
                Know the difference
              </h2>
              <p className="text-sm text-[#667085] leading-relaxed">
                See at a glance whether usage is just a busy day or a leak that needs attention &mdash; before it shows up on your bill.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CLOSING SECTION (Stark & Generous Whitespace)
         ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-24 sm:py-28 lg:py-32 flex flex-col items-center justify-center text-center px-5 sm:px-8">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101828] tracking-tight mb-8">
            See what&apos;s happening in your home, tonight.
          </h2>

          <button
            id="btn-closing-signin"
            type="button"
            onClick={() => router.push('/login')}
            className="px-8 py-3.5 rounded-lg bg-[#2F6FED] hover:bg-[#2458C7] text-white text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            Sign in
          </button>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          MINIMAL FOOTER
         ───────────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-[#E4E7EC] py-8 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 3C16 3 7 14.5 7 21C7 25.9706 11.0294 30 16 30C20.9706 30 25 25.9706 25 21C25 14.5 16 3 16 3Z" fill="#2F6FED"/>
                <circle cx="13" cy="22" r="2.5" fill="#FFFFFF" opacity="0.9"/>
              </svg>
            </div>
            <span className="font-bold text-sm text-[#101828] tracking-tight">AquaWatch</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
