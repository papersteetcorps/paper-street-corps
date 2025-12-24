"use client";

import { useState } from "react";
import {
  classifyTemperament,
  CHEMICAL_DESCRIPTIONS,
  TEMPERAMENT_DESCRIPTIONS,
  TemperamentResult,
  getIdealProfile,
} from "@/lib/scoring/temperaments";

type Chemical = "cortisol" | "dopamine" | "oxytocin" | "serotonin" | "androgenicity";

export default function TemperamentsTestPage() {
  const [scores, setScores] = useState<Record<Chemical, number | null>>({
    cortisol: null,
    dopamine: null,
    oxytocin: null,
    serotonin: null,
    androgenicity: null,
  });
  const [result, setResult] = useState<TemperamentResult | null>(null);

  const chemicals: Chemical[] = ["cortisol", "dopamine", "oxytocin", "serotonin", "androgenicity"];

  const handleScoreChange = (chemical: Chemical, value: number) => {
    setScores((prev) => ({ ...prev, [chemical]: value }));
  };

  const isComplete = chemicals.every((c) => scores[c] !== null);

  const handleSubmit = () => {
    if (!isComplete) return;
    const tempResult = classifyTemperament(
      scores.cortisol!,
      scores.dopamine!,
      scores.oxytocin!,
      scores.serotonin!,
      scores.androgenicity!
    );
    setResult(tempResult);
  };

  const handleReset = () => {
    setScores({
      cortisol: null,
      dopamine: null,
      oxytocin: null,
      serotonin: null,
      androgenicity: null,
    });
    setResult(null);
  };

  if (result) {
    return <ResultsView result={result} onReset={handleReset} />;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Temperament Assessment</h1>
        <p className="mt-2 text-neutral-400">
          Rate your typical levels of each biochemical marker. This assessment uses
          variance-based classification to identify your primary temperament.
        </p>
      </header>

      <div className="text-sm text-neutral-500 border border-neutral-800 p-4">
        <strong>Rating Scale:</strong> 1 = Very low, 2 = Slightly low, 3 = Balanced, 4 = Slightly high, 5 = Very high
        <br />
        <span className="text-neutral-600 mt-1 block">
          Note: Androgenicity refers to testosterone (males) or estrogen (females)
        </span>
      </div>

      <div className="space-y-8">
        {chemicals.map((chemical, index) => (
          <ChemicalQuestion
            key={chemical}
            chemical={chemical}
            index={index + 1}
            value={scores[chemical]}
            onChange={(value) => handleScoreChange(chemical, value)}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isComplete}
        className={`w-full py-3 text-sm font-medium ${
          isComplete
            ? "bg-white text-black hover:bg-neutral-200"
            : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
        }`}
      >
        {isComplete ? "Calculate Temperament" : "Answer all questions to continue"}
      </button>
    </div>
  );
}

function ChemicalQuestion({
  chemical,
  index,
  value,
  onChange,
}: {
  chemical: Chemical;
  index: number;
  value: number | null;
  onChange: (value: number) => void;
}) {
  const info = CHEMICAL_DESCRIPTIONS[chemical];

  return (
    <div className="border border-neutral-800 p-5">
      <div className="text-xs text-neutral-500 uppercase tracking-wide">Question {index}</div>
      <h3 className="mt-2 text-lg font-medium">{info.label}</h3>
      <p className="mt-1 text-sm text-neutral-400">{info.description}</p>

      <div className="mt-4 flex justify-between text-xs text-neutral-500">
        <span>{info.low}</span>
        <span>{info.high}</span>
      </div>

      <div className="mt-2 flex justify-between">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => onChange(score)}
            className={`w-12 h-12 border ${
              value === score
                ? "border-white bg-white text-black"
                : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
            }`}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultsView({
  result,
  onReset,
}: {
  result: TemperamentResult;
  onReset: () => void;
}) {
  const primaryInfo = TEMPERAMENT_DESCRIPTIONS[result.primary];
  const idealProfile = getIdealProfile(result.primary);
  const chemicalLabels = ["Cortisol", "Dopamine", "Oxytocin", "Serotonin", "Androgenicity"];

  const displayType = result.isBlend && result.secondary
    ? `${result.primary}-${result.secondary}`
    : result.primary;

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <div className="text-xs text-neutral-500 uppercase tracking-wide">Your Result</div>
        <h1 className="mt-2 text-4xl font-bold">{displayType}</h1>
        <p className="mt-1 text-xl text-neutral-400">{primaryInfo.title}</p>
        {result.isBlend && (
          <p className="mt-2 text-sm text-neutral-500">
            Strong blend detected — variance difference: {(result.variances[result.secondary!] - result.variance).toFixed(2)}
          </p>
        )}
      </header>

      <section className="border border-neutral-800 p-5">
        <h2 className="text-lg font-medium">Key Traits</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {primaryInfo.traits.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 text-sm border border-neutral-700 text-neutral-300"
            >
              {trait}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <section className="border border-neutral-800 p-5">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Strengths</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            {primaryInfo.strengths.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </section>

        <section className="border border-neutral-800 p-5">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Challenges</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            {primaryInfo.challenges.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="border border-neutral-800 p-5">
        <h2 className="text-lg font-medium">Your Scores vs Ideal Profile</h2>
        <div className="mt-4 space-y-3">
          {chemicalLabels.map((label, i) => {
            const userScore = Object.values(result.userScores)[i];
            const idealScore = idealProfile[i];
            return (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{label}</span>
                <div className="flex items-center gap-4">
                  <span>You: {userScore}</span>
                  <span className="text-neutral-500">|</span>
                  <span className="text-neutral-500">Ideal: {idealScore}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border border-neutral-800 p-5">
        <h2 className="text-lg font-medium">All Temperament Variances</h2>
        <p className="mt-1 text-sm text-neutral-500">Lower variance = closer match</p>
        <div className="mt-4 space-y-2">
          {(Object.entries(result.variances) as [string, number][])
            .sort((a, b) => a[1] - b[1])
            .map(([type, variance], i) => (
              <div
                key={type}
                className={`flex items-center justify-between text-sm ${
                  type === result.primary ? "text-white" : "text-neutral-400"
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

      <section className="text-sm text-neutral-500">
        <p>
          This assessment uses variance-based classification from biochemical self-ratings.
          Temperament is one lens for understanding personality patterns.
        </p>
      </section>

      <button
        onClick={onReset}
        className="w-full py-3 text-sm font-medium border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500"
      >
        Take Again
      </button>
    </div>
  );
}
