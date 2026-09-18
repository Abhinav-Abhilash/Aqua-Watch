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
  const { timeline, selectedHousehold, leakStatus, theme } = useAqua();
  const [dualRange, setDualRange] = useState<'14d' | '30d' | '60d'>('30d');

  const isDark = theme === 'dark';
  const blueColor = isDark ? '#5B8DEF' : '#2F6FED';
  const overnightStroke = isDark ? '#6B7280' : '#667085';
  const leakColor = isDark ? '#F97066' : '#F04438';
  const peerBarColor = isDark ? '#2A2D35' : '#E4E7EC';
  const gridColor = isDark ? '#2A2D35' : '#F0F1F3';
  const axisColor = isDark ? '#2A2D35' : '#E4E7EC';
  const tickColor = isDark ? '#9AA0AC' : '#667085';

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
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] p-4 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#E4E7EC] gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#101828]">
              Dual-Signal Consumption Trend
            </h2>
            <p className="text-xs text-[#667085] mt-0.5">
              Separates daytime usage from overnight flow to detect unattended consumption.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#F8F9FB] p-1 rounded-full border border-[#E4E7EC] text-xs font-semibold text-[#667085]">
            <button
              onClick={() => setDualRange('14d')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                dualRange === '14d' ? 'bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20 font-bold' : 'hover:text-[#101828]'
              }`}
            >
              14 days
            </button>
            <button
              onClick={() => setDualRange('30d')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                dualRange === '30d' ? 'bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20 font-bold' : 'hover:text-[#101828]'
              }`}
            >
              30 days
            </button>
            <button
              onClick={() => setDualRange('60d')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                dualRange === '60d' ? 'bg-[#EFF4FF] text-[#2F6FED] border border-[#2F6FED]/20 font-bold' : 'hover:text-[#101828]'
              }`}
            >
              60 days
            </button>
          </div>
        </div>

        {/* Dual Chart Canvas */}
        <div className="mt-5 w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dualSignalData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: axisColor }}
                tick={{ fill: tickColor, fontSize: 11 }}
                minTickGap={20}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: axisColor }}
                tick={{ fill: tickColor, fontSize: 11 }}
                unit=" L"
                label={{ value: 'Liters / Day', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#FFFFFF] p-3.5 rounded-xl shadow-lg border border-[#E4E7EC] text-xs max-w-xs z-50">
                        <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-1.5 mb-2">
                          <span className="font-bold text-[#101828]">{data.fullDate}</span>
                          {data.isAnomalous && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3F2] text-[#F04438]">
                              Leak Flagged
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#2F6FED] font-medium">Daytime draw:</span>
                            <strong className="text-[#101828]">{data.daytime} L</strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#667085] font-medium">Overnight flow:</span>
                            <strong className="text-[#101828]">{data.overnight} L</strong>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-[#E4E7EC] text-[#667085]">
                            <span>Total usage:</span>
                            <strong className="text-[#101828]">{data.total} L</strong>
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
              {/* Daytime Line: Solid Blue */}
              <Line
                type="monotone"
                dataKey="daytime"
                name="Daytime usage (6am - 11pm)"
                stroke={blueColor}
                strokeWidth={2.4}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (!cx || !cy) return <g key={props.key} />;
                  const isAnomalous = payload.isAnomalous;
                  return (
                    <circle
                      key={props.key || payload.date}
                      cx={cx}
                      cy={cy}
                      r={isAnomalous ? 5 : 2.5}
                      fill={isAnomalous ? leakColor : blueColor}
                      stroke={isDark ? '#1E2128' : '#FFFFFF'}
                      strokeWidth={1.5}
                    />
                  );
                }}
                activeDot={{ r: 5, fill: blueColor }}
              />
              {/* Overnight Line: Grey, dashed */}
              <Line
                type="monotone"
                dataKey="overnight"
                name="Overnight flow (11pm - 6am)"
                stroke={overnightStroke}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2.5, fill: overnightStroke }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E4E7EC] flex flex-wrap items-center justify-between text-xs text-[#667085] gap-2">
          <span>Daytime: primary occupant living activity</span>
          <span>Overnight: calibrated unattended baseline check</span>
        </div>
      </div>

      {/* 2. Side-by-Side Lower Trends: 4-Week Peer Bar Chart & Zoomed-In Overnight Trendline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chart A: 4-Week Household vs. Peer Group Weekly Totals (Bars in blue & light grey) */}
        <div className="lg:col-span-6 bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E4E7EC] gap-2">
              <h3 className="font-bold text-[#101828] text-sm sm:text-base">
                4-Week Usage vs. Peer Group
              </h3>
              <span className="text-xs text-[#667085]">
                Weekly total (L)
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-2 mb-4">
              Comparing 7-day cumulative consumption for {selectedHousehold.name} vs. {selectedHousehold.locality} peer average ({selectedHousehold.occupants} occupants).
            </p>

            {/* Recharts Bar Chart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={{ stroke: axisColor }}
                    tick={{ fill: tickColor, fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: axisColor }}
                    tick={{ fill: tickColor, fontSize: 11 }}
                    unit=" L"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#FFFFFF] p-3 rounded-xl shadow-lg border border-[#E4E7EC] text-xs">
                            <div className="font-bold text-[#101828] mb-1.5">{d.label}</div>
                            <div className="text-[#2F6FED] font-semibold">{selectedHousehold.name}: {d.householdTotal} L</div>
                            <div className="text-[#667085]">Peers: {d.peerTotal} L</div>
                            <div className={`mt-1 font-bold ${d.diffPercent > 0 ? 'text-[#F04438]' : 'text-[#12B76A]'}`}>
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
                  {/* Household bars in Blue, Peer average in Grey */}
                  <Bar dataKey="householdTotal" name={`${selectedHousehold.name}`} fill={blueColor} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="peerTotal" name="Peer group average" fill={peerBarColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E4E7EC] text-[11px] text-[#667085] flex flex-wrap items-center justify-between gap-2">
            <span>Aggregated 7-day blocks</span>
            <span>Active meter logs</span>
          </div>
        </div>

        {/* Chart B: Dedicated Zoomed-In Overnight Leak Signal */}
        <div className="lg:col-span-6 bg-[#FFFFFF] rounded-2xl border border-[#E4E7EC] p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E4E7EC] gap-2">
              <h3 className="font-bold text-[#101828] text-sm sm:text-base">
                Overnight Leak Signal
              </h3>
              <span className="text-xs text-[#667085]">
                0 – 160L scale
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-2 mb-4">
              Dedicated high-resolution view of late-night flow (11pm–6am). Isolates leak signals that get lost next to daytime numbers.
            </p>

            {/* Recharts Zoomed Overnight Line Chart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overnightTrendData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: axisColor }}
                    tick={{ fill: tickColor, fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 'dataMax + 25']}
                    tickLine={false}
                    axisLine={{ stroke: axisColor }}
                    tick={{ fill: tickColor, fontSize: 11 }}
                    unit=" L"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#FFFFFF] p-3 rounded-xl shadow-lg border border-[#E4E7EC] text-xs">
                            <div className="font-bold text-[#101828] mb-1">{d.fullDate}</div>
                            <div className="text-[#101828]">Overnight flow: <strong className="font-bold">{d.overnight} L</strong></div>
                            <div className="text-[#667085]">Threshold: ~{overnightThreshold} L</div>
                            <div className="mt-1 text-[11px]">
                              Flow pattern: <strong className={d.flowShape === 'CONTINUOUS' ? 'text-[#F04438]' : 'text-[#101828]'}>
                                {d.flowShape}
                              </strong>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Red Accent for Leak Threshold */}
                  <ReferenceLine
                    y={overnightThreshold}
                    stroke={leakColor}
                    strokeDasharray="4 4"
                    label={{
                      value: `Leak threshold (~${overnightThreshold}L)`,
                      fill: leakColor,
                      fontSize: 10,
                      position: 'insideTopRight'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="overnight"
                    name="Overnight flow (L)"
                    stroke={overnightStroke}
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
                          fill={isHigh ? leakColor : overnightStroke}
                          stroke={isDark ? '#1E2128' : '#FFFFFF'}
                          strokeWidth={1}
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E4E7EC] text-[11px] text-[#667085] flex flex-wrap items-center justify-between gap-2">
            <span>Dotted red line: threshold (#F04438)</span>
            <span>Normal baseline: 5–15 L/night</span>
          </div>
        </div>

      </div>

    </div>
  );
}
