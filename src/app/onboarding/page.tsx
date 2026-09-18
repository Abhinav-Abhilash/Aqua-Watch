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
  const [expectedOvernightLiters, setExpectedOvernightLiters] = useState('0');
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
      expectedOvernightLiters: Math.max(0, parseInt(expectedOvernightLiters, 10) || 0),
      notes: notes.trim() || undefined
    });

    setTimeout(() => {
      router.push('/');
    }, 400);
  };

  return (
    <>
      <TopHeader onOpenLogReading={() => setIsLogReadingOpen(true)} />

      <main className="relative bg-[#F5F7FA] min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E4E7EC] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF4FF] text-[#2F6FED] flex items-center justify-center shrink-0 border border-[#2F6FED]/20">
                <span className="material-symbols-outlined text-[24px]">add_home</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#101828] tracking-tight">
                  Enroll New Property
                </h1>
                <p className="text-xs text-[#667085]">
                  Register a household and automatically generate 60 days of calibrated baseline history
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E4E7EC] shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1.5">
                  Property or household name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 144 Willow Creek Way (Miller Loft)"
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg text-sm text-[#101828] focus:bg-white focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20"
                />
              </div>

              {/* Occupants */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#101828]">
                    Number of occupants
                  </label>
                  <span className="text-xs text-[#667085]">
                    Est. ~{parseInt(occupants || '1') * 130} L / day baseline median
                  </span>
                </div>
                <select
                  value={occupants}
                  onChange={(e) => setOccupants(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg text-sm text-[#101828] focus:bg-white focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20"
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
                <label className="block text-xs font-semibold text-[#101828] mb-1.5">
                  Sub-district or locality
                </label>
                <select
                  disabled={isCustomLocality}
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg text-sm text-[#101828] focus:bg-white focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20 disabled:opacity-50"
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
                    className="rounded text-[#2F6FED] focus:ring-[#2F6FED]"
                  />
                  <label htmlFor="customLoc" className="cursor-pointer text-[#667085]">
                    Specify custom locality name
                  </label>
                </div>

                {isCustomLocality && (
                  <input
                    type="text"
                    value={customLocality}
                    onChange={(e) => setCustomLocality(e.target.value)}
                    placeholder="Enter custom locality..."
                    className="mt-2 w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg text-sm text-[#101828] focus:bg-white focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20"
                    required
                  />
                )}
              </div>

              {/* Scheduled Overnight Appliances */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#101828]">
                    Scheduled overnight usage (liters/night)
                  </label>
                  <span className="text-xs text-[#667085]">Default: 0 L</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="1"
                  value={expectedOvernightLiters}
                  onChange={(e) => setExpectedOvernightLiters(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg text-sm text-[#101828] focus:bg-white focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20"
                />
                <p className="text-xs text-[#667085] mt-1">
                  If you have a sprinkler, water softener, or anything that runs automatically overnight, enter roughly how much it uses.
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1.5">
                  Property notes (optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Lawn irrigation sub-meter, low-flow fixtures"
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg text-sm text-[#101828] focus:bg-white focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20"
                />
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-xl bg-[#EFF4FF] border border-[#2F6FED]/20 text-xs text-[#101828]">
                <span className="font-bold text-[#2F6FED] block mb-0.5">
                  Automated 60-Day Telemetry Compilation
                </span>
                Upon enrollment, AquaWatch generates 60 days of calibrated baseline history with natural weekend variance and links this property to similar peers.
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#2F6FED] hover:bg-[#2458C7] text-white font-bold text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
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
