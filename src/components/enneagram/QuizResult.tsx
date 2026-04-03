"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import ResultChat from "@/components/results/ResultChat";

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

interface QuizResultProps {
  winnerType: number;
  tally: Record<number, number>;
  comparedTypes: number[];
  onReset: () => void;
}

export default function QuizResult({ winnerType, tally, comparedTypes, onReset }: QuizResultProps) {
  const totalAnswers = Object.values(tally).reduce((a, b) => a + b, 0);
  const winnerCount = tally[winnerType] ?? 0;
  const pct = totalAnswers > 0 ? Math.round((winnerCount / totalAnswers) * 100) : 0;
  const triad = TRIAD_MAP[winnerType] ?? "";

  const sortedTypes = [...comparedTypes].sort((a, b) => (tally[b] ?? 0) - (tally[a] ?? 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Hero */}
      <div className="text-center space-y-3">
        <p className="text-xs text-surface-500 uppercase tracking-widest">Quiz Result</p>
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-5xl font-bold text-accent-amber"
        >
          Type {winnerType}
        </motion.h2>
        <p className="text-lg text-surface-300">{TYPE_NAMES[winnerType]}</p>
        <p className="text-sm text-surface-500">{triad} Triad &middot; {pct}% of your answers &middot; {totalAnswers} total responses</p>
      </div>

      {/* Breakdown */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-surface-800 rounded-2xl p-6 space-y-4"
      >
        <p className="text-xs text-surface-500 uppercase tracking-widest">Type Comparison</p>
        <div className="space-y-3">
          {sortedTypes.map((t, i) => {
            const count = tally[t] ?? 0;
            const typePct = totalAnswers > 0 ? (count / totalAnswers) * 100 : 0;
            const isWinner = t === winnerType;
            return (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="space-y-1"
              >
                <div className="flex justify-between items-baseline">
                  <span className={`text-sm font-medium ${isWinner ? "text-accent-amber" : "text-surface-400"}`}>
                    Type {t} — {TYPE_NAMES[t]}
                  </span>
                  <span className="text-xs text-surface-500">{count}/{totalAnswers} ({Math.round(typePct)}%)</span>
                </div>
                <div className="h-3 bg-surface-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${typePct}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                    className={`h-full rounded-full ${isWinner ? "bg-accent-amber" : "bg-surface-600"}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border border-surface-800 rounded-2xl p-6"
      >
        <p className="text-xs text-surface-500 uppercase tracking-widest mb-3">How This Was Determined</p>
        <p className="text-sm text-surface-400 leading-relaxed">
          The quiz presented scenarios derived from your own life phases. Each option described how a specific
          Enneagram type would process that situation — without revealing which type it represented. Your pattern
          of choices consistently aligned with Type {winnerType} ({TYPE_NAMES[winnerType]}), suggesting this
          type&rsquo;s fixation, passion, and trap most closely match how you actually experienced your life.
        </p>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Button variant="ghost" onClick={onReset}>Start Over</Button>
      </div>

      <p className="text-xs text-surface-500 text-center">
        Powered by VRDW INEE-2 — Ichazo &amp; Naranjo&rsquo;s Enneagram Engine. Personalized life-phase quiz.
      </p>

      <ResultChat
        testType="enneagram"
        result={{ winnerType, tally, comparedTypes } as unknown as Record<string, unknown>}
        accentColor="var(--color-accent-amber)"
      />
    </motion.div>
  );
}
