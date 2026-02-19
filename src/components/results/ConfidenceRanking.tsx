"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Badge from "@/components/ui/Badge";

interface RankingItem {
  name: string;
  value: number;
  displayValue: string;
}

interface ConfidenceRankingProps {
  items: RankingItem[];
  highlightName: string;
  topCount?: number;
  label?: string;
  valueSuffix?: string;
  accentColor?: "blue" | "purple" | "teal" | "amber";
  delay?: number;
}

export default function ConfidenceRanking({
  items,
  highlightName,
  topCount = 3,
  label = "All Rankings",
  accentColor = "blue",
  delay = 0.4,
}: ConfidenceRankingProps) {
  const [expanded, setExpanded] = useState(false);
  const topItems = items.slice(0, topCount);
  const restItems = items.slice(topCount);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="border border-surface-800 rounded-lg p-5 space-y-3"
    >
      <h3 className="text-lg font-medium">{label}</h3>

      <div className="space-y-2">
        {topItems.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.08 }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className={
                  item.name === highlightName
                    ? "text-foreground font-medium"
                    : "text-surface-400"
                }
              >
                {i + 1}. {item.name}
              </span>
              {i === 0 && <Badge color={accentColor}>Best Match</Badge>}
            </div>
            <span className="text-surface-500 tabular-nums">
              {item.displayValue}
            </span>
          </motion.div>
        ))}
      </div>

      {restItems.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-surface-500 hover:text-surface-300 transition-colors cursor-pointer"
          >
            {expanded
              ? "Show less"
              : `Show all ${items.length} types`}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden space-y-2"
              >
                {restItems.map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-surface-500">
                      {topCount + i + 1}. {item.name}
                    </span>
                    <span className="text-surface-600 tabular-nums">
                      {item.displayValue}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.section>
  );
}
