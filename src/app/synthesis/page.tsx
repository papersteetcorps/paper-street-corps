"use client";

import { useState, useEffect } from "react";
import { getAllResults, type StoredResult } from "@/lib/results-store";
import SynthesisClient from "./SynthesisClient";

const TEST_LABELS: Record<string, string> = {
  temperaments: "Temperaments",
  "moral-alignment": "Moral Alignment",
  cjte: "MBTI",
  socionics: "Socionics",
  potentiology: "Energy Profile",
  enneagram: "Enneagram",
};

export default function SynthesisPage() {
  const [results, setResults] = useState<
    Array<{ testType: string; result: Record<string, unknown>; label: string }>
  >([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored: StoredResult[] = getAllResults();
    setResults(
      stored.map((s) => ({
        testType: s.testType,
        result: s.result,
        label: TEST_LABELS[s.testType] ?? s.testType,
      }))
    );
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className="relative max-w-4xl mx-auto px-5 sm:px-8 md:px-12 py-10 sm:py-14 space-y-10">
      <div className="precision-grid" />

      <header className="relative z-10 space-y-5">
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
          <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
          <span>Synthesis</span>
          <span className="flex-1 h-px bg-[var(--surface-700)]" />
          <span className="text-[var(--surface-500)]">
            / {String(results.length).padStart(2, "0")} files
          </span>
        </div>
        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.92] tracking-[-0.03em]"
          style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144' }}
        >
          Who you are.
          <br />
          <span className="italic font-light text-[var(--ember)]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
            All of it.
          </span>
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[var(--surface-300)] leading-relaxed max-w-xl">
          Your test results combined into one profile. The patterns, the contradictions,
          and what it all means for you.
        </p>
      </header>

      <div className="relative z-10">
        <SynthesisClient availableResults={results} />
      </div>
    </div>
  );
}
