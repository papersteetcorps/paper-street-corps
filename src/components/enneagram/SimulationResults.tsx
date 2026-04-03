"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import ResultChat from "@/components/results/ResultChat";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";

interface EgoMechanism {
  name: string;
  evidence: string;
}

interface TypeSimulation {
  type: number;
  tldr?: string;
  fixation?: EgoMechanism;
  passion?: EgoMechanism;
  trap?: EgoMechanism;
  shocking?: string;
}

export interface EnneagramSimulation {
  headline?: string;
  summary?: string;
  simulations?: TypeSimulation[];
  insights?: string[];
  strengths?: string[];
  challenges?: string[];
  growth?: string;
  predictedType?: number;
  predictedSubtype?: string;
  triad?: string;
}

const TYPE_NAMES: Record<number, string> = {
  1: "The Reformer",
  2: "The Helper",
  3: "The Achiever",
  4: "The Individualist",
  5: "The Investigator",
  6: "The Loyalist",
  7: "The Enthusiast",
  8: "The Challenger",
  9: "The Peacemaker",
};

const TRIAD_MAP: Record<number, string> = {
  8: "Gut", 9: "Gut", 1: "Gut",
  2: "Heart", 3: "Heart", 4: "Heart",
  5: "Head", 6: "Head", 7: "Head",
};

interface SimulationResultsProps {
  simulation: EnneagramSimulation;
  phases: Record<string, unknown>[];
  onQuiz: () => void;
  onReset: () => void;
}

function MechanismCard({ label, mechanism, delay }: { label: string; mechanism: EgoMechanism; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="border border-surface-800 rounded-xl p-4 space-y-1.5"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-surface-500 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-medium text-accent-amber">{mechanism.name}</p>
      </div>
      <p className="text-sm text-surface-300 leading-relaxed">{mechanism.evidence}</p>
    </motion.div>
  );
}

function TypeView({ sim, index, total, phases }: { sim: TypeSimulation; index: number; total: number; phases: Record<string, unknown>[] }) {
  const [expanded, setExpanded] = useState(false);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loadingNarrative, setLoadingNarrative] = useState(false);
  const triad = TRIAD_MAP[sim.type] ?? "";

  const handleExpand = useCallback(async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (narrative) return; // already loaded
    setLoadingNarrative(true);
    try {
      const res = await fetch("/api/enneagram-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phases, type: sim.type }),
      });
      const text = await res.text();
      setNarrative(text);
    } catch {
      setNarrative("Could not load narrative.");
    } finally {
      setLoadingNarrative(false);
    }
  }, [expanded, narrative, phases, sim.type]);

  return (
    <motion.div
      key={sim.type}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Type hero */}
      <div className="text-center space-y-1">
        <p className="text-xs text-surface-500 uppercase tracking-widest">
          Simulation {index + 1} of {total}
        </p>
        <h2 className="text-4xl font-bold text-accent-amber">Type {sim.type}</h2>
        <p className="text-sm text-surface-400">
          {TYPE_NAMES[sim.type]} &middot; {triad} Triad
        </p>
      </div>

      {/* TLDR */}
      {sim.tldr && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="border border-accent-amber/20 bg-accent-amber/5 rounded-2xl px-5 py-4"
        >
          <p className="text-sm text-surface-200 leading-relaxed">{sim.tldr}</p>
        </motion.div>
      )}

      {/* Ego mechanism cards */}
      <div className="grid grid-cols-1 gap-3">
        {sim.fixation && <MechanismCard label="Fixation" mechanism={sim.fixation} delay={0.15} />}
        {sim.passion && <MechanismCard label="Passion" mechanism={sim.passion} delay={0.2} />}
        {sim.trap && <MechanismCard label="Trap" mechanism={sim.trap} delay={0.25} />}
      </div>

      {/* Shocking insight */}
      {sim.shocking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border border-red-500/15 bg-red-500/5 rounded-2xl px-5 py-4"
        >
          <p className="text-xs text-red-400/80 uppercase tracking-widest mb-1">What you might not have noticed</p>
          <p className="text-sm text-surface-300 leading-relaxed">{sim.shocking}</p>
        </motion.div>
      )}

      {/* On-demand narrative */}
      <div className="space-y-2">
        <button
          onClick={handleExpand}
          disabled={loadingNarrative}
          className="text-xs text-surface-500 hover:text-surface-300 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
        >
          {loadingNarrative ? (
            <LoadingState compact message="Generating full simulation..." accent="amber" />
          ) : (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              {expanded ? "Hide full simulation" : "Read full simulation"}
            </>
          )}
        </button>
        <AnimatePresence>
          {expanded && narrative && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="border border-surface-800 rounded-2xl p-5 text-sm text-surface-400 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                {narrative}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function SimulationResults({ simulation, phases, onQuiz, onReset }: SimulationResultsProps) {
  const sims = simulation.simulations ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSim = sims[activeIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Overall summary */}
      {simulation.headline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-1"
        >
          <p className="text-xs text-surface-500 uppercase tracking-widest">VRDW INEE-2</p>
          <h3 className="text-lg font-semibold text-foreground">{simulation.headline}</h3>
          {simulation.summary && (
            <p className="text-sm text-surface-400 leading-relaxed">{simulation.summary}</p>
          )}
        </motion.div>
      )}

      {/* Type tabs */}
      {sims.length > 1 && (
        <div className="flex justify-center gap-2">
          {sims.map((sim, i) => (
            <button
              key={sim.type}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                i === activeIndex
                  ? "bg-accent-amber/10 text-accent-amber border border-accent-amber/30"
                  : "text-surface-500 border border-surface-800 hover:border-surface-600"
              }`}
            >
              Type {sim.type}
            </button>
          ))}
        </div>
      )}

      {/* Active type simulation */}
      <AnimatePresence mode="wait">
        {activeSim && (
          <TypeView
            key={activeSim.type}
            sim={activeSim}
            index={activeIndex}
            total={sims.length}
            phases={phases}
          />
        )}
      </AnimatePresence>

      {/* Navigation between types */}
      {sims.length > 1 && (
        <div className="flex justify-between items-center pt-2">
          <Button
            variant="ghost"
            onClick={() => setActiveIndex((i) => i - 1)}
            disabled={activeIndex === 0}
          >
            &larr; Previous Type
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveIndex((i) => i + 1)}
            disabled={activeIndex === sims.length - 1}
          >
            Next Type &rarr;
          </Button>
        </div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-surface-800"
      >
        <Button variant="secondary" onClick={onQuiz}>
          Take the Quiz to Narrow Down
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Start Over
        </Button>
      </motion.div>

      <p className="text-xs text-surface-500 text-center">
        Powered by VRDW INEE-2 — Ichazo &amp; Naranjo&rsquo;s Enneagram Engine.
      </p>

      <ResultChat
        testType="enneagram"
        result={simulation as Record<string, unknown>}
        accentColor="var(--color-accent-amber)"
      />
    </div>
  );
}
