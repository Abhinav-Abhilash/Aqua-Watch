'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';

interface ManualReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManualReadingModal({ isOpen, onClose }: ManualReadingModalProps) {
  const { households, selectedHouseholdId, addReading, selectedHousehold } = useAqua();

  const [householdId, setHouseholdId] = useState(selectedHouseholdId);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [liters, setLiters] = useState('520');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentH = households.find(h => h.id === householdId) || selectedHousehold;
  const typicalDaily = currentH.occupants * 130;
  const numericLiters = Number(liters) || 0;
  const willBeElevated = numericLiters > typicalDaily * 1.35;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numericLiters || numericLiters <= 0) return;

    addReading({
      householdId,
      date,
      liters: Math.round(numericLiters)
    });

    setSuccessMsg(`Logged ${Math.round(numericLiters)} L for ${currentH.name}!`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E4E7EC] w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E4E7EC] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#101828]">Log Manual Meter Reading</h3>
            <p className="text-xs text-[#667085]">Record daily consumption from property sub-meter</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#667085] hover:text-[#101828] hover:bg-[#F2F4F7] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 rounded-lg bg-[#ECFDF3] border border-[#12B76A]/30 text-[#12B76A] text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#12B76A] text-[18px]">
                check_circle
              </span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Household Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#101828] mb-1">
              Select Household
            </label>
            <select
              value={householdId}
              onChange={(e) => setHouseholdId(e.target.value)}
              className="w-full text-xs font-medium bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg px-4 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
            >
              {households.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.locality}, {h.occupants} occupants)
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#101828] mb-1">
              Reading Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs font-medium bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg px-4 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              required
            />
          </div>

          {/* Liters Entry */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#101828]">
                Water Volume (Liters)
              </label>
              <span className="text-[11px] text-[#667085]">
                Baseline: ~{typicalDaily} L/day
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="10"
                max="5000"
                step="1"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                placeholder="520"
                className="w-full text-sm font-bold bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg px-4 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                required
              />
              <span className="absolute right-4 top-2.5 text-xs font-semibold text-[#667085]">
                Liters
              </span>
            </div>
          </div>

          {/* High-draw note */}
          <div className={`p-3.5 rounded-xl text-xs border ${
            willBeElevated
              ? 'bg-[#FFFAEB] border-[#F79009]/30 text-[#B54708]'
              : 'bg-[#ECFDF3] border-[#12B76A]/30 text-[#027A48]'
          }`}>
            <p className="font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">
                {willBeElevated ? 'change_history' : 'check_circle'}
              </span>
              <span>{willBeElevated ? 'Elevated reading detected' : 'Within standard range'}</span>
            </p>
            <p className="text-[11px] mt-0.5 opacity-90">
              {willBeElevated
                ? `Value is +${Math.round(((numericLiters - typicalDaily) / typicalDaily) * 100)}% above normal. 2 consecutive elevated readings will flag a leak.`
                : `Normal baseline for ${currentH.occupants} occupants in ${currentH.locality} is ~${typicalDaily} L.`}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#667085] hover:text-[#101828] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2458C7] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Reading
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
