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
  { id: "kime-q1", text: "When evaluating a claim, what matters more: whether it is logically consistent within its own framework, or whether it produces measurable results in practice? Why?", answerType: "text", meta: { targetElements: ["Ti", "Te"] } },
  { id: "kime-q2", text: "Do you naturally monitor how relationships evolve over time, sensing emotional distance shifts even if nothing is said?", answerType: "text", meta: { targetElements: ["Fi", "Fe"] } },
  { id: "kime-q3", text: "When entering a new environment, do you quickly assess who holds influence and how power flows?", answerType: "text", meta: { targetElements: ["Se", "Te"] } },
  { id: "kime-q4", text: "Do you often think about where situations are heading long-term, even when others are focused on the present?", answerType: "text", meta: { targetElements: ["Ni", "Ne"] } },
  { id: "kime-q5", text: "When solving a problem, do you prefer generating many alternative possibilities first, or narrowing toward one inevitable direction?", answerType: "text", meta: { targetElements: ["Ne", "Ni"] } },
  { id: "kime-q6", text: "Are you highly sensitive to physical comfort, atmosphere, lighting, and subtle environmental harmony?", answerType: "text", meta: { targetElements: ["Si", "Se"] } },
  { id: "kime-q7", text: "Do you feel responsible for maintaining or elevating the emotional tone in a group setting?", answerType: "text", meta: { targetElements: ["Fe", "Fi"] } },
  { id: "kime-q8", text: "Do you instinctively categorize information into internally consistent systems and definitions?", answerType: "text", meta: { targetElements: ["Ti"] } },
  { id: "kime-q9", text: "When working on a task, do you prioritize efficiency and output metrics over conceptual elegance?", answerType: "text", meta: { targetElements: ["Te", "Ti"] } },
  { id: "kime-q10", text: "Do you find it easy to imagine how a person could develop into something very different from what they are now?", answerType: "text", meta: { targetElements: ["Ni", "Ne"] } },
  { id: "kime-q11", text: "In conflicts, do you focus more on preserving personal loyalty bonds or on mobilizing collective emotional energy?", answerType: "text", meta: { targetElements: ["Fi", "Fe"] } },
  { id: "kime-q12", text: "Do you tend to act directly to secure territory, resources, or leverage when something feels threatened?", answerType: "text", meta: { targetElements: ["Se"] } },
  { id: "kime-q13", text: "Is your attention frequently absorbed by subtle internal sensations, pacing, and maintaining personal equilibrium?", answerType: "text", meta: { targetElements: ["Si"] } },
  { id: "kime-q14", text: "Do you evaluate people primarily based on demonstrated competence and effectiveness?", answerType: "text", meta: { targetElements: ["Te"] } },
  { id: "kime-q15", text: "When someone expresses strong emotions, do you analyze their structural reasoning first, or respond to the emotional field itself?", answerType: "text", meta: { targetElements: ["Ti", "Fe"] } },
  { id: "kime-q16", text: "Do you experience time as a flowing trajectory, sensing momentum and inevitability rather than isolated events?", answerType: "text", meta: { targetElements: ["Ni"] } },
];

const MODEL_A_POSITIONS = [
  { pos: "1. Base (Leading)", color: "text-accent-blue", bg: "bg-accent-blue/5 border-accent-blue/20" },
  { pos: "2. Creative", color: "text-accent-purple", bg: "bg-accent-purple/5 border-accent-purple/20" },
  { pos: "3. Role", color: "text-surface-300", bg: "bg-surface-900 border-surface-700" },
  { pos: "4. Vulnerable (PoLR)", color: "text-red-400", bg: "bg-red-500/5 border-red-500/20" },
  { pos: "5. Suggestive", color: "text-accent-teal", bg: "bg-accent-teal/5 border-accent-teal/20" },
  { pos: "6. Mobilizing", color: "text-accent-amber", bg: "bg-accent-amber/5 border-accent-amber/20" },
  { pos: "7. Ignoring", color: "text-surface-500", bg: "bg-surface-900 border-surface-800" },
  { pos: "8. Demonstrative", color: "text-surface-400", bg: "bg-surface-900 border-surface-800" },
];

type Interpretation = {
  headline?: string;
  summary?: string;
  insights?: string[];
  strengths?: string[];
  challenges?: string[];
  growth?: string;
  socType?: string;
  mbtiType?: string;
  quadra?: string;
  baseElement?: string;
  modelAStack?: string[];
} | null;

export default function SocionicsPage() {
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
          testType: "socionics",
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
        saveResult("socionics", data.interpretation);
        logEvent("test_completed", {
          testType: "socionics",
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
    <KIMEResults interpretation={interpretation} />
  ) : null;

  if (!mode && !interpretation) {
    return (
      <ModeSelector
        title="Socionics"
        framework="Socionics & information metabolism"
        subtitle="Sixteen questions to find your sociotype. Reveals how you process information and interact with others."
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
        title="Socionics"
        questions={FALLBACK_QUESTIONS}
        onComplete={handleComplete}
        onSwitchMode={() => setMode("classic")}
        domain="Socionics and information metabolism"
      />
    );
  }

  if (mode === "voice" && isLoading) {
    return <AnalysisLoader title="Building your sociotype profile" />;
  }

  return (
    <WizardShell
      title="Socionics"
      subtitle="16 questions to find your sociotype. This looks at how you process information, not just how you behave."
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

function KIMEResults({ interpretation }: { interpretation: NonNullable<Interpretation> }) {
  const socType = interpretation.socType ?? "---";
  const mbtiType = interpretation.mbtiType;
  const quadra = interpretation.quadra;
  const modelAStack = interpretation.modelAStack ?? [];

  return (
    <ResultsLayout>
      <ResultDictate testType="socionics" result={interpretation as unknown as Record<string, unknown>} accentColor="var(--color-accent-amber)" />
      {/* Type hero */}
      <TypeCard
        typeCode={socType}
        subtitle={mbtiType ? `MBTI: ${mbtiType}${quadra ? ` · ${quadra} Quadra` : ""}` : quadra ? `${quadra} Quadra` : "Socionics Sociotype"}
        confidence={undefined}
        accentColor="amber"
        delay={0}
      />

      {/* Model A stack */}
      {modelAStack.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-surface-800 rounded-2xl p-6 space-y-4"
        >
          <p className="text-xs text-surface-500 uppercase tracking-widest">Model A — Information Element Stack</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MODEL_A_POSITIONS.slice(0, modelAStack.length).map(({ pos, color, bg }, i) => (
              <div key={pos} className={`rounded-xl p-3 border ${bg}`}>
                <p className="text-xs text-surface-500 mb-1 truncate">{pos}</p>
                <p className={`text-xl font-bold ${color}`}>{modelAStack[i]}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-surface-500">
            Ego block: {modelAStack.slice(0, 2).join(" + ")} &nbsp;&bull;&nbsp;
            SuperId: {modelAStack.slice(4, 6).join(" + ")}
          </p>
        </motion.section>
      )}

      {/* Quadra info */}
      {quadra && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="border border-accent-amber/20 bg-accent-amber/5 rounded-2xl px-5 py-4 flex items-center gap-4"
        >
          <span className="text-3xl">🌐</span>
          <div>
            <p className="text-xs text-surface-500 uppercase tracking-widest mb-0.5">Quadra</p>
            <p className="text-lg font-semibold text-accent-amber">{quadra}</p>
            <p className="text-xs text-surface-400 mt-0.5">Valued information elements define your social and intellectual ecology.</p>
          </div>
        </motion.div>
      )}

      {/* Narrative */}
      <NarrativeSection
        headline={interpretation.headline}
        summary={interpretation.summary}
        insights={interpretation.insights}
        strengths={interpretation.strengths}
        challenges={interpretation.challenges}
        growth={interpretation.growth}
        delay={0.5}
      />

      <p className="text-xs text-surface-500 text-center">
        Socionics typing via Model A analysis.
      </p>

      <ResultChat testType="socionics" result={interpretation as Record<string, unknown>} accentColor="var(--color-accent-amber)" />
      <ResultVoiceCoach testType="socionics" result={interpretation as Record<string, unknown>} accentColor="var(--color-accent-amber)" />
    </ResultsLayout>
  );
}
