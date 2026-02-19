"use client";

import { motion } from "motion/react";
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RadarChartProps {
  labels: string[];
  userValues: number[];
  referenceValues?: number[];
  referenceLabel?: string;
  userLabel?: string;
  userColor?: string;
  referenceColor?: string;
  delay?: number;
}

export default function RadarChart({
  labels,
  userValues,
  referenceValues,
  referenceLabel = "Type Centroid",
  userLabel = "Your Scores",
  userColor = "var(--accent-blue)",
  referenceColor = "var(--accent-purple)",
  delay = 0.2,
}: RadarChartProps) {
  const data = labels.map((label, i) => ({
    axis: label,
    user: userValues[i],
    ...(referenceValues ? { reference: referenceValues[i] } : {}),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="border border-surface-800 rounded-lg p-5"
    >
      <h3 className="text-lg font-medium mb-4">Chemical Profile</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="var(--surface-700)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "var(--surface-400)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            domain={[0, 5]}
            tick={{ fill: "var(--surface-600)", fontSize: 10 }}
            axisLine={false}
          />
          {referenceValues && (
            <Radar
              name={referenceLabel}
              dataKey="reference"
              stroke={referenceColor}
              fill={referenceColor}
              fillOpacity={0.15}
              strokeWidth={1.5}
            />
          )}
          <Radar
            name={userLabel}
            dataKey="user"
            stroke={userColor}
            fill={userColor}
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "var(--surface-400)" }}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </motion.div>
  );
}
