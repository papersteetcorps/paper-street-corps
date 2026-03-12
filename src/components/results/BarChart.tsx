"use client";

import { motion } from "motion/react";
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarChartProps {
  data: { name: string; value: number }[];
  highlightName?: string;
  accentColor?: string;
  mutedColor?: string;
  label?: string;
  valueLabel?: string;
  delay?: number;
}

export default function BarChart({
  data,
  highlightName,
  accentColor = "var(--accent-blue)",
  mutedColor = "var(--surface-600)",
  label = "Distance to Types",
  valueLabel = "Distance",
  delay = 0.2,
}: BarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="border border-surface-800 rounded-lg p-5"
    >
      <h3 className="text-lg font-medium mb-4">{label}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RechartsBar data={data} layout="vertical" barSize={14}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--surface-800)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fill: "var(--surface-500)", fontSize: 11 }}
            axisLine={{ stroke: "var(--surface-700)" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={60}
            tick={{ fill: "var(--surface-400)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface-900)",
              border: "1px solid var(--surface-700)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--foreground)" }}
            itemStyle={{ color: "var(--surface-300)" }}
            formatter={(value: number | undefined) => [
              value != null ? value.toFixed(2) : "—",
              valueLabel,
            ]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={
                  entry.name === highlightName ? accentColor : mutedColor
                }
              />
            ))}
          </Bar>
        </RechartsBar>
      </ResponsiveContainer>
    </motion.div>
  );
}
