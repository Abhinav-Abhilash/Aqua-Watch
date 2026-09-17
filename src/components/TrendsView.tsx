'use client';

import React, { useState, useMemo } from 'react';
import { useAqua } from '@/context/AquaContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function TrendsView() {
  const { timeline, selectedHousehold, leakStatus } = useAqua();
  const [dualRange, setDualRange] = useState<'14d' | '30d' | '60d'>('30d');

  // Dual-signal daytime vs overnight data
  const dualRangeCount = dualRange === '14d' ? 14 : dualRange === '30d' ? 30 : 60;
  const dualSignalData = useMemo(() => {
    return timeline.slice(-dualRangeCount).map(d => ({
      date: d.date.slice(5), // MM-DD
      fullDate: d.date,
      daytime: d.daytimeLiters,
      overnight: d.overnightLiters,
      effectiveOvernight: d.effectiveOvernightLiters ?? d.overnightLiters,
      total: d.liters,
      daytimeAvg: Math.round(d.rolling_daytime_avg),
      overnightAvg: Math.round(d.rolling_overnight_avg),
      daytimeThreshold: Math.round(d.rolling_daytime_avg + 2.5 * (d.rolling_stddev * 0.8 || 20)),
      isAnomalous: d.is_anomalous,
      isOvernightAnomalous: d.is_overnight_anomalous,
      flowShape: d.flow_shape || 'NORMAL'
    }));
  }, [timeline, dualRangeCount]);

  // 4-Week Usage vs Peer Group Bar Chart Data
  const weeklyData = useMemo(() => {
    if (!timeline || timeline.length < 7) return [];
    
    // Take up to last 28 days in 4 chunks of 7 days
    const last28 = timeline.slice(-28);
    const weeks = [];
    const numWeeks = Math.min(4, Math.floor(last28.length / 7));

    for (let i = 0; i < numWeeks; i++) {
      const startIdx = last28.length - (numWeeks - i) * 7;
      const weekSlice = last28.slice(startIdx, startIdx + 7);
      if (weekSlice.length === 0) continue;

      const householdSum = weekSlice.reduce((acc, d) => acc + d.liters, 0);
      const peerSum = Math.round(weekSlice.reduce((acc, d) => acc + (d.peer_avg || 340), 0));
      const startDate = weekSlice[0].date.slice(5);
      const endDate = weekSlice[weekSlice.length - 1].date.slice(5);
      const isCurrentWeek = i === numWeeks - 1;

      weeks.push({
        label: isCurrentWeek ? 'This Week' : `${startDate} – ${endDate}`,
        weekNum: `W-${numWeeks - 1 - i}`,
        householdTotal: householdSum,
        peerTotal: peerSum,
        diffPercent: peerSum > 0 ? Math.round(((householdSum - peerSum) / peerSum) * 100) : 0
      });
    }

    return weeks;
  }, [timeline]);

  // Zoomed-in Overnight Only Trendline Data (Last 14 Days)
  const latestAnalysis = timeline[timeline.length - 1];
  const overnightStdDev = latestAnalysis?.rolling_overnight_stddev || 6;
  const overnightThreshold = Math.round(
    leakStatus.rollingOvernightAvgLiters + 2.5 * overnightStdDev
  );

  const overnightTrendData = useMemo(() => {
    return timeline.slice(-14).map(d => ({
      date: d.date.slice(5),
      fullDate: d.date,
      overnight: d.overnightLiters,
      effectiveOvernight: d.effectiveOvernightLiters ?? d.overnightLiters,
      isLeakElevated: d.is_overnight_anomalous,
      flowShape: d.flow_shape || (d.overnightLiters > overnightThreshold ? 'CONTINUOUS' : 'NORMAL'),
      burst: d.is_overnight_burst
    }));
  }, [timeline, overnightThreshold]);

  return (
    <div className="space-y-6">
      
      {/* 1. Main Full-Size Dual-Signal Chart (Daytime vs Overnight) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Dual-signal consumption trend
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Separates daytime usage from overnight flow to detect unattended consumption.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded text-xs font-medium text-slate-600 self-start sm:self-auto">
            <button
              onClick={() => setDualRange('14d')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                dualRange === '14d' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              14 days
            </button>
            <button
              onClick={() => setDualRange('30d')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                dualRange === '30d' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              30 days
            </button>
            <button
              onClick={() => setDualRange('60d')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                dualRange === '60d' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              60 days
            </button>
          </div>
        </div>

        {/* Dual Chart Canvas */}
        <div className="mt-5 w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dualSignalData} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
                minTickGap={20}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
                unit=" L"
                label={{ value: 'Liters / Day', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3.5 rounded-lg shadow-lg border border-slate-200 text-xs max-w-xs z-50">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                          <span className="font-bold text-slate-800">{data.fullDate}</span>
                          {data.isAnomalous && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
                              Alert active
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#2F6FED] font-medium">Daytime draw:</span>
                            <strong className="text-slate-800">{data.daytime} L</strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Overnight flow:</span>
                            <strong className="text-slate-800">{data.overnight} L</strong>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-slate-500">
                            <span>Total usage:</span>
                            <strong className="text-slate-900">{data.total} L</strong>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
              />
              <Line
                type="monotone"
                dataKey="daytime"
                name="Daytime usage (6am - 11pm)"
                stroke="#2F6FED"
                strokeWidth={2}
                dot={{ r: 2.5, fill: '#2F6FED' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="overnight"
                name="Overnight flow (11pm - 6am)"
                stroke="#64748b"
                strokeWidth={2}
                dot={{ r: 2.5, fill: '#64748b' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Daytime: primary occupant living activity</span>
          <span>Overnight: calibrated unattended baseline check</span>
        </div>
      </div>

      {/* 2. Side-by-Side Lower Trends: 4-Week Peer Bar Chart & Zoomed-In Overnight Trendline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chart A: 4-Week Household vs. Peer Group Weekly Totals */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-none p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                4-week usage vs. peer group
              </h3>
              <span className="text-xs text-slate-500 font-normal">
                Weekly total (L)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-4">
              Comparing 7-day cumulative consumption for {selectedHousehold.name} vs. {selectedHousehold.locality} peer average ({selectedHousehold.occupants} occupants).
            </p>

            {/* Recharts Bar Chart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    unit=" L"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs">
                            <div className="font-bold text-slate-800 mb-1.5">{d.label}</div>
                            <div className="text-[#2F6FED] font-semibold">{selectedHousehold.name}: {d.householdTotal} L</div>
                            <div className="text-slate-500">Peers: {d.peerTotal} L</div>
                            <div className={`mt-1 font-bold ${d.diffPercent > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                              {d.diffPercent > 0 ? `+${d.diffPercent}% above peers` : `${Math.abs(d.diffPercent)}% below peers`}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={30}
                    iconType="rect"
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                  <Bar dataKey="householdTotal" name={`${selectedHousehold.name}`} fill="#2F6FED" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="peerTotal" name="Peer group average" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Aggregated 7-day blocks</span>
            <span>Active meter logs</span>
          </div>
        </div>

        {/* Chart B: Dedicated Zoomed-In Overnight Leak Signal */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-none p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Overnight leak signal
              </h3>
              <span className="text-xs text-slate-500 font-normal">
                0 – 160L scale
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-4">
              Dedicated high-resolution view of late-night flow (11pm–6am). Isolates leak signals that get lost next to daytime numbers.
            </p>

            {/* Recharts Zoomed Overnight Line Chart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overnightTrendData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 'dataMax + 25']}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    unit=" L"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs">
                            <div className="font-bold text-slate-800 mb-1">{d.fullDate}</div>
                            <div className="text-slate-700">Overnight flow: <strong className="font-bold">{d.overnight} L</strong></div>
                            <div className="text-slate-500">Threshold: ~{overnightThreshold} L</div>
                            <div className="mt-1 text-[11px]">
                              Flow pattern: <strong className={d.flowShape === 'CONTINUOUS' ? 'text-red-700' : d.flowShape === 'BURST' ? 'text-amber-700' : 'text-emerald-700'}>
                                {d.flowShape}
                              </strong>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Reference Line for Overnight Anomaly Threshold */}
                  <ReferenceLine
                    y={overnightThreshold}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{
                      value: `Leak threshold (~${overnightThreshold}L)`,
                      fill: '#ef4444',
                      fontSize: 10,
                      position: 'insideTopRight'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="overnight"
                    name="Overnight flow (L)"
                    stroke="#2F6FED"
                    strokeWidth={2}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (!cx || !cy) return <g key={props.key} />;
                      const isHigh = payload.overnight >= overnightThreshold;
                      return (
                        <circle
                          key={props.key || payload.date}
                          cx={cx}
                          cy={cy}
                          r={isHigh ? 4.5 : 2.5}
                          fill={isHigh ? '#ef4444' : '#2F6FED'}
                          stroke="#ffffff"
                          strokeWidth={1}
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Dotted red line: threshold</span>
            <span>Normal baseline: 5–15 L/night</span>
          </div>
        </div>

      </div>

    </div>
  );
}
