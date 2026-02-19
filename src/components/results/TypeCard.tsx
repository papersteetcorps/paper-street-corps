"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="text-center space-y-3 py-6"
    >
      <p className="text-xs text-surface-500 uppercase tracking-widest">Your Result</p>
      <h2 className="text-6xl md:text-7xl font-bold tracking-tight" style={{ color }}>
        {typeCode}
      </h2>
      {subtitle && (
        <p className="text-lg text-surface-400">{subtitle}</p>
      )}
      {confidence !== undefined && (
        <p className="text-surface-500 text-sm">
          <AnimatedCounter target={confidence * 100} delay={delay + 0.3} />% confidence
        </p>
      )}
    </motion.div>
  );
}
