'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAqua } from '@/context/AquaContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { allActiveAlerts, isMobileMenuOpen, setIsMobileMenuOpen, logout, dashboardView, setDashboardView } = useAqua();
  const activeAlertCount = allActiveAlerts.length;
  const hasLeakAlert = allActiveAlerts.some(a => a.severity === 'LEAK_DETECTED');

  const [isDashboardExpanded, setIsDashboardExpanded] = useState<boolean>(true);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const isDashboard = pathname === '/';

  const handleDashboardClick = () => {
    if (pathname !== '/') {
      router.push('/');
      setIsDashboardExpanded(true);
      setDashboardView('overview');
    } else {
      if (dashboardView !== 'overview') {
        setDashboardView('overview');
        setIsDashboardExpanded(true);
      } else {
        setIsDashboardExpanded(prev => !prev);
      }
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDashboardExpanded(prev => !prev);
  };

  const handleSubItemClick = (view: 'overview' | 'trends' | 'history') => {
    setDashboardView(view);
    if (pathname !== '/') {
      router.push('/');
    }
    closeMenu();
  };

  const sidebarContent = (
    <>
      <div className="flex flex-col">
        {/* Brand & Logo — Soft Monochrome */}
        <div className="px-4 mb-6 flex items-center justify-between">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 3C16 3 7 14.5 7 21C7 25.9706 11.0294 30 16 30C20.9706 30 25 25.9706 25 21C25 14.5 16 3 16 3Z" fill="#4A7FA5"/>
                <path d="M16 7C16 7 10 15.5 10 20.5C10 24.0899 12.6863 27 16 27C17.2 27 18.3 26.6 19.2 25.9C18.2 25.4 17.5 24.3 17.5 23C17.5 21.3 18.8 20 20.5 20C21.4 20 22.2 20.4 22.7 21C22.9 20.3 23 19.7 23 19C23 14 16 7 16 7Z" fill="#3B6584" opacity="0.4"/>
                <circle cx="13" cy="22" r="2.5" fill="#FAFAFA" opacity="0.9"/>
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[17px] text-[#1A1A1A] tracking-tight">AquaWatch</span>
              <span className="text-[11px] font-medium text-[#8A8A8A] mt-0.5">Household Utility</span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={closeMenu}
            className="lg:hidden p-1 text-[#6B6B6B] hover:text-[#1A1A1A] rounded-full hover:bg-[#E0E0E0] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation links — Pill-shaped controls */}
        <nav className="flex flex-col gap-1.5 px-3">
          {/* Expandable Dashboard Parent */}
          <div className="flex flex-col">
            <div
              onClick={handleDashboardClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-full transition-all text-sm font-medium cursor-pointer select-none group ${
                isDashboard
                  ? isDashboardExpanded
                    ? 'bg-[#E0E0E0] text-[#1A1A1A] font-semibold'
                    : 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                  : 'text-[#6B6B6B] hover:bg-[#E0E0E0]/70 hover:text-[#1A1A1A]'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDashboardClick();
                }
              }}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${
                  isDashboard && !isDashboardExpanded ? 'text-white' : isDashboard ? 'text-[#1A1A1A]' : 'text-[#6B6B6B]'
                }`}>
                  grid_view
                </span>
                <span>Dashboard</span>
              </div>

              {/* Small muted grey chevron on the right */}
              <button
                type="button"
                onClick={handleChevronClick}
                className={`p-1 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                  isDashboard && !isDashboardExpanded
                    ? 'text-white/80 hover:text-white'
                    : 'text-[#8A8A8A] hover:text-[#1A1A1A]'
                }`}
                title={isDashboardExpanded ? "Collapse sub-items" : "Expand sub-items"}
                aria-label="Toggle Dashboard sub-menu"
              >
                <span
                  className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                    isDashboardExpanded ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
            </div>

            {/* Nested Sub-List directly beneath it, indented slightly */}
            {isDashboardExpanded && (
              <div className="flex flex-col gap-1 mt-1 pl-4">
                {/* Sub-item 1: Overview */}
                <button
                  type="button"
                  id="nav-sub-overview"
                  onClick={() => handleSubItemClick('overview')}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full transition-all text-xs text-left cursor-pointer ${
                    isDashboard && dashboardView === 'overview'
                      ? 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                      : 'text-[#6B6B6B] hover:bg-[#E0E0E0] hover:text-[#1A1A1A] font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${
                    isDashboard && dashboardView === 'overview' ? 'text-white' : 'text-[#8A8A8A]'
                  }`}>
                    dashboard
                  </span>
                  <span>Overview</span>
                </button>

                {/* Sub-item 2: Trends */}
                <button
                  type="button"
                  id="nav-sub-trends"
                  onClick={() => handleSubItemClick('trends')}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full transition-all text-xs text-left cursor-pointer ${
                    isDashboard && dashboardView === 'trends'
                      ? 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                      : 'text-[#6B6B6B] hover:bg-[#E0E0E0] hover:text-[#1A1A1A] font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${
                    isDashboard && dashboardView === 'trends' ? 'text-white' : 'text-[#8A8A8A]'
                  }`}>
                    trending_up
                  </span>
                  <span>Trends</span>
                </button>

                {/* Sub-item 3: History */}
                <button
                  type="button"
                  id="nav-sub-history"
                  onClick={() => handleSubItemClick('history')}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full transition-all text-xs text-left cursor-pointer ${
                    isDashboard && dashboardView === 'history'
                      ? 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                      : 'text-[#6B6B6B] hover:bg-[#E0E0E0] hover:text-[#1A1A1A] font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${
                    isDashboard && dashboardView === 'history' ? 'text-white' : 'text-[#8A8A8A]'
                  }`}>
                    history
                  </span>
                  <span>History</span>
                </button>
              </div>
            )}
          </div>

          <Link
            href="/households"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full transition-all text-sm font-medium ${
              pathname === '/households'
                ? 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#6B6B6B] hover:bg-[#E0E0E0]/70 hover:text-[#1A1A1A]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${
              pathname === '/households' ? 'text-white' : 'text-[#6B6B6B]'
            }`}>home</span>
            <span>Households</span>
          </Link>

          <Link
            href="/alerts"
            onClick={closeMenu}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-full transition-all text-sm font-medium ${
              pathname === '/alerts'
                ? 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#6B6B6B] hover:bg-[#E0E0E0]/70 hover:text-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-[20px] ${
                pathname === '/alerts' ? 'text-white' : 'text-[#6B6B6B]'
              }`}>notifications</span>
              <span>Alerts</span>
            </div>
            {activeAlertCount > 0 && (
              <span className="text-white text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1A1A1A]">
                {activeAlertCount}
              </span>
            )}
          </Link>

          <Link
            href="/onboarding"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full transition-all text-sm font-medium ${
              pathname === '/onboarding'
                ? 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#6B6B6B] hover:bg-[#E0E0E0]/70 hover:text-[#1A1A1A]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${
              pathname === '/onboarding' ? 'text-white' : 'text-[#6B6B6B]'
            }`}>add_home</span>
            <span>Add Property</span>
          </Link>
        </nav>
      </div>

      {/* Footer User Profile — Monochrome Pill */}
      <div className="flex flex-col gap-2 px-3">
        <div className="p-2 px-3 rounded-full bg-[#E0E0E0]/60 border border-[#DCDCDC] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs shrink-0">
              SJ
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-xs font-bold text-[#1A1A1A] truncate">Sarah Jenkins</span>
              <span className="text-[10px] text-[#8A8A8A] truncate">Demo User</span>
            </div>
          </div>
          <button
            id="btn-sidebar-logout"
            onClick={() => {
              closeMenu();
              logout();
            }}
            title="Sign out / Switch to Login"
            className="p-1 rounded-full text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#DCDCDC] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar — Off-white Surface #FAFAFA */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-[#FAFAFA] border-r border-[#DCDCDC] z-40 flex-col justify-between py-5">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMenu}
          className="lg:hidden fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-[#FAFAFA] border-r border-[#DCDCDC] z-50 shadow-2xl flex flex-col justify-between py-5 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
