"use client";

import { motion } from "motion/react";

interface ScoreRow {
  label: string;
  userScore: number;
  idealScore: number;
}

interface ScoreComparisonProps {
  rows: ScoreRow[];
  maxScore?: number;
  userColor?: string;
  idealColor?: string;
  delay?: number;
}

export default function ScoreComparison({
  rows,
  maxScore = 5,
  userColor = "var(--accent-blue)",
  idealColor = "var(--accent-purple)",
  delay = 0.8,
}: ScoreComparisonProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="border border-surface-800 rounded-lg p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Score Comparison</h3>
        <div className="flex gap-4 text-xs text-surface-500">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-1.5 rounded-full"
              style={{ background: userColor }}
            />
            You
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-1.5 rounded-full opacity-40"
              style={{ background: idealColor }}
            />
            Ideal
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => {
          const userPct = ((row.userScore - 1) / (maxScore - 1)) * 100;
          const idealPct = ((row.idealScore - 1) / (maxScore - 1)) * 100;
          return (
            <div key={row.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-surface-300">{row.label}</span>
                <span className="text-surface-500">
                  {row.userScore.toFixed(1)} / {row.idealScore.toFixed(1)}
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-surface-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${idealPct}%` }}
                  transition={{ duration: 0.6, delay: delay + i * 0.08 }}
                  className="absolute h-full rounded-full opacity-30"
                  style={{ background: idealColor }}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${userPct}%` }}
                  transition={{ duration: 0.8, delay: delay + 0.1 + i * 0.08 }}
                  className="absolute h-full rounded-full"
                  style={{ background: userColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
