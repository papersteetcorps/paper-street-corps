"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

interface AvailableResult {
  testType: string;
  result: Record<string, unknown>;
  label: string;
}

type Synthesis = {
  title?: string;
  coreProfile?: string;
  convergences?: Array<{ frameworks: string[]; insight: string }>;
  divergences?: Array<{ insight: string }>;
  unifiedStrengths?: string[];
  unifiedChallenges?: string[];
  blindSpots?: string;
  growthPath?: string;
  frameworks?: string[];
};

const TEST_HREFS: Record<string, string> = {
  temperaments: "/temperaments",
  "moral-alignment": "/moral-alignment",
  cjte: "/cjte",
  socionics: "/socionics",
  potentiology: "/potentiology",
  enneagram: "/enneagram",
};

const TEST_COLORS: Record<string, string> = {
  temperaments: "text-accent-purple border-accent-purple/30 bg-accent-purple/5",
  "moral-alignment": "text-accent-teal border-accent-teal/30 bg-accent-teal/5",
  cjte: "text-accent-blue border-accent-blue/30 bg-accent-blue/5",
  socionics: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
  potentiology: "text-accent-purple border-accent-purple/30 bg-accent-purple/5",
  enneagram: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
};

export default function SynthesisClient({ availableResults }: { availableResults: AvailableResult[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(availableResults.map((r) => r.testType)));
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (testType: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(testType)) next.delete(testType);
      else next.add(testType);
      return next;
    });
  };

  const selectedResults = availableResults.filter((r) => selected.has(r.testType));

  const runSynthesis = async () => {
    if (selectedResults.length < 2) return;
    setLoading(true);
    setError(null);
    setSynthesis(null);
    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: selectedResults.map((r) => ({ testType: r.testType, result: r.result })) }),
      });
      const data = await res.json();
      if (data.synthesis) {
        setSynthesis(data.synthesis);
      } else {
        setError(data.error ?? "Synthesis failed. Check your ANTHROPIC_API_KEY.");
      }
    } catch {
      setError("Could not reach the synthesis service.");
    } finally {
      setLoading(false);
    }
  };

  if (availableResults.length === 0) {
    return (
      <div className="border border-surface-800 rounded-2xl p-12 text-center space-y-4">
        <p className="text-4xl">🧪</p>
        <p className="text-foreground font-medium">No test results yet</p>
        <p className="text-surface-400 text-sm">Complete at least two tests to generate a synthesis.</p>
        <Link
          href="/"
          className="inline-block mt-2 text-sm bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue border border-accent-blue/20 px-5 py-2.5 rounded-xl transition-colors"
        >
          Explore tests
        </Link>
      </div>
    );
  }

  if (availableResults.length === 1) {
    return (
      <div className="border border-surface-800 rounded-2xl p-10 text-center space-y-4">
        <p className="text-3xl">📊</p>
        <p className="text-foreground font-medium">Only one test completed</p>
        <p className="text-surface-400 text-sm">
          Complete at least one more test to unlock cross-framework synthesis.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {Object.entries(TEST_HREFS)
            .filter(([t]) => t !== availableResults[0].testType)
            .slice(0, 3)
            .map(([t, href]) => (
              <Link
                key={t}
                href={href}
                className="text-xs border border-surface-700 hover:border-surface-500 text-surface-400 hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
              >
                Take {t}
              </Link>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Result selector */}
      <div className="border border-surface-800 rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground">Select frameworks to synthesize</p>
          <p className="text-xs text-surface-500 mt-0.5">Choose 2 or more — more frameworks = richer synthesis</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableResults.map((r) => {
            const isOn = selected.has(r.testType);
            const colors = TEST_COLORS[r.testType] ?? "text-surface-300 border-surface-700 bg-surface-900";
            return (
              <button
                key={r.testType}
                onClick={() => toggle(r.testType)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all text-left ${
                  isOn ? colors : "border-surface-800 bg-surface-900 text-surface-500"
                }`}
              >
                <span className="text-sm font-medium">{r.label}</span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isOn ? "border-current bg-current" : "border-surface-600"
                }`}>
                  {isOn && <span className="w-1.5 h-1.5 rounded-full bg-background" />}
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={runSynthesis}
          disabled={selectedResults.length < 2 || loading}
          className="w-full py-3 rounded-xl text-sm font-semibold bg-accent-blue hover:bg-accent-blue/90 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Synthesizing…" : `Synthesize ${selectedResults.length} framework${selectedResults.length !== 1 ? "s" : ""}`}
        </button>
        {selectedResults.length < 2 && (
          <p className="text-xs text-surface-500 text-center">Select at least 2 frameworks</p>
        )}
      </div>

      {error && (
        <div className="border border-red-500/30 bg-red-500/5 rounded-xl px-5 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <AnimatePresence>
        {synthesis && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Title */}
            {synthesis.title && (
              <div className="border border-surface-700 rounded-2xl p-6 text-center space-y-2">
                <p className="text-xs text-surface-500 uppercase tracking-widest">You</p>
                <h2 className="text-2xl font-bold text-foreground">{synthesis.title}</h2>
                {synthesis.coreProfile && (
                  <p className="text-surface-300 text-sm leading-relaxed max-w-2xl mx-auto mt-3">
                    {synthesis.coreProfile}
                  </p>
                )}
              </div>
            )}

            {/* Convergences */}
            {synthesis.convergences && synthesis.convergences.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border border-surface-800 rounded-2xl p-6 space-y-4"
              >
                <p className="text-xs text-surface-500 uppercase tracking-widest">What's consistent about you</p>
                <div className="space-y-3">
                  {synthesis.convergences.map((c, i) => (
                    <div key={i} className="rounded-xl bg-accent-blue/5 border border-accent-blue/15 px-4 py-3 space-y-1">
                      <div className="flex flex-wrap gap-1.5">
                        {c.frameworks.map((f) => (
                          <span key={f} className="text-xs font-mono bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded">{f}</span>
                        ))}
                      </div>
                      <p className="text-sm text-surface-200">{c.insight}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Divergences */}
            {synthesis.divergences && synthesis.divergences.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border border-surface-800 rounded-2xl p-6 space-y-4"
              >
                <p className="text-xs text-surface-500 uppercase tracking-widest">Where it gets complicated</p>
                <div className="space-y-3">
                  {synthesis.divergences.map((d, i) => (
                    <div key={i} className="rounded-xl bg-surface-900 border border-surface-700 px-4 py-3">
                      <p className="text-sm text-surface-300">{d.insight}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Strengths + Challenges */}
            {(synthesis.unifiedStrengths || synthesis.unifiedChallenges) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {synthesis.unifiedStrengths && (
                  <section className="border border-surface-800 rounded-2xl p-5 space-y-3">
                    <p className="text-xs text-surface-500 uppercase tracking-widest">What you're built for</p>
                    <ul className="space-y-2">
                      {synthesis.unifiedStrengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-surface-200">
                          <span className="text-accent-teal mt-0.5 shrink-0">▸</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {synthesis.unifiedChallenges && (
                  <section className="border border-surface-800 rounded-2xl p-5 space-y-3">
                    <p className="text-xs text-surface-500 uppercase tracking-widest">What trips you up</p>
                    <ul className="space-y-2">
                      {synthesis.unifiedChallenges.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-surface-200">
                          <span className="text-accent-amber mt-0.5 shrink-0">▸</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </motion.div>
            )}

            {/* Blind Spots */}
            {synthesis.blindSpots && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6 space-y-3"
              >
                <p className="text-xs text-red-400/70 uppercase tracking-widest">What you don't see about yourself</p>
                <p className="text-sm text-surface-200 leading-relaxed">{synthesis.blindSpots}</p>
              </motion.section>
            )}

            {/* Growth Path */}
            {synthesis.growthPath && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border border-accent-teal/20 bg-accent-teal/5 rounded-2xl p-6 space-y-3"
              >
                <p className="text-xs text-accent-teal/70 uppercase tracking-widest">What to work on</p>
                <p className="text-sm text-surface-200 leading-relaxed">{synthesis.growthPath}</p>
              </motion.section>
            )}

            <p className="text-xs text-surface-600 text-center">
              Based on {synthesis.frameworks?.join(", ") ?? selectedResults.map((r) => r.testType).join(", ")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
