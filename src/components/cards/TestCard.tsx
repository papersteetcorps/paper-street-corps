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
  delay?: number;
}

export default function TestCard({
  title,
  description,
  href,
  accentColor,
  accentMuted,
  icon,
  delay = 0,
}: TestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link href={href} className="group block">
        <div className="relative border border-surface-800 rounded-xl p-6 transition-all duration-300 group-hover:border-surface-600 group-hover:shadow-lg overflow-hidden">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: accentMuted }}
          />
          <div className="relative space-y-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ background: accentMuted, color: accentColor }}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-medium group-hover:text-foreground transition-colors">
                {title}
              </h3>
              <p className="mt-1 text-sm text-surface-400 leading-relaxed">
                {description}
              </p>
            </div>
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
