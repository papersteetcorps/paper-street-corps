"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

interface TypeCardProps {
  typeCode: string;
  subtitle?: string;
  confidence: number;
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

export default function TypeCard({
  typeCode,
  subtitle,
  confidence,
  accentColor = "var(--accent-blue)",
  delay = 0,
}: TypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="text-center space-y-3 py-4"
    >
      <p className="text-sm text-surface-500 uppercase tracking-widest">
        Your Result
      </p>
      <h2
        className="text-6xl font-bold tracking-tight"
        style={{ color: accentColor }}
      >
        {typeCode}
      </h2>
      {subtitle && (
        <p className="text-xl text-surface-400">{subtitle}</p>
      )}
      <p className="text-surface-500">
        <AnimatedCounter target={confidence * 100} delay={delay + 0.3} />%
        confidence
      </p>
    </motion.div>
  );
}
