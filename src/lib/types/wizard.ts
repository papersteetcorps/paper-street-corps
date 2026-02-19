export type AnswerType = "scale" | "slider" | "choice";

export interface WizardQuestion {
  id: string;
  text: string;
  description?: string;
  answerType: AnswerType;
  labels?: [string, string];
  min?: number;
  max?: number;
  step?: number;
}

export interface WizardAnswer {
  questionId: string;
  value: number;
}

export interface WizardConfig {
  testType: "mbti" | "temperaments" | "moral-alignment";
  title: string;
  subtitle: string;
  questionSource: "static" | "llm";
  questions: WizardQuestion[];
}

export type WizardPhase = "intro" | "questions" | "loading" | "results" | "error";

export interface WizardState {
  phase: WizardPhase;
  currentIndex: number;
  answers: WizardAnswer[];
  direction: number;
  error: string | null;
}

export type WizardAction =
  | { type: "START" }
  | { type: "ANSWER"; questionId: string; value: number }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SUBMIT" }
  | { type: "RESULTS_READY" }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };
