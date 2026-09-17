'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import { AVAILABLE_LOCALITIES } from '@/lib/data/seedData';
import { useRouter } from 'next/navigation';
import TopHeader from '@/components/TopHeader';
import ManualReadingModal from '@/components/ManualReadingModal';

export default function OnboardingPage() {
  const { addHousehold } = useAqua();
  const router = useRouter();

  const [name, setName] = useState('');
  const [occupants, setOccupants] = useState('3');
  const [locality, setLocality] = useState(AVAILABLE_LOCALITIES[0]);
  const [customLocality, setCustomLocality] = useState('');
  const [isCustomLocality, setIsCustomLocality] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLogReadingOpen, setIsLogReadingOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const effectiveLocality = isCustomLocality && customLocality.trim() ? customLocality.trim() : locality;

    addHousehold({
      name: name.trim(),
      occupants: Math.max(1, parseInt(occupants, 10) || 1),
      locality: effectiveLocality,
      notes: notes.trim() || undefined
    });

    setTimeout(() => {
      router.push('/');
    }, 400);
  };

  return (
    <>
      <TopHeader onOpenLogReading={() => setIsLogReadingOpen(true)} />

      <main className="relative pt-20 bg-background min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">add_home</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Enroll New Property
                </h1>
                <p className="text-xs text-slate-500">
                  Register a household and automatically generate 60 days of calibrated baseline history
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Property / Household Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 144 Willow Creek Way (Miller Loft)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                />
              </div>

              {/* Occupants */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Number of Occupants
                  </label>
                  <span className="text-xs text-slate-400">
                    Est. ~{parseInt(occupants || '1') * 130} L / day baseline median
                  </span>
                </div>
                <select
                  value={occupants}
                  onChange={(e) => setOccupants(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num} occupant{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Locality */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sub-District / Locality
                </label>
                <select
                  disabled={isCustomLocality}
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20 disabled:opacity-50"
                >
                  {AVAILABLE_LOCALITIES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                <div className="flex items-center gap-2 mt-2 text-xs">
                  <input
                    type="checkbox"
                    id="customLoc"
                    checked={isCustomLocality}
                    onChange={(e) => setIsCustomLocality(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="customLoc" className="cursor-pointer text-slate-600">
                    Specify custom locality name
                  </label>
                </div>

                {isCustomLocality && (
                  <input
                    type="text"
                    value={customLocality}
                    onChange={(e) => setCustomLocality(e.target.value)}
                    placeholder="Enter custom locality..."
                    className="mt-2 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                    required
                  />
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Property Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Lawn irrigation sub-meter, low-flow fixtures"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                />
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700">
                <span className="font-bold text-primary block mb-0.5">
                  Automated 60-Day Telemetry Compilation
                </span>
                Upon enrollment, AquaWatch generates 60 days of calibrated baseline history with natural weekend variance and links this property to similar peers.
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-primary-container text-white font-bold text-sm rounded-lg hover:bg-primary transition-colors shadow-sm"
                >
                  {isSubmitting ? 'Compiling 60-Day Baseline...' : 'Complete Enrollment & View Dashboard'}
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>

      <ManualReadingModal
        isOpen={isLogReadingOpen}
        onClose={() => setIsLogReadingOpen(false)}
      />
    </>
  );
}
