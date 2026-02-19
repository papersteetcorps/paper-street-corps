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
import Badge from "@/components/ui/Badge";
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
        // fallback to static questions silently
      } finally {
        if (!cancelled) setLoadingQuestions(false);
      }
    }
    fetchQuestions();
    return () => { cancelled = true; };
  }, []);

  const handleComplete = useCallback(
    (answers: WizardAnswer[]) => {
      // Local scoring: compute chemical scores from answers + question weights
      const totals: Record<Chemical, number> = {
        dopamine: 0, serotonin: 0, norepinephrine: 0, acetylcholine: 0, oxytocin: 0,
      };
      const weightSums: Record<Chemical, number> = {
        dopamine: 0, serotonin: 0, norepinephrine: 0, acetylcholine: 0, oxytocin: 0,
      };

      if (isLLMSource) {
        // LLM questions carry weights in meta
        questions.forEach((q) => {
          const answer = answers.find((a) => a.questionId === q.id);
          const val = answer?.value ?? 3;
          const weights = (q.meta?.weights ?? {}) as Record<string, number>;
          for (const [chem, w] of Object.entries(weights)) {
            if (chem in totals) {
              totals[chem as Chemical] += val * w;
              weightSums[chem as Chemical] += w;
            }
          }
        });
      } else {
        // Static questions use QUESTIONS data
        QUESTIONS.forEach((q, i) => {
          const answer = answers.find((a) => a.questionId === `mbti-q-${i}`);
          const val = answer?.value ?? 3;
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

      // Fire LLM interpretation in parallel (non-blocking)
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

      {interpretation && (
        <section className="border border-surface-800 rounded-lg p-5 space-y-4">
          <h3 className="text-lg font-medium">AI Interpretation</h3>
          <p className="text-sm text-surface-300 leading-relaxed whitespace-pre-line">
            {interpretation.narrative}
          </p>
          {interpretation.insights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-surface-400">
                Key Insights
              </h4>
              <ul className="space-y-1">
                {interpretation.insights.map((insight, i) => (
                  <li key={i} className="text-sm text-surface-300">
                    &#8226; {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-surface-500 italic">
            {interpretation.typeDescription}
          </p>
        </section>
      )}

      <p className="text-xs text-surface-500 text-center">
        Classification uses 5-chemical Mahalanobis distance to 16 type
        centroids with softmax confidence.
      </p>
    </div>
  );
}
