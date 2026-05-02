"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import WizardShell from "@/components/wizard/WizardShell";
import ModeSelector, { type TestMode } from "@/components/wizard/ModeSelector";
import TestVoice from "@/components/wizard/TestVoice";
import AnalysisLoader from "@/components/wizard/AnalysisLoader";
import { logEvent } from "@/lib/logger";
import ResultsLayout from "@/components/results/ResultsLayout";
import TypeCard from "@/components/results/TypeCard";
import NarrativeSection from "@/components/results/NarrativeSection";
import ResultChat from "@/components/results/ResultChat";
import ResultVoiceCoach from "@/components/results/ResultVoiceCoach";
import ResultDictate from "@/components/results/ResultDictate";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";
import { saveResult } from "@/lib/results-store";

const FALLBACK_QUESTIONS: WizardQuestion[] = [
  { id: "pbce-q1", text: "When do you feel most like yourself? What are you doing?", answerType: "text", meta: { targetFunctions: ["SbjX", "ObjX"] } },
  { id: "pbce-q2", text: "What activities or environments give you the most energy?", answerType: "text", meta: { targetFunctions: ["SbjX", "ObjX", "SbjA"] } },
  { id: "pbce-q3", text: "Tell me about a time you burned out. What caused it and what were the warning signs?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q4", text: "When solving a problem, do you go with your gut or build a system? Give a recent example.", answerType: "text", meta: { targetFunctions: ["SbjX", "SbjL"] } },
  { id: "pbce-q5", text: "Does abstract thinking energize you or drain you? What happens when you have to do it for hours?", answerType: "text", meta: { targetFunctions: ["SbjA", "ObjA"] } },
  { id: "pbce-q6", text: "How much do your personal values drive your decisions? Are they automatic or something you consciously check?", answerType: "text", meta: { targetFunctions: ["SbjM", "ObjM"] } },
  { id: "pbce-q7", text: "How long can you work on pure logic, rules, and systems before it starts wearing you down?", answerType: "text", meta: { targetFunctions: ["ObjL", "SbjL"], burnoutRelevant: true } },
  { id: "pbce-q8", text: "What do you do to recharge after a mentally draining period?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q9", text: "Do you prefer creating new ideas or improving existing ones? Give an example.", answerType: "text", meta: { targetFunctions: ["SbjA", "ObjA", "ObjL"] } },
  { id: "pbce-q10", text: "When your values and your logic disagree, which one wins? What does that cost you?", answerType: "text", meta: { targetFunctions: ["SbjM", "SbjL"], burnoutRelevant: true } },
  { id: "pbce-q11", text: "Describe a work environment where you thrive vs. one where you fall apart.", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q12", text: "What's something you're good at but find quietly draining every time you do it?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q13", text: "How do you engage with the world most naturally: hands-on experience, abstract patterns, logical structure, or through relationships and values?", answerType: "text", meta: { targetFunctions: ["SbjX", "SbjA", "SbjL", "SbjM"] } },
  { id: "pbce-q14", text: "What happens to you when you're stuck doing work outside your comfort zone for a long time?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q15", text: "When a project ends, what do you feel? Relief, emptiness, or the urge to start something new?", answerType: "text", meta: { burnoutRelevant: true } },
  { id: "pbce-q16", text: "What's the one thing that, if you had to do it every day, would slowly destroy you?", answerType: "text", meta: { burnoutRelevant: true } },
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
  const [mode, setMode] = useState<TestMode | null>(null);
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
      if (data.interpretation) {
        saveResult("potentiology", data.interpretation);
        logEvent("test_completed", {
          testType: "potentiology",
          mode: mode ?? undefined,
          payload: { answers, result: data.interpretation },
        });
      }
    } catch {
      setInterpretation({ headline: "Analysis complete", summary: "Could not reach the interpretation service." });
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  const handleReset = useCallback(() => {
    setInterpretation(null);
    setMode(null);
  }, []);

  const resultView = interpretation ? (
    <PBCEResults interpretation={interpretation} />
  ) : null;

  if (!mode && !interpretation) {
    return (
      <ModeSelector
        title="Energy Profile"
        framework="Cognitive energy & burnout cycles"
        subtitle="Sixteen questions about what energizes you and what drains you. You'll get your cognitive domain, energy stack, and the burnout patterns you fall into."
        onSelect={setMode}
        questionCount={FALLBACK_QUESTIONS.length}
        estimateClassic="~8 mins"
        estimateVoice="~15 mins"
      />
    );
  }

  if (mode === "voice" && !interpretation && !isLoading) {
    return (
      <TestVoice
        title="Energy Profile"
        questions={FALLBACK_QUESTIONS}
        onComplete={handleComplete}
        onSwitchMode={() => setMode("classic")}
        domain="cognitive energy patterns and burnout cycles"
      />
    );
  }

  if (mode === "voice" && isLoading) {
    return <AnalysisLoader title="Building your energy profile" />;
  }

  return (
    <WizardShell
      title="Energy Profile"
      subtitle="16 honest questions about what energizes you and what drains you. You'll get your cognitive domain, energy stack, and the burnout patterns you keep falling into."
      questions={FALLBACK_QUESTIONS}
      loadingQuestions={false}
      onComplete={handleComplete}
      resultView={resultView}
      isLoading={isLoading}
      onReset={handleReset}
      autoStart
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
      <ResultDictate testType="potentiology" result={interpretation as unknown as Record<string, unknown>} accentColor="var(--color-accent-purple)" />
      {/* Type hero */}
      <TypeCard
        typeCode={pbceType}
        subtitle={nickname ?? "Energy Profile Type"}
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
                {primaryDirection === "Sbj" ? "Subjective, internally referenced" : "Objective, externally referenced"}
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
        Based on PBCE-1. Energy-based cognitive typing.
      </p>

      <ResultChat testType="potentiology" result={interpretation as Record<string, unknown>} accentColor="var(--color-accent-purple)" />
      <ResultVoiceCoach testType="potentiology" result={interpretation as Record<string, unknown>} accentColor="var(--color-accent-purple)" />
    </ResultsLayout>
  );
}
