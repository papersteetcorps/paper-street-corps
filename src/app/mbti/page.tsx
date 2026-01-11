"use client";

import { useState } from "react";
import { QUESTIONS } from "@/data/neuroQuestions";
import {
  CHEMICALS,
  Chemical,
  NeurochemicalMBTI,
  TYPE_CENTROIDS,
} from "@/lib/scoring/neurochemicalMBTI";

type Result = {
  type: string;
  distance: number;
  confidence: number;
};

export default function MBTIPage() {
  const [answers, setAnswers] = useState<number[]>(
    () => Array(QUESTIONS.length).fill(3)
  );
  const [result, setResult] = useState<Result[]>([]);

  function submit() {
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
      const a = answers[i];

      (Object.entries(q.weights) as [Chemical, number][]).forEach(
        ([chem, w]) => {
          totals[chem] += a * w;
          weights[chem] += w;
        }
      );
    });

    const scores = {} as Record<Chemical, number>;
    CHEMICALS.forEach((c) => {
      scores[c] = weights[c]
        ? Math.min(5, Math.max(1, totals[c] / weights[c]))
        : 3;
    });

    const model = new NeurochemicalMBTI(TYPE_CENTROIDS);
    setResult(model.classify(scores));
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-semibold tracking-tight">
        Neurochemical MBTI Assessment
      </h1>

      {/* Instructions */}
      <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
        This assessment estimates your cognitive-emotional profile using
        neurochemical weighting rather than forced personality categories.
        Answer based on your <strong>baseline behavior</strong>, not temporary
        stress, mood, or aspirational self-image.
        <br />
        <br />
        For best accuracy, take the test when mentally rested and respond
        instinctively. There are no “good” or “bad” scores, only closer or
        farther matches.
      </p>

      {/* Questions */}
      {QUESTIONS.map((q, i) => (
        <div key={i} className="space-y-1">
          <p>{q.text}</p>
          <input
            type="range"
            min={1}
            max={5}
            value={answers[i]}
            onChange={(e) => {
              const next = [...answers];
              next[i] = Number(e.target.value);
              setAnswers(next);
            }}
            className="w-full"
          />
        </div>
      ))}

      {/* Analyze Button */}
      <button
        onClick={submit}
        className="px-5 py-2 bg-white text-black border border-black rounded hover:bg-gray-100 transition"
      >
        Analyze
      </button>

      {/* Results */}
      {result.length > 0 && (
        <div className="pt-4 space-y-1">
          <h2 className="text-xl font-semibold">Top Matches</h2>
          {result.slice(0, 3).map((r) => (
            <div key={r.type}>
              {r.type} — confidence {(r.confidence * 100).toFixed(1)}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
