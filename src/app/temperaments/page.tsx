"use client";

import { useState, useCallback } from "react";
import {
  classifyTemperament,
  CHEMICAL_DESCRIPTIONS,
  TEMPERAMENT_DESCRIPTIONS,
  getIdealProfile,
  type TemperamentResult,
} from "@/lib/scoring/temperaments";
import WizardShell from "@/components/wizard/WizardShell";
import ResultsLayout from "@/components/results/ResultsLayout";
import TypeCard from "@/components/results/TypeCard";
import RadarChart from "@/components/results/RadarChart";
import ConfidenceRanking from "@/components/results/ConfidenceRanking";
import NarrativeSection from "@/components/results/NarrativeSection";
import ScoreComparison from "@/components/results/ScoreComparison";
import Badge from "@/components/ui/Badge";
import ResultChat from "@/components/results/ResultChat";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";
import { saveResult } from "@/lib/results-store";
import { motion } from "motion/react";

type Chemical = "cortisol" | "dopamine" | "oxytocin" | "serotonin" | "androgenicity";

type Interpretation = {
  narrative: string;
  insights: string[];
  typeDescription: string;
} | null;

const CHEMICALS: Chemical[] = [
  "cortisol", "dopamine", "oxytocin", "serotonin", "androgenicity",
];

const CHEMICAL_LABELS = ["Cortisol", "Dopamine", "Oxytocin", "Serotonin", "Androgenicity"];

const staticQuestions: WizardQuestion[] = CHEMICALS.map((chem) => {
  const info = CHEMICAL_DESCRIPTIONS[chem];
  return {
    id: `temp-${chem}`,
    text: info.label,
    description: info.description,
    answerType: "scale" as const,
    labels: [info.low, info.high] as [string, string],
    min: 1,
    max: 5,
    meta: { chemical: chem },
  };
});

export default function TemperamentsTestPage() {
  const [result, setResult] = useState<TemperamentResult | null>(null);
  const [interpretation, setInterpretation] = useState<Interpretation>(null);
  const [localResult, setLocalResult] = useState<Record<string, unknown>>({});

  const handleComplete = useCallback(
    (answers: WizardAnswer[]) => {
      const scoreMap: Record<Chemical, number> = {
        cortisol: 3, dopamine: 3, oxytocin: 3, serotonin: 3, androgenicity: 3,
      };

      for (const chem of CHEMICALS) {
        const answer = answers.find((a) => a.questionId === `temp-${chem}`);
        if (answer) scoreMap[chem] = typeof answer.value === "number" ? answer.value : 3;
      }

      const tempResult = classifyTemperament(
        scoreMap.cortisol, scoreMap.dopamine, scoreMap.oxytocin,
        scoreMap.serotonin, scoreMap.androgenicity
      );
      setResult(tempResult);
      setLocalResult({
        testType: "temperaments",
        primary: tempResult.primary,
        secondary: tempResult.secondary,
        isBlend: tempResult.isBlend,
        variance: tempResult.variance,
        variances: tempResult.variances,
        userScores: tempResult.userScores,
      });

      fetch("/api/score-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: "temperaments",
          answers,
          localResult: {
            primary: tempResult.primary,
            secondary: tempResult.secondary,
            isBlend: tempResult.isBlend,
            variance: tempResult.variance,
            variances: tempResult.variances,
            userScores: tempResult.userScores,
          },
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.interpretation) {
            setInterpretation(data.interpretation);
            saveResult("temperaments", { ...data.interpretation, primary: tempResult.primary, secondary: tempResult.secondary, isBlend: tempResult.isBlend });
          }
        })
        .catch(() => {});
    },
    []
  );

  const handleReset = useCallback(() => {
    setResult(null);
    setInterpretation(null);
    setLocalResult({});
  }, []);

  const resultView = result ? (
    <TemperamentResults result={result} interpretation={interpretation} localResult={localResult} />
  ) : null;

  return (
    <WizardShell
      title="Temperament Assessment"
      subtitle="Rate your typical levels of each biochemical marker. This assessment uses variance-based classification to identify your primary temperament."
      questions={staticQuestions}
      loadingQuestions={false}
      onComplete={handleComplete}
      resultView={resultView}
      onReset={handleReset}
    />
  );
}

function TemperamentResults({
  result,
  interpretation,
  localResult,
}: {
  result: TemperamentResult;
  interpretation: Interpretation;
  localResult: Record<string, unknown>;
}) {
  const primaryInfo = TEMPERAMENT_DESCRIPTIONS[result.primary];
  const idealProfile = getIdealProfile(result.primary);

  const displayType =
    result.isBlend && result.secondary
      ? `${result.primary}-${result.secondary}`
      : result.primary;

  const userValues = Object.values(result.userScores);

  const varianceItems = (Object.entries(result.variances) as [string, number][])
    .sort((a, b) => a[1] - b[1])
    .map(([type, variance]) => ({
      name: type,
      value: variance,
      displayValue: variance.toFixed(2),
    }));

  const comparisonRows = CHEMICAL_LABELS.map((label, i) => ({
    label,
    userScore: userValues[i],
    idealScore: idealProfile[i],
  }));

  return (
    <ResultsLayout>
      {/* 0ms — Hero */}
      <TypeCard
        typeCode={displayType}
        subtitle={primaryInfo.title}
        confidence={1 - result.variance / 5}
        accentColor="var(--accent-purple)"
        delay={0}
      />

      {result.isBlend && result.secondary && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-surface-500 text-center"
        >
          Blend detected — variance gap:{" "}
          {(result.variances[result.secondary] - result.variance).toFixed(2)}
        </motion.p>
      )}

      {/* Traits */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="border border-surface-800 rounded-lg p-5"
      >
        <h3 className="text-lg font-medium">Key Traits</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {primaryInfo.traits.map((trait) => (
            <Badge key={trait} color="purple">{trait}</Badge>
          ))}
        </div>
      </motion.section>

      {/* Strengths / Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <section className="border border-surface-800 rounded-lg p-5">
          <h3 className="text-sm font-medium text-surface-500 uppercase tracking-wide">Strengths</h3>
          <ul className="mt-3 space-y-2 text-sm text-surface-300">
            {primaryInfo.strengths.map((s) => <li key={s}>&#8226; {s}</li>)}
          </ul>
        </section>
        <section className="border border-surface-800 rounded-lg p-5">
          <h3 className="text-sm font-medium text-surface-500 uppercase tracking-wide">Challenges</h3>
          <ul className="mt-3 space-y-2 text-sm text-surface-300">
            {primaryInfo.challenges.map((c) => <li key={c}>&#8226; {c}</li>)}
          </ul>
        </section>
      </motion.div>

      {/* 200ms — Radar */}
      <RadarChart
        labels={CHEMICAL_LABELS}
        userValues={userValues}
        referenceValues={[...idealProfile]}
        referenceLabel={`${result.primary} Ideal`}
        userColor="var(--accent-purple)"
        referenceColor="var(--accent-teal)"
        delay={0.3}
      />

      {/* 400ms — Variance ranking */}
      <ConfidenceRanking
        items={varianceItems}
        highlightName={result.primary}
        label="Temperament Variances"
        accentColor="purple"
        delay={0.5}
      />

      {/* 600ms — AI narrative */}
      {interpretation && (
        <NarrativeSection
          narrative={interpretation.narrative}
          insights={interpretation.insights}
          typeDescription={interpretation.typeDescription}
          delay={0.7}
        />
      )}

      {/* 800ms — Score comparison */}
      <ScoreComparison
        rows={comparisonRows}
        userColor="var(--accent-purple)"
        idealColor="var(--accent-teal)"
        delay={0.9}
      />

      <p className="text-xs text-surface-500 text-center">
        Variance-based classification from biochemical self-ratings. Temperament
        is one lens for understanding personality patterns.
      </p>

      <ResultChat testType="temperaments" result={localResult} accentColor="var(--color-accent-purple)" />
    </ResultsLayout>
  );
}
