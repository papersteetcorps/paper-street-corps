"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import type { LifePhase } from "@/lib/types/enneagram";
import { phaseToPayload } from "@/lib/types/enneagram";

interface QuizOption {
  type: number;
  text: string;
}

interface QuizQuestion {
  id: string;
  scenario: string;
  options: QuizOption[];
}

interface QuizAnswer {
  questionId: string;
  chosenType: number;
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

const MIN_ROUNDS = 1;
const MAX_ROUNDS = 5;
const WIN_LEAD = 3;
const WIN_RATIO = 0.55;

function getWinner(tally: Record<number, number>, totalAnswers: number): number | null {
  const entries = Object.entries(tally).map(([t, c]) => ({ type: Number(t), count: c }));
  if (entries.length < 2) return null;
  entries.sort((a, b) => b.count - a.count);
  const first = entries[0];
  const second = entries[1];
  if (first.count - second.count >= WIN_LEAD && first.count / totalAnswers >= WIN_RATIO) {
    return first.type;
  }
  return null;
}

interface QuizViewProps {
  phases: LifePhase[];
  comparedTypes: number[];
  onResult: (winnerType: number, tally: Record<number, number>) => void;
  onBack: () => void;
}

export default function QuizView({ phases, comparedTypes, onResult, onBack }: QuizViewProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [tally, setTally] = useState<Record<number, number>>(() => {
    const t: Record<number, number> = {};
    comparedTypes.forEach((n) => (t[n] = 0));
    return t;
  });
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const fetchQuestions = useCallback(
    async (roundNum: number, prevAnswers: QuizAnswer[]) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/enneagram-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phases: phases.map(phaseToPayload),
            comparedTypes,
            round: roundNum,
            previousAnswers: prevAnswers,
          }),
        });
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
          setCurrentIndex(0);
        } else {
          setError(data.error || "Failed to generate quiz questions.");
        }
      } catch {
        setError("Could not reach the quiz service.");
      } finally {
        setLoading(false);
      }
    },
    [phases, comparedTypes]
  );

  useEffect(() => {
    fetchQuestions(1, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = useCallback(
    (chosenType: number) => {
      const q = questions[currentIndex];
      if (!q) return;

      setSelectedOption(chosenType);

      // brief delay so user sees selection highlight
      setTimeout(() => {
        const newAnswer: QuizAnswer = { questionId: q.id, chosenType };
        const newAnswers = [...answers, newAnswer];
        const newTally = { ...tally, [chosenType]: (tally[chosenType] ?? 0) + 1 };

        setAnswers(newAnswers);
        setTally(newTally);
        setSelectedOption(null);

        const totalAnswered = newAnswers.length;
        const isLastInRound = currentIndex === questions.length - 1;

        if (isLastInRound) {
          // check for winner
          const winner = totalAnswered >= MIN_ROUNDS * 10 ? getWinner(newTally, totalAnswered) : null;
          if (winner || round >= MAX_ROUNDS) {
            setFinished(true);
            onResult(winner ?? getBestType(newTally), newTally);
            return;
          }
          // next round
          const nextRound = round + 1;
          setRound(nextRound);
          fetchQuestions(nextRound, newAnswers);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 300);
    },
    [questions, currentIndex, answers, tally, round, fetchQuestions, onResult]
  );

  const totalAnswered = answers.length;
  const currentQ = questions[currentIndex];

  // Tally bar
  const maxTally = Math.max(1, ...Object.values(tally));

  if (finished) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs text-surface-500 uppercase tracking-widest">VRDW INEE-2 — Quiz</p>
        <h2 className="text-2xl font-semibold tracking-tight">Narrowing Down Your Type</h2>
        <p className="text-sm text-surface-400">
          Round {round} &middot; Question {currentIndex + 1}/{questions.length} &middot; {totalAnswered} answered total
        </p>
      </div>

      {/* Tally */}
      <div className="border border-surface-800 rounded-2xl p-4 space-y-2">
        <p className="text-xs text-surface-500 uppercase tracking-widest">Running Tally</p>
        <div className="space-y-1.5">
          {comparedTypes.map((t) => (
            <div key={t} className="flex items-center gap-3">
              <span className="text-xs text-surface-400 w-6 text-right">{t}</span>
              <div className="flex-1 bg-surface-800 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent-amber/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${((tally[t] ?? 0) / maxTally) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-xs text-surface-400 w-6">{tally[t] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <LoadingState
          message={round === 1 ? "Building your personalized quiz" : `Generating round ${round}`}
          variant="quiz"
          accent="amber"
        />
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-12 space-y-4">
          <p className="text-red-400 text-sm">{error}</p>
          <Button variant="secondary" onClick={() => fetchQuestions(round, answers)}>
            Retry
          </Button>
        </div>
      )}

      {/* Question */}
      {!loading && !error && currentQ && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Scenario */}
            <div className="border border-surface-800 rounded-2xl p-5">
              <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Scenario</p>
              <p className="text-sm text-surface-200 leading-relaxed">{currentQ.scenario}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <p className="text-xs text-surface-500">Which response resonates most with your actual experience?</p>
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === opt.type;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => selectedOption === null && handleAnswer(opt.type)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left rounded-xl border p-4 transition-all cursor-pointer disabled:cursor-default ${
                      isSelected
                        ? "border-accent-amber bg-accent-amber/10"
                        : "border-surface-800 hover:border-surface-600 bg-surface-900"
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className={`text-sm font-bold shrink-0 ${isSelected ? "text-accent-amber" : "text-surface-600"}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <p className="text-sm text-surface-300 leading-relaxed">{opt.text}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Back */}
      <div className="flex justify-start pt-2">
        <Button variant="ghost" onClick={onBack} disabled={loading}>
          Back to Simulation
        </Button>
      </div>
    </motion.div>
  );
}

function getBestType(tally: Record<number, number>): number {
  let best = 0;
  let bestCount = -1;
  for (const [t, c] of Object.entries(tally)) {
    if (c > bestCount) {
      bestCount = c;
      best = Number(t);
    }
  }
  return best;
}
