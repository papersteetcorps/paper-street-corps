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
import Badge from "@/components/ui/Badge";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";

type Chemical = "cortisol" | "dopamine" | "oxytocin" | "serotonin" | "androgenicity";

const CHEMICALS: Chemical[] = [
  "cortisol",
  "dopamine",
  "oxytocin",
  "serotonin",
  "androgenicity",
];

const wizardQuestions: WizardQuestion[] = CHEMICALS.map((chem) => {
  const info = CHEMICAL_DESCRIPTIONS[chem];
  return {
    id: `temp-${chem}`,
    text: info.label,
    description: info.description,
    answerType: "scale" as const,
    labels: [info.low, info.high] as [string, string],
    min: 1,
    max: 5,
  };
});

export default function TemperamentsTestPage() {
  const [result, setResult] = useState<TemperamentResult | null>(null);

  const handleComplete = useCallback((answers: WizardAnswer[]) => {
    const scoreMap: Record<Chemical, number> = {
      cortisol: 3,
      dopamine: 3,
      oxytocin: 3,
      serotonin: 3,
      androgenicity: 3,
    };

    for (const chem of CHEMICALS) {
      const answer = answers.find((a) => a.questionId === `temp-${chem}`);
      if (answer) scoreMap[chem] = answer.value;
    }

    const tempResult = classifyTemperament(
      scoreMap.cortisol,
      scoreMap.dopamine,
      scoreMap.oxytocin,
      scoreMap.serotonin,
      scoreMap.androgenicity
    );
    setResult(tempResult);
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
  }, []);

  const resultView = result ? (
    <TemperamentResults result={result} />
  ) : null;

  return (
    <WizardShell
      title="Temperament Assessment"
      subtitle="Rate your typical levels of each biochemical marker. This assessment uses variance-based classification to identify your primary temperament."
      questions={wizardQuestions}
      onComplete={handleComplete}
      resultView={resultView}
      onReset={handleReset}
    />
  );
}

function TemperamentResults({ result }: { result: TemperamentResult }) {
  const primaryInfo = TEMPERAMENT_DESCRIPTIONS[result.primary];
  const idealProfile = getIdealProfile(result.primary);
  const chemicalLabels = [
    "Cortisol",
    "Dopamine",
    "Oxytocin",
    "Serotonin",
    "Androgenicity",
  ];

  const displayType =
    result.isBlend && result.secondary
      ? `${result.primary}-${result.secondary}`
      : result.primary;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-surface-500 uppercase tracking-wide">
          Your Result
        </p>
        <h2 className="text-5xl font-bold tracking-tight">{displayType}</h2>
        <p className="text-xl text-surface-400">{primaryInfo.title}</p>
        {result.isBlend && (
          <p className="text-sm text-surface-500">
            Blend detected — variance gap:{" "}
            {(
              result.variances[result.secondary!] - result.variance
            ).toFixed(2)}
          </p>
        )}
      </div>

      <section className="border border-surface-800 rounded-lg p-5">
        <h3 className="text-lg font-medium">Key Traits</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {primaryInfo.traits.map((trait) => (
            <Badge key={trait} color="purple">
              {trait}
            </Badge>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border border-surface-800 rounded-lg p-5">
          <h3 className="text-sm font-medium text-surface-500 uppercase tracking-wide">
            Strengths
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-surface-300">
            {primaryInfo.strengths.map((s) => (
              <li key={s}>&#8226; {s}</li>
            ))}
          </ul>
        </section>
        <section className="border border-surface-800 rounded-lg p-5">
          <h3 className="text-sm font-medium text-surface-500 uppercase tracking-wide">
            Challenges
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-surface-300">
            {primaryInfo.challenges.map((c) => (
              <li key={c}>&#8226; {c}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="border border-surface-800 rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium">Your Scores vs Ideal Profile</h3>
        <div className="space-y-3">
          {chemicalLabels.map((label, i) => {
            const userScore = Object.values(result.userScores)[i];
            const idealScore = idealProfile[i];
            const userPct = ((userScore - 1) / 4) * 100;
            const idealPct = ((idealScore - 1) / 4) * 100;
            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-300">{label}</span>
                  <span className="text-surface-500">
                    You: {userScore} | Ideal: {idealScore}
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full bg-surface-800 overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-accent-purple/40"
                    style={{ width: `${idealPct}%` }}
                  />
                  <div
                    className="absolute h-full rounded-full bg-accent-purple"
                    style={{ width: `${userPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border border-surface-800 rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium">All Temperament Variances</h3>
        <p className="text-sm text-surface-500">
          Lower variance = closer match
        </p>
        <div className="space-y-2">
          {(Object.entries(result.variances) as [string, number][])
            .sort((a, b) => a[1] - b[1])
            .map(([type, variance], i) => (
              <div
                key={type}
                className={`flex items-center justify-between text-sm ${
                  type === result.primary
                    ? "text-foreground"
                    : "text-surface-400"
                }`}
              >
                <span>
                  {i + 1}. {type}
                </span>
                <span>{variance.toFixed(2)}</span>
              </div>
            ))}
        </div>
      </section>

      <p className="text-xs text-surface-500 text-center">
        Variance-based classification from biochemical self-ratings. Temperament
        is one lens for understanding personality patterns.
      </p>
    </div>
  );
}
