"use client";

import { useState, useEffect } from "react";
import { getAllResults, type StoredResult } from "@/lib/results-store";
import SynthesisClient from "./SynthesisClient";

const TEST_LABELS: Record<string, string> = {
  temperaments: "Temperaments",
  "moral-alignment": "Moral Alignment",
  cjte: "MBTI",
  socionics: "Socionics (KIME)",
  potentiology: "Potentiology (PBCE)",
  enneagram: "Enneagram (INEE)",
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
        <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Cross-Framework Analysis</p>
        <h1 className="text-2xl font-semibold text-foreground">Profile Synthesis</h1>
        <p className="text-surface-400 text-sm mt-2 max-w-xl">
          Combines all your completed test results into one unified psychological profile.
          Identifies convergences, divergences, and the pattern that runs beneath all frameworks.
        </p>
      </div>

      <SynthesisClient availableResults={results} />
    </div>
  );
}
