import type { Metadata } from 'next';
import './globals.css';
import { AquaProvider } from '@/context/AquaContext';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'AquaWatch — Water Demand & Anomaly Dashboard',
  description: 'Real-time domestic fluid dynamics, telemetry monitoring, and smart home leak detection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen font-sans text-on-surface antialiased">
        <AquaProvider>
          {/* Left Persistent Navigation Sidebar */}
          <Sidebar />

          {/* Main Viewport Container */}
          <div className="pl-0 lg:pl-60 min-h-screen flex flex-col justify-between">
            <div>
              {children}
            </div>
            <footer className="py-4 px-6 border-t border-slate-200/60 text-center text-xs text-slate-500 bg-white/50 mt-12">
              <p>Built with Antigravity, Stitch, Claude · AquaWatch Smart Water Ledger</p>
            </footer>
          </div>
        </AquaProvider>
      </body>
    </html>
  );
}
