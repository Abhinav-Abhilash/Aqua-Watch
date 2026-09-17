'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';

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
    <div className="flex-1 w-full flex flex-col md:flex-row bg-[#F5F7FA] text-slate-900">
      
      {/* Left Column: Form direct on page (no floating card) */}
      <div className="w-full md:w-[56%] lg:w-[58%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 bg-[#F5F7FA]">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 shrink-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="none" style={{ width: '24px', height: '24px' }}>
              <path d="M16 3C16 3 7 14.5 7 21C7 25.9706 11.0294 30 16 30C20.9706 30 25 25.9706 25 21C25 14.5 16 3 16 3Z" fill="#2F6FED"/>
              <path d="M16 7C16 7 10 15.5 10 20.5C10 24.0899 12.6863 27 16 27C17.2 27 18.3 26.6 19.2 25.9C18.2 25.4 17.5 24.3 17.5 23C17.5 21.3 18.8 20 20.5 20C21.4 20 22.2 20.4 22.7 21C22.9 20.3 23 19.7 23 19C23 14 16 7 16 7Z" fill="#6ba0fa" opacity="0.6"/>
              <circle cx="13" cy="22" r="2.5" fill="#FFFFFF" opacity="0.7"/>
            </svg>
          </div>
          <span className="font-bold text-base text-slate-900 tracking-tight">AquaWatch</span>
        </div>

        {/* Center Form Section */}
        <div className="my-auto py-12 max-w-sm w-full">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Sign in
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-8">
            sign in to check your household&apos;s water usage
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED] transition-colors"
              />
            </div>

            <button
              id="btn-form-login"
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-[#2F6FED] hover:bg-[#2558c4] active:bg-[#1f49a3] text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </form>

          {/* Understated Secondary Action */}
          <div className="mt-6 text-center">
            <button
              id="btn-demo-login"
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-slate-500 hover:text-[#2F6FED] hover:underline transition-colors cursor-pointer"
            >
              Continue as demo user
            </button>
          </div>
        </div>

        {/* Minimal Bottom Margin Anchor */}
        <div className="text-[11px] text-slate-400">
          Smart water telemetry and flow monitoring
        </div>
      </div>

      {/* Right Column: Solid #2F6FED Block with Calm House-Flow Illustration */}
      <div className="hidden md:flex md:w-[44%] lg:w-[42%] bg-[#2F6FED] flex-col justify-between p-8 lg:p-12 text-white">
        
        {/* Subtle Panel Header */}
        <div className="flex items-center justify-between text-white/80 text-xs font-medium">
          <span>Household flow monitoring</span>
          <span>Baseline intake</span>
        </div>

        {/* House-Flow Illustration in calm/normal state */}
        <div className="my-auto py-8 w-full max-w-md mx-auto">
          <svg
            className="w-full h-auto select-none"
            fill="none"
            viewBox="0 0 740 280"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground Line */}
            <line x1="20" y1="245" x2="720" y2="245" stroke="#7BA8F7" strokeWidth="2.5" strokeLinecap="round" />

            {/* House Silhouette */}
            <path
              d="M 170 245 V 105 L 340 35 L 510 105 L 680 105 V 245 Z"
              fill="#2558C4"
              stroke="#A6C5FC"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M 155 110 L 340 28 L 525 110" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            <path d="M 510 105 H 695" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

            {/* Room Dividing Walls */}
            <line x1="330" y1="105" x2="330" y2="245" stroke="#4B81EC" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="500" y1="105" x2="500" y2="245" stroke="#4B81EC" strokeWidth="1.5" strokeDasharray="4 3" />

            {/* Room Labels (sentence-case, no middle dots) */}
            <text x="250" y="125" textAnchor="middle" fill="#D9E6FF" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="500">
              Zone 1: Utility
            </text>
            <text x="415" y="125" textAnchor="middle" fill="#D9E6FF" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="500">
              Zone 2: Yard and irrigation
            </text>
            <text x="590" y="125" textAnchor="middle" fill="#D9E6FF" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="500">
              Zone 3: Bath and fixtures
            </text>

            {/* Street Meter Pit */}
            <rect x="55" y="210" width="60" height="35" rx="5" fill="#1F49A3" stroke="#A6C5FC" strokeWidth="1.5" />
            <circle cx="85" cy="227" r="10" fill="#FFFFFF" />
            <circle cx="85" cy="227" r="3.5" fill="#2F6FED" />
            <path d="M85 227 L89 223" stroke="#2F6FED" strokeWidth="1.5" strokeLinecap="round" />
            <text x="85" y="260" textAnchor="middle" fill="#EBF2FF" fontFamily="system-ui, sans-serif" fontSize="9.5" fontWeight="600">
              Street meter
            </text>

            {/* Fixtures */}
            <rect x="235" y="195" width="30" height="48" rx="3" fill="#1F49A3" stroke="#7BA8F7" strokeWidth="1.5" />
            <text x="250" y="235" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="9.5">
              Heater
            </text>

            <path d="M 400 220 V 170 H 430" fill="none" stroke="#7BA8F7" strokeWidth="3" strokeLinecap="round" />
            <rect x="382" y="160" width="36" height="20" rx="3" fill="#1F49A3" stroke="#A6C5FC" strokeWidth="1.5" />
            <text x="400" y="152" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="9.5">
              Sub-meter
            </text>

            <path d="M 580 220 V 165 H 610 V 180" fill="none" stroke="#7BA8F7" strokeWidth="3" strokeLinecap="round" />
            <text x="610" y="152" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="9.5">
              Shower
            </text>

            {/* Outer Pipe */}
            <path d="M 85 220 H 600" stroke="#1F49A3" strokeWidth="10" strokeLinecap="round" opacity="0.6" />

            {/* Normal Continuous Laminar Flow Stream */}
            <path
              d="M 85 220 H 600"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Authentic statistic copy at bottom */}
        <div className="text-xs text-white/80 font-normal leading-relaxed">
          the average home loses over 10,000 liters a year to undetected leaks
        </div>
      </div>

    </div>
  );
}
