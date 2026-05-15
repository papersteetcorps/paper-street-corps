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
            className="w-full bg-[#0a0a0c] border border-[var(--surface-700)] px-4 py-3.5 pr-14 text-[var(--foreground)] placeholder-[var(--surface-500)] text-[15px] focus:outline-none focus:border-[var(--ember)] focus:ring-1 focus:ring-[var(--ember)]/40 transition-colors resize-none leading-relaxed font-body"
          />
          {supported && (
            <button
              type="button"
              onClick={toggle}
              className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center border transition-all ${
                listening
                  ? "border-[var(--ember)] bg-[var(--ember)] text-[#0a0a0c] animate-pulse"
                  : "border-[var(--surface-700)] text-[var(--surface-400)] hover:text-[var(--ember)] hover:border-[var(--ember)]"
              }`}
              aria-label={listening ? "Stop recording" : "Start recording"}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              >
                {listening ? (
                  <rect x="6" y="6" width="12" height="12" fill="currentColor" />
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
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--ember-hot)]">
            {error}
          </p>
        )}
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--surface-500)]">
          {listening
            ? "● Listening · tap stop when done"
            : "Be specific. Vague answers produce vague results."}
        </p>
      </div>
    );
  }

  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-3">
      {labels && (
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--surface-400)]">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
      <div className="flex justify-between gap-2">
        {options.map((opt) => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(opt)}
            className={`flex-1 h-12 border text-base font-mono font-semibold transition-colors cursor-pointer ${
              value === opt
                ? "border-[var(--ember)] bg-[var(--ember-muted)] text-[var(--ember)]"
                : "border-[var(--surface-700)] text-[var(--surface-300)] hover:border-[var(--ember)]/60 hover:text-[var(--foreground)]"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
