"use client";

import { motion, AnimatePresence } from "motion/react";
import type { WizardQuestion } from "@/lib/types/wizard";
import AnswerInput from "./AnswerInput";

interface QuestionCardProps {
  question: WizardQuestion;
  value: number | null;
  onChange: (value: number) => void;
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
        initial={{ opacity: 0, x: direction * 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -60 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-foreground">
            {question.text}
          </h2>
          {question.description && (
            <p className="text-sm text-surface-400">{question.description}</p>
          )}
        </div>

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
