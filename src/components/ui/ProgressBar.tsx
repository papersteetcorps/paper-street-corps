"use client";

import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full h-[3px] bg-[var(--surface-800)] overflow-hidden">
      <motion.div
        className="h-full bg-[var(--ember)]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ boxShadow: "0 0 12px rgba(255,77,28,0.5)" }}
      />
    </div>
  );
}
