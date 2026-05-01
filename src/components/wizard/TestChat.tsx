"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";
import { useVoiceInput } from "@/lib/hooks/useVoiceInput";
import Container from "@/components/ui/Container";
import Slider from "@/components/ui/Slider";
import AnalysisLoader from "@/components/wizard/AnalysisLoader";
import { logEvent } from "@/lib/logger";

type Role = "ai" | "user";
type Message = { role: Role; text: string; questionId?: string };

interface TestChatProps {
  title: string;
  questions: WizardQuestion[];
  onComplete: (answers: WizardAnswer[]) => void;
  onSwitchToClassic: () => void;
  storageKey?: string;
}

export default function TestChat({
  title,
  questions,
  onComplete,
  onSwitchToClassic,
  storageKey,
}: TestChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [answers, setAnswers] = useState<WizardAnswer[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState("");
  const [validating, setValidating] = useState(false);
  const [askedFollowUp, setAskedFollowUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const baseTextRef = useRef("");

  const { listening, supported: micSupported, start, stop, error: voiceError } = useVoiceInput();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastUserActionRef = useRef<"none" | "sent">("none");

  // Restore from localStorage on mount
  useEffect(() => {
    if (!storageKey) {
      setMessages([{ role: "ai", text: questions[0].text, questionId: questions[0].id }]);
      return;
    }
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved) as { messages: Message[]; answers: WizardAnswer[]; currentIdx: number };
        if (data.messages?.length && data.currentIdx < questions.length) {
          setMessages(data.messages);
          setAnswers(data.answers ?? []);
          setCurrentIdx(data.currentIdx ?? 0);
          return;
        }
      }
    } catch { /* ignore */ }
    setMessages([{ role: "ai", text: questions[0].text, questionId: questions[0].id }]);
  }, [storageKey, questions]);

  // Persist on every state change
  useEffect(() => {
    if (!storageKey || messages.length === 0) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ messages, answers, currentIdx }));
    } catch { /* ignore */ }
  }, [storageKey, messages, answers, currentIdx]);

  // Scroll to bottom only when the user just sent something
  useEffect(() => {
    if (lastUserActionRef.current === "sent") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      lastUserActionRef.current = "none";
    }
  }, [messages]);

  const currentQuestion = questions[currentIdx];

  const advanceToNext = useCallback((finalAnswers: WizardAnswer[]) => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      setSubmitting(true);
      setMessages((prev) => {
        const finalMessages = [...prev, { role: "ai" as Role, text: "Got it. Analysing your answers now…" }];
        // Log the full chat thread before submitting
        logEvent("chat_test_thread", {
          testType: title,
          mode: "chat",
          payload: { messages: finalMessages, answers: finalAnswers },
        });
        return finalMessages;
      });
      if (storageKey) {
        try { localStorage.removeItem(storageKey); } catch { /* */ }
      }
      onComplete(finalAnswers);
      return;
    }
    const nextQ = questions[nextIdx];
    setCurrentIdx(nextIdx);
    setAskedFollowUp(false);
    setMessages((prev) => [...prev, { role: "ai", text: nextQ.text, questionId: nextQ.id }]);
  }, [currentIdx, questions, onComplete, storageKey, title]);

  const submitAnswer = useCallback(async (rawValue: string | number) => {
    if (validating || submitting) return;
    if (!currentQuestion) return;

    const userText = typeof rawValue === "number" ? `${rawValue}` : rawValue.trim();
    if (!userText) return;

    lastUserActionRef.current = "sent";
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    baseTextRef.current = "";

    if (currentQuestion.answerType === "slider") {
      const num = typeof rawValue === "number" ? rawValue : parseInt(userText, 10);
      const min = currentQuestion.min ?? 1;
      const max = currentQuestion.max ?? 5;
      if (isNaN(num) || num < min || num > max) {
        setMessages((prev) => [...prev, { role: "ai", text: `Please give a number between ${min} and ${max}.` }]);
        return;
      }
      const newAnswers = [...answers, { questionId: currentQuestion.id, value: num }];
      setAnswers(newAnswers);
      advanceToNext(newAnswers);
      return;
    }

    setValidating(true);
    try {
      const res = await fetch("/api/validate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion.text, answer: userText }),
      });
      const data = await res.json() as { valid: boolean; reason?: string };

      if (data.valid || askedFollowUp) {
        const newAnswers = [...answers, { questionId: currentQuestion.id, value: userText }];
        setAnswers(newAnswers);
        advanceToNext(newAnswers);
      } else {
        setAskedFollowUp(true);
        setMessages((prev) => [...prev, { role: "ai", text: data.reason ?? "Could you say a bit more?" }]);
      }
    } catch {
      const newAnswers = [...answers, { questionId: currentQuestion.id, value: userText }];
      setAnswers(newAnswers);
      advanceToNext(newAnswers);
    } finally {
      setValidating(false);
    }
  }, [currentQuestion, answers, askedFollowUp, validating, submitting, advanceToNext]);

  const toggleMic = useCallback(() => {
    if (listening) {
      stop();
      return;
    }
    baseTextRef.current = input;
    start((transcript) => {
      const base = baseTextRef.current;
      const sep = base && !base.endsWith(" ") ? " " : "";
      setInput(base + sep + transcript);
    });
  }, [listening, input, start, stop]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAnswer(input);
    }
  };

  const isSlider = currentQuestion?.answerType === "slider";
  const sliderMin = currentQuestion?.min ?? 1;
  const sliderMax = currentQuestion?.max ?? 5;
  const [sliderValue, setSliderValue] = useState(3);

  useEffect(() => {
    if (isSlider) setSliderValue(3);
  }, [currentIdx, isSlider]);

  const clearChat = useCallback(() => {
    setMessages([{ role: "ai", text: questions[0].text, questionId: questions[0].id }]);
    setAnswers([]);
    setCurrentIdx(0);
    setInput("");
    setAskedFollowUp(false);
    if (storageKey) {
      try { localStorage.removeItem(storageKey); } catch { /* */ }
    }
  }, [questions, storageKey]);

  return (
    <Container className="py-6 md:py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="min-w-0">
            <p className="text-xs text-surface-500 uppercase tracking-widest">{title}</p>
            <p className="text-sm text-surface-400 mt-0.5">
              Question {Math.min(currentIdx + 1, questions.length)} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={clearChat}
              disabled={submitting}
              className="text-xs text-surface-500 hover:text-surface-300 transition-colors disabled:opacity-40"
            >
              Clear
            </button>
            <button
              onClick={onSwitchToClassic}
              className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
            >
              Classic
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-surface-800 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-accent-amber/60"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + (submitting ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Chat thread */}
        <div className="space-y-3 mb-6 min-h-[300px]">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-base leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent-amber/10 border border-accent-amber/20 text-foreground"
                      : "bg-surface-800 border border-surface-700 text-surface-200"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {validating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-surface-800 border border-surface-700 rounded-2xl px-4 py-3 text-surface-400 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" style={{ animationDelay: "0.3s" }} />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area — slider OR textarea */}
        {!submitting && currentQuestion && (
          <div className="border border-surface-700 bg-surface-900 rounded-2xl p-4 space-y-3">
            {isSlider ? (
              <>
                {currentQuestion.labels && (
                  <div className="flex justify-between text-xs text-surface-500 px-1">
                    <span>{currentQuestion.labels[0]}</span>
                    <span>{currentQuestion.labels[1]}</span>
                  </div>
                )}
                <Slider value={sliderValue} onChange={setSliderValue} min={sliderMin} max={sliderMax} />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">
                    Selected: <span className="text-accent-amber font-semibold">{sliderValue}</span>
                  </span>
                  <button
                    onClick={() => submitAnswer(sliderValue)}
                    disabled={validating}
                    className="px-5 py-2 rounded-xl bg-accent-amber text-white text-sm font-semibold hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer or tap the mic to dictate…"
                  rows={3}
                  disabled={validating}
                  className="w-full bg-transparent text-foreground placeholder:text-surface-500 text-base focus:outline-none resize-none leading-relaxed disabled:opacity-50"
                />
                <div className="flex items-center justify-between gap-2">
                  {micSupported && (
                    <button
                      onClick={toggleMic}
                      disabled={validating}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        listening
                          ? "bg-red-500/20 text-red-400 animate-pulse"
                          : "bg-surface-800 text-surface-400 hover:text-foreground hover:bg-surface-700"
                      } disabled:opacity-40`}
                      aria-label={listening ? "Stop recording" : "Dictate"}
                      title="Dictate your answer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {listening ? (
                          <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
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
                  <p className="text-xs text-surface-500 flex-1 px-2 truncate">
                    {listening ? "Listening… tap stop when done" : "Enter to send · Shift+Enter for new line"}
                  </p>
                  <button
                    onClick={() => submitAnswer(input)}
                    disabled={!input.trim() || validating}
                    className="px-5 py-2 rounded-xl bg-accent-amber text-white text-sm font-semibold hover:brightness-110 disabled:opacity-40 transition-all"
                  >
                    Send
                  </button>
                </div>
                {voiceError && <p className="text-xs text-red-400">{voiceError}</p>}
              </>
            )}
          </div>
        )}

        {submitting && <AnalysisLoader title={`Building your ${title.toLowerCase()} profile`} />}
      </div>
    </Container>
  );
}
