"use client";

import { useRef, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import Slider from "@/components/ui/Slider";
import type { AnswerType } from "@/lib/types/wizard";
import { useVoiceInput } from "@/lib/hooks/useVoiceInput";

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
  const baseTextRef = useRef(typeof value === "string" ? value : "");
  const { listening, supported, start, stop, error } = useVoiceInput();

  const toggle = useCallback(() => {
    if (listening) {
      stop();
      return;
    }
    baseTextRef.current = typeof value === "string" ? value : "";
    start((transcript) => {
      const base = baseTextRef.current;
      const separator = base && !base.endsWith(" ") ? " " : "";
      onChange(base + separator + transcript);
    });
  }, [listening, value, start, stop, onChange]);

  // Sync the ref when user types manually
  useEffect(() => {
    if (!listening && typeof value === "string" && value !== baseTextRef.current) {
      baseTextRef.current = value;
    }
  }, [listening, value]);

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
        <div className="relative">
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Say it however it comes out."
            rows={5}
            className="w-full bg-surface-800 border border-surface-600 rounded-xl px-5 py-4 pr-12 text-foreground placeholder-surface-400 text-base focus:outline-none focus:border-accent-blue/60 focus:ring-1 focus:ring-accent-blue/30 transition-colors resize-none leading-relaxed"
          />
          {supported && (
            <button
              type="button"
              onClick={toggle}
              className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                listening
                  ? "bg-red-500/20 text-red-400 animate-pulse"
                  : "bg-surface-700 text-surface-400 hover:text-foreground hover:bg-surface-600"
              }`}
              aria-label={listening ? "Stop recording" : "Start recording"}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {listening ? (
                  <>
                    <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
                  </>
                ) : (
                  <>
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        <p className="text-surface-400 text-sm">
          {listening
            ? "Listening. Tap stop when you're done."
            : "A few sentences. Specific beats vague."}
        </p>
      </div>
    );
  }

  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-3">
      {labels && (
        <div className="flex justify-between text-sm text-surface-300 font-medium">
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
            className={`flex-1 h-12 rounded-lg border text-base font-semibold transition-colors cursor-pointer ${
              value === opt
                ? "border-accent-blue bg-accent-blue-muted text-accent-blue"
                : "border-surface-600 text-surface-300 hover:border-surface-500 hover:text-foreground"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
