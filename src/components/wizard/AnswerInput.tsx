"use client";

import { motion } from "motion/react";
import Slider from "@/components/ui/Slider";
import type { AnswerType } from "@/lib/types/wizard";

interface AnswerInputProps {
  type: AnswerType;
  value: number | string | null;
  onChange: (value: number | string) => void;
  labels?: [string, string];
  min?: number;
  max?: number;
}

export default function AnswerInput({
  type,
  value,
  onChange,
  labels,
  min = 1,
  max = 5,
}: AnswerInputProps) {
  if (type === "slider") {
    return (
      <Slider
        value={typeof value === "number" ? value : 3}
        onChange={(v) => onChange(v)}
        min={min}
        max={max}
        labels={labels}
      />
    );
  }

  if (type === "text") {
    return (
      <div className="space-y-3">
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your answer here — be specific and honest. There are no right or wrong answers."
          rows={5}
          className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-foreground placeholder-surface-500 text-sm focus:outline-none focus:border-accent-blue/60 focus:ring-1 focus:ring-accent-blue/30 transition-colors resize-none leading-relaxed"
        />
        <p className="text-surface-500 text-xs">
          Aim for at least 2–3 sentences. The more specific you are, the more accurate your result.
        </p>
      </div>
    );
  }

  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-3">
      {labels && (
        <div className="flex justify-between text-xs text-surface-500">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
      <div className="flex justify-between gap-2">
        {options.map((opt) => (
          <motion.button
            key={opt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt)}
            className={`flex-1 h-12 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
              value === opt
                ? "border-accent-blue bg-accent-blue-muted text-accent-blue"
                : "border-surface-700 text-surface-400 hover:border-surface-500 hover:text-surface-200"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
