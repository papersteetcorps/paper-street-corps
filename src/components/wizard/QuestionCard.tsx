"use client";

import { motion, AnimatePresence } from "motion/react";
import type { WizardQuestion } from "@/lib/types/wizard";
import AnswerInput from "./AnswerInput";

interface QuestionCardProps {
  question: WizardQuestion;
  value: number | string | null;
  onChange: (value: number | string) => void;
  direction: number;
}

export default function QuestionCard({
  question,
  value,
  onChange,
  direction,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        initial={{ opacity: 0, x: direction * 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -40 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative border border-[var(--surface-700)] bg-[var(--surface-900)]/40 p-5 sm:p-7"
      >
        {/* Ember rule at top */}
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--ember)]" />

        {/* Mono meta strip */}
        {question.description && (
          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] sm:tracking-[0.25em] text-[var(--ember)] mb-4">
            {question.description}
          </p>
        )}

        <h2
          className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.15] tracking-[-0.02em] text-[var(--foreground)] mb-6"
          style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144' }}
        >
          {question.text}
        </h2>

        <AnswerInput
          type={question.answerType}
          value={value}
          onChange={onChange}
          labels={question.labels}
          min={question.min}
          max={question.max}
        />
      </motion.div>
    </AnimatePresence>
  );
}
