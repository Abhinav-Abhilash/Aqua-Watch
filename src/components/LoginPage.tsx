'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import ThemeToggleSwitch from '@/components/ThemeToggleSwitch';

export default function LoginPage() {
  const { login } = useAqua();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(false);
  };

  const handleDemoLogin = () => {
    login(true);
  };

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row bg-[#F5F7FA] text-[#101828]">
      
      {/* Left Column: Form direct on surface */}
      <div className="w-full md:w-[52%] lg:w-[50%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 bg-[#FFFFFF] border-r border-[#E4E7EC]">
        
        {/* Brand Header & Theme Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 3C16 3 7 14.5 7 21C7 25.9706 11.0294 30 16 30C20.9706 30 25 25.9706 25 21C25 14.5 16 3 16 3Z" fill="#2F6FED"/>
                <path d="M16 7C16 7 10 15.5 10 20.5C10 24.0899 12.6863 27 16 27C17.2 27 18.3 26.6 19.2 25.9C18.2 25.4 17.5 24.3 17.5 23C17.5 21.3 18.8 20 20.5 20C21.4 20 22.2 20.4 22.7 21C22.9 20.3 23 19.7 23 19C23 14 16 7 16 7Z" fill="#1D4ED8" opacity="0.35"/>
                <circle cx="13" cy="22" r="2.5" fill="#FFFFFF" opacity="0.9"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-[#101828] tracking-tight">AquaWatch</span>
          </div>
          <ThemeToggleSwitch id="login-theme-toggle-switch" />
        </div>

        {/* Center Form Section */}
        <div className="my-auto py-10 max-w-sm w-full mx-auto md:mx-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
            Sign in
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1.5 mb-8">
            Check your household&apos;s telemetry and flow ledger
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#101828] mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg text-sm text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-[#101828] mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg text-sm text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20 transition-colors"
              />
            </div>

            {/* Primary CTA: Solid Blue #2F6FED */}
            <button
              id="btn-form-login"
              type="submit"
              className="w-full mt-3 py-3 px-6 bg-[#2F6FED] hover:bg-[#2458C7] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Sign in
            </button>
          </form>

          {/* Secondary Action: Text link / Outline */}
          <div className="mt-6 text-center">
            <button
              id="btn-demo-login"
              type="button"
              onClick={handleDemoLogin}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#2F6FED] hover:underline transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              <span>Continue as demo user</span>
            </button>
          </div>
        </div>

        {/* Minimal Bottom Margin Anchor */}
        <div className="text-[11px] text-[#667085]">
          Smart water telemetry and flow anomaly intelligence
        </div>
      </div>

      {/* Right Column: Solid Blue Background #2F6FED with Architectural Illustration */}
      <div className="hidden md:flex md:w-[48%] lg:w-[50%] bg-[#2F6FED] flex-col justify-between p-8 lg:p-12 text-white">
        
        {/* Panel Header */}
        <div className="flex items-center justify-between text-blue-100 text-xs font-medium">
          <span>Household flow monitoring</span>
          <span>Calibrated baseline</span>
        </div>

        {/* House-Flow Illustration on Solid Blue #2F6FED */}
        <div className="my-auto py-8 w-full max-w-md mx-auto">
          <svg
            className="w-full h-auto select-none"
            fill="none"
            viewBox="0 0 740 280"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="loginHouseShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.25" />
              </filter>
              <linearGradient id="loginRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#BFDBFE" />
              </linearGradient>
              <linearGradient id="loginWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#EFF6FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="loginPipeCylinder" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="30%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#93C5FD" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>

            {/* Ground Plane & Soft Cast Shadow */}
            <ellipse cx="425" cy="247" rx="275" ry="8" fill="#1E3A8A" opacity="0.4" />
            <line x1="20" y1="245" x2="720" y2="245" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 246 H720 V260 H20 Z" fill="#60A5FA" opacity="0.2" />

            {/* House Silhouette with Drop Shadow & White Fill */}
            <path
              d="M 170 245 V 105 L 340 35 L 510 105 L 680 105 V 245 Z"
              fill="url(#loginWallGrad)"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinejoin="round"
              filter="url(#loginHouseShadow)"
            />
            {/* Roof Overhang Eaves */}
            <path d="M 155 110 L 340 28 L 525 110" fill="none" stroke="url(#loginRoofGrad)" strokeWidth="5" strokeLinecap="round" />
            <path d="M 510 105 H 695" stroke="url(#loginRoofGrad)" strokeWidth="5" strokeLinecap="round" />

            {/* Room Dividing Walls */}
            <line x1="330" y1="105" x2="330" y2="245" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="5 3" />
            <line x1="500" y1="105" x2="500" y2="245" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="5 3" />

            {/* Room Labels (White badges) */}
            <g>
              <rect x="195" y="114" width="110" height="20" rx="10" fill="#FFFFFF" />
              <text x="250" y="128" textAnchor="middle" fill="#1E40AF" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
                Zone 1: Utility
              </text>
            </g>
            <g>
              <rect x="365" y="114" width="100" height="20" rx="10" fill="#FFFFFF" />
              <text x="415" y="128" textAnchor="middle" fill="#1E40AF" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
                Zone 2: Yard
              </text>
            </g>
            <g>
              <rect x="540" y="114" width="100" height="20" rx="10" fill="#FFFFFF" />
              <text x="590" y="128" textAnchor="middle" fill="#1E40AF" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
                Zone 3: Living
              </text>
            </g>

            {/* Street Meter Pit */}
            <rect x="55" y="210" width="60" height="35" rx="8" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
            <circle cx="85" cy="227" r="11" fill="#EFF6FF" stroke="#2F6FED" strokeWidth="2" />
            <circle cx="85" cy="227" r="3.5" fill="#2F6FED" />
            <path d="M85 227 L89 223" stroke="#2F6FED" strokeWidth="1.5" strokeLinecap="round" />
            <text x="85" y="260" textAnchor="middle" fill="#EFF6FF" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
              Street meter
            </text>

            {/* Fixtures */}
            <rect x="235" y="195" width="32" height="50" rx="5" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
            <text x="251" y="236" textAnchor="middle" fill="#1E40AF" fontFamily="system-ui, sans-serif" fontSize="9.5" fontWeight="700">
              Heater
            </text>

            <path d="M 400 220 V 170 H 430" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <rect x="380" y="160" width="40" height="22" rx="5" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
            <text x="400" y="153" textAnchor="middle" fill="#1E40AF" fontFamily="system-ui, sans-serif" fontSize="9.5" fontWeight="700">
              Sub-meter
            </text>

            <path d="M 580 220 V 165 H 610 V 180" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M 602 180 L 618 180 L 622 188 L 598 188 Z" fill="#FFFFFF" />
            <text x="610" y="153" textAnchor="middle" fill="#1E40AF" fontFamily="system-ui, sans-serif" fontSize="9.5" fontWeight="700">
              Shower
            </text>

            {/* Pipe */}
            <path d="M 85 220 H 600" stroke="url(#loginPipeCylinder)" strokeWidth="14" strokeLinecap="round" />

            {/* Active Water Flow with white highlight */}
            <path
              className="flow-line-active"
              d="M 85 220 H 600"
              stroke="#FFFFFF"
              strokeWidth={5}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Fact copy at bottom */}
        <div className="text-xs text-blue-100 font-normal leading-relaxed">
          The average home loses over 10,000 liters a year to undetected leaks
        </div>
      </div>

    </div>
  );
}
