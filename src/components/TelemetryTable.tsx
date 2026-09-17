'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface TelemetryTableProps {
  onOpenDetails?: (date: string) => void;
}

export default function TelemetryTable({ onOpenDetails }: TelemetryTableProps) {
  const { timeline, selectedHousehold, leakStatus, updateHousehold } = useAqua();
  const [filterRange, setFilterRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [showChart, setShowChart] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<any | null>(null);
  const [isEditingScheduled, setIsEditingScheduled] = useState(false);
  const [tempScheduled, setTempScheduled] = useState(String(selectedHousehold.expectedOvernightLiters || 0));

  const count = filterRange === '7d' ? 7 : filterRange === '14d' ? 14 : 30;
  const chartDays = timeline.slice(-count);
  const recentDays = [...chartDays].reverse();

  const chartData = chartDays.map(d => ({
    date: d.date.slice(5), // MM-DD
    fullDate: d.date,
    daytime: d.daytimeLiters,
    overnight: d.overnightLiters,
    effectiveOvernight: d.effectiveOvernightLiters ?? d.overnightLiters,
    total: d.liters,
    baseline: Math.round(d.rolling_avg)
  }));

  const handleSaveScheduled = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Math.max(0, parseInt(tempScheduled, 10) || 0);
    updateHousehold(selectedHousehold.id, { expectedOvernightLiters: val });
    setIsEditingScheduled(false);
  };

  const declaredLiters = selectedHousehold.expectedOvernightLiters || 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-none overflow-hidden flex flex-col">
      
      {/* Table Header Toolbar */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Telemetry history
            </span>
            <h2 className="font-bold text-base text-slate-900 tracking-tight">
              Consumption history and readings
            </h2>
            <button
              onClick={() => setShowChart(!showChart)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-primary hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">
                {showChart ? 'expand_less' : 'show_chart'}
              </span>
              <span>{showChart ? 'Hide Trend Chart' : 'View Dual-Signal Chart'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time calibrated readings: Daytime domestic activity vs. Overnight 5-hourly flow shape
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Transparent Declared Scheduled Use Badge */}
          <div
            id="scheduled-overnight-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">schedule</span>
            <span>
              scheduled overnight use: <strong className="text-slate-900">{declaredLiters} L/night</strong> — excluded from leak detection
            </span>
            <button
              id="btn-edit-scheduled-overnight"
              onClick={() => {
                setTempScheduled(String(declaredLiters));
                setIsEditingScheduled(true);
              }}
              className="ml-1 text-primary hover:text-blue-800 underline font-semibold text-xs cursor-pointer"
            >
              Edit
            </button>
          </div>

          {/* Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterRange('7d')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setFilterRange('14d')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterRange === '14d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setFilterRange('30d')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Burst Pattern Informational Note in Level 3/History */}
      {leakStatus.hasUnusualOvernightActivity && (
        <div
          id="burst-pattern-informational-note"
          className="mx-5 my-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-700"
        >
          <span className="material-symbols-outlined text-slate-500 text-[20px] shrink-0 mt-0.5">
            bedtime
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-xs">
              unusual overnight activity — may be a guest or late-night use
            </span>
            <span className="text-slate-500 text-[11px] mt-0.5">
              Overnight flow is concentrated in 1–2 isolated hourly bursts rather than continuous trickle across most hours. Water management filters this out from plumbing leak alerts.
            </span>
          </div>
        </div>
      )}

      {/* Baseline Reset Log Note in Level 3/History */}
      {selectedHousehold.baselineResetDate && (
        <div
          id="baseline-reset-log-note"
          className="mx-5 my-2 p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-center justify-between gap-3 text-xs text-blue-900"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">history_edu</span>
            <span>
              baseline reset by user on <strong>{selectedHousehold.baselineResetDate}</strong> — tracking new 14-day consumption baseline from this date forward
            </span>
          </div>
          <span className="text-[11px] text-blue-700 font-semibold px-2.5 py-0.5 rounded-md bg-white border border-blue-200 shadow-2xs shrink-0">
            Confirmed Normal Anchor
          </span>
        </div>
      )}

      {/* Dual-Signal Trendline Chart */}
      {showChart && (
        <div className="px-5 pt-4 pb-2 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">Dual-Signal Telemetry Trend (Liters/Day)</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-primary font-semibold">
                <span className="w-2.5 h-0.5 bg-[#2F6FED]" /> Daytime Activity (~6am-11pm)
              </span>
              <span className="flex items-center gap-1 text-slate-600 font-semibold">
                <span className="w-2.5 h-0.5 bg-[#64748b]" /> Overnight Minimum Flow (~11pm-6am)
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-0.5 bg-[#94A3B8] border-dashed" /> 14-Day Baseline
              </span>
            </div>
          </div>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} stroke="#CBD5E1" />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} stroke="#CBD5E1" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs">
                          <p className="font-bold text-slate-900 mb-1">{data.fullDate}</p>
                          <p className="text-primary font-semibold">Daytime: {data.daytime} L</p>
                          <p className="text-slate-600 font-semibold">Overnight (Raw): {data.overnight} L</p>
                          {declaredLiters > 0 && (
                            <p className="text-emerald-700 font-semibold">Overnight (Effective): {data.effectiveOvernight} L (-{declaredLiters} L)</p>
                          )}
                          <p className="text-slate-800 font-bold border-t border-slate-100 pt-1 mt-1">Total: {data.total} L (Baseline: {data.baseline} L)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="daytime" name="Daytime" stroke="#2F6FED" strokeWidth={2.2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="overnight" name="Overnight" stroke="#64748b" strokeWidth={2.2} dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[760px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200">
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-4">Daytime</th>
              <th className="py-3 px-4">Overnight Flow</th>
              <th className="py-3 px-4">Hourly Flow Shape (1am-5am)</th>
              <th className="py-3 px-4">Total (L)</th>
              <th className="py-3 px-4">14-Day Baseline</th>
              <th className="py-3 px-4">Peer Avg</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {recentDays.map((day) => {
              const isAnomalous = day.is_anomalous;
              const isElevatedUnflagged = day.is_elevated_unflagged;
              const isResetDate = day.date === selectedHousehold.baselineResetDate;
              const buckets = day.overnightBuckets || [1, 1, 1, 1, 1];

              return (
                <tr
                  key={day.date}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isAnomalous ? 'bg-red-50/40' : isElevatedUnflagged ? 'bg-amber-50/30' : isResetDate ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* Date */}
                  <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {isAnomalous ? (
                        <span className="material-symbols-outlined text-[16px] text-error">
                          warning
                        </span>
                      ) : isElevatedUnflagged ? (
                        <span className="material-symbols-outlined text-[16px] text-amber-600">
                          monitoring
                        </span>
                      ) : null}
                      <span>{day.date}</span>
                      {isResetDate && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-primary font-bold">
                          Reset Point
                        </span>
                      )}
                      {day.is_simulated && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-semibold">
                          Simulated
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Daytime */}
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {day.daytimeLiters} L
                  </td>

                  {/* Overnight Flow */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className={`font-semibold ${day.overnightLiters > 25 ? 'text-purple-900 font-bold' : 'text-purple-700'}`}>
                        {day.overnightLiters} L
                      </span>
                      {declaredLiters > 0 && (
                        <span className="text-[10px] text-slate-400">
                          eff: {day.effectiveOvernightLiters ?? Math.max(0, day.overnightLiters - declaredLiters)} L (-{declaredLiters})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Hourly Flow Shape: 5 Buckets (1am, 2am, 3am, 4am, 5am) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      {buckets.map((b, idx) => {
                        const isElev = b >= 4;
                        return (
                          <span
                            key={idx}
                            title={`${idx + 1}am: ${b} L`}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isElev
                                ? day.flow_shape === 'BURST'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-error'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {b}L
                          </span>
                        );
                      })}
                      {day.flow_shape === 'BURST' ? (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                          Burst
                        </span>
                      ) : day.flow_shape === 'CONTINUOUS' ? (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-error font-semibold border border-red-200">
                          Trickle
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Total Liters */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {day.liters} L
                  </td>

                  {/* 14d rolling avg */}
                  <td className="py-3.5 px-4 text-slate-500">
                    {Math.round(day.rolling_avg)} L
                  </td>

                  {/* Peer avg */}
                  <td className="py-3.5 px-4 text-slate-500">
                    {day.peer_avg} L
                  </td>

                  {/* Status Pill */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isAnomalous ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-error text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                        Leak Flagged
                      </span>
                    ) : day.is_overnight_burst ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Burst Activity
                      </span>
                    ) : isElevatedUnflagged ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Monitoring
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Normal
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setSelectedDayDetail(day)}
                      className="text-primary hover:text-blue-800 font-semibold cursor-pointer text-xs"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick Modal to Edit Scheduled Overnight Liters */}
      {isEditingScheduled && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Scheduled Overnight Usage</h3>
              <button onClick={() => setIsEditingScheduled(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveScheduled} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Overnight Liters (L/night)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="1"
                  value={tempScheduled}
                  onChange={(e) => setTempScheduled(e.target.value)}
                  className="w-full text-sm font-bold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  if you have a sprinkler, water softener, or anything that runs automatically overnight, enter roughly how much it uses.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingScheduled(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-primary-container hover:bg-primary rounded-lg shadow-sm"
                >
                  Save Allowance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Day Details: {selectedDayDetail.date}</h3>
                <span className="text-xs text-slate-500">Dual-Signal Telemetry &amp; 5-Hourly Flow Breakdown</span>
              </div>
              <button onClick={() => setSelectedDayDetail(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Overnight Hourly Buckets */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Overnight Hourly Buckets</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    selectedDayDetail.flow_shape === 'CONTINUOUS'
                      ? 'bg-red-100 text-error'
                      : selectedDayDetail.flow_shape === 'BURST'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedDayDetail.flow_shape === 'CONTINUOUS'
                      ? 'Continuous Trickle Signature'
                      : selectedDayDetail.flow_shape === 'BURST'
                      ? 'Burst Flow Signature'
                      : 'Baseline Normal'}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center">
                  {(selectedDayDetail.overnightBuckets || [1, 1, 1, 1, 1]).map((b: number, i: number) => (
                    <div key={i} className="bg-white p-2 rounded-lg border border-slate-200/80 flex flex-col">
                      <span className="text-[10px] text-slate-400 font-semibold">{i + 1} AM</span>
                      <span className={`text-sm font-bold mt-0.5 ${b >= 4 ? 'text-primary' : 'text-slate-800'}`}>
                        {b} L
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-500 mt-2">
                  {selectedDayDetail.flow_shape === 'CONTINUOUS'
                    ? 'Elevated consistently across 4–5 buckets — consistent with toilet flapper or pinhole pipe leak.'
                    : selectedDayDetail.flow_shape === 'BURST'
                    ? 'Only 1–2 buckets elevated and remaining near-zero — consistent with guest or late-night bathroom use.'
                    : 'Normal near-zero overnight baseline flow.'}
                </p>
              </div>

              {/* Volume Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block">Daytime Usage</span>
                  <span className="text-base font-bold text-slate-900 mt-0.5">{selectedDayDetail.daytimeLiters} L</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block">Total Overnight</span>
                  <span className="text-base font-bold text-slate-900 mt-0.5">{selectedDayDetail.overnightLiters} L</span>
                </div>
              </div>

              {/* Scheduled appliance note */}
              {declaredLiters > 0 && (
                <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900">
                  Scheduled allowance: <strong>{declaredLiters} L/night</strong> deducted → Effective overnight flow evaluated: <strong>{selectedDayDetail.effectiveOvernightLiters} L</strong>.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-primary-container hover:bg-primary rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
