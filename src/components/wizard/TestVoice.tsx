"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";
import { useVoiceAgent } from "@/lib/hooks/useVoiceAgent";
import Container from "@/components/ui/Container";
import AnalysisLoader from "@/components/wizard/AnalysisLoader";
import { logEvent } from "@/lib/logger";

type Role = "ai" | "user";
type Turn = { role: Role; text: string };

interface TestVoiceProps {
  title: string;
  questions: WizardQuestion[];
  onComplete: (answers: WizardAnswer[]) => void;
  onSwitchMode: () => void;
  domain?: string;
}

/* ── Reusable SVG icons ─────────────────────────────────────────────────── */

function IconMic({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function IconStop({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function IconCheck({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconSpeaker({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

/* ── Audio reactive visualizer (4 concentric pulse rings) ───────────────── */

function VoiceVisualizer({
  state,
}: {
  state: "idle" | "connecting" | "user" | "agent" | "ready";
}) {
  const isUser = state === "user";
  const isAgent = state === "agent";
  const isActive = isUser || isAgent;

  const accentColor = isUser
    ? "rgb(248, 113, 113)" // red-400
    : isAgent
    ? "rgb(232, 98, 42)" // amber
    : "rgb(124, 92, 252)"; // blue

  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        animate={{
          opacity: isActive ? [0.4, 0.7, 0.4] : 0.15,
          scale: isActive ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: isActive ? 1.6 : 0.6,
          repeat: isActive ? Infinity : 0,
        }}
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 65%)`,
        }}
      />

      {/* Pulse rings (4 layered) */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: `${accentColor}40` }}
          animate={
            isActive
              ? {
                  scale: [0.85, 1.45, 0.85],
                  opacity: [0, 0.55, 0],
                }
              : { scale: 1, opacity: 0 }
          }
          transition={{
            duration: 2.4,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.6,
            ease: "easeOut",
          }}
          initial={{ width: 180, height: 180 }}
        />
      ))}

      {/* Soft inner ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          border: `1px solid ${accentColor}55`,
          background: `radial-gradient(circle at 50% 30%, ${accentColor}22, transparent 70%)`,
        }}
        animate={{
          scale: isActive ? [1, 1.03, 1] : 1,
        }}
        transition={{
          duration: 1.6,
          repeat: isActive ? Infinity : 0,
        }}
      />

      {/* Core circle */}
      <motion.div
        className="relative w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-sm"
        style={{
          background: isActive
            ? `radial-gradient(circle at 50% 30%, ${accentColor}30, ${accentColor}10)`
            : "linear-gradient(180deg, rgba(42,42,58,0.6), rgba(16,16,24,0.8))",
          boxShadow: isActive
            ? `0 0 40px ${accentColor}55, inset 0 0 30px ${accentColor}33`
            : "0 0 20px rgba(0,0,0,0.4), inset 0 0 20px rgba(124, 92, 252, 0.12)",
        }}
        animate={{
          scale: state === "user" ? [1, 1.06, 1] : state === "agent" ? [1, 1.03, 1] : 1,
        }}
        transition={{
          duration: 1.2,
          repeat: isActive ? Infinity : 0,
        }}
      >
        {state === "agent" ? (
          <IconSpeaker size={42} className="text-foreground" />
        ) : (
          <IconMic size={42} className="text-foreground" />
        )}
      </motion.div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function TestVoice({
  title,
  questions,
  onComplete,
  onSwitchMode,
  domain = "personality typology",
}: TestVoiceProps) {
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);

  const voiceAgent = useVoiceAgent();
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<Turn[]>([]);
  const currentQRef = useRef(0);
  const submittingRef = useRef(false);
  const submitFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript]);

  const submitConversation = useCallback(async () => {
    // Guard: don't double-submit if already in flight or already triggered
    if (submitting) return;
    const turns = transcriptRef.current;
    const userTurns = turns.filter((t) => t.role === "user").length;
    if (userTurns < 1) {
      setError("No conversation to analyse. Try talking with the coach first.");
      submittingRef.current = false;
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    voiceAgent.stop();

    // Log the full voice conversation transcript (fire-and-forget)
    logEvent("voice_test_transcript", {
      testType: title,
      mode: "voice",
      payload: { transcript: turns, questions: questions.map((q) => ({ id: q.id, text: q.text })) },
    });

    try {
      const res = await fetch("/api/extract-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, transcript: turns }),
      });
      const data = await res.json();
      if (data.answers) {
        onComplete(data.answers as WizardAnswer[]);
      } else {
        setError(data.error ?? "Could not extract answers from the conversation.");
        setSubmitting(false);
        submittingRef.current = false;
      }
    } catch {
      setError("Could not reach the analysis service. Check your connection.");
      setSubmitting(false);
      submittingRef.current = false;
    }
  }, [questions, voiceAgent, onComplete, submitting]);

  useEffect(() => {
    submitFnRef.current = submitConversation;
  }, [submitConversation]);

  const handleEnd = useCallback(() => {
    submitConversation();
  }, [submitConversation]);

  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  const matchesQuestion = (agentText: string, qText: string): boolean => {
    const a = normalize(agentText);
    const q = normalize(qText);
    if (q.length < 8) return false;
    const qWords = q.split(" ");
    if (qWords.length < 4) return a.includes(q);
    for (let i = 0; i <= qWords.length - 4; i++) {
      const phrase = qWords.slice(i, i + 4).join(" ");
      if (a.includes(phrase)) return true;
    }
    return false;
  };

  const startSession = useCallback(async () => {
    setError(null);
    setTranscript([]);
    transcriptRef.current = [];
    setCurrentQ(0);
    currentQRef.current = 0;
    submittingRef.current = false;
    setStarted(true);

    const questionList = questions
      .map((q, i) => {
        if (q.answerType === "slider") {
          const min = q.min ?? 1;
          const max = q.max ?? 5;
          const lbls = q.labels ? `${q.labels[0]} → ${q.labels[1]}` : `${min} to ${max}`;
          return `Q${i + 1}: "${q.text}" (rate yourself ${lbls})`;
        }
        return `Q${i + 1}: "${q.text}"`;
      })
      .join("\n");

    const total = questions.length;
    const testName = title;

    const systemPrompt = `You are a warm, perceptive expert in ${domain} having a guided but natural conversation with the user about themselves. This is for the ${testName} assessment.

==== HOW TO OPEN ====
Greet them warmly, then briefly explain what's about to happen. Something like:
"Hey! Thanks for hopping on. For the ${testName} assessment I'll ask you ${total} questions, one at a time. Just answer however feels natural — there's no right answer. Ready? Cool, here's the first one."
Keep this intro under 4 sentences. Don't list the topics. Then go straight into question 1.

==== ASKING THE QUESTIONS ====
You MUST ask the questions in this exact order — never skip, never reorder:

${questionList}

You may slightly rephrase a question to fit conversational flow, but you must keep the same meaning. KEEP THE ORDER FIXED.

==== TONE ====
- Warm, curious, friendly — like a thoughtful friend, not a clinician
- React naturally to what they say: "oh interesting", "yeah I get that", "huh, makes sense"
- Keep your replies short — 1-2 sentences max
- If their answer is vague, ask ONE friendly follow-up like "could you say a bit more?" — only once per question
- Use small disfluencies sometimes — "yeah", "hmm", "got it"

==== TRANSITIONS ====
Between questions, ALWAYS use a clear transition phrase that mentions progress:
- "Got it. Next question — [Q text]"
- "Cool. Question 3 of ${total} — [Q text]"
- "Halfway there. [Q text]" (when at the midpoint)
- "One more after this. [Q text]" (when on the second-to-last)
- "Last question — [Q text]" (when on the final question)

==== HOW TO END ====
After Q${total} is answered, wrap up warmly:
"Awesome, that's all of them. Thanks for sharing — I've got a really clear sense of you now. Let me put together what I learned."

==== STRICT RULES ====
- Never invent answers the user didn't give
- Never skip questions, never reorder
- Never ask 2 questions in one turn
- One question per turn, one transition phrase, then the question`;

    const greeting = `Hey! Thanks for hopping on. For the ${testName} assessment I'll ask you ${total} questions, one at a time. Just answer however feels natural — there's no right or wrong. Ready? Here's question 1: ${questions[0]?.text ?? ""}`;

    await voiceAgent.start({
      systemPrompt,
      greeting,
      voice: "ivy",
      onTranscriptUser: (text) => {
        if (!text?.trim()) return;
        setTranscript((prev) => [...prev, { role: "user", text }]);
      },
      onTranscriptAgent: (text) => {
        if (!text?.trim()) return;
        setTranscript((prev) => [...prev, { role: "ai", text }]);

        // Track progress for the UI
        const nextIdx = currentQRef.current + 1;
        const nextQ = questions[nextIdx];
        if (nextQ && matchesQuestion(text, nextQ.text)) {
          currentQRef.current = nextIdx;
          setCurrentQ(nextIdx);
        }

        // Auto-submit detection — relaxed and robust.
        // Trigger when ANY clear wrap-up phrase is detected AND user has spoken at least 3 times.
        // We don't depend on currentQRef matching the last question because agent rephrasing can miss it.
        if (submittingRef.current) return;
        const userTurnCount = transcriptRef.current.filter((t) => t.role === "user").length;
        const minTurns = Math.max(2, Math.min(3, Math.floor(questions.length / 3)));

        const wrapUpSignal =
          /that's all|all of them|all the questions|let me put together|put together what i learned|got (everything|a really good|a really clear|a good|a clear) sense|got a sense|i('| ha)?ve got|i got it all|we're done|we are done|all done|wrapping up|that wraps it up|thanks for sharing|thanks for chatting|appreciate (you )?sharing|that's everything|that's it for|i think we're done/i;

        if (userTurnCount >= minTurns && wrapUpSignal.test(text)) {
          submittingRef.current = true;
          setTimeout(() => {
            submitFnRef.current?.();
          }, 2500);
        }
      },
      onError: (msg) => {
        setError(msg);
        setStarted(false);
      },
    });
  }, [questions, voiceAgent, domain, title]);

  const userTurnCount = transcript.filter((t) => t.role === "user").length;

  // Determine visualizer state
  const vizState: "idle" | "connecting" | "user" | "agent" | "ready" = !started
    ? "idle"
    : voiceAgent.connecting
    ? "connecting"
    : voiceAgent.userSpeaking
    ? "user"
    : voiceAgent.agentSpeaking
    ? "agent"
    : voiceAgent.connected
    ? "ready"
    : "idle";

  return (
    <Container className="py-6 md:py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="min-w-0">
            <p className="text-xs text-surface-500 uppercase tracking-widest font-medium">{title}</p>
            <p className="text-sm text-surface-300 mt-0.5">
              {started
                ? `Question ${Math.min(currentQ + 1, questions.length)} of ${questions.length}`
                : "Voice conversation"}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onSwitchMode}
              className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
            >
              Classic
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {started && (
          <div className="h-1 bg-surface-800 rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, var(--color-accent-amber), var(--color-accent-purple))",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(currentQ / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        {/* Visualizer */}
        <div className="flex flex-col items-center justify-center mb-8">
          <VoiceVisualizer state={vizState} />
          <motion.p
            key={vizState}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-base font-medium text-foreground"
          >
            {!started
              ? "Ready when you are"
              : voiceAgent.connecting
              ? "Connecting…"
              : voiceAgent.userSpeaking
              ? "Listening to you"
              : voiceAgent.agentSpeaking
              ? "Coach is talking"
              : voiceAgent.connected
              ? "Your turn"
              : "Disconnected"}
          </motion.p>
          {started && voiceAgent.connected && (
            <p className="text-xs text-surface-500 mt-1.5">
              {userTurnCount} {userTurnCount === 1 ? "thing" : "things"} shared
            </p>
          )}
        </div>

        {/* Live transcript */}
        <div className="border border-surface-700/60 rounded-2xl bg-surface-900/40 backdrop-blur-sm mb-6 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-surface-700/60 flex items-center justify-between bg-surface-800/40">
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  voiceAgent.connected ? "bg-emerald-400 animate-pulse" : "bg-surface-600"
                }`}
              />
              <p className="text-[10px] uppercase tracking-widest text-surface-400 font-semibold">
                Live transcript
              </p>
            </div>
            <span className="text-[10px] text-surface-500 tabular-nums">{transcript.length} turns</span>
          </div>
          <div className="max-h-80 overflow-y-auto p-4 space-y-2.5">
            {transcript.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-10 h-10 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center mb-3 text-surface-500">
                  <IconMic size={18} />
                </div>
                <p className="text-sm text-surface-500">
                  {started ? "Waiting for the coach…" : "Tap Start when you're ready"}
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {transcript.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        t.role === "user"
                          ? "bg-gradient-to-br from-accent-amber/15 to-accent-amber/5 border border-accent-amber/25 text-foreground"
                          : "bg-surface-800/80 border border-surface-700 text-surface-200"
                      }`}
                    >
                      {t.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 flex items-start gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Action buttons */}
        {!submitting && (
          <div className="flex justify-center gap-3">
            {!started || !voiceAgent.connected ? (
              <button
                onClick={startSession}
                disabled={voiceAgent.connecting}
                className="px-7 py-3 rounded-xl bg-gradient-to-br from-accent-amber to-orange-600 text-white font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2.5 shadow-lg shadow-accent-amber/20"
              >
                <IconMic size={18} />
                {voiceAgent.connecting ? "Connecting…" : "Start Conversation"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleEnd}
                  disabled={userTurnCount < 1}
                  className="px-7 py-3 rounded-xl bg-gradient-to-br from-accent-amber to-orange-600 text-white font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2.5 shadow-lg shadow-accent-amber/20"
                  title="End conversation and analyse what was shared"
                >
                  <IconCheck size={18} />
                  Done — Analyse
                </button>
                <button
                  onClick={() => { voiceAgent.stop(); setStarted(false); }}
                  className="px-5 py-3 rounded-xl bg-surface-800 border border-surface-700 text-surface-300 font-medium hover:bg-surface-700 hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <IconStop size={14} />
                  Cancel
                </button>
              </>
            )}
          </div>
        )}

        {submitting && (
          <AnalysisLoader
            title="Reading your conversation"
            steps={[
              "Reviewing the full transcript",
              "Connecting threads across your answers",
              "Mapping what you said to each question",
              "Pulling out your answers",
              "Handing off to the analyst",
            ]}
          />
        )}
      </div>
    </Container>
  );
}
