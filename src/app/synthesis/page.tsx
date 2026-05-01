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
  const [results, setResults] = useState<Array<{ testType: string; result: Record<string, unknown>; label: string }>>([]);
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
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="pt-4">
        <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Your full picture</p>
        <h1 className="text-2xl font-semibold text-foreground">Who You Are</h1>
        <p className="text-surface-400 text-sm mt-2 max-w-xl">
          Your test results combined into one profile. The patterns, the contradictions, and what it all means for you.
        </p>
      </div>

      <SynthesisClient availableResults={results} />
    </div>
  );
}
