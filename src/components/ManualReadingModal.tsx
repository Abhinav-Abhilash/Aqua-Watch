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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAFAFA] rounded-2xl shadow-xl border border-[#DCDCDC] w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCDCDC] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1A1A1A]">Log Manual Meter Reading</h3>
            <p className="text-xs text-[#8A8A8A]">Record daily consumption from property sub-meter</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#E0E0E0] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 rounded-full bg-[#E0E0E0] border border-[#DCDCDC] text-[#1A1A1A] text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1A1A1A] text-[18px]">
                check_circle
              </span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Household Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Select Household
            </label>
            <select
              value={householdId}
              onChange={(e) => setHouseholdId(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-[#DCDCDC] rounded-full px-4 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20"
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
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Reading Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-[#DCDCDC] rounded-full px-4 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20"
              required
            />
          </div>

          {/* Liters Entry */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#1A1A1A]">
                Water Volume (Liters)
              </label>
              <span className="text-[11px] text-[#8A8A8A]">
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
                className="w-full text-sm font-bold bg-white border border-[#DCDCDC] rounded-full px-4 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20"
                required
              />
              <span className="absolute right-4 top-2.5 text-xs font-semibold text-[#8A8A8A]">
                Liters
              </span>
            </div>
          </div>

          {/* High-draw note */}
          <div className="p-3 rounded-2xl text-xs border border-[#DCDCDC] bg-[#EDEDED] text-[#1A1A1A]">
            <p className="font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">
                {willBeElevated ? 'change_history' : 'check_circle'}
              </span>
              <span>{willBeElevated ? 'Elevated reading detected' : 'Within standard range'}</span>
            </p>
            <p className="text-[11px] text-[#8A8A8A] mt-0.5">
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
              className="px-4 py-2 text-xs font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors cursor-pointer"
            >
              Save Reading
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
