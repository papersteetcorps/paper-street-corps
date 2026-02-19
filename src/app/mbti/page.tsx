"use client";

import { useState, useCallback } from "react";
import { QUESTIONS } from "@/data/neuroQuestions";
import {
  CHEMICALS,
  Chemical,
  NeurochemicalMBTI,
  TYPE_CENTROIDS,
} from "@/lib/scoring/neurochemicalMBTI";
import WizardShell from "@/components/wizard/WizardShell";
import Badge from "@/components/ui/Badge";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";

type Result = {
  type: string;
  distance: number;
  confidence: number;
};

const wizardQuestions: WizardQuestion[] = QUESTIONS.map((q, i) => ({
  id: `mbti-q-${i}`,
  text: q.text.replace(/^\[.*?\]:\s*/, ""),
  description: `Chemical axis: ${Object.keys(q.weights).join(", ")}`,
  answerType: "scale" as const,
  labels: ["Strongly Disagree", "Strongly Agree"] as [string, string],
  min: 1,
  max: 5,
}));

export default function MBTIPage() {
  const [results, setResults] = useState<Result[] | null>(null);
  const [userScores, setUserScores] = useState<Record<Chemical, number> | null>(null);

  const handleComplete = useCallback((answers: WizardAnswer[]) => {
    const totals: Record<Chemical, number> = {
      dopamine: 0,
      serotonin: 0,
      norepinephrine: 0,
      acetylcholine: 0,
      oxytocin: 0,
    };
    const weights: Record<Chemical, number> = {
      dopamine: 0,
      serotonin: 0,
      norepinephrine: 0,
      acetylcholine: 0,
      oxytocin: 0,
    };

    QUESTIONS.forEach((q, i) => {
      const answer = answers.find((a) => a.questionId === `mbti-q-${i}`);
      const a = answer?.value ?? 3;
      (Object.entries(q.weights) as [Chemical, number][]).forEach(([chem, w]) => {
        totals[chem] += a * w;
        weights[chem] += w;
      });
    });

    const scores = {} as Record<Chemical, number>;
    CHEMICALS.forEach((c) => {
      scores[c] = weights[c]
        ? Math.min(5, Math.max(1, totals[c] / weights[c]))
        : 3;
    });

    const model = new NeurochemicalMBTI(TYPE_CENTROIDS);
    const classified = model.classify(scores);

    setUserScores(scores);
    setResults(classified);
  }, []);

  const handleReset = useCallback(() => {
    setResults(null);
    setUserScores(null);
  }, []);

  const resultView =
    results && userScores ? (
      <MBTIResults results={results} userScores={userScores} />
    ) : null;

  return (
    <WizardShell
      title="Neurochemical MBTI Assessment"
      subtitle="This assessment estimates your cognitive-emotional profile using neurochemical weighting. Answer based on your baseline behavior, not temporary stress, mood, or aspirational self-image."
      questions={wizardQuestions}
      onComplete={handleComplete}
      resultView={resultView}
      onReset={handleReset}
    />
  );
}

function MBTIResults({
  results,
  userScores,
}: {
  results: Result[];
  userScores: Record<Chemical, number>;
}) {
  const top = results[0];
  const topThree = results.slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-surface-500 uppercase tracking-wide">
          Your Result
        </p>
        <h2 className="text-5xl font-bold tracking-tight">{top.type}</h2>
        <p className="text-surface-400">
          {(top.confidence * 100).toFixed(1)}% confidence
        </p>
      </div>

      <section className="border border-surface-800 rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium">Top Matches</h3>
        <div className="space-y-2">
          {topThree.map((r, i) => (
            <div
              key={r.type}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className={
                    i === 0 ? "text-foreground font-medium" : "text-surface-400"
                  }
                >
                  {i + 1}. {r.type}
                </span>
                {i === 0 && <Badge color="blue">Best Match</Badge>}
              </div>
              <span className="text-surface-500">
                {(r.confidence * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-surface-800 rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium">Your Chemical Profile</h3>
        <div className="space-y-3">
          {CHEMICALS.map((chem) => {
            const score = userScores[chem];
            const pct = ((score - 1) / 4) * 100;
            return (
              <div key={chem} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-300 capitalize">{chem}</span>
                  <span className="text-surface-500">{score.toFixed(2)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-blue transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-surface-500 text-center">
        Classification uses 5-chemical Mahalanobis distance to 16 type
        centroids with softmax confidence.
      </p>
    </div>
  );
}
