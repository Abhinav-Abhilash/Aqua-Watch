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
    <div className="bg-[#FAFAFA] rounded-2xl border border-[#DCDCDC] overflow-hidden flex flex-col">
      
      {/* Table Header Toolbar */}
      <div className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#DCDCDC]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold text-[#1A1A1A] bg-[#E0E0E0] px-3 py-1 rounded-full border border-[#DCDCDC]">
              Telemetry Ledger
            </span>
            <h2 className="font-bold text-base text-[#1A1A1A] tracking-tight">
              Consumption history and readings
            </h2>
            <button
              onClick={() => setShowChart(!showChart)}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors flex items-center gap-1 cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
            >
              <span className="material-symbols-outlined text-[15px]">
                {showChart ? 'expand_less' : 'show_chart'}
              </span>
              <span>{showChart ? 'Hide Trend Chart' : 'View Dual-Signal Chart'}</span>
            </button>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Calibrated readings: Daytime domestic activity vs. Overnight 5-hourly flow shape
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Scheduled Overnight Use Badge */}
          <div
            id="scheduled-overnight-badge"
            className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDEDED] border border-[#DCDCDC] text-xs text-[#1A1A1A]"
          >
            <span className="material-symbols-outlined text-[15px] text-[#6B6B6B]">schedule</span>
            <span>
              scheduled overnight: <strong className="text-[#1A1A1A]">{declaredLiters} L/night</strong>
            </span>
            <button
              id="btn-edit-scheduled-overnight"
              onClick={() => {
                setTempScheduled(String(declaredLiters));
                setIsEditingScheduled(true);
              }}
              className="ml-1 text-[#1A1A1A] hover:underline font-semibold text-xs cursor-pointer"
            >
              Edit
            </button>
          </div>

          {/* Range Selector */}
          <div className="flex items-center gap-1 bg-[#E0E0E0] p-1 rounded-full border border-[#DCDCDC] text-xs font-semibold text-[#6B6B6B]">
            <button
              onClick={() => setFilterRange('7d')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                filterRange === '7d' ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'hover:text-[#1A1A1A]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setFilterRange('14d')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                filterRange === '14d' ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'hover:text-[#1A1A1A]'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setFilterRange('30d')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                filterRange === '30d' ? 'bg-[#1A1A1A] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'hover:text-[#1A1A1A]'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Burst Pattern Informational Note */}
      {leakStatus.hasUnusualOvernightActivity && (
        <div
          id="burst-pattern-informational-note"
          className="mx-4 sm:mx-6 my-3 p-3.5 rounded-2xl bg-[#EDEDED] border border-[#DCDCDC] flex items-start gap-3 text-xs text-[#1A1A1A]"
        >
          <span className="material-symbols-outlined text-[#6B6B6B] text-[20px] shrink-0 mt-0.5">
            bedtime
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-[#1A1A1A] text-xs">
              Unusual overnight activity — may be a guest or late-night use
            </span>
            <span className="text-[#6B6B6B] text-[11px] mt-0.5">
              Overnight flow is concentrated in 1–2 isolated hourly bursts rather than continuous trickle across most hours. Water management filters this out from plumbing leak alerts.
            </span>
          </div>
        </div>
      )}

      {/* Baseline Reset Log Note */}
      {selectedHousehold.baselineResetDate && (
        <div
          id="baseline-reset-log-note"
          className="mx-4 sm:mx-6 my-2 p-3 rounded-2xl bg-[#EDEDED] border border-[#DCDCDC] flex flex-wrap items-center justify-between gap-3 text-xs text-[#1A1A1A]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#1A1A1A] text-[18px]">history_edu</span>
            <span>
              Baseline reset by user on <strong>{selectedHousehold.baselineResetDate}</strong> — tracking new 14-day consumption baseline from this date forward
            </span>
          </div>
          <span className="text-[11px] text-white font-semibold px-3 py-0.5 rounded-full bg-[#1A1A1A] shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
            Confirmed Anchor
          </span>
        </div>
      )}

      {/* Dual-Signal Trendline Chart */}
      {showChart && (
        <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-[#DCDCDC] bg-[#FAFAFA]">
          <div className="flex flex-wrap items-center justify-between text-xs text-[#8A8A8A] mb-2 gap-2">
            <span className="font-semibold text-[#1A1A1A]">Dual-Signal Telemetry Trend (Liters/Day)</span>
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#1A1A1A] font-semibold">
                <span className="w-2.5 h-0.5 bg-[#1A1A1A]" /> Daytime Activity
              </span>
              <span className="flex items-center gap-1.5 text-[#6B6B6B] font-semibold">
                <span className="w-2.5 h-0.5 bg-[#8A8A8A] border-dashed" /> Overnight Minimum Flow
              </span>
              <span className="flex items-center gap-1.5 text-[#8A8A8A]">
                <span className="w-2.5 h-0.5 bg-[#DCDCDC]" /> 14-Day Baseline
              </span>
            </div>
          </div>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8A8A8A' }} stroke="#DCDCDC" />
                <YAxis tick={{ fontSize: 10, fill: '#8A8A8A' }} stroke="#DCDCDC" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#FAFAFA] p-2.5 rounded-2xl shadow-lg border border-[#DCDCDC] text-xs">
                          <p className="font-bold text-[#1A1A1A] mb-1">{data.fullDate}</p>
                          <p className="text-[#1A1A1A] font-semibold">Daytime: {data.daytime} L</p>
                          <p className="text-[#6B6B6B] font-semibold">Overnight: {data.overnight} L</p>
                          <p className="text-[#1A1A1A] font-bold border-t border-[#DCDCDC] pt-1 mt-1">Total: {data.total} L (Baseline: {data.baseline} L)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="daytime" name="Daytime" stroke="#1A1A1A" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="overnight" name="Overnight" stroke="#8A8A8A" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#DCDCDC" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#EDEDED] text-[#1A1A1A] font-semibold text-xs border-b border-[#DCDCDC]">
              <th className="py-3 px-4 sm:px-5">Date</th>
              <th className="py-3 px-3 sm:px-4">Daytime</th>
              <th className="py-3 px-3 sm:px-4">Overnight Flow</th>
              <th className="py-3 px-3 sm:px-4">Hourly Flow Shape (1am-5am)</th>
              <th className="py-3 px-3 sm:px-4">Total (L)</th>
              <th className="py-3 px-3 sm:px-4">14-Day Baseline</th>
              <th className="py-3 px-3 sm:px-4">Peer Avg</th>
              <th className="py-3 px-3 sm:px-4">Status</th>
              <th className="py-3 px-4 sm:px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDCDC] text-[#1A1A1A] font-medium">
            {recentDays.map((day) => {
              const isAnomalous = day.is_anomalous;
              const isElevatedUnflagged = day.is_elevated_unflagged;
              const isResetDate = day.date === selectedHousehold.baselineResetDate;
              const buckets = day.overnightBuckets || [1, 1, 1, 1, 1];

              return (
                <tr
                  key={day.date}
                  onClick={() => setSelectedDayDetail(day)}
                  className={`hover:bg-[#EBEBEB] transition-colors cursor-pointer ${
                    isAnomalous ? 'bg-[#E5E5E5]/50' : ''
                  }`}
                >
                  {/* Date */}
                  <td className="py-3.5 px-4 sm:px-5 font-semibold text-[#1A1A1A]">
                    <div className="flex items-center gap-1.5">
                      {isAnomalous ? (
                        <span className="material-symbols-outlined text-[16px] text-[#1A1A1A]">
                          water_damage
                        </span>
                      ) : isElevatedUnflagged ? (
                        <span className="material-symbols-outlined text-[16px] text-[#1A1A1A]">
                          change_history
                        </span>
                      ) : null}
                      <span>{day.date}</span>
                      {isResetDate && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#1A1A1A] text-white font-bold">
                          Anchor
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Daytime */}
                  <td className="py-3.5 px-3 sm:px-4 font-semibold text-[#1A1A1A]">
                    {day.daytimeLiters} L
                  </td>

                  {/* Overnight Flow */}
                  <td className="py-3.5 px-3 sm:px-4">
                    <div className="flex flex-col">
                      <span className={`font-semibold ${isAnomalous ? 'text-[#1A1A1A] font-extrabold' : 'text-[#1A1A1A]'}`}>
                        {day.overnightLiters} L
                      </span>
                      {declaredLiters > 0 && (
                        <span className="text-[10px] text-[#8A8A8A]">
                          eff: {day.effectiveOvernightLiters ?? Math.max(0, day.overnightLiters - declaredLiters)} L (-{declaredLiters})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Hourly Flow Shape: 5 Buckets */}
                  <td className="py-3.5 px-3 sm:px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {buckets.map((b, idx) => {
                        const isElev = b >= 4;
                        return (
                          <span
                            key={idx}
                            title={`${idx + 1}am: ${b} L`}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isElev
                                ? day.flow_shape === 'CONTINUOUS'
                                  ? 'bg-[#1A1A1A] text-white'
                                  : 'bg-[#E0E0E0] text-[#1A1A1A]'
                                : 'bg-[#E0E0E0] text-[#6B6B6B]'
                            }`}
                          >
                            {b}L
                          </span>
                        );
                      })}
                      {day.flow_shape === 'CONTINUOUS' ? (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-[#1A1A1A] text-white font-bold">
                          Trickle
                        </span>
                      ) : day.flow_shape === 'BURST' ? (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-[#E0E0E0] text-[#1A1A1A] font-semibold border border-[#DCDCDC]">
                          Burst
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Total Liters */}
                  <td className="py-3.5 px-3 sm:px-4 font-bold text-[#1A1A1A]">
                    {day.liters} L
                  </td>

                  {/* 14d rolling avg */}
                  <td className="py-3.5 px-3 sm:px-4 text-[#8A8A8A]">
                    {Math.round(day.rolling_avg)} L
                  </td>

                  {/* Peer avg */}
                  <td className="py-3.5 px-3 sm:px-4 text-[#8A8A8A]">
                    {day.peer_avg} L
                  </td>

                  {/* Status Pill */}
                  <td className="py-3.5 px-3 sm:px-4">
                    {isAnomalous ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] text-white text-[11px] font-bold shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        Leak Flagged
                      </span>
                    ) : day.is_overnight_burst ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0E0E0] text-[#6B6B6B] text-[11px] font-medium border border-[#DCDCDC]">
                        Burst
                      </span>
                    ) : isElevatedUnflagged ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E0E0E0] text-[#1A1A1A] text-[11px] font-medium border border-[#DCDCDC]">
                        <span className="material-symbols-outlined text-[13px]">change_history</span>
                        Monitoring
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0E0E0] text-[#1A1A1A] text-[11px] font-medium border border-[#DCDCDC]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                        Normal
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 sm:px-5 text-right">
                    <button
                      onClick={() => setSelectedDayDetail(day)}
                      className="text-[#1A1A1A] hover:underline font-semibold cursor-pointer text-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAFAFA] rounded-2xl shadow-xl border border-[#DCDCDC] w-full max-w-sm overflow-hidden p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCDCDC]">
              <h3 className="text-sm font-bold text-[#1A1A1A]">Scheduled Overnight Usage</h3>
              <button onClick={() => setIsEditingScheduled(false)} className="text-[#8A8A8A] hover:text-[#1A1A1A]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveScheduled} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Expected Overnight Liters (L/night)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="1"
                  value={tempScheduled}
                  onChange={(e) => setTempScheduled(e.target.value)}
                  className="w-full text-sm font-bold bg-white border border-[#DCDCDC] rounded-full px-4 py-2 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20"
                />
                <p className="text-xs text-[#8A8A8A] mt-1.5">
                  Enter baseline for sprinkler, water softener, or automatic appliances running overnight.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCDCDC]">
                <button
                  type="button"
                  onClick={() => setIsEditingScheduled(false)}
                  className="px-4 py-1.5 text-xs font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.12)] cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAFAFA] rounded-2xl shadow-xl border border-[#DCDCDC] w-full max-w-md overflow-hidden p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCDCDC]">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">Day Details: {selectedDayDetail.date}</h3>
                <span className="text-xs text-[#8A8A8A]">Dual-Signal Telemetry &amp; 5-Hourly Flow Breakdown</span>
              </div>
              <button onClick={() => setSelectedDayDetail(null)} className="text-[#8A8A8A] hover:text-[#1A1A1A]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Overnight Hourly Buckets */}
              <div className="bg-[#EDEDED] p-3.5 rounded-2xl border border-[#DCDCDC]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1A1A1A]">Overnight Hourly Buckets</span>
                  <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${
                    selectedDayDetail.flow_shape === 'CONTINUOUS'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#E0E0E0] text-[#1A1A1A]'
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
                    <div key={i} className="bg-[#FAFAFA] p-2 rounded-xl border border-[#DCDCDC] flex flex-col">
                      <span className="text-[10px] text-[#8A8A8A] font-semibold">{i + 1} AM</span>
                      <span className="text-sm font-bold mt-0.5 text-[#1A1A1A]">
                        {b} L
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-[#8A8A8A] mt-2">
                  {selectedDayDetail.flow_shape === 'CONTINUOUS'
                    ? 'Elevated consistently across buckets — signature of continuous leak.'
                    : 'Unattended overnight flow pattern within standard boundaries.'}
                </p>
              </div>

              {/* Volume Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#EDEDED] border border-[#DCDCDC]">
                  <span className="text-[#8A8A8A] block">Daytime Usage</span>
                  <span className="text-base font-bold text-[#1A1A1A] mt-0.5">{selectedDayDetail.daytimeLiters} L</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#EDEDED] border border-[#DCDCDC]">
                  <span className="text-[#8A8A8A] block">Total Overnight</span>
                  <span className="text-base font-bold text-[#1A1A1A] mt-0.5">{selectedDayDetail.overnightLiters} L</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#DCDCDC] flex justify-end">
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.12)] cursor-pointer"
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
