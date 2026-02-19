"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import WizardShell from "@/components/wizard/WizardShell";
import ResultsLayout from "@/components/results/ResultsLayout";
import TypeCard from "@/components/results/TypeCard";
import NarrativeSection from "@/components/results/NarrativeSection";
import ResultChat from "@/components/results/ResultChat";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";

const FALLBACK_QUESTIONS: WizardQuestion[] = [
  {
    id: "cjte-q1",
    text: "What thoughts run in your head most of the time?",
    description: "Question 1 of 8 — Dominant Thought Content (Weight 3)",
    answerType: "text",
    meta: { questionNumber: 1, weight: 3 },
  },
  {
    id: "cjte-q2",
    text: "What is your field / domain of interest and why?",
    description: "Question 2 of 8 — Field of Interest (Weight 2)",
    answerType: "text",
    meta: { questionNumber: 2, weight: 2 },
  },
  {
    id: "cjte-q3",
    text: "What is the dark impulse deep within you (if any)?",
    description: "Question 3 of 8 — Dark Impulse (Weight 2)",
    answerType: "text",
    meta: { questionNumber: 3, weight: 2 },
  },
  {
    id: "cjte-q4",
    text: "What are your leading moral values and sensitive areas?",
    description: "Question 4 of 8 — Moral Values (Weight 3)",
    answerType: "text",
    meta: { questionNumber: 4, weight: 3 },
  },
  {
    id: "cjte-q5",
    text: "Write about how your usual day-to-day routine is like.",
    description: "Question 5 of 8 — Daily Routine (Weight 2)",
    answerType: "text",
    meta: { questionNumber: 5, weight: 2 },
  },
  {
    id: "cjte-q6",
    text: "What is your style of problem-solving and decision-making?",
    description: "Question 6 of 8 — Problem Solving (Weight 3)",
    answerType: "text",
    meta: { questionNumber: 6, weight: 3 },
  },
  {
    id: "cjte-q7",
    text: "What are the things you like about this world?",
    description: "Question 7 of 8 — What You Like (Weight 1)",
    answerType: "text",
    meta: { questionNumber: 7, weight: 1 },
  },
  {
    id: "cjte-q8",
    text: "What are the things you hate about this world?",
    description: "Question 8 of 8 — What You Hate (Weight 1)",
    answerType: "text",
    meta: { questionNumber: 8, weight: 1 },
  },
];

type Interpretation = {
  headline?: string;
  summary?: string;
  insights?: string[];
  strengths?: string[];
  challenges?: string[];
  growth?: string;
  typeCode?: string;
  socionicsCode?: string;
  functionStack?: string[];
} | null;

export default function CJTEPage() {
  const [questions, setQuestions] = useState<WizardQuestion[]>(FALLBACK_QUESTIONS);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [interpretation, setInterpretation] = useState<Interpretation>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testType: "cjte" }),
        });
        const data = await res.json();
        if (!cancelled && data.questions && !data.fallback) {
          setQuestions(data.questions);
        }
      } catch {
        // fallback to static
      } finally {
        if (!cancelled) setLoadingQuestions(false);
      }
    }
    fetchQuestions();
    return () => { cancelled = true; };
  }, []);

  const handleComplete = useCallback(async (answers: WizardAnswer[]) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/score-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: "cjte",
          answers,
          localResult: { answers: answers.map((a) => ({ id: a.questionId, response: a.value })) },
        }),
      });
      const data = await res.json();
      if (data.interpretation) {
        setInterpretation(data.interpretation);
      } else {
        setInterpretation({ headline: "Analysis complete", summary: "Your responses have been processed. Add GEMINI_API_KEY for full interpretation." });
      }
    } catch {
      setInterpretation({ headline: "Analysis complete", summary: "Could not reach the interpretation service." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => setInterpretation(null), []);

  const resultView = interpretation ? (
    <CJTEResults interpretation={interpretation} />
  ) : null;

  return (
    <WizardShell
      title="Classic Jungian Typology Engine"
      subtitle="VRDW CJTE-3 — Eight open-ended questions to determine your Jungian type and cognitive function stack. Answer honestly and specifically. Your answers will be analyzed with the full Jungian corpus."
      questions={questions}
      loadingQuestions={loadingQuestions}
      onComplete={handleComplete}
      resultView={resultView}
      isLoading={isLoading}
      onReset={handleReset}
    />
  );
}

function CJTEResults({ interpretation }: { interpretation: NonNullable<Interpretation> }) {
  const typeCode = interpretation.typeCode ?? "----";
  const socionics = interpretation.socionicsCode;
  const functionStack = interpretation.functionStack ?? [];

  return (
    <ResultsLayout>
      {/* Type hero */}
      <TypeCard
        typeCode={typeCode}
        subtitle={socionics ? `Socionics: ${socionics}` : "Classic Jungian Type"}
        confidence={undefined}
        accentColor="blue"
        delay={0}
      />

      {/* Cognitive function stack */}
      {functionStack.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-surface-800 rounded-2xl p-6 space-y-4"
        >
          <p className="text-xs text-surface-500 uppercase tracking-widest">Cognitive Function Stack</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Dominant", "Auxiliary", "Tertiary", "Inferior"].map((pos, i) => (
              <div
                key={pos}
                className={`rounded-xl p-4 border text-center ${
                  i === 0
                    ? "border-accent-blue/30 bg-accent-blue/5"
                    : i === 1
                    ? "border-accent-purple/30 bg-accent-purple/5"
                    : i === 2
                    ? "border-accent-teal/30 bg-accent-teal/5"
                    : "border-surface-700 bg-surface-900"
                }`}
              >
                <p className="text-xs text-surface-500 mb-1">{pos}</p>
                <p className={`text-xl font-bold ${
                  i === 0 ? "text-accent-blue" : i === 1 ? "text-accent-purple" : i === 2 ? "text-accent-teal" : "text-surface-400"
                }`}>
                  {functionStack[i] ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* AI narrative */}
      <NarrativeSection
        headline={interpretation.headline}
        summary={interpretation.summary}
        insights={interpretation.insights}
        strengths={interpretation.strengths}
        challenges={interpretation.challenges}
        growth={interpretation.growth}
        delay={0.4}
      />

      <p className="text-xs text-surface-500 text-center">
        Powered by VRDW CJTE-3 &mdash; Classic Jungian Typology Engine with full cognitive function corpus.
      </p>

      <ResultChat testType="cjte" result={interpretation as Record<string, unknown>} accentColor="var(--color-accent-blue)" />
    </ResultsLayout>
  );
}
