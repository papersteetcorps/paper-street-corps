"use client";

import { useState, useCallback, useEffect } from "react";
import { QUESTIONS } from "@/data/neuroQuestions";
import {
  CHEMICALS,
  Chemical,
  NeurochemicalMBTI,
  TYPE_CENTROIDS,
} from "@/lib/scoring/neurochemicalMBTI";
import WizardShell from "@/components/wizard/WizardShell";
import ResultsLayout from "@/components/results/ResultsLayout";
import TypeCard from "@/components/results/TypeCard";
import RadarChart from "@/components/results/RadarChart";
import BarChart from "@/components/results/BarChart";
import ConfidenceRanking from "@/components/results/ConfidenceRanking";
import NarrativeSection from "@/components/results/NarrativeSection";
import ScoreComparison from "@/components/results/ScoreComparison";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";

type Result = {
  type: string;
  distance: number;
  confidence: number;
};

type Interpretation = {
  narrative: string;
  insights: string[];
  typeDescription: string;
} | null;

const staticQuestions: WizardQuestion[] = QUESTIONS.map((q, i) => ({
  id: `mbti-q-${i}`,
  text: q.text.replace(/^\[.*?\]:\s*/, ""),
  description: `Chemical axis: ${Object.keys(q.weights).join(", ")}`,
  answerType: "scale" as const,
  labels: ["Strongly Disagree", "Strongly Agree"] as [string, string],
  min: 1,
  max: 5,
  meta: { weights: q.weights },
}));

const CHEMICAL_LABELS = ["Dopamine", "Serotonin", "Norepinephrine", "Acetylcholine", "Oxytocin"];

export default function MBTIPage() {
  const [questions, setQuestions] = useState<WizardQuestion[]>(staticQuestions);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [results, setResults] = useState<Result[] | null>(null);
  const [userScores, setUserScores] = useState<Record<Chemical, number> | null>(null);
  const [interpretation, setInterpretation] = useState<Interpretation>(null);
  const [isLLMSource, setIsLLMSource] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testType: "mbti", questionCount: 7 }),
        });
        const data = await res.json();
        if (!cancelled && data.questions && !data.fallback) {
          setQuestions(data.questions);
          setIsLLMSource(true);
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

  const handleComplete = useCallback(
    (answers: WizardAnswer[]) => {
      const totals: Record<Chemical, number> = {
        dopamine: 0, serotonin: 0, norepinephrine: 0, acetylcholine: 0, oxytocin: 0,
      };
      const weightSums: Record<Chemical, number> = {
        dopamine: 0, serotonin: 0, norepinephrine: 0, acetylcholine: 0, oxytocin: 0,
      };

      if (isLLMSource) {
        questions.forEach((q) => {
          const answer = answers.find((a) => a.questionId === q.id);
          const val = typeof answer?.value === "number" ? answer.value : 3;
          const weights = (q.meta?.weights ?? {}) as Record<string, number>;
          for (const [chem, w] of Object.entries(weights)) {
            if (chem in totals) {
              totals[chem as Chemical] += val * w;
              weightSums[chem as Chemical] += w;
            }
          }
        });
      } else {
        QUESTIONS.forEach((q, i) => {
          const answer = answers.find((a) => a.questionId === `mbti-q-${i}`);
          const val = typeof answer?.value === "number" ? answer.value : 3;
          (Object.entries(q.weights) as [Chemical, number][]).forEach(([chem, w]) => {
            totals[chem] += val * w;
            weightSums[chem] += w;
          });
        });
      }

      const scores = {} as Record<Chemical, number>;
      CHEMICALS.forEach((c) => {
        scores[c] = weightSums[c]
          ? Math.min(5, Math.max(1, totals[c] / weightSums[c]))
          : 3;
      });

      const model = new NeurochemicalMBTI(TYPE_CENTROIDS);
      const classified = model.classify(scores);

      setUserScores(scores);
      setResults(classified);

      fetch("/api/score-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: "mbti",
          answers,
          localResult: {
            topType: classified[0].type,
            confidence: classified[0].confidence,
            scores,
            topThree: classified.slice(0, 3),
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
    setResults(null);
    setUserScores(null);
    setInterpretation(null);
  }, []);

  const resultView =
    results && userScores ? (
      <MBTIResults
        results={results}
        userScores={userScores}
        interpretation={interpretation}
      />
    ) : null;

  return (
    <WizardShell
      title="Neurochemical MBTI Assessment"
      subtitle="This assessment estimates your cognitive-emotional profile using neurochemical weighting. Answer based on your baseline behavior, not temporary stress, mood, or aspirational self-image."
      questions={questions}
      loadingQuestions={loadingQuestions}
      onComplete={handleComplete}
      resultView={resultView}
      onReset={handleReset}
    />
  );
}

function MBTIResults({
  results,
  userScores,
  interpretation,
}: {
  results: Result[];
  userScores: Record<Chemical, number>;
  interpretation: Interpretation;
}) {
  const top = results[0];
  const topCentroid = TYPE_CENTROIDS[top.type];
  const userValues = CHEMICALS.map((c) => userScores[c]);

  const barData = results
    .slice(0, 10)
    .sort((a, b) => a.distance - b.distance)
    .map((r) => ({
      name: r.type,
      value: r.distance,
    }));

  const rankingItems = results.map((r) => ({
    name: r.type,
    value: r.confidence,
    displayValue: `${(r.confidence * 100).toFixed(1)}%`,
  }));

  const comparisonRows = CHEMICAL_LABELS.map((label, i) => ({
    label,
    userScore: userValues[i],
    idealScore: topCentroid[i],
  }));

  return (
    <ResultsLayout>
      {/* 0ms — Hero type card */}
      <TypeCard
        typeCode={top.type}
        confidence={top.confidence}
        delay={0}
      />

      {/* 200ms — Radar chart */}
      <RadarChart
        labels={CHEMICAL_LABELS}
        userValues={userValues}
        referenceValues={topCentroid}
        referenceLabel={`${top.type} Centroid`}
        delay={0.2}
      />

      {/* 400ms — Confidence ranking */}
      <ConfidenceRanking
        items={rankingItems}
        highlightName={top.type}
        label="Type Rankings"
        accentColor="blue"
        delay={0.4}
      />

      {/* 600ms — AI narrative (if available) */}
      {interpretation && (
        <NarrativeSection
          narrative={interpretation.narrative}
          insights={interpretation.insights}
          typeDescription={interpretation.typeDescription}
          delay={0.6}
        />
      )}

      {/* 800ms — Score comparison */}
      <ScoreComparison
        rows={comparisonRows}
        delay={0.8}
      />

      {/* Distance bar chart */}
      <BarChart
        data={barData}
        highlightName={top.type}
        label="Distance to Types"
        valueLabel="Mahalanobis Distance"
        delay={1.0}
      />

      <p className="text-xs text-surface-500 text-center">
        Classification uses 5-chemical Mahalanobis distance to 16 type
        centroids with softmax confidence.
      </p>
    </ResultsLayout>
  );
}
