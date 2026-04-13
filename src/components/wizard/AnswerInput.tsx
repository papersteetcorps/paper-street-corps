"use client";

import { useState, useRef, useCallback } from "react";
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

function useSpeechRecognition(onResult: (finalText: string, interim: string) => void) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const toggle = useCallback(() => {
    if (!supported) return;

    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      return;
    }

    const SR =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interimText = "";
      let finalText = "";
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }
      setInterim(interimText);
      onResult(finalText, interimText);
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setListening(false);
      setInterim("");
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [supported, listening, onResult]);

  return { listening, toggle, supported, interim };
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

  const handleSpeechResult = useCallback(
    (finalText: string, interim: string) => {
      if (finalText) {
        const base = baseTextRef.current;
        const separator = base && !base.endsWith(" ") ? " " : "";
        const updated = base + separator + finalText;
        baseTextRef.current = updated;
        onChange(updated);
      }
      void interim; // interim is displayed separately via the hook
    },
    [onChange]
  );

  const { listening, toggle, supported, interim } = useSpeechRecognition(handleSpeechResult);

  // Sync the ref when user types manually
  if (!listening && typeof value === "string" && value !== baseTextRef.current) {
    baseTextRef.current = value;
  }

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
        {listening && interim && (
          <p className="text-accent-blue/70 text-sm italic animate-pulse">
            {interim}
          </p>
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
