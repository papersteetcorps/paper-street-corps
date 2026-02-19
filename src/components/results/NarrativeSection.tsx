"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface NarrativeSectionProps {
  narrative: string;
  insights: string[];
  typeDescription: string;
  delay?: number;
}

function TypewriterText({ text, speed = 8 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

export default function NarrativeSection({
  narrative,
  insights,
  typeDescription,
  delay = 0.6,
}: NarrativeSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="border border-surface-800 rounded-lg p-5 space-y-4"
    >
      <h3 className="text-lg font-medium">AI Interpretation</h3>

      <div className="text-sm text-surface-300 leading-relaxed">
        <TypewriterText text={narrative} />
      </div>

      {insights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-surface-400">Key Insights</h4>
          <ul className="space-y-1">
            {insights.map((insight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.5 + i * 0.1 }}
                className="text-sm text-surface-300"
              >
                &#8226; {insight}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-surface-500 italic">{typeDescription}</p>
    </motion.section>
  );
}
