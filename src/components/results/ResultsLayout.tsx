"use client";

import { motion } from "motion/react";

interface ResultsLayoutProps {
  children: React.ReactNode;
}

export default function ResultsLayout({ children }: ResultsLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-8 px-6 py-12"
    >
      <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
        <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
        <span>Forge Identity Plate</span>
        <span className="flex-1 h-px bg-[var(--surface-700)]" />
      </div>
      {children}
    </motion.div>
  );
}
