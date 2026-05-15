"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_STEPS = [
  "Reading your responses",
  "Cross-referencing the framework",
  "Tracing your cognitive patterns",
  "Mapping your function stack",
  "Generating your profile",
  "Crafting your insights",
];

const ROTATING_TIPS = [
  "This usually takes 10–30 seconds.",
  "Reading every word you wrote.",
  "Looking for what you said and what you didn't.",
  "Connecting threads across your answers.",
  "Almost there.",
];

interface AnalysisLoaderProps {
  steps?: string[];
  title?: string;
}

export default function AnalysisLoader({
  steps = DEFAULT_STEPS,
  title = "Analysing your responses",
}: AnalysisLoaderProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [steps.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % ROTATING_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const pct = Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-5 py-12">
      {/* Precision grid scaffold */}
      <div className="precision-grid" />

      {/* Ember heat from below */}
      <div
        className="absolute pointer-events-none opacity-80"
        style={{
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 45% at 50% 60%, rgba(255, 77, 28, 0.12) 0%, transparent 60%)",
        }}
      />

      {/* Crosshair marks on the work area */}
      <div className="crosshair hidden sm:block" style={{ top: "32px", left: "32px" }} />
      <div className="crosshair hidden sm:block" style={{ top: "32px", right: "32px" }} />
      <div className="crosshair hidden sm:block" style={{ bottom: "32px", left: "32px" }} />
      <div className="crosshair hidden sm:block" style={{ bottom: "32px", right: "32px" }} />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Stamp header */}
        <div className="flex items-center gap-3 mb-8 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
          <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
          <span>Processing</span>
          <span className="flex-1 h-px bg-[var(--surface-700)]" />
          <span className="text-[var(--surface-400)]">/ {String(pct).padStart(3, "0")}%</span>
        </div>

        {/* Concentric reactor indicator */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-10">
          {/* Outer rotating dial */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="var(--surface-700)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="var(--ember)"
                strokeWidth="1.5"
                strokeDasharray={`${pct * 3} 999`}
                strokeLinecap="butt"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            </svg>
          </motion.div>

          {/* Inner pulse rings */}
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-3 border border-[var(--ember)]/40"
              animate={{ scale: [1, 1.25], opacity: [0.5, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Center mark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[var(--ember)] flex items-center justify-center"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                boxShadow:
                  "0 0 24px rgba(255, 77, 28, 0.4), inset 0 0 16px rgba(255, 77, 28, 0.25)",
              }}
            >
              <span className="font-mono text-[var(--ember)] text-xs font-bold">F</span>
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <h2
          className="font-display text-2xl sm:text-3xl text-center tracking-[-0.02em] text-[var(--foreground)] mb-3"
          style={{ fontWeight: 500 }}
        >
          {title}
        </h2>

        {/* Rotating tip */}
        <div className="h-5 mb-10 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIdx}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.4 }}
              className="text-[12px] font-mono uppercase tracking-[0.2em] text-[var(--surface-400)]"
            >
              {ROTATING_TIPS[tipIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Step ledger */}
        <div className="border-t border-[var(--surface-700)]">
          {steps.map((step, i) => {
            const isComplete = i < activeStep;
            const isActive = i === activeStep;
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 sm:gap-4 py-2.5 border-b border-[var(--surface-700)] border-dashed"
              >
                <span className="text-[10px] font-mono text-[var(--surface-500)] w-7">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-3 h-3 bg-[var(--ember)] flex items-center justify-center"
                    >
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0a0a0c"
                        strokeWidth="3.5"
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      className="w-3 h-3 border border-[var(--ember)]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="block w-1 h-1 bg-[var(--ember)]" />
                    </motion.div>
                  ) : (
                    <div className="w-1.5 h-1.5 border border-[var(--surface-600)]" />
                  )}
                </div>

                <span
                  className={`text-[13px] font-body transition-colors duration-300 ${
                    isComplete
                      ? "text-[var(--surface-500)] line-through decoration-[var(--surface-700)]"
                      : isActive
                      ? "text-[var(--foreground)] font-medium"
                      : "text-[var(--surface-600)]"
                  }`}
                >
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
