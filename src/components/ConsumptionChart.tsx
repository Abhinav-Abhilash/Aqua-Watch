'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { DayAnalysis, Household } from '@/types';
import { Calendar, Info } from 'lucide-react';

interface ConsumptionChartProps {
  timeline: DayAnalysis[];
  household: Household;
}

export default function ConsumptionChart({ timeline, household }: ConsumptionChartProps) {
  const [timeRange, setTimeRange] = useState<'14d' | '30d' | '60d'>('30d');

  // Filter timeline according to selected range
  const displayData = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    const count = timeRange === '14d' ? 14 : timeRange === '30d' ? 30 : 60;
    return timeline.slice(-count).map(item => ({
      ...item,
      // Format short date for X axis e.g. "Oct 12"
      shortDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [timeline, timeRange]);

  // Custom dot renderer to highlight anomalous readings with a pulsating/colored ring
  const renderCustomDot = (props: any): React.ReactElement => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) {
      return <g key={props.key || payload?.date || Math.random().toString()} />;
    }

    if (payload?.is_anomalous) {
      return (
        <g key={`dot-${payload.date}`}>
          <circle cx={cx} cy={cy} r={7} fill="#f43f5e" fillOpacity={0.3} className="animate-ping" />
          <circle cx={cx} cy={cy} r={5} fill="#e11d48" stroke="#ffffff" strokeWidth={2} />
        </g>
      );
    }

    return (
      <circle
        key={`dot-${payload?.date || Math.random().toString()}`}
        cx={cx}
        cy={cy}
        r={2.5}
        fill="#0284c7"
        stroke="#ffffff"
        strokeWidth={1}
      />
    );
  };

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DayAnalysis & { shortDate: string } = payload[0].payload;
      const excess = data.liters - data.rolling_avg;

      return (
        <div className="bg-white p-3.5 rounded-xl shadow-lg border border-slate-200 text-xs max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <span className="font-semibold text-slate-800">{data.date}</span>
            {data.is_anomalous ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                Anomaly (&gt;2.5σ)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                Normal
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600 inline-block mr-1.5" />
                Household Usage:
              </span>
              <strong className="text-slate-900 font-bold">{data.liters} L</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center text-slate-500">
                <span className="w-2.5 h-0.5 bg-slate-400 inline-block mr-1.5" />
                {household.locality} Peers Avg:
              </span>
              <span className="text-slate-700 font-medium">{data.peer_avg} L</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center text-slate-500">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block mr-1.5" />
                14-Day Rolling Avg:
              </span>
              <span className="text-slate-700">{data.rolling_avg} L</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
              <span>Threshold (μ + 2.5σ):</span>
              <span>{Math.round(data.rolling_avg + 2.5 * data.rolling_stddev)} L</span>
            </div>

            {data.is_anomalous && (
              <div className="text-rose-600 font-medium pt-1 text-[11px]">
                Excess: +{Math.round(excess)} L above baseline
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">Consumption Timeline</h2>
            <span className="text-xs font-normal text-slate-500">
              (Household vs. Similar {household.locality} Peers)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Solid blue is {household.name}; dashed slate is the {household.locality} peer average ({household.occupants} occupants).
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          <button
            onClick={() => setTimeRange('14d')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
              timeRange === '14d'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 14 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
              timeRange === '30d'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('60d')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
              timeRange === '60d'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full 60 Days
          </button>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="mt-4 w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayData}
            margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="shortDate"
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
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
            />

            {/* Peer Average Reference Line */}
            <Line
              type="monotone"
              dataKey="peer_avg"
              name={`Similar Peers Avg (${household.locality})`}
              stroke="#64748b"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

            {/* 14-Day Rolling Avg */}
            <Line
              type="monotone"
              dataKey="rolling_avg"
              name="14-Day Rolling Baseline"
              stroke="#0ea5e9"
              strokeOpacity={0.6}
              strokeWidth={1.5}
              dot={false}
            />

            {/* Household Daily Usage Line */}
            <Line
              type="monotone"
              dataKey="liters"
              name={`${household.name} (Actual L/day)`}
              stroke="#0284c7"
              strokeWidth={2.5}
              dot={renderCustomDot}
              activeDot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer / Annotation */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block ring-2 ring-rose-200" />
            <span className="font-medium text-slate-700">Red markers</span>
            <span>= Anomalies &gt; 2.5σ above rolling baseline</span>
          </span>
        </div>
        <div className="flex items-center space-x-1 text-slate-400">
          <Info className="w-3.5 h-3.5" />
          <span>Notice natural weekend lifts (+15-20%) on Saturdays and Sundays</span>
        </div>
      </div>

    </div>
  );
}
