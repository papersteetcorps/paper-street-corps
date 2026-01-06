"use client";

import { useState } from "react";
import { MBTI_QUESTIONS, Axis } from "@/data/mbtiQuestions";
import {
  classifyMBTI,
  MBTIResult,
  getCentroid,
} from "@/lib/scoring/mbti";

type AxisScores = Record<Axis, number>;

export default function MBTITestPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<AxisScores>({
    dopamine: 0,
    serotonin: 0,
    testosterone: 0,
    estrogen: 0,
  });
  const [result, setResult] = useState<MBTIResult | null>(null);

  const handleAnswer = (qid: string, axis: Axis, value: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));

    // single-question-per-axis → overwrite, do not accumulate
    setScores((prev) => ({
      ...prev,
      [axis]: value,
    }));
  };

  const isComplete = MBTI_QUESTIONS.every(
    (q) => answers[q.id] !== undefined
  );

  const handleSubmit = () => {
    if (!isComplete) return;

    setResult(
      classifyMBTI(
        scores.dopamine as 1 | 2 | 3 | 4 | 5,
        scores.serotonin as 1 | 2 | 3 | 4 | 5,
        scores.testosterone as 1 | 2 | 3 | 4 | 5,
        scores.estrogen as 1 | 2 | 3 | 4 | 5
      )
    );
  };

  const handleReset = () => {
    setAnswers({});
    setScores({
      dopamine: 0,
      serotonin: 0,
      testosterone: 0,
      estrogen: 0,
    });
    setResult(null);
  };

  if (result) {
    return <ResultsView result={result} onReset={handleReset} />;
  }

  return (
    <div className="max-w-2xl space-y-10">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold">
          MBTI Neurochemical Assessment
        </h1>

        <p className="text-1xl text-neutral-400">
          Rate yourself on each neurochemical axis. This assessment applies nearest-centroid
          classification to align your profile with one of 16 MBTI types. Please answer according
          to your usual tendencies, not temporary or context-specific behavior.
        </p>
      </header>

      <section className="border border-neutral-800 p-5 text-sm text-neutral-400">
        <div className="font-medium text-neutral-300 mb-1">
          RATING SCALE:
        </div>
        <p>
          1 = Very Low,&nbsp;
          2 = Slightly Low,&nbsp;
          3 = Balanced,&nbsp;
          4 = Slightly High,&nbsp;
          5 = Very High
        </p>
      </section>

      {/* Questions */}
      <div className="space-y-8">
        {MBTI_QUESTIONS.map((q, i) => (
          <div key={q.id} className="border border-neutral-800 p-5">
            <div className="text-xs uppercase tracking-wide text-neutral-500">
              Question {i + 1}
            </div>

            <p className="mt-2 text-lg">{q.text}</p>

            <div className="mt-4 flex justify-between">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => handleAnswer(q.id, q.axis, v)}
                  className={`w-12 h-12 border ${
                    answers[q.id] === v
                      ? "border-white bg-white text-black"
                      : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        disabled={!isComplete}
        onClick={handleSubmit}
        className={`w-full py-3 text-sm font-medium ${
          isComplete
            ? "bg-white text-black hover:bg-neutral-200"
            : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
        }`}
      >
        Calculate MBTI Type
      </button>
    </div>
  );
}

/* ============================
   RESULTS VIEW
   ============================ */

function ResultsView({
  result,
  onReset,
}: {
  result: MBTIResult;
  onReset: () => void;
}) {
  const centroid = getCentroid(result.type);

  const rows = [
    { label: "Dopamine", user: result.userScores.dopamine, type: centroid[0] },
    { label: "Serotonin", user: result.userScores.serotonin, type: centroid[1] },
    { label: "Testosterone", user: result.userScores.testosterone, type: centroid[2] },
    { label: "Estrogen", user: result.userScores.estrogen, type: centroid[3] },
  ];

  return (
    <div className="max-w-2xl space-y-10">
      {/* Header */}
      <header>
        <div className="text-xs uppercase tracking-wide text-neutral-500">
          Your Result
        </div>
        <h1 className="mt-2 text-5xl font-bold">{result.type}</h1>
        <p className="mt-2 text-neutral-400">
          Distance from centroid: {result.distance.toFixed(2)}
        </p>
      </header>

      {/* Scores vs Centroid */}
      <section className="border border-neutral-800 p-6">
        <h2 className="text-lg font-medium">
          Your Scores vs Type Centroid
        </h2>

        <div className="mt-6 space-y-4">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-neutral-400">{row.label}</span>
              <div className="flex items-center gap-4">
                <span>You: {row.user}</span>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-500">
                  {result.type}: {row.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Matches */}
      <section className="border border-neutral-800 p-6">
        <h2 className="text-lg font-medium">Top 5 Matches</h2>

        <div className="mt-6 space-y-2">
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

      {/* Disclaimer */}
      <p className="text-sm text-neutral-500">
        This assessment uses neurochemical-based nearest centroid classification.
        Personality is complex and cannot be fully captured by any typology system.
      </p>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-3 text-sm border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500"
      >
        Take Again
      </button>
    </div>
  );
}
