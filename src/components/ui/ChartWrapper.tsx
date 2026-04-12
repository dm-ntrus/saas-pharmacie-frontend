"use client";

import React from "react";
import { cn } from "@/utils/cn";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#ec4899", // pink-500
];

interface BaseChartProps {
  data: Record<string, unknown>[];
  title?: string;
  className?: string;
  height?: number;
  colors?: string[];
}

interface AxisChartProps extends BaseChartProps {
  xKey: string;
  yKey: string | string[];
}

interface PieChartWidgetProps extends BaseChartProps {
  dataKey: string;
  nameKey?: string;
}

function ChartContainer({
  title,
  className,
  height = 300,
  children,
}: {
  title?: string;
  className?: string;
  height: number;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </h4>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

const chartTooltipStyle = {
  contentStyle: {
    borderRadius: "0.5rem",
    border: "1px solid var(--color-slate-200, #e2e8f0)",
    backgroundColor: "var(--color-white, #fff)",
    fontSize: "0.75rem",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
};

function resolveYKeys(yKey: string | string[]): string[] {
  return Array.isArray(yKey) ? yKey : [yKey];
}

export function BarChartWidget({
  data,
  title,
  xKey,
  yKey,
  className,
  height = 300,
  colors = COLORS,
}: AxisChartProps) {
  const keys = resolveYKeys(yKey);
  return (
    <ChartContainer title={title} className={className} height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
        <YAxis tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
        <Tooltip {...chartTooltipStyle} />
        {keys.length > 1 && <Legend />}
        {keys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

export function LineChartWidget({
  data,
  title,
  xKey,
  yKey,
  className,
  height = 300,
  colors = COLORS,
}: AxisChartProps) {
  const keys = resolveYKeys(yKey);
  return (
    <ChartContainer title={title} className={className} height={height}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
        <YAxis tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
        <Tooltip {...chartTooltipStyle} />
        {keys.length > 1 && <Legend />}
        {keys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

export function PieChartWidget({
  data,
  title,
  dataKey,
  nameKey = "name",
  className,
  height = 300,
  colors = COLORS,
}: PieChartWidgetProps) {
  return (
    <ChartContainer title={title} className={className} height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={2}
          label={({ name, percent }) =>
            `${name} ${(((percent ?? 0) as number) * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip {...chartTooltipStyle} />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
}

export function AreaChartWidget({
  data,
  title,
  xKey,
  yKey,
  className,
  height = 300,
  colors = COLORS,
}: AxisChartProps) {
  const keys = resolveYKeys(yKey);
  return (
    <ChartContainer title={title} className={className} height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
        <YAxis tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
        <Tooltip {...chartTooltipStyle} />
        {keys.length > 1 && <Legend />}
        {keys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[i % colors.length]}
            fill={colors[i % colors.length]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
