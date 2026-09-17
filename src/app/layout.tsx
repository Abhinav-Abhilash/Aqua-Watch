import type { Metadata } from 'next';
import './globals.css';
import { AquaProvider } from '@/context/AquaContext';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'AquaWatch — Smart Water Ledger & Anomaly Detection',
  description: 'Know when your home is wasting water. Real-time domestic telemetry and leak intelligence.',
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
          <AppShell>
            {children}
          </AppShell>
        </AquaProvider>
      </body>
    </html>
  );
}
