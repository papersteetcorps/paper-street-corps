"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

interface TypeCardProps {
  typeCode: string;
  subtitle?: string;
  confidence?: number;
  accentColor?: string;
  delay?: number;
}

function AnimatedCounter({ target, delay }: { target: number; delay: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => v.toFixed(1));

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.2,
      delay,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, target, delay]);

  return <motion.span>{rounded}</motion.span>;
}

const ACCENT_MAP: Record<string, string> = {
  blue: "var(--color-accent-blue)",
  purple: "var(--color-accent-purple)",
  teal: "var(--color-accent-teal)",
  amber: "var(--color-accent-amber)",
};

export default function TypeCard({
  typeCode,
  subtitle,
  confidence,
  accentColor = "blue",
  delay = 0,
}: TypeCardProps) {
  const color = ACCENT_MAP[accentColor] ?? accentColor;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), (delay + 0.2) * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="relative py-10">
      {/* Background glow pulse on reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={revealed ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${color}15 0%, transparent 70%)`,
        }}
      />

      {/* Ember line above result */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={revealed ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.1 }}
        className="mx-auto mb-8 h-px w-32"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(232, 98, 42, 0.6), rgba(124, 58, 237, 0.6), transparent)",
        }}
      />

      <div className="relative text-center space-y-4">
        {/* Pre-reveal label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay }}
          className="text-xs text-surface-500 uppercase tracking-widest"
        >
          You are
        </motion.p>

        {/* Type code: dramatic scale-up reveal */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.6, filter: "blur(12px)" }}
          animate={revealed ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-7xl md:text-9xl font-bold tracking-tight"
          style={{
            color,
            textShadow: `0 0 60px ${color}30, 0 0 120px ${color}15`,
          }}
        >
          {typeCode}
        </motion.h2>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.5 }}
            className="text-xl text-surface-300"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Confidence */}
        {confidence !== undefined && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: delay + 0.7 }}
            className="text-surface-500 text-sm pt-2"
          >
            <AnimatedCounter target={confidence * 100} delay={delay + 0.8} />% match
          </motion.p>
        )}
      </div>

      {/* Ember line below result */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={revealed ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.6 }}
        className="mx-auto mt-8 h-px w-32"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.6), rgba(232, 98, 42, 0.6), transparent)",
        }}
      />
    </div>
  );
}
