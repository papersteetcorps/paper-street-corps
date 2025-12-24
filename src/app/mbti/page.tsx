"use client";

import { useState } from "react";
import { classifyMBTI, AXIS_DESCRIPTIONS, MBTIResult, getCentroid } from "@/lib/scoring/mbti";

type Axis = "dopamine" | "serotonin" | "testosterone" | "estrogen";

export default function MBTITestPage() {
  const [scores, setScores] = useState<Record<Axis, number | null>>({
    dopamine: null,
    serotonin: null,
    testosterone: null,
    estrogen: null,
  });
  const [result, setResult] = useState<MBTIResult | null>(null);

  const axes: Axis[] = ["dopamine", "serotonin", "testosterone", "estrogen"];

  const handleScoreChange = (axis: Axis, value: number) => {
    setScores((prev) => ({ ...prev, [axis]: value }));
  };

  const isComplete = axes.every((axis) => scores[axis] !== null);

  const handleSubmit = () => {
    if (!isComplete) return;
    const mbtiResult = classifyMBTI(
      scores.dopamine!,
      scores.serotonin!,
      scores.testosterone!,
      scores.estrogen!
    );
    setResult(mbtiResult);
  };

  const handleReset = () => {
    setScores({ dopamine: null, serotonin: null, testosterone: null, estrogen: null });
    setResult(null);
  };

  if (result) {
    return <ResultsView result={result} onReset={handleReset} />;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">MBTI Neurochemical Assessment</h1>
        <p className="mt-2 text-neutral-400">
          Rate yourself on each neurochemical axis. This assessment uses nearest centroid
          classification to match your profile to one of 16 MBTI types.
        </p>
      </header>

      <div className="text-sm text-neutral-500 border border-neutral-800 p-4">
        <strong>Rating Scale:</strong> 1 = Very low, 2 = Slightly low, 3 = Balanced, 4 = Slightly high, 5 = Very high
      </div>

      <div className="space-y-8">
        {axes.map((axis, index) => (
          <AxisQuestion
            key={axis}
            axis={axis}
            index={index + 1}
            value={scores[axis]}
            onChange={(value) => handleScoreChange(axis, value)}
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
        {isComplete ? "Calculate MBTI Type" : "Answer all questions to continue"}
      </button>
    </div>
  );
}

function AxisQuestion({
  axis,
  index,
  value,
  onChange,
}: {
  axis: Axis;
  index: number;
  value: number | null;
  onChange: (value: number) => void;
}) {
  const info = AXIS_DESCRIPTIONS[axis];

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
  result: MBTIResult;
  onReset: () => void;
}) {
  const centroid = getCentroid(result.type);
  const axisLabels = ["Dopamine", "Serotonin", "Testosterone", "Estrogen"];

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <div className="text-xs text-neutral-500 uppercase tracking-wide">Your Result</div>
        <h1 className="mt-2 text-5xl font-bold">{result.type}</h1>
        <p className="mt-2 text-neutral-400">
          Distance from centroid: {result.distance.toFixed(2)}
        </p>
      </header>

      <section className="border border-neutral-800 p-5">
        <h2 className="text-lg font-medium">Your Scores vs Type Centroid</h2>
        <div className="mt-4 space-y-3">
          {axisLabels.map((label, i) => {
            const userScore = Object.values(result.userScores)[i];
            const typeScore = centroid[i];
            return (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{label}</span>
                <div className="flex items-center gap-4">
                  <span>You: {userScore}</span>
                  <span className="text-neutral-500">|</span>
                  <span className="text-neutral-500">{result.type}: {typeScore}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border border-neutral-800 p-5">
        <h2 className="text-lg font-medium">Top 5 Matches</h2>
        <div className="mt-4 space-y-2">
          {result.ranking.slice(0, 5).map((match, i) => (
            <div
              key={match.type}
              className={`flex items-center justify-between text-sm ${
                i === 0 ? "text-white" : "text-neutral-400"
              }`}
            >
              <span>
                {i + 1}. {match.type}
              </span>
              <span>{match.distance.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="text-sm text-neutral-500">
        <p>
          This assessment uses neurochemical-based nearest centroid classification.
          Personality is complex and cannot be fully captured by any typology system.
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
