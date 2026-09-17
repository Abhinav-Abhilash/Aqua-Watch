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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Log Manual Meter Reading</h3>
            <p className="text-xs text-slate-500">Record daily consumption from property sub-meter</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                check_circle
              </span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Household Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Household
            </label>
            <select
              value={householdId}
              onChange={(e) => setHouseholdId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reading Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
              required
            />
          </div>

          {/* Liters Entry */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Water Volume (Liters)
              </label>
              <span className="text-[11px] text-slate-400">
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
                className="w-full text-sm font-bold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-primary-container/20 focus:outline-none"
                required
              />
              <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">
                Liters
              </span>
            </div>
          </div>

          {/* High-draw note */}
          <div className={`p-3 rounded-xl text-xs border ${
            willBeElevated
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <p className="font-semibold">
              {willBeElevated ? '⚠️ Elevated Reading Detected' : '✓ Within Standard Range'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
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
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-primary-container hover:bg-primary rounded-lg shadow-sm transition-colors"
            >
              Save Reading
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
