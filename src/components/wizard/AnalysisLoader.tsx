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
  "This usually takes 10-30 seconds.",
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

  // Auto-advance steps every ~3-4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [steps.length]);

  // Rotate tips every ~4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % ROTATING_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Animated aurora background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 500,
            height: 500,
            top: "20%",
            left: "20%",
            background: "radial-gradient(circle, rgba(232, 98, 42, 0.18), transparent 60%)",
          }}
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 450,
            height: 450,
            bottom: "10%",
            right: "10%",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 60%)",
          }}
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 30, -40, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 400,
            height: 400,
            top: "50%",
            left: "50%",
            translateX: "-50%",
            translateY: "-50%",
            background: "radial-gradient(circle, rgba(124, 92, 252, 0.12), transparent 60%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-6 text-center">
        {/* Central visualization */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer rotating gradient ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, var(--color-accent-amber), var(--color-accent-purple), var(--color-accent-blue), var(--color-accent-amber))",
              maskImage: "radial-gradient(circle, transparent 60%, black 62%, black 70%, transparent 72%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 60%, black 62%, black 70%, transparent 72%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Pulse rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-accent-amber/30"
              animate={{
                scale: [1, 1.6],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Center sparkle icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(232, 98, 42, 0.4), rgba(124, 92, 252, 0.2))",
                boxShadow: "0 0 30px rgba(232, 98, 42, 0.4), inset 0 0 20px rgba(232, 98, 42, 0.3)",
              }}
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
                <path d="M19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6L19 14z" />
                <path d="M5 16l.6 1.8L7 18l-1.4.4L5 20l-.6-1.8L3 18l1.4-.4L5 16z" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 tracking-tight">{title}</h2>

        {/* Rotating tip */}
        <div className="h-5 mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-surface-400"
            >
              {ROTATING_TIPS[tipIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Step list */}
        <div className="space-y-2.5 text-left">
          {steps.map((step, i) => {
            const isComplete = i < activeStep;
            const isActive = i === activeStep;
            const isPending = i > activeStep;
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3"
              >
                {/* Status icon */}
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-5 h-5 rounded-full bg-accent-amber/15 flex items-center justify-center"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent-amber">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      className="w-4 h-4 rounded-full border-2 border-accent-amber/30 border-t-accent-amber"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-surface-700" />
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-sm transition-colors duration-300 ${
                    isComplete
                      ? "text-surface-400 line-through decoration-surface-700"
                      : isActive
                      ? "text-foreground font-medium"
                      : isPending
                      ? "text-surface-600"
                      : ""
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
