"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface TestCardProps {
  title: string;
  description: string;
  href: string;
  accentColor: string;
  accentMuted: string;
  icon: string;
  badge?: string;
  delay?: number;
}

export default function TestCard({
  title,
  description,
  href,
  accentColor,
  accentMuted,
  icon,
  badge,
  delay = 0,
}: TestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link href={href} className="group block h-full">
        <div className="relative h-full border border-surface-800 rounded-2xl p-6 transition-all duration-300 group-hover:border-surface-600 group-hover:shadow-xl overflow-hidden flex flex-col">
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: accentMuted }}
          />

          <div className="relative flex flex-col flex-1 space-y-4">
            {/* Icon + badge row */}
            <div className="flex items-start justify-between">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-mono"
                style={{ background: accentMuted, color: accentColor }}
              >
                {icon}
              </div>
              {badge && (
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-md border"
                  style={{ color: accentColor, borderColor: `${accentColor}30`, background: `${accentMuted}` }}
                >
                  {badge}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-base font-semibold group-hover:text-foreground transition-colors">
                {title}
              </h3>
              <p className="mt-2 text-sm text-surface-400 leading-relaxed">
                {description}
              </p>
            </div>

            {/* CTA */}
            <span
              className="inline-block text-sm font-medium transition-colors"
              style={{ color: accentColor }}
            >
              Take Test &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
