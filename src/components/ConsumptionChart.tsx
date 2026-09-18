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
  Legend
} from 'recharts';
import { DayAnalysis, Household } from '@/types';
import { Calendar, Info } from 'lucide-react';
import { useAqua } from '@/context/AquaContext';

interface ConsumptionChartProps {
  timeline?: DayAnalysis[];
  household?: Household;
}

export default function ConsumptionChart({ timeline: propTimeline, household: propHousehold }: ConsumptionChartProps = {}) {
  const { timeline: contextTimeline, selectedHousehold: contextHousehold } = useAqua();
  const timeline = propTimeline || contextTimeline;
  const household = propHousehold || contextHousehold;
  const [timeRange, setTimeRange] = useState<'14d' | '30d' | '60d'>('30d');

  // Filter timeline according to selected range
  const displayData = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    const count = timeRange === '14d' ? 14 : timeRange === '30d' ? 30 : 60;
    return timeline.slice(-count).map(item => ({
      ...item,
      shortDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [timeline, timeRange]);

  // Custom dot renderer: single muted red accent #B8564A for anomaly data points
  const renderCustomDot = (props: any): React.ReactElement => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) {
      return <g key={props.key || payload?.date || Math.random().toString()} />;
    }

    if (payload?.is_anomalous) {
      return (
        <g key={`dot-${payload.date}`}>
          <circle cx={cx} cy={cy} r={7} fill="#B8564A" fillOpacity={0.25} className="animate-ping" />
          <circle cx={cx} cy={cy} r={5} fill="#B8564A" stroke="#FAFAFA" strokeWidth={2} />
        </g>
      );
    }

    return (
      <circle
        key={`dot-${payload?.date || Math.random().toString()}`}
        cx={cx}
        cy={cy}
        r={2.5}
        fill="#1A1A1A"
        stroke="#FAFAFA"
        strokeWidth={1}
      />
    );
  };

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayAnalysis & { shortDate: string } = payload[0].payload;
      const excess = data.liters - data.rolling_avg;

      return (
        <div className="bg-[#FAFAFA] p-3.5 rounded-2xl shadow-lg border border-[#DCDCDC] text-xs max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-[#DCDCDC] pb-2 mb-2">
            <span className="font-semibold text-[#1A1A1A]">{data.date}</span>
            {data.is_anomalous ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F9ECEB] text-[#B8564A] border border-[#B8564A]/30">
                Anomaly (&gt;2.5σ)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#E0E0E0] text-[#1A1A1A]">
                Normal
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-[#6B6B6B] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] inline-block mr-1.5" />
                Household Usage:
              </span>
              <strong className="text-[#1A1A1A] font-bold">{data.liters} L</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center text-[#8A8A8A]">
                <span className="w-2.5 h-0.5 bg-[#8A8A8A] inline-block mr-1.5" />
                {household.locality} Peers Avg:
              </span>
              <span className="text-[#6B6B6B] font-medium">{data.peer_avg} L</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center text-[#8A8A8A]">
                <span className="w-2.5 h-0.5 bg-[#B0B0B0] inline-block mr-1.5" />
                14-Day Rolling Avg:
              </span>
              <span className="text-[#6B6B6B]">{data.rolling_avg} L</span>
            </div>

            {data.is_anomalous && (
              <div className="text-[#B8564A] font-semibold pt-1 border-t border-[#DCDCDC] text-[11px]">
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
    <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-[#DCDCDC]">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCDCDC] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-[#1A1A1A]">Consumption Timeline</h2>
            <span className="text-xs font-normal text-[#8A8A8A]">
              (Household vs. Similar {household.locality} Peers)
            </span>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            Solid black is {household.name}; dashed grey is the {household.locality} peer average ({household.occupants} occupants).
          </p>
        </div>

        {/* Time range selector — Pill-shaped selector */}
        <div className="flex items-center space-x-1 bg-[#E0E0E0] p-1 rounded-full border border-[#DCDCDC] self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-[#6B6B6B] ml-1.5 mr-0.5" />
          <button
            onClick={() => setTimeRange('14d')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
              timeRange === '14d'
                ? 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            14 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
              timeRange === '30d'
                ? 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('60d')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
              timeRange === '60d'
                ? 'bg-[#1A1A1A] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            60 Days
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis
              dataKey="shortDate"
              tickLine={false}
              axisLine={{ stroke: '#DCDCDC' }}
              tick={{ fill: '#8A8A8A', fontSize: 11 }}
              minTickGap={20}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#DCDCDC' }}
              tick={{ fill: '#8A8A8A', fontSize: 11 }}
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

            {/* Peer Average Reference Line — Mid-Grey Dashed */}
            <Line
              type="monotone"
              dataKey="peer_avg"
              name={`Similar Peers Avg (${household.locality})`}
              stroke="#8A8A8A"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

            {/* 14-Day Rolling Avg — Light/Mid Grey Line */}
            <Line
              type="monotone"
              dataKey="rolling_avg"
              name="14-Day Rolling Baseline"
              stroke="#B0B0B0"
              strokeWidth={1.5}
              dot={false}
            />

            {/* Household Daily Usage Line — Solid Black #1A1A1A */}
            <Line
              type="monotone"
              dataKey="liters"
              name={`${household.name} (Actual L/day)`}
              stroke="#1A1A1A"
              strokeWidth={2.5}
              dot={renderCustomDot}
              activeDot={{ r: 6, fill: '#1A1A1A', stroke: '#FAFAFA', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="mt-3 pt-3 border-t border-[#DCDCDC] flex flex-wrap items-center justify-between text-xs text-[#8A8A8A] gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8564A] inline-block" />
            <span className="font-medium text-[#1A1A1A]">Red markers</span>
            <span>= Flagged anomalies (&gt;2.5σ baseline breach)</span>
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[#8A8A8A]">
          <Info className="w-3.5 h-3.5" />
          <span>Expected weekend lift (+15-20%) on Saturdays and Sundays</span>
        </div>
      </div>

    </div>
  );
}
