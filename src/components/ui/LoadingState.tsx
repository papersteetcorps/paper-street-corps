"use client";

import { motion } from "motion/react";

const STEPS_SETS: Record<string, string[]> = {
  simulate: [
    "Reading your life phases",
    "Loading enneagram corpus",
    "Simulating type patterns",
    "Analyzing fixation signatures",
    "Compiling results",
  ],
  quiz: [
    "Analyzing your phase data",
    "Constructing scenarios",
    "Mapping type responses",
    "Generating options",
  ],
  interpret: [
    "Loading research corpus",
    "Analyzing your answers",
    "Mapping cognitive patterns",
    "Generating interpretation",
  ],
  narrative: [
    "Building simulation context",
    "Writing phase-by-phase analysis",
  ],
  default: [
    "Processing",
    "Analyzing",
    "Generating results",
  ],
};

interface LoadingStateProps {
  message?: string;
  variant?: keyof typeof STEPS_SETS;
  compact?: boolean;
  accent?: "amber" | "blue" | "purple" | "teal";
}

export default function LoadingState({
  message,
  variant = "default",
  compact = false,
  accent = "blue",
}: LoadingStateProps) {
  const steps = STEPS_SETS[variant] ?? STEPS_SETS.default;
  const accentColor = `var(--color-accent-${accent})`;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-surface-500">
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ background: accentColor }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </span>
        {message ?? "Loading..."}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-20 space-y-8"
    >
      {/* Animated rings */}
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-surface-800"
          style={{ borderTopColor: accentColor }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-surface-800"
          style={{ borderBottomColor: accentColor }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{ background: accentColor }}
          animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm text-surface-300 font-medium">{message}</p>
      )}

      {/* Animated step list */}
      <div className="space-y-2 w-56">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 1.5, duration: 0.4 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: accentColor }}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: i * 1.5, duration: 0.4 }}
            />
            <motion.span
              className="text-xs text-surface-500"
              animate={{ opacity: [0.5, 1] }}
              transition={{ delay: i * 1.5, duration: 0.3 }}
            >
              {step}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
