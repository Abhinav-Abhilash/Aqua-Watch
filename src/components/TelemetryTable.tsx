'use client';

import React, { useState } from 'react';
import { useAqua } from '@/context/AquaContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface TelemetryTableProps {
  onOpenDetails: (date: string) => void;
}

export default function TelemetryTable({ onOpenDetails }: TelemetryTableProps) {
  const { timeline, selectedHousehold } = useAqua();
  const [filterRange, setFilterRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [showChart, setShowChart] = useState(true);

  const count = filterRange === '7d' ? 7 : filterRange === '14d' ? 14 : 30;
  const chartDays = timeline.slice(-count);
  const recentDays = [...chartDays].reverse();

  const chartData = chartDays.map(d => ({
    date: d.date.slice(5), // MM-DD
    fullDate: d.date,
    daytime: d.daytimeLiters,
    overnight: d.overnightLiters,
    total: d.liters,
    baseline: Math.round(d.rolling_avg)
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      
      {/* Table Header Toolbar */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-base text-slate-900 tracking-tight">
              Consumption Telemetry &amp; Dual-Signal Analysis
            </h2>
            <button
              onClick={() => setShowChart(!showChart)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-primary hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                {showChart ? 'expand_less' : 'show_chart'}
              </span>
              <span>{showChart ? 'Hide Trend Chart' : 'View Dual-Signal Chart'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time calibrated readings: Daytime domestic activity vs. Overnight minimum idle flow
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterRange('7d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setFilterRange('14d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterRange === '14d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setFilterRange('30d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Dual-Signal Trendline Chart */}
      {showChart && (
        <div className="px-5 pt-4 pb-2 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">Dual-Signal Telemetry Trend (Liters/Day)</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-primary font-semibold">
                <span className="w-2.5 h-0.5 bg-[#2F6FED]" /> Daytime Activity (~6am-11pm)
              </span>
              <span className="flex items-center gap-1 text-purple-600 font-semibold">
                <span className="w-2.5 h-0.5 bg-[#9333EA]" /> Overnight Minimum Flow (~11pm-6am)
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
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs">
                          <p className="font-bold text-slate-900 mb-1">{data.fullDate}</p>
                          <p className="text-primary font-semibold">Daytime: {data.daytime} L</p>
                          <p className="text-purple-600 font-semibold">Overnight: {data.overnight} L</p>
                          <p className="text-slate-800 font-bold border-t border-slate-100 pt-1 mt-1">Total: {data.total} L (Baseline: {data.baseline} L)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="daytime" name="Daytime" stroke="#2F6FED" strokeWidth={2.2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="overnight" name="Overnight" stroke="#9333EA" strokeWidth={2.2} dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[680px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-4">Daytime</th>
              <th className="py-3 px-4">Overnight</th>
              <th className="py-3 px-4">Total (L)</th>
              <th className="py-3 px-4">14-Day Baseline</th>
              <th className="py-3 px-4">Peer Avg ({selectedHousehold.locality})</th>
              <th className="py-3 px-4">Variance vs Peer</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {recentDays.map((day) => {
              const peerDiff = day.peer_avg > 0
                ? Math.round(((day.liters - day.peer_avg) / day.peer_avg) * 100)
                : 0;
              const isAnomalous = day.is_anomalous;
              const isElevatedUnflagged = day.is_elevated_unflagged;

              return (
                <tr
                  key={day.date}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isAnomalous ? 'bg-red-50/40' : isElevatedUnflagged ? 'bg-amber-50/30' : ''
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

                  {/* Overnight */}
                  <td className={`py-3.5 px-4 font-semibold ${day.overnightLiters > 25 ? 'text-error font-bold' : 'text-purple-700'}`}>
                    {day.overnightLiters} L
                  </td>

                  {/* Liters */}
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

                  {/* Variance */}
                  <td className="py-3.5 px-4 font-semibold">
                    <span className={peerDiff > 20 ? 'text-error' : peerDiff < -10 ? 'text-emerald-600' : 'text-slate-600'}>
                      {peerDiff > 0 ? `+${peerDiff}%` : `${peerDiff}%`}
                    </span>
                  </td>

                  {/* Status Pill */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isAnomalous ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-error text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                        Leak Flagged
                      </span>
                    ) : isElevatedUnflagged ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Single Spike (Monitoring)
                      </span>
                    ) : day.liters < day.rolling_avg * 0.85 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-primary text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Optimized
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
                      onClick={() => onOpenDetails(day.date)}
                      className="text-primary hover:text-blue-800 font-semibold cursor-pointer"
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

    </div>
  );
}
