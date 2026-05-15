"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
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
import LoadingState from "@/components/ui/LoadingState";
import AnalysisLoader from "@/components/wizard/AnalysisLoader";
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
  loadingQuestions?: boolean;
  error?: string | null;
  onReset?: () => void;
  storageKey?: string;
  autoStart?: boolean;
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
    case "RESTORE":
      return { ...state, phase: "questions", answers: action.answers, currentIndex: action.currentIndex, direction: 1 };
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

function loadSaved(key: string): { answers: WizardAnswer[]; currentIndex: number } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Array.isArray(data.answers) && data.answers.length > 0) return data;
    return null;
  } catch {
    return null;
  }
}

export default function WizardShell({
  title,
  subtitle,
  questions,
  onComplete,
  resultView,
  isLoading = false,
  loadingQuestions = false,
  error = null,
  onReset,
  storageKey,
  autoStart = false,
}: WizardShellProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Auto-start: skip intro phase when launched from a parent mode picker
  useEffect(() => {
    if (autoStart && state.phase === "intro" && !loadingQuestions && questions.length > 0) {
      // Restore saved draft if available, else just start
      const draft = storageKey ? loadSaved(storageKey) : null;
      if (draft) {
        dispatch({ type: "RESTORE", answers: draft.answers, currentIndex: draft.currentIndex });
      } else {
        dispatch({ type: "START" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, loadingQuestions, questions.length]);
  const hasRestored = useRef(false);
  const hasSavedDraft = useRef(false);

  // Restore from localStorage on mount
  useEffect(() => {
    if (!storageKey || hasRestored.current) return;
    hasRestored.current = true;
    const saved = loadSaved(storageKey);
    if (saved) {
      hasSavedDraft.current = true;
    }
  }, [storageKey]);

  // Check if there's a draft to show resume button
  const savedDraft = storageKey ? loadSaved(storageKey) : null;
  const showResume = state.phase === "intro" && savedDraft && !hasRestored.current === false;

  // Persist to localStorage on every answer/navigation change
  useEffect(() => {
    if (!storageKey || state.phase !== "questions" || state.answers.length === 0) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers: state.answers, currentIndex: state.currentIndex }));
    } catch {
      // quota exceeded — silent
    }
  }, [storageKey, state.answers, state.currentIndex, state.phase]);

  const currentQuestion = questions[state.currentIndex];
  const currentAnswer = currentQuestion
    ? state.answers.find((a) => a.questionId === currentQuestion.id)
    : null;

  const handleAnswer = useCallback(
    (value: number | string) => {
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
    if (storageKey) {
      try { localStorage.removeItem(storageKey); } catch { /* silent */ }
    }
    onComplete(state.answers);
  }, [onComplete, state.answers, storageKey]);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
    if (storageKey) {
      try { localStorage.removeItem(storageKey); } catch { /* silent */ }
    }
    onReset?.();
  }, [onReset, storageKey]);

  const handleResume = useCallback(() => {
    if (!storageKey) return;
    const saved = loadSaved(storageKey);
    if (saved) {
      dispatch({ type: "RESTORE", answers: saved.answers, currentIndex: saved.currentIndex });
    }
  }, [storageKey]);

  const phase: WizardPhase =
    error ? "error" : isLoading ? "loading" : resultView ? "results" : state.phase;

  return (
    <Container className="py-10 sm:py-14">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="space-y-7 max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
              <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
              <span>Forge Assessment</span>
              <span className="flex-1 h-px bg-[var(--surface-700)]" />
            </div>
            <h1
              className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]"
              style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144' }}
            >
              {title}
            </h1>
            <p className="text-[14px] sm:text-[15px] text-[var(--surface-300)] leading-relaxed">
              {subtitle}
            </p>
            {loadingQuestions ? (
              <LoadingState compact message="Getting ready..." accent="blue" />
            ) : (
              <>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--surface-400)] border-t border-[var(--surface-700)] pt-5">
                  <span>
                    <span className="text-[var(--ember)]">{String(questions.length).padStart(2, "0")}</span>{" "}
                    Questions
                  </span>
                  <span className="text-[var(--surface-600)]">·</span>
                  <span>~{Math.max(1, Math.round(questions.length * 0.5))} mins</span>
                  <span className="text-[var(--surface-600)]">·</span>
                  <span>Be honest</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                  <Button onClick={() => dispatch({ type: "START" })}>
                    <span>Begin</span>
                    <span>→</span>
                  </Button>
                  {showResume && savedDraft && (
                    <Button variant="secondary" onClick={handleResume}>
                      <span>Resume {savedDraft.answers.length}/{questions.length}</span>
                    </Button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}

        {phase === "questions" && currentQuestion && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-7 max-w-xl mx-auto"
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
              canGoNext={
                currentAnswer != null &&
                (typeof currentAnswer.value === "number" ||
                  (typeof currentAnswer.value === "string" && currentAnswer.value.trim().length > 10))
              }
              isLast={state.currentIndex === questions.length - 1}
              onBack={handleBack}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </motion.div>
        )}

        {phase === "loading" && <AnalysisLoader title={`Building your ${title.toLowerCase()} profile`} />}

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
                <span>Start Over</span>
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
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--ember-hot)]">
              {error || state.error || "Something went wrong. Not your fault."}
            </p>
            <Button variant="secondary" onClick={handleReset}>
              <span>Try Again</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
