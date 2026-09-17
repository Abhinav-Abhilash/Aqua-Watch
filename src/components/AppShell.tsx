'use client';

import React from 'react';
import { useAqua } from '@/context/AquaContext';
import Sidebar from '@/components/Sidebar';
import AppFooter from '@/components/AppFooter';
import LoginPage from '@/components/LoginPage';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoaded } = useAqua();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3 bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading AquaWatch...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-background">
        <div className="flex-1 flex flex-col">
          <LoginPage />
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <Sidebar />
      <div className="pl-0 lg:pl-60 min-h-screen flex flex-col justify-between flex-1">
        <div className="flex-1">
          {children}
        </div>
        <AppFooter />
      </div>
    </div>
  );
}
