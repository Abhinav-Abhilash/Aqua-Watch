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
        {/* Brand & Logo — White and Blue */}
        <div className="px-5 mb-6 flex items-center justify-between">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 3C16 3 7 14.5 7 21C7 25.9706 11.0294 30 16 30C20.9706 30 25 25.9706 25 21C25 14.5 16 3 16 3Z" fill="#2F6FED"/>
                <path d="M16 7C16 7 10 15.5 10 20.5C10 24.0899 12.6863 27 16 27C17.2 27 18.3 26.6 19.2 25.9C18.2 25.4 17.5 24.3 17.5 23C17.5 21.3 18.8 20 20.5 20C21.4 20 22.2 20.4 22.7 21C22.9 20.3 23 19.7 23 19C23 14 16 7 16 7Z" fill="#1D4ED8" opacity="0.35"/>
                <circle cx="13" cy="22" r="2.5" fill="#FFFFFF" opacity="0.9"/>
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[17px] text-[#101828] tracking-tight">AquaWatch</span>
              <span className="text-[11px] font-medium text-[#667085] mt-0.5">Household Utility</span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={closeMenu}
            className="lg:hidden p-1 text-[#667085] hover:text-[#101828] rounded-full hover:bg-[#F2F4F7] transition-colors"
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
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer select-none group ${
                isDashboard
                  ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold'
                  : 'text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828]'
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
                  isDashboard ? 'text-[#2F6FED]' : 'text-[#667085]'
                }`}>
                  grid_view
                </span>
                <span>Dashboard</span>
              </div>

              {/* Muted chevron on the right */}
              <button
                type="button"
                onClick={handleChevronClick}
                className={`p-1 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                  isDashboard
                    ? 'text-[#2F6FED]/70 hover:text-[#2F6FED]'
                    : 'text-[#667085] hover:text-[#101828]'
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

            {/* Nested Sub-List directly beneath it */}
            {isDashboardExpanded && (
              <div className="flex flex-col gap-1 mt-1 pl-4">
                {/* Sub-item 1: Overview */}
                <button
                  type="button"
                  id="nav-sub-overview"
                  onClick={() => handleSubItemClick('overview')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-xs text-left cursor-pointer ${
                    isDashboard && dashboardView === 'overview'
                      ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold'
                      : 'text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828] font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${
                    isDashboard && dashboardView === 'overview' ? 'text-[#2F6FED]' : 'text-[#667085]'
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
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-xs text-left cursor-pointer ${
                    isDashboard && dashboardView === 'trends'
                      ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold'
                      : 'text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828] font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${
                    isDashboard && dashboardView === 'trends' ? 'text-[#2F6FED]' : 'text-[#667085]'
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
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-xs text-left cursor-pointer ${
                    isDashboard && dashboardView === 'history'
                      ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold'
                      : 'text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828] font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${
                    isDashboard && dashboardView === 'history' ? 'text-[#2F6FED]' : 'text-[#667085]'
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
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
              pathname === '/households'
                ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold'
                : 'text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${
              pathname === '/households' ? 'text-[#2F6FED]' : 'text-[#667085]'
            }`}>home</span>
            <span>Households</span>
          </Link>

          <Link
            href="/alerts"
            onClick={closeMenu}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
              pathname === '/alerts'
                ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold'
                : 'text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-[20px] ${
                pathname === '/alerts' ? 'text-[#2F6FED]' : 'text-[#667085]'
              }`}>notifications</span>
              <span>Alerts</span>
            </div>
            {activeAlertCount > 0 && (
              <span className="text-white text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F04438] flex items-center justify-center min-w-[20px] h-[20px]">
                {activeAlertCount}
              </span>
            )}
          </Link>

          <Link
            href="/onboarding"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
              pathname === '/onboarding'
                ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold'
                : 'text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${
              pathname === '/onboarding' ? 'text-[#2F6FED]' : 'text-[#667085]'
            }`}>add_home</span>
            <span>Add Property</span>
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <div className="px-5 pt-3 border-t border-[#E4E7EC] flex items-center justify-between">
        <span className="text-[11px] text-[#667085] font-medium">v1.4.2</span>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar — Pure White Surface #FFFFFF */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-[#FFFFFF] border-r border-[#E4E7EC] z-40 flex-col justify-between py-5 shadow-xs">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMenu}
          className="lg:hidden fixed inset-0 bg-[#101828]/40 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-[#FFFFFF] border-r border-[#E4E7EC] z-50 shadow-xl flex flex-col justify-between py-5 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
