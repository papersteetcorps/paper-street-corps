"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import WizardShell from "@/components/wizard/WizardShell";
import ResultsLayout from "@/components/results/ResultsLayout";
import TypeCard from "@/components/results/TypeCard";
import NarrativeSection from "@/components/results/NarrativeSection";
import ResultChat from "@/components/results/ResultChat";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";
import { saveResult } from "@/lib/results-store";

const FALLBACK_QUESTIONS: WizardQuestion[] = [
  { id: "pbce-q1", text: "Describe a situation where you felt fully in your element — what were you doing, and why did it feel natural?", answerType: "text", meta: { targetFunctions: ["SbjX", "ObjX"] } },
  { id: "pbce-q2", text: "When you're at your most energized, what kind of activity or environment is responsible for that?", answerType: "text", meta: { targetFunctions: ["SbjX", "ObjX", "SbjA"] } },
  { id: "pbce-q3", text: "Describe a time when you burned out. What were the signs, and what caused the collapse?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q4", text: "When you analyze a problem, do you prefer a gut-level experiential read or building a logical system from scratch? Describe this with a recent example.", answerType: "text", meta: { targetFunctions: ["SbjX", "SbjL"] } },
  { id: "pbce-q5", text: "How do you relate to abstract theory — do you find it energizing or draining? What happens when you're forced to work in abstractions for a long time?", answerType: "text", meta: { targetFunctions: ["SbjA", "ObjA"] } },
  { id: "pbce-q6", text: "In your relationships, what role do your moral values play? Do they feel like a deep engine driving you, or more like a framework you consciously apply?", answerType: "text", meta: { targetFunctions: ["SbjM", "ObjM"] } },
  { id: "pbce-q7", text: "When you're forced to work purely on logic — systems, rules, efficiency — how long before it becomes exhausting? What happens to you mentally?", answerType: "text", meta: { targetFunctions: ["ObjL", "SbjL"], burnoutRelevant: true } },
  { id: "pbce-q8", text: "What does your recovery look like? What activities restore your cognitive energy after depletion?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q9", text: "Do you prefer to generate new frameworks and ideas, or refine and stabilize existing ones? Give an example from your work or life.", answerType: "text", meta: { targetFunctions: ["SbjA", "ObjA", "ObjL"] } },
  { id: "pbce-q10", text: "When your values and logic directly contradict each other in a decision, how do you resolve it? Which wins, and what is the cost?", answerType: "text", meta: { targetFunctions: ["SbjM", "SbjL"], burnoutRelevant: true } },
  { id: "pbce-q11", text: "Describe a work environment where you thrive vs. one where you deteriorate. Be specific about the structure, people, and demands.", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q12", text: "What is something you are deeply competent at but find quietly draining every time you do it?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q13", text: "If you had to define your primary mode of engaging with the world — through direct experience, abstract patterns, logical structure, or moral/relational meaning — which resonates most?", answerType: "text", meta: { targetFunctions: ["SbjX", "SbjA", "SbjL", "SbjM"] } },
  { id: "pbce-q14", text: "What happens to your performance and self-image when you are working outside your preferred domain for an extended period?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q15", text: "When a project ends, what do you feel — relief, emptiness, or an immediate need to start something new? What does this tell you?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q16", text: "What is the thing that, if you had to do it every day, would slowly erode who you are?", answerType: "text", meta: { burnoutRelevant: true } },
];

const DOMAIN_LABELS: Record<string, string> = {
  X: "Experience",
  A: "Abstraction",
  L: "Logic",
  M: "Morality",
};

const DOMAIN_COLORS: Record<string, string> = {
  X: "text-accent-blue",
  A: "text-accent-purple",
  L: "text-accent-teal",
  M: "text-accent-amber",
};

type Interpretation = {
  headline?: string;
  summary?: string;
  insights?: string[];
  strengths?: string[];
  challenges?: string[];
  growth?: string;
  pbceType?: string;
  nickname?: string;
  primaryDomain?: string;
  primaryDirection?: string;
  functionStack?: string[];
} | null;

export default function PotentiologyPage() {
  const [interpretation, setInterpretation] = useState<Interpretation>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = useCallback(async (answers: WizardAnswer[]) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/score-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: "potentiology",
          answers,
          localResult: { answers: answers.map((a) => ({ id: a.questionId, response: a.value })) },
        }),
      });
      const data = await res.json();
      const interp = data.interpretation ?? {
        headline: "Analysis complete",
        summary: "Your responses have been recorded.",
      };
      setInterpretation(interp);
      if (data.interpretation) saveResult("potentiology", data.interpretation);
    } catch {
      setInterpretation({ headline: "Analysis complete", summary: "Could not reach the interpretation service." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => setInterpretation(null), []);

  const resultView = interpretation ? (
    <PBCEResults interpretation={interpretation} />
  ) : null;

  return (
    <WizardShell
      title="Potentiology Burnout Cycle Engine"
      subtitle="VRDW PBCE-1 — An energy-based cognitive framework. 16 questions from a strict but caring mentor. Honesty is required. This test identifies your cognitive domain, burnout pattern, and sustainable capacity."
      questions={FALLBACK_QUESTIONS}
      loadingQuestions={false}
      onComplete={handleComplete}
      resultView={resultView}
      isLoading={isLoading}
      onReset={handleReset}
    />
  );
}

function PBCEResults({ interpretation }: { interpretation: NonNullable<Interpretation> }) {
  const pbceType = interpretation.pbceType ?? "—";
  const nickname = interpretation.nickname;
  const primaryDomain = interpretation.primaryDomain;
  const primaryDirection = interpretation.primaryDirection;
  const functionStack = interpretation.functionStack ?? [];

  const domainColor = primaryDomain ? DOMAIN_COLORS[primaryDomain] ?? "text-foreground" : "text-foreground";
  const domainLabel = primaryDomain ? DOMAIN_LABELS[primaryDomain] ?? primaryDomain : null;

  return (
    <ResultsLayout>
      {/* Type hero */}
      <TypeCard
        typeCode={pbceType}
        subtitle={nickname ?? "Potentiology Type"}
        confidence={undefined}
        accentColor="purple"
        delay={0}
      />

      {/* Domain + direction */}
      {(primaryDomain || primaryDirection) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {primaryDomain && (
            <div className="border border-surface-800 rounded-2xl p-5 text-center">
              <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Primary Domain</p>
              <p className={`text-3xl font-bold ${domainColor}`}>{primaryDomain}</p>
              <p className="text-sm text-surface-400 mt-1">{domainLabel}</p>
            </div>
          )}
          {primaryDirection && (
            <div className="border border-surface-800 rounded-2xl p-5 text-center">
              <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Orientation</p>
              <p className="text-3xl font-bold text-foreground">{primaryDirection}</p>
              <p className="text-sm text-surface-400 mt-1">
                {primaryDirection === "Sbj" ? "Subjective — internally referenced" : "Objective — externally referenced"}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Function stack (energy cascade) */}
      {functionStack.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="border border-surface-800 rounded-2xl p-6 space-y-4"
        >
          <div>
            <p className="text-xs text-surface-500 uppercase tracking-widest mb-1">Energy Stack</p>
            <p className="text-xs text-surface-600">Functions ordered by energy capacity — ego defaults down the stack as energy depletes</p>
          </div>
          <div className="space-y-2">
            {functionStack.map((fn, i) => {
              const domain = fn.slice(-1);
              const color = DOMAIN_COLORS[domain] ?? "text-surface-300";
              const width = `${Math.max(20, 100 - i * 11)}%`;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-surface-500 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 bg-surface-800 rounded-full h-6 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                      className={`h-full rounded-full ${i === 0 ? "bg-accent-purple/40" : i <= 3 ? "bg-surface-600" : "bg-surface-700"}`}
                    />
                    <span className={`absolute inset-y-0 left-3 flex items-center text-xs font-medium ${color}`}>{fn}</span>
                  </div>
                  <span className="text-xs text-surface-600 shrink-0 w-16">
                    {i === 0 ? "Highest cap" : i === 7 ? "Lowest cap" : ""}
                  </span>
                </div>
              );
            })}
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
        delay={0.6}
      />

      <p className="text-xs text-surface-500 text-center">
        Powered by VRDW PBCE-1 &mdash; Potentiology Burnout Cycle Engine. Energy-based cognitive typing.
      </p>

      <ResultChat testType="potentiology" result={interpretation as Record<string, unknown>} accentColor="var(--color-accent-purple)" />
    </ResultsLayout>
  );
}
