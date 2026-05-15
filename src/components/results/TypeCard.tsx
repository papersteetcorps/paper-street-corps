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

export default function TypeCard({
  typeCode,
  subtitle,
  confidence,
  delay = 0,
}: TypeCardProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), (delay + 0.2) * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="relative border border-[var(--surface-600)] bg-[#0c0c10] overflow-hidden">
      {/* Crosshairs */}
      <div className="crosshair" style={{ top: "-6px", left: "-6px" }} />
      <div className="crosshair" style={{ top: "-6px", right: "-6px" }} />
      <div className="crosshair" style={{ bottom: "-6px", left: "-6px" }} />
      <div className="crosshair" style={{ bottom: "-6px", right: "-6px" }} />

      {/* Plate header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay }}
        className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[var(--surface-700)] bg-[var(--surface-900)]/80 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[var(--surface-400)]"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse flex-shrink-0" />
          <span className="truncate">Forge Identity Plate · Issued {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
        </span>
        {confidence !== undefined && (
          <span className="text-[var(--ember)] flex-shrink-0 tabular-nums">
            <AnimatedCounter target={confidence * 100} delay={delay + 0.8} />% match
          </span>
        )}
      </motion.div>

      {/* Body */}
      <div className="relative px-5 sm:px-8 md:px-10 py-10 sm:py-12 md:py-16">
        {/* Heat orb backdrop */}
        <div
          className="absolute pointer-events-none opacity-80"
          style={{
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255, 77, 28, 0.10) 0%, transparent 65%)",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay }}
          className="relative text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--ember)] mb-4"
        >
          You are —
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
          animate={revealed ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative font-display text-[20vw] sm:text-[14vw] md:text-[10rem] leading-[0.82] tracking-[-0.05em] text-[var(--ember)]"
          style={{
            fontWeight: 500,
            fontVariationSettings: '"opsz" 144, "SOFT" 0',
            textShadow: "0 0 50px rgba(255, 77, 28, 0.4), 0 0 100px rgba(255, 77, 28, 0.2)",
          }}
        >
          {typeCode}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.5 }}
            className="relative font-display text-xl sm:text-2xl md:text-3xl italic font-light text-[var(--foreground)] mt-4"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Bottom ember seam */}
      <div className="h-[2px] bg-[var(--ember)]" />
    </div>
  );
}
