"use client";

import { useReducer, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type {
  WizardQuestion,
  WizardAnswer,
  WizardPhase,
  WizardAction,
  WizardState,
} from "@/lib/types/wizard";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ProgressHeader from "./ProgressHeader";
import QuestionCard from "./QuestionCard";
import WizardNavigation from "./WizardNavigation";

interface WizardShellProps {
  title: string;
  subtitle: string;
  questions: WizardQuestion[];
  onComplete: (answers: WizardAnswer[]) => void;
  resultView: React.ReactNode | null;
  isLoading?: boolean;
  error?: string | null;
  onReset?: () => void;
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "START":
      return { ...state, phase: "questions", currentIndex: 0 };
    case "ANSWER": {
      const existing = state.answers.findIndex(
        (a) => a.questionId === action.questionId
      );
      const answers =
        existing >= 0
          ? state.answers.map((a, i) =>
              i === existing ? { ...a, value: action.value } : a
            )
          : [...state.answers, { questionId: action.questionId, value: action.value }];
      return { ...state, answers };
    }
    case "NEXT":
      return { ...state, currentIndex: state.currentIndex + 1, direction: 1 };
    case "BACK":
      return {
        ...state,
        currentIndex: Math.max(0, state.currentIndex - 1),
        direction: -1,
      };
    case "SUBMIT":
      return { ...state, phase: "loading" };
    case "RESULTS_READY":
      return { ...state, phase: "results" };
    case "ERROR":
      return { ...state, phase: "error", error: action.message };
    case "RESET":
      return { phase: "intro", currentIndex: 0, answers: [], direction: 1, error: null };
    default:
      return state;
  }
}

const initialState: WizardState = {
  phase: "intro",
  currentIndex: 0,
  answers: [],
  direction: 1,
  error: null,
};

export default function WizardShell({
  title,
  subtitle,
  questions,
  onComplete,
  resultView,
  isLoading = false,
  error = null,
  onReset,
}: WizardShellProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const currentQuestion = questions[state.currentIndex];
  const currentAnswer = currentQuestion
    ? state.answers.find((a) => a.questionId === currentQuestion.id)
    : null;

  const handleAnswer = useCallback(
    (value: number) => {
      if (!currentQuestion) return;
      dispatch({ type: "ANSWER", questionId: currentQuestion.id, value });
    },
    [currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (state.currentIndex < questions.length - 1) {
      dispatch({ type: "NEXT" });
    }
  }, [state.currentIndex, questions.length]);

  const handleBack = useCallback(() => {
    dispatch({ type: "BACK" });
  }, []);

  const handleSubmit = useCallback(() => {
    dispatch({ type: "SUBMIT" });
    onComplete(state.answers);
  }, [onComplete, state.answers]);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
    onReset?.();
  }, [onReset]);

  const phase: WizardPhase =
    error ? "error" : isLoading ? "loading" : resultView ? "results" : state.phase;

  return (
    <Container className="py-8">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center max-w-xl mx-auto"
          >
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="text-surface-400 leading-relaxed">{subtitle}</p>
            <p className="text-sm text-surface-500">
              {questions.length} questions &middot; Takes about{" "}
              {Math.max(1, Math.round(questions.length * 0.5))} minutes
            </p>
            <Button onClick={() => dispatch({ type: "START" })}>
              Begin Assessment
            </Button>
          </motion.div>
        )}

        {phase === "questions" && currentQuestion && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 max-w-xl mx-auto"
          >
            <ProgressHeader
              current={state.currentIndex + 1}
              total={questions.length}
              title={title}
            />
            <QuestionCard
              question={currentQuestion}
              value={currentAnswer?.value ?? null}
              onChange={handleAnswer}
              direction={state.direction}
            />
            <WizardNavigation
              canGoBack={state.currentIndex > 0}
              canGoNext={currentAnswer != null}
              isLast={state.currentIndex === questions.length - 1}
              onBack={handleBack}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="w-8 h-8 border-2 border-surface-700 border-t-accent-blue rounded-full animate-spin" />
            <p className="text-surface-400 text-sm">Calculating results...</p>
          </motion.div>
        )}

        {phase === "results" && resultView && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {resultView}
            <div className="text-center pt-4">
              <Button variant="secondary" onClick={handleReset}>
                Take Again
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-4"
          >
            <p className="text-red-400">
              {error || state.error || "Something went wrong"}
            </p>
            <Button variant="secondary" onClick={handleReset}>
              Try Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
