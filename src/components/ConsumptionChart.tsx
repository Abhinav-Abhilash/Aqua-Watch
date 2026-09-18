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
  const { timeline: contextTimeline, selectedHousehold: contextHousehold, theme } = useAqua();
  const timeline = propTimeline || contextTimeline;
  const household = propHousehold || contextHousehold;
  const [timeRange, setTimeRange] = useState<'14d' | '30d' | '60d'>('30d');

  const isDark = theme === 'dark';
  const blueColor = isDark ? '#5B8DEF' : '#2F6FED';
  const peerStroke = isDark ? '#6B7280' : '#667085';
  const rollingStroke = isDark ? '#3E4452' : '#D0D5DD';
  const anomalyColor = isDark ? '#F97066' : '#F04438';
  const gridColor = isDark ? '#2A2D35' : '#F0F1F3';
  const axisColor = isDark ? '#2A2D35' : '#E4E7EC';
  const tickColor = isDark ? '#9AA0AC' : '#667085';

  // Filter timeline according to selected range
  const displayData = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    const count = timeRange === '14d' ? 14 : timeRange === '30d' ? 30 : 60;
    return timeline.slice(-count).map(item => ({
      ...item,
      shortDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [timeline, timeRange]);

  // Custom dot renderer: Red for anomaly data points, Blue for normal
  const renderCustomDot = (props: any): React.ReactElement => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) {
      return <g key={props.key || payload?.date || Math.random().toString()} />;
    }

    if (payload?.is_anomalous) {
      return (
        <g key={`dot-${payload.date}`}>
          <circle cx={cx} cy={cy} r={7} fill={anomalyColor} fillOpacity={0.25} className="animate-ping" />
          <circle cx={cx} cy={cy} r={5} fill={anomalyColor} stroke={isDark ? '#1E2128' : '#FFFFFF'} strokeWidth={2} />
        </g>
      );
    }

    return (
      <circle
        key={`dot-${payload?.date || Math.random().toString()}`}
        cx={cx}
        cy={cy}
        r={2.5}
        fill={blueColor}
        stroke={isDark ? '#1E2128' : '#FFFFFF'}
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
        <div className="bg-[#FFFFFF] p-3.5 rounded-xl shadow-lg border border-[#E4E7EC] text-xs max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-2 mb-2">
            <span className="font-semibold text-[#101828]">{data.date}</span>
            {data.is_anomalous ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3F2] text-[#F04438] border border-[#F04438]/30">
                Anomaly (&gt;2.5σ)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#ECFDF3] text-[#12B76A]">
                Normal
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-[#667085] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F6FED] inline-block mr-1.5" />
                Household Usage:
              </span>
              <strong className="text-[#101828] font-bold">{data.liters} L</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center text-[#667085]">
                <span className="w-2.5 h-0.5 bg-[#667085] inline-block mr-1.5" />
                {household.locality} Peers Avg:
              </span>
              <span className="text-[#667085] font-medium">{data.peer_avg} L</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center text-[#98A2B3]">
                <span className="w-2.5 h-0.5 bg-[#D0D5DD] inline-block mr-1.5" />
                14-Day Rolling Avg:
              </span>
              <span className="text-[#667085]">{data.rolling_avg} L</span>
            </div>

            {data.is_anomalous && (
              <div className="text-[#F04438] font-semibold pt-1 border-t border-[#E4E7EC] text-[11px]">
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
    <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E4E7EC] shadow-xs">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E7EC] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-[#101828]">Consumption Timeline</h2>
            <span className="text-xs font-normal text-[#667085]">
              (Household vs. Similar {household.locality} Peers)
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            Solid blue is {household.name}; dashed grey is the {household.locality} peer average ({household.occupants} occupants).
          </p>
        </div>

        {/* Time range selector — Pill-shaped selector */}
        <div className="flex items-center space-x-1 bg-[#F8F9FB] p-1 rounded-full border border-[#E4E7EC] self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-[#667085] ml-1.5 mr-0.5" />
          <button
            onClick={() => setTimeRange('14d')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${timeRange === '14d'
                ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold border border-[#2F6FED]/20'
                : 'text-[#667085] hover:text-[#101828]'
              }`}
          >
            14 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${timeRange === '30d'
                ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold border border-[#2F6FED]/20'
                : 'text-[#667085] hover:text-[#101828]'
              }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('60d')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${timeRange === '60d'
                ? 'bg-[#EFF4FF] text-[#2F6FED] font-semibold border border-[#2F6FED]/20'
                : 'text-[#667085] hover:text-[#101828]'
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="shortDate"
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
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
            />

            {/* Peer Average Reference Line — Grey Dashed */}
            <Line
              type="monotone"
              dataKey="peer_avg"
              name={`Similar Peers Avg (${household.locality})`}
              stroke={peerStroke}
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

            {/* 14-Day Rolling Avg — Baseline Line */}
            <Line
              type="monotone"
              dataKey="rolling_avg"
              name="14-Day Rolling Baseline"
              stroke={rollingStroke}
              strokeWidth={1.5}
              dot={false}
            />

            {/* Household Daily Usage Line — Solid Blue */}
            <Line
              type="monotone"
              dataKey="liters"
              name={`${household.name} (Actual L/day)`}
              stroke={blueColor}
              strokeWidth={2.5}
              dot={renderCustomDot}
              activeDot={{ r: 6, fill: blueColor, stroke: isDark ? '#1E2128' : '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="mt-3 pt-3 border-t border-[#E4E7EC] flex flex-wrap items-center justify-between text-xs text-[#667085] gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F04438] inline-block" />
            <span className="font-semibold text-[#101828]">Red markers</span>
            <span>= Flagged anomalies (&gt;2.5σ baseline breach)</span>
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[#667085]">
          <Info className="w-3.5 h-3.5 text-[#2F6FED]" />
          <span>Expected weekend lift (+15-20%) on Saturdays and Sundays</span>
        </div>
      </div>

    </div>
  );
}
