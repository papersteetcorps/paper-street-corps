"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface NarrativeSectionProps {
  headline?: string;
  narrative?: string;
  summary?: string;
  insights?: string[];
  strengths?: string[];
  challenges?: string[];
  growth?: string;
  typeDescription?: string;
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
  headline,
  narrative,
  summary,
  insights = [],
  strengths = [],
  challenges = [],
  growth,
  typeDescription,
  delay = 0.6,
}: NarrativeSectionProps) {
  const mainText = summary ?? narrative ?? "";
  const displayHeadline = headline ?? typeDescription ?? "Analysis";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="border border-surface-800 rounded-2xl p-6 space-y-6"
    >
      <div>
        <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">AI Interpretation</p>
        <h3 className="text-xl font-semibold text-foreground">{displayHeadline}</h3>
      </div>

      {mainText && (
        <p className="text-sm text-surface-300 leading-relaxed">
          <TypewriterText text={mainText} />
        </p>
      )}

      {insights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-surface-400 uppercase tracking-widest">Key Insights</h4>
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.5 + i * 0.1 }}
                className="flex items-start gap-2 text-sm text-surface-300"
              >
                <span className="text-accent-blue mt-0.5 shrink-0">&#8594;</span>
                {insight}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {(strengths.length > 0 || challenges.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-green-400 uppercase tracking-widest">Strengths</h4>
              <ul className="space-y-1.5">
                {strengths.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.8 + i * 0.08 }}
                    className="flex items-center gap-2 text-sm text-surface-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
          {challenges.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-amber-400 uppercase tracking-widest">Challenges</h4>
              <ul className="space-y-1.5">
                {challenges.map((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.8 + i * 0.08 }}
                    className="flex items-center gap-2 text-sm text-surface-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    {c}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {growth && (
        <div className="border-t border-surface-800 pt-4 space-y-2">
          <h4 className="text-xs font-medium text-accent-purple uppercase tracking-widest">Growth Path</h4>
          <p className="text-sm text-surface-400 leading-relaxed italic">{growth}</p>
        </div>
      )}
    </motion.section>
  );
}
