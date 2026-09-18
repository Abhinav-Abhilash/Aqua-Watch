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
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] overflow-hidden flex flex-col shadow-xs">
      
      {/* Table Header Toolbar */}
      <div className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E7EC]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold text-[#2F6FED] bg-[#EFF4FF] px-3 py-1 rounded-full border border-[#2F6FED]/20">
              Telemetry Ledger
            </span>
            <h2 className="font-bold text-base text-[#101828] tracking-tight">
              Consumption history and readings
            </h2>
            <button
              onClick={() => setShowChart(!showChart)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2F6FED] hover:bg-[#2458C7] text-white transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">
                {showChart ? 'expand_less' : 'show_chart'}
              </span>
              <span>{showChart ? 'Hide Trend Chart' : 'View Dual-Signal Chart'}</span>
            </button>
          </div>
          <p className="text-xs text-[#667085] mt-1">
            Calibrated readings: Daytime domestic activity vs. Overnight 5-hourly flow shape
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Scheduled Overnight Use Badge */}
          <div
            id="scheduled-overnight-badge"
            className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F9FB] border border-[#E4E7EC] text-xs text-[#101828]"
          >
            <span className="material-symbols-outlined text-[15px] text-[#667085]">schedule</span>
            <span>
              scheduled overnight: <strong className="text-[#101828]">{declaredLiters} L/night</strong>
            </span>
            <button
              id="btn-edit-scheduled-overnight"
              onClick={() => {
                setTempScheduled(String(declaredLiters));
                setIsEditingScheduled(true);
              }}
              className="ml-1 text-[#2F6FED] hover:underline font-semibold text-xs cursor-pointer"
            >
              Edit
            </button>
          </div>

          {/* Range Selector */}
          <div className="flex items-center gap-1 bg-[#F8F9FB] p-1 rounded-full border border-[#E4E7EC] text-xs font-semibold text-[#667085]">
            <button
              onClick={() => setFilterRange('7d')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                filterRange === '7d' ? 'bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20 font-bold' : 'hover:text-[#101828]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setFilterRange('14d')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                filterRange === '14d' ? 'bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20 font-bold' : 'hover:text-[#101828]'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setFilterRange('30d')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                filterRange === '30d' ? 'bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20 font-bold' : 'hover:text-[#101828]'
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
          className="mx-4 sm:mx-6 my-3 p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC] flex items-start gap-3 text-xs text-[#101828]"
        >
          <span className="material-symbols-outlined text-[#2F6FED] text-[20px] shrink-0 mt-0.5">
            bedtime
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-[#101828] text-xs">
              Unusual overnight activity — may be a guest or late-night use
            </span>
            <span className="text-[#667085] text-[11px] mt-0.5">
              Overnight flow is concentrated in 1–2 isolated hourly bursts rather than continuous trickle across most hours. Water management filters this out from plumbing leak alerts.
            </span>
          </div>
        </div>
      )}

      {/* Baseline Reset Log Note */}
      {selectedHousehold.baselineResetDate && (
        <div
          id="baseline-reset-log-note"
          className="mx-4 sm:mx-6 my-2 p-3 rounded-xl bg-[#EFF4FF] border border-[#2F6FED]/30 flex flex-wrap items-center justify-between gap-3 text-xs text-[#101828]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#2F6FED] text-[18px]">history_edu</span>
            <span>
              Baseline reset by user on <strong>{selectedHousehold.baselineResetDate}</strong> — tracking new 14-day consumption baseline from this date forward
            </span>
          </div>
          <span className="text-[11px] text-white font-semibold px-3 py-0.5 rounded-full bg-[#2F6FED] shrink-0 shadow-xs">
            Confirmed Anchor
          </span>
        </div>
      )}

      {/* Dual-Signal Trendline Chart */}
      {showChart && (
        <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-[#E4E7EC] bg-[#FFFFFF]">
          <div className="flex flex-wrap items-center justify-between text-xs text-[#667085] mb-2 gap-2">
            <span className="font-semibold text-[#101828]">Dual-Signal Telemetry Trend (Liters/Day)</span>
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#2F6FED] font-semibold">
                <span className="w-2.5 h-0.5 bg-[#2F6FED]" /> Daytime Activity
              </span>
              <span className="flex items-center gap-1.5 text-[#667085] font-semibold">
                <span className="w-2.5 h-0.5 bg-[#667085] border-dashed" /> Overnight Minimum Flow
              </span>
              <span className="flex items-center gap-1.5 text-[#98A2B3]">
                <span className="w-2.5 h-0.5 bg-[#E4E7EC]" /> 14-Day Baseline
              </span>
            </div>
          </div>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#667085' }} stroke="#E4E7EC" />
                <YAxis tick={{ fontSize: 10, fill: '#667085' }} stroke="#E4E7EC" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#FFFFFF] p-2.5 rounded-xl shadow-lg border border-[#E4E7EC] text-xs">
                          <p className="font-bold text-[#101828] mb-1">{data.fullDate}</p>
                          <p className="text-[#2F6FED] font-semibold">Daytime: {data.daytime} L</p>
                          <p className="text-[#667085] font-semibold">Overnight: {data.overnight} L</p>
                          <p className="text-[#101828] font-bold border-t border-[#E4E7EC] pt-1 mt-1">Total: {data.total} L (Baseline: {data.baseline} L)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="daytime" name="Daytime" stroke="#2F6FED" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="overnight" name="Overnight" stroke="#667085" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#E4E7EC" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table: White background, hairline grey row dividers #E4E7EC */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8F9FB] text-[#101828] font-semibold text-xs border-b border-[#E4E7EC]">
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
          <tbody className="divide-y divide-[#E4E7EC] text-[#101828] font-medium bg-[#FFFFFF]">
            {recentDays.map((day) => {
              const isAnomalous = day.is_anomalous;
              const isElevatedUnflagged = day.is_elevated_unflagged;
              const isResetDate = day.date === selectedHousehold.baselineResetDate;
              const buckets = day.overnightBuckets || [1, 1, 1, 1, 1];

              return (
                <tr
                  key={day.date}
                  onClick={() => setSelectedDayDetail(day)}
                  className={`hover:bg-[#F8F9FB] transition-colors cursor-pointer ${
                    isAnomalous ? 'bg-[#FEF3F2]/40' : ''
                  }`}
                >
                  {/* Date */}
                  <td className="py-3.5 px-4 sm:px-5 font-semibold text-[#101828]">
                    <div className="flex items-center gap-1.5">
                      {isAnomalous ? (
                        <span className="material-symbols-outlined text-[16px] text-[#F04438]">
                          water_damage
                        </span>
                      ) : isElevatedUnflagged ? (
                        <span className="material-symbols-outlined text-[16px] text-[#F79009]">
                          change_history
                        </span>
                      ) : null}
                      <span>{day.date}</span>
                      {isResetDate && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#2F6FED] text-white font-bold">
                          Anchor
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Daytime */}
                  <td className="py-3.5 px-3 sm:px-4 font-semibold text-[#101828]">
                    {day.daytimeLiters} L
                  </td>

                  {/* Overnight Flow */}
                  <td className="py-3.5 px-3 sm:px-4">
                    <div className="flex flex-col">
                      <span className={`font-semibold ${isAnomalous ? 'text-[#F04438] font-extrabold' : 'text-[#101828]'}`}>
                        {day.overnightLiters} L
                      </span>
                      {declaredLiters > 0 && (
                        <span className="text-[10px] text-[#667085]">
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
                                  ? 'bg-[#FEF3F2] text-[#F04438] border border-[#F04438]/30'
                                  : 'bg-[#FFFAEB] text-[#F79009] border border-[#F79009]/30'
                                : 'bg-[#F2F4F7] text-[#667085]'
                            }`}
                          >
                            {b}L
                          </span>
                        );
                      })}
                      {day.flow_shape === 'CONTINUOUS' ? (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-[#FEF3F2] text-[#F04438] font-bold border border-[#F04438]/30">
                          Trickle
                        </span>
                      ) : day.flow_shape === 'BURST' ? (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-[#EFF4FF] text-[#2F6FED] font-semibold border border-[#2F6FED]/20">
                          Burst
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Total Liters */}
                  <td className="py-3.5 px-3 sm:px-4 font-bold text-[#101828]">
                    {day.liters} L
                  </td>

                  {/* 14d rolling avg */}
                  <td className="py-3.5 px-3 sm:px-4 text-[#667085]">
                    {Math.round(day.rolling_avg)} L
                  </td>

                  {/* Peer avg */}
                  <td className="py-3.5 px-3 sm:px-4 text-[#667085]">
                    {day.peer_avg} L
                  </td>

                  {/* Status Pill: Colored dot + text (green / amber / red) */}
                  <td className="py-3.5 px-3 sm:px-4">
                    {isAnomalous ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3F2] text-[#F04438] text-[11px] font-bold border border-[#F04438]/30 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F04438] animate-ping" />
                        Leak Flagged
                      </span>
                    ) : day.is_overnight_burst ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF4FF] text-[#2F6FED] text-[11px] font-medium border border-[#2F6FED]/20">
                        Burst
                      </span>
                    ) : isElevatedUnflagged ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFAEB] text-[#F79009] text-[11px] font-semibold border border-[#F79009]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F79009]" />
                        Monitoring
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF3] text-[#12B76A] text-[11px] font-semibold border border-[#12B76A]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
                        Normal
                      </span>
                    )}
                  </td>

                  {/* Action Link: Blue text */}
                  <td className="py-3.5 px-4 sm:px-5 text-right">
                    <button
                      onClick={() => setSelectedDayDetail(day)}
                      className="text-[#2F6FED] hover:underline font-semibold cursor-pointer text-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E4E7EC] w-full max-w-sm overflow-hidden p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <h3 className="text-sm font-bold text-[#101828]">Scheduled Overnight Usage</h3>
              <button onClick={() => setIsEditingScheduled(false)} className="text-[#667085] hover:text-[#101828]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveScheduled} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1">
                  Expected Overnight Liters (L/night)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="1"
                  value={tempScheduled}
                  onChange={(e) => setTempScheduled(e.target.value)}
                  className="w-full text-sm font-bold bg-[#FFFFFF] border border-[#E4E7EC] rounded-lg px-4 py-2 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                />
                <p className="text-xs text-[#667085] mt-1.5">
                  Enter baseline for sprinkler, water softener, or automatic appliances running overnight.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => setIsEditingScheduled(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#667085] hover:text-[#101828] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2458C7] rounded-lg shadow-sm cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E4E7EC] w-full max-w-md overflow-hidden p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <div>
                <h3 className="text-base font-bold text-[#101828]">Day Details: {selectedDayDetail.date}</h3>
                <span className="text-xs text-[#667085]">Dual-Signal Telemetry &amp; 5-Hourly Flow Breakdown</span>
              </div>
              <button onClick={() => setSelectedDayDetail(null)} className="text-[#667085] hover:text-[#101828]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Overnight Hourly Buckets */}
              <div className="bg-[#F8F9FB] p-3.5 rounded-xl border border-[#E4E7EC]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#101828]">Overnight Hourly Buckets</span>
                  <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${
                    selectedDayDetail.flow_shape === 'CONTINUOUS'
                      ? 'bg-[#FEF3F2] text-[#F04438] border border-[#F04438]/30'
                      : 'bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20'
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
                    <div key={i} className="bg-[#FFFFFF] p-2 rounded-lg border border-[#E4E7EC] flex flex-col">
                      <span className="text-[10px] text-[#667085] font-semibold">{i + 1} AM</span>
                      <span className="text-sm font-bold mt-0.5 text-[#101828]">
                        {b} L
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-[#667085] mt-2">
                  {selectedDayDetail.flow_shape === 'CONTINUOUS'
                    ? 'Elevated consistently across buckets — signature of continuous leak.'
                    : 'Unattended overnight flow pattern within standard boundaries.'}
                </p>
              </div>

              {/* Volume Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC]">
                  <span className="text-[#667085] block">Daytime Usage</span>
                  <span className="text-base font-bold text-[#101828] mt-0.5">{selectedDayDetail.daytimeLiters} L</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC]">
                  <span className="text-[#667085] block">Total Overnight</span>
                  <span className="text-base font-bold text-[#101828] mt-0.5">{selectedDayDetail.overnightLiters} L</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex justify-end">
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2458C7] rounded-lg shadow-sm cursor-pointer"
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
