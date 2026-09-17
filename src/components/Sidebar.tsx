'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAqua } from '@/context/AquaContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { allActiveAlerts, isMobileMenuOpen, setIsMobileMenuOpen } = useAqua();
  const activeAlertCount = allActiveAlerts.length;

  const closeMenu = () => setIsMobileMenuOpen(false);

  const sidebarContent = (
    <>
      <div className="flex flex-col">
        {/* Brand & Logo */}
        <div className="px-4 mb-6 flex items-center justify-between">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 3C16 3 7 14.5 7 21C7 25.9706 11.0294 30 16 30C20.9706 30 25 25.9706 25 21C25 14.5 16 3 16 3Z" fill="#2F6FED"/>
                <path d="M16 7C16 7 10 15.5 10 20.5C10 24.0899 12.6863 27 16 27C17.2 27 18.3 26.6 19.2 25.9C18.2 25.4 17.5 24.3 17.5 23C17.5 21.3 18.8 20 20.5 20C21.4 20 22.2 20.4 22.7 21C22.9 20.3 23 19.7 23 19C23 14 16 7 16 7Z" fill="#4B8BF5" opacity="0.6"/>
                <circle cx="13" cy="22" r="2.5" fill="#FFFFFF" opacity="0.7"/>
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[17px] text-slate-900 tracking-tight">AquaWatch</span>
              <span className="text-[11px] font-medium text-slate-500 mt-0.5">Household Utility</span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={closeMenu}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1 px-3">
          <Link
            href="/"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              pathname === '/'
                ? 'bg-primary-container text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/households"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              pathname === '/households'
                ? 'bg-primary-container text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span>Households</span>
          </Link>

          <Link
            href="/alerts"
            onClick={closeMenu}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              pathname === '/alerts'
                ? 'bg-primary-container text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span>Alerts</span>
            </div>
            {activeAlertCount > 0 && (
              <span className="bg-error text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                {activeAlertCount}
              </span>
            )}
          </Link>

          <Link
            href="/onboarding"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              pathname === '/onboarding'
                ? 'bg-primary-container text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">add_home</span>
            <span>Add Property</span>
          </Link>
        </nav>
      </div>

      {/* Footer User Profile */}
      <div className="flex flex-col gap-2 px-3">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary-container/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              SJ
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">Sarah Jenkins</span>
              <span className="text-[10px] text-slate-500 truncate">Operations Lead</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex-col justify-between py-4">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMenu}
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white z-50 shadow-2xl flex flex-col justify-between py-4 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
