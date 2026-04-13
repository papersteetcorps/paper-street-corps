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
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="aurora-line" />
      {children}
    </motion.div>
  );
}
