"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface TestCardProps {
  title: string;
  description: string;
  href: string;
  accentColor?: string;
  accentMuted?: string;
  icon?: string;
  badge?: string;
  delay?: number;
  index?: string | number;
}

export default function TestCard({
  title,
  description,
  href,
  icon = "◈",
  badge,
  delay = 0,
  index,
}: TestCardProps) {
  const idx =
    index !== undefined
      ? typeof index === "number"
        ? String(index).padStart(2, "0")
        : index
      : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Link
        href={href}
        className="group block relative border border-[var(--surface-700)] bg-[var(--surface-900)]/60 hover:border-[var(--ember)] transition-colors h-full"
      >
        {/* Top ember rule on hover */}
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--ember)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)] group-hover:text-[var(--ember)] transition-colors">
              {idx} / Test
            </span>
            {badge && (
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 border border-[var(--ember)]/40 text-[var(--ember)]">
                {badge}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-mono text-2xl text-[var(--ember)]">{icon}</span>
            <h3
              className="font-display text-2xl tracking-[-0.02em] text-[var(--foreground)] group-hover:text-[var(--ember)] transition-colors"
              style={{ fontWeight: 500 }}
            >
              {title}
            </h3>
          </div>

          <p className="text-[14px] text-[var(--surface-300)] leading-relaxed flex-1">{description}</p>

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-dashed border-[var(--surface-700)]">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)] group-hover:text-[var(--foreground)] transition-colors">
              Begin →
            </span>
            <span className="text-[var(--surface-600)] group-hover:text-[var(--ember)] group-hover:translate-x-1 transition-all">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
