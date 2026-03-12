"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface TheoryCardProps {
  title: string;
  description: string;
  href: string;
  delay?: number;
}

export default function TheoryCard({
  title,
  description,
  href,
  delay = 0,
}: TheoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link href={href} className="group block">
        <div className="border border-surface-800 rounded-lg p-5 transition-all duration-300 group-hover:border-surface-600 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.06)]">
          <h3 className="text-base font-medium group-hover:text-foreground transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-sm text-surface-400">{description}</p>
          <span className="mt-3 inline-block text-sm text-surface-500 group-hover:text-surface-300 transition-colors">
            Learn More &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
