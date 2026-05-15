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

export default function SynthesisClient({
  availableResults,
}: {
  availableResults: AvailableResult[];
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(availableResults.map((r) => r.testType))
  );
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
        body: JSON.stringify({
          results: selectedResults.map((r) => ({
            testType: r.testType,
            result: r.result,
          })),
        }),
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

  // ── Empty state ──────────────────────────────────────────────────
  if (availableResults.length === 0) {
    return (
      <div className="relative border border-[var(--surface-700)] bg-[var(--surface-900)]/40 p-10 sm:p-14 text-center space-y-5">
        <div className="crosshair" style={{ top: "-6px", left: "-6px" }} />
        <div className="crosshair" style={{ top: "-6px", right: "-6px" }} />
        <div className="crosshair" style={{ bottom: "-6px", left: "-6px" }} />
        <div className="crosshair" style={{ bottom: "-6px", right: "-6px" }} />

        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--ember)]">
          / No file on record
        </p>
        <h2
          className="font-display text-3xl sm:text-4xl tracking-[-0.02em] text-[var(--foreground)]"
          style={{ fontWeight: 500 }}
        >
          You haven&apos;t taken anything yet.
        </h2>
        <p className="text-[14px] text-[var(--surface-400)] leading-relaxed max-w-md mx-auto">
          Complete at least two assessments to generate a cross-framework synthesis.
        </p>
        <Link href="/" className="cut-btn inline-flex mt-4">
          <span>Browse Assessments</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  // ── Single-result state ──────────────────────────────────────────
  if (availableResults.length === 1) {
    return (
      <div className="relative border border-[var(--surface-700)] bg-[var(--surface-900)]/40 p-8 sm:p-10 space-y-5">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--ember)]" />

        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--ember)]">
          / Need one more
        </p>
        <h2
          className="font-display text-2xl sm:text-3xl tracking-[-0.02em] text-[var(--foreground)]"
          style={{ fontWeight: 500 }}
        >
          One assessment on file. Synthesis needs at least two.
        </h2>
        <p className="text-[13px] sm:text-[14px] text-[var(--surface-400)] leading-relaxed">
          Each framework reads personality from a different angle. They sharpen each other
          when read together.
        </p>
        <div className="border-t border-[var(--surface-700)] pt-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)] mb-3">
            / Suggested next
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TEST_HREFS)
              .filter(([t]) => t !== availableResults[0].testType)
              .slice(0, 3)
              .map(([t, href]) => (
                <Link
                  key={t}
                  href={href}
                  className="text-[10px] font-mono uppercase tracking-[0.18em] px-3 py-2 border border-[var(--surface-700)] text-[var(--surface-300)] hover:border-[var(--ember)] hover:text-[var(--ember)] transition-colors"
                >
                  Take {t} →
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Normal state ─────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Selector */}
      <div className="relative border border-[var(--surface-700)] bg-[var(--surface-900)]/40">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--ember)]" />

        <div className="p-5 sm:p-7 space-y-5">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)] mb-2">
              § Frameworks
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--foreground)]">
              Select frameworks to synthesize.
            </p>
            <p className="text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.2em] text-[var(--surface-500)] mt-1">
              Choose 2+ · more frameworks = richer signal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-[var(--surface-700)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--surface-700)]">
            {availableResults.map((r, i) => {
              const isOn = selected.has(r.testType);
              const isLastRow = i >= availableResults.length - 2;
              return (
                <button
                  key={r.testType}
                  onClick={() => toggle(r.testType)}
                  className={`group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors text-left ${
                    !isLastRow ? "border-b border-[var(--surface-700)]" : ""
                  } ${
                    isOn
                      ? "bg-[var(--ember-muted)] text-[var(--foreground)]"
                      : "text-[var(--surface-400)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className="flex items-baseline gap-3 min-w-0">
                    <span
                      className={`text-[10px] font-mono ${
                        isOn ? "text-[var(--ember)]" : "text-[var(--surface-500)]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14px] font-body truncate">{r.label}</span>
                  </span>
                  <span
                    className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                      isOn
                        ? "border-[var(--ember)] bg-[var(--ember)]"
                        : "border-[var(--surface-600)] group-hover:border-[var(--surface-400)]"
                    }`}
                  >
                    {isOn && (
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0a0a0c"
                        strokeWidth="4"
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={runSynthesis}
            disabled={selectedResults.length < 2 || loading}
            className="cut-btn w-full justify-center disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <span className="w-2 h-2 bg-[#0a0a0c] ember-pulse" />
                <span>Synthesizing…</span>
              </>
            ) : (
              <>
                <span>
                  Synthesize {String(selectedResults.length).padStart(2, "0")} framework
                  {selectedResults.length !== 1 ? "s" : ""}
                </span>
                <span>→</span>
              </>
            )}
          </button>

          {selectedResults.length < 2 && (
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--surface-500)] text-center">
              Select at least 2 frameworks
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="border border-[var(--ember-hot)]/30 bg-[var(--ember-muted)] px-5 py-4">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--ember-hot)]">
            ! {error}
          </p>
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
            {/* Identity plate header */}
            {synthesis.title && (
              <div className="relative border border-[var(--surface-600)] bg-[#0c0c10] overflow-hidden">
                <div className="crosshair" style={{ top: "-6px", left: "-6px" }} />
                <div className="crosshair" style={{ top: "-6px", right: "-6px" }} />
                <div className="crosshair" style={{ bottom: "-6px", left: "-6px" }} />
                <div className="crosshair" style={{ bottom: "-6px", right: "-6px" }} />

                <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[var(--surface-700)] bg-[var(--surface-900)]/80 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--surface-400)]">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse flex-shrink-0" />
                    <span className="truncate">
                      Cross-Framework Synthesis · {selectedResults.length} sources
                    </span>
                  </span>
                  <span className="flex-shrink-0">
                    {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </span>
                </div>

                <div className="relative p-6 sm:p-10 md:p-12">
                  <div
                    className="absolute pointer-events-none opacity-70"
                    style={{
                      inset: 0,
                      background:
                        "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255, 77, 28, 0.10) 0%, transparent 65%)",
                    }}
                  />
                  <p className="relative text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--ember)] mb-4">
                    You are —
                  </p>
                  <h2
                    className="relative font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-[-0.03em] text-[var(--foreground)]"
                    style={{
                      fontWeight: 500,
                      fontVariationSettings: '"opsz" 144',
                      textShadow: "0 0 40px rgba(255, 77, 28, 0.18)",
                    }}
                  >
                    {synthesis.title}
                  </h2>
                  {synthesis.coreProfile && (
                    <p className="relative font-display text-lg sm:text-xl italic font-light text-[var(--surface-200)] leading-[1.45] tracking-[-0.005em] mt-6 max-w-2xl"
                       style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                      {synthesis.coreProfile}
                    </p>
                  )}
                </div>

                <div className="h-[2px] bg-[var(--ember)]" />
              </div>
            )}

            {/* Convergences */}
            {synthesis.convergences && synthesis.convergences.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border border-[var(--surface-700)] bg-[var(--surface-900)]/40"
              >
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-3 p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-[var(--surface-700)]">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
                      § What
                      <br className="hidden md:block" />
                      <span className="md:hidden"> </span>
                      converges
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-9 p-5 sm:p-6 md:p-7 space-y-4">
                    {synthesis.convergences.map((c, i) => (
                      <div
                        key={i}
                        className="border-l-2 border-[var(--ember)] pl-4 py-1 space-y-2"
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {c.frameworks.map((f) => (
                            <span
                              key={f}
                              className="text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 border border-[var(--ember)]/40 text-[var(--ember)]"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                        <p className="text-[14px] sm:text-[15px] text-[var(--foreground)] leading-relaxed">
                          {c.insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Divergences */}
            {synthesis.divergences && synthesis.divergences.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border border-[var(--surface-700)] bg-[var(--surface-900)]/40"
              >
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-3 p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-[var(--surface-700)]">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
                      § Where it
                      <br className="hidden md:block" />
                      <span className="md:hidden"> </span>
                      gets complicated
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-9 p-5 sm:p-6 md:p-7">
                    <ul className="divide-y divide-dashed divide-[var(--surface-700)]">
                      {synthesis.divergences.map((d, i) => (
                        <li
                          key={i}
                          className="flex items-baseline gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <span className="text-[10px] font-mono text-[var(--surface-500)] w-6 flex-shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[14px] sm:text-[15px] text-[var(--surface-200)] leading-relaxed">
                            {d.insight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Strengths + Challenges */}
            {(synthesis.unifiedStrengths || synthesis.unifiedChallenges) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border border-[var(--surface-700)] bg-[var(--surface-900)]/40 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--surface-700)]"
              >
                {synthesis.unifiedStrengths && (
                  <section className="p-5 sm:p-7 space-y-4">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
                      + Built For
                    </p>
                    <ul className="divide-y divide-dashed divide-[var(--surface-700)]">
                      {synthesis.unifiedStrengths.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0"
                        >
                          <span className="text-[10px] font-mono text-[var(--surface-500)] w-5 flex-shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[14px] text-[var(--foreground)]">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {synthesis.unifiedChallenges && (
                  <section className="p-5 sm:p-7 space-y-4">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-400)]">
                      − Where to Push
                    </p>
                    <ul className="divide-y divide-dashed divide-[var(--surface-700)]">
                      {synthesis.unifiedChallenges.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0"
                        >
                          <span className="text-[10px] font-mono text-[var(--surface-500)] w-5 flex-shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[14px] text-[var(--surface-200)]">{c}</span>
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
                className="border border-[var(--ember)]/30 bg-[var(--ember-muted)]"
              >
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-3 p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-[var(--ember)]/20">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember-hot)]">
                      ! Blind
                      <br className="hidden md:block" />
                      <span className="md:hidden"> </span>
                      spots
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-9 p-5 sm:p-6 md:p-7">
                    <p className="text-[14px] sm:text-[15px] text-[var(--surface-100)] leading-relaxed">
                      {synthesis.blindSpots}
                    </p>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Growth Path */}
            {synthesis.growthPath && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border border-[var(--surface-700)] bg-[var(--surface-900)]/40"
              >
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-3 p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-[var(--surface-700)]">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
                      § Next move
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-9 p-5 sm:p-6 md:p-7">
                    <p
                      className="font-display italic text-lg sm:text-xl leading-[1.5] text-[var(--surface-100)] tracking-[-0.01em]"
                      style={{
                        fontWeight: 400,
                        fontVariationSettings: '"opsz" 144, "SOFT" 100',
                      }}
                    >
                      {synthesis.growthPath}
                    </p>
                  </div>
                </div>
              </motion.section>
            )}

            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)] text-center pt-2">
              / Based on{" "}
              {synthesis.frameworks?.join(" · ") ??
                selectedResults.map((r) => r.testType).join(" · ")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
