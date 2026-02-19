"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import {
  classifyMoralAlignment,
  ALL_ALIGNMENTS,
  ALIGNMENT_COLORS,
  type MoralAlignmentResult,
} from "@/lib/scoring/moralAlignment";
import WizardShell from "@/components/wizard/WizardShell";
import ResultsLayout from "@/components/results/ResultsLayout";
import TypeCard from "@/components/results/TypeCard";
import NarrativeSection from "@/components/results/NarrativeSection";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";

type Interpretation = {
  narrative: string;
  insights: string[];
  typeDescription: string;
} | null;

const staticQuestions: WizardQuestion[] = [
  {
    id: "ma-s1",
    text: "I believe rules and laws are essential for a functioning society.",
    answerType: "scale",
    labels: ["Strongly Disagree", "Strongly Agree"],
    min: 1, max: 5,
    meta: { axis: "structure" },
  },
  {
    id: "ma-s2",
    text: "I respect authority and follow established procedures.",
    answerType: "scale",
    labels: ["Strongly Disagree", "Strongly Agree"],
    min: 1, max: 5,
    meta: { axis: "structure" },
  },
  {
    id: "ma-s3",
    text: "I prefer consistency and tradition over spontaneity and change.",
    answerType: "scale",
    labels: ["Strongly Disagree", "Strongly Agree"],
    min: 1, max: 5,
    meta: { axis: "structure" },
  },
  {
    id: "ma-i1",
    text: "I prioritize helping others even at personal cost.",
    answerType: "scale",
    labels: ["Strongly Disagree", "Strongly Agree"],
    min: 1, max: 5,
    meta: { axis: "impulse" },
  },
  {
    id: "ma-i2",
    text: "I feel responsible for the wellbeing of people around me.",
    answerType: "scale",
    labels: ["Strongly Disagree", "Strongly Agree"],
    min: 1, max: 5,
    meta: { axis: "impulse" },
  },
  {
    id: "ma-i3",
    text: "I believe compassion should guide decision-making more than efficiency.",
    answerType: "scale",
    labels: ["Strongly Disagree", "Strongly Agree"],
    min: 1, max: 5,
    meta: { axis: "impulse" },
  },
];

export default function MoralAlignmentPage() {
  const [questions, setQuestions] = useState<WizardQuestion[]>(staticQuestions);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [result, setResult] = useState<MoralAlignmentResult | null>(null);
  const [interpretation, setInterpretation] = useState<Interpretation>(null);
  const [isLLMSource, setIsLLMSource] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testType: "moral-alignment", questionCount: 6 }),
        });
        const data = await res.json();
        if (!cancelled && data.questions && !data.fallback) {
          setQuestions(data.questions);
          setIsLLMSource(true);
        }
      } catch {
        // fallback
      } finally {
        if (!cancelled) setLoadingQuestions(false);
      }
    }
    fetchQuestions();
    return () => { cancelled = true; };
  }, []);

  const handleComplete = useCallback(
    (answers: WizardAnswer[]) => {
      let structureSum = 0, structureCount = 0;
      let impulseSum = 0, impulseCount = 0;

      const qs = isLLMSource ? questions : staticQuestions;
      qs.forEach((q) => {
        const answer = answers.find((a) => a.questionId === q.id);
        if (!answer) return;
        const axis = q.meta?.axis as string;
        const val = typeof answer.value === "number" ? answer.value : 3;
        if (axis === "structure") {
          structureSum += val;
          structureCount++;
        } else if (axis === "impulse") {
          impulseSum += val;
          impulseCount++;
        }
      });

      const structureScore = structureCount > 0 ? structureSum / structureCount : 3;
      const impulseScore = impulseCount > 0 ? impulseSum / impulseCount : 3;

      const aligned = classifyMoralAlignment(structureScore, impulseScore);
      setResult(aligned);

      fetch("/api/score-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: "moral-alignment",
          answers,
          localResult: {
            alignment: aligned.alignment,
            archetype: aligned.archetype,
            structureScore,
            impulseScore,
          },
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.interpretation) setInterpretation(data.interpretation);
        })
        .catch(() => {});
    },
    [questions, isLLMSource]
  );

  const handleReset = useCallback(() => {
    setResult(null);
    setInterpretation(null);
  }, []);

  const resultView = result ? (
    <AlignmentResults result={result} interpretation={interpretation} />
  ) : null;

  return (
    <WizardShell
      title="Moral Alignment Assessment"
      subtitle="This assessment maps your ethical tendencies across two axes: structure (Lawful-Chaotic) and impulse (Good-Evil). Answer honestly based on your genuine preferences."
      questions={questions}
      loadingQuestions={loadingQuestions}
      onComplete={handleComplete}
      resultView={resultView}
      onReset={handleReset}
    />
  );
}

function AlignmentResults({
  result,
  interpretation,
}: {
  result: MoralAlignmentResult;
  interpretation: Interpretation;
}) {
  const color = ALIGNMENT_COLORS[result.alignment] || "var(--accent-blue)";

  return (
    <ResultsLayout>
      <TypeCard
        typeCode={result.alignment}
        subtitle={result.archetype}
        confidence={1}
        accentColor={color}
        delay={0}
      />

      {/* 3x3 Grid */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="border border-surface-800 rounded-lg p-5"
      >
        <h3 className="text-lg font-medium mb-4">Alignment Grid</h3>
        <div className="grid grid-cols-3 gap-2">
          {ALL_ALIGNMENTS.map((a) => {
            const isMatch = a.name === result.alignment;
            const cellColor = ALIGNMENT_COLORS[a.name];
            return (
              <motion.div
                key={a.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + (a.row * 3 + a.col) * 0.05 }}
                className={`rounded-lg p-3 text-center text-xs transition-all ${
                  isMatch
                    ? "ring-2 ring-offset-1 ring-offset-background"
                    : "opacity-50"
                }`}
                style={{
                  background: isMatch
                    ? `${cellColor}20`
                    : "var(--surface-900)",
                  borderColor: isMatch ? cellColor : "var(--surface-800)",
                  border: `1px solid ${isMatch ? cellColor : "var(--surface-800)"}`,
                  ...(isMatch ? { ringColor: cellColor } : {}),
                }}
              >
                <div
                  className="font-medium"
                  style={{ color: isMatch ? cellColor : "var(--surface-400)" }}
                >
                  {a.name}
                </div>
                <div className="text-surface-500 mt-0.5">{a.archetype}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Axis Scores */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border border-surface-800 rounded-lg p-5 space-y-4"
      >
        <h3 className="text-lg font-medium">Axis Scores</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-surface-300">
                Structure: {result.structure}
              </span>
              <span className="text-surface-500">
                {result.structureScore.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-500">
              <span>Chaotic</span>
              <div className="flex-1 h-2 rounded-full bg-surface-800 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((result.structureScore - 1) / 4) * 100}%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
              <span>Lawful</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-surface-300">
                Impulse: {result.impulse}
              </span>
              <span className="text-surface-500">
                {result.impulseScore.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-500">
              <span>Evil</span>
              <div className="flex-1 h-2 rounded-full bg-surface-800 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((result.impulseScore - 1) / 4) * 100}%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
              <span>Good</span>
            </div>
          </div>
        </div>
      </motion.section>

      {interpretation && (
        <NarrativeSection
          narrative={interpretation.narrative}
          insights={interpretation.insights}
          typeDescription={interpretation.typeDescription}
          delay={0.8}
        />
      )}

      <p className="text-xs text-surface-500 text-center">
        Two-axis scoring: Structure (Lawful/Neutral/Chaotic) and Impulse
        (Good/Neutral/Evil). Results map to the 3x3 alignment grid.
      </p>
    </ResultsLayout>
  );
}
