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
        <span className="inline-block w-[2px] h-[1em] bg-[var(--ember)] ml-0.5 align-text-bottom animate-pulse" />
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
  const displayHeadline = headline ?? typeDescription ?? "The Breakdown";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="border border-[var(--surface-700)] bg-[var(--surface-900)]/40 divide-y divide-[var(--surface-700)]"
    >
      {/* Headline section */}
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-12 md:col-span-3 p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-[var(--surface-700)]">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
            § What
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            Forge sees
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 p-5 sm:p-6 md:p-7">
          <h3
            className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.1] tracking-[-0.02em] text-[var(--foreground)]"
            style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144' }}
          >
            {displayHeadline}
          </h3>
        </div>
      </div>

      {/* Summary section with editorial drop cap */}
      {mainText && (
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-3 p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-[var(--surface-700)]">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
              § Summary
            </p>
          </div>
          <div className="col-span-12 md:col-span-9 p-5 sm:p-6 md:p-7">
            <p
              className="font-display text-base sm:text-lg md:text-xl leading-[1.55] text-[var(--surface-200)] tracking-[-0.005em]"
              style={{ fontWeight: 400 }}
            >
              <TypewriterText text={mainText} />
            </p>
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-3 p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-[var(--surface-700)]">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
              § What
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              stands out
            </p>
          </div>
          <div className="col-span-12 md:col-span-9 p-5 sm:p-6 md:p-7">
            <ul className="divide-y divide-dashed divide-[var(--surface-700)]">
              {insights.map((insight, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.5 + i * 0.08 }}
                  className="flex items-baseline gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-[10px] font-mono text-[var(--surface-500)] w-6 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] sm:text-[15px] text-[var(--surface-100)] leading-relaxed">
                    {insight}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Strengths / Challenges — ledger */}
      {(strengths.length > 0 || challenges.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--surface-700)]">
          {strengths.length > 0 && (
            <div className="p-5 sm:p-6 md:p-7">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)] mb-4">
                + Built For
              </p>
              <ul className="divide-y divide-dashed divide-[var(--surface-700)]">
                {strengths.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.7 + i * 0.06 }}
                    className="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="text-[10px] font-mono text-[var(--surface-500)] w-5 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14px] text-[var(--foreground)]">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
          {challenges.length > 0 && (
            <div className="p-5 sm:p-6 md:p-7">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-400)] mb-4">
                − Where to Push
              </p>
              <ul className="divide-y divide-dashed divide-[var(--surface-700)]">
                {challenges.map((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.7 + i * 0.06 }}
                    className="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="text-[10px] font-mono text-[var(--surface-500)] w-5 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14px] text-[var(--surface-200)]">{c}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Growth — closer */}
      {growth && (
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-3 p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-[var(--surface-700)]">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
              § Next move
            </p>
          </div>
          <div className="col-span-12 md:col-span-9 p-5 sm:p-6 md:p-7">
            <p
              className="font-display italic text-lg sm:text-xl leading-[1.5] text-[var(--surface-100)] tracking-[-0.01em]"
              style={{ fontWeight: 400, fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              {growth}
            </p>
          </div>
        </div>
      )}
    </motion.section>
  );
}
