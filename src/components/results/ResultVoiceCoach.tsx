"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useVoiceAgent } from "@/lib/hooks/useVoiceAgent";
import { logEvent } from "@/lib/logger";

type Role = "ai" | "user";
type Turn = { role: Role; text: string };

interface ResultVoiceCoachProps {
  testType: string;
  result: Record<string, unknown>;
  accentColor?: string;
}

const TEST_LABELS: Record<string, string> = {
  cjte: "Jungian",
  socionics: "Socionics",
  potentiology: "Energy Profile",
  temperaments: "Temperament",
  "moral-alignment": "Moral Alignment",
  enneagram: "Enneagram",
};

/* ── Icons ──────────────────────────────────────────────────────────── */

function IconMic({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function IconSpeaker({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function IconX({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconStop({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  );
}

/* ── Visualizer ─────────────────────────────────────────────────────── */

function Visualizer({
  state,
}: {
  state: "idle" | "connecting" | "user" | "agent" | "ready";
}) {
  const isUser = state === "user";
  const isAgent = state === "agent";
  const isActive = isUser || isAgent;

  return (
    <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
      {/* Outer dial */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: isActive ? 360 : 0 }}
        transition={{ duration: 8, repeat: isActive ? Infinity : 0, ease: "linear" }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="var(--surface-700)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
        </svg>
      </motion.div>

      {/* Pulse rings — only when active */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-6 border border-[var(--ember)]/45"
          animate={
            isActive
              ? { scale: [1, 1.35], opacity: [0.6, 0] }
              : { scale: 1, opacity: 0 }
          }
          transition={{
            duration: 2.2,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.7,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Center plate */}
      <motion.div
        className="relative w-20 h-20 sm:w-24 sm:h-24 border-2 border-[var(--ember)] flex items-center justify-center bg-[#0a0a0c]"
        animate={{
          scale: isUser ? [1, 1.06, 1] : isAgent ? [1, 1.03, 1] : 1,
          boxShadow: isActive
            ? [
                "0 0 24px rgba(255, 77, 28, 0.35), inset 0 0 16px rgba(255, 77, 28, 0.18)",
                "0 0 36px rgba(255, 77, 28, 0.55), inset 0 0 22px rgba(255, 77, 28, 0.28)",
                "0 0 24px rgba(255, 77, 28, 0.35), inset 0 0 16px rgba(255, 77, 28, 0.18)",
              ]
            : "0 0 0px rgba(255, 77, 28, 0)",
        }}
        transition={{ duration: 1.4, repeat: isActive ? Infinity : 0 }}
      >
        {isAgent ? (
          <IconSpeaker size={30} className="text-[var(--ember)]" />
        ) : (
          <IconMic size={30} className={isUser ? "text-[var(--ember)]" : "text-[var(--surface-300)]"} />
        )}
      </motion.div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */

export default function ResultVoiceCoach({ testType, result }: ResultVoiceCoachProps) {
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const voiceAgent = useVoiceAgent();
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript]);

  useEffect(() => {
    if (!open) {
      voiceAgent.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startSession = useCallback(async () => {
    setError(null);
    setTranscript([]);

    const testLabel = TEST_LABELS[testType] ?? testType;
    const resultJson = JSON.stringify(result, null, 2);

    const typeCode =
      (result.typeCode as string) ||
      (result.alignment as string) ||
      (result.primary as string) ||
      "your type";

    const systemPrompt = `You are a warm, insightful personal coach who specializes in ${testLabel} typology. The user just got their result and wants to talk about it with you.

THEIR FULL PROFILE:
${resultJson}

YOUR ROLE:
- Be a thoughtful coach having a casual conversation with them about who they are
- Reference specific things from their profile when relevant — strengths, blind spots, growth areas
- Keep responses short — 1-3 sentences max. This is a chat, not a lecture.
- Be warm and direct, not clinical
- React naturally: "yeah, that tracks", "makes sense", "huh, interesting"
- Ask them clarifying questions to understand what they want to explore
- If they ask "what does this mean?" — explain in plain language with a concrete example
- If they push back ("I don't think this is me") — engage seriously, don't just agree or disagree blindly
- If they want practical advice ("what should I do?") — give one concrete suggestion based on their specific profile

WHAT TO AVOID:
- Don't recite the whole profile back at them
- Don't lecture
- Don't speak in psychology jargon — translate it
- Don't be vague or hedge everything
- Don't say "as a coach I can't" — you can. You're a friend who knows the framework.

START WITH:
A short, warm greeting acknowledging their result. Something like "Hey, so you came out as ${typeCode}. What's on your mind about it?" Keep it under 2 sentences. Then let them lead.`;

    const greeting = `Hey, so you came out as ${typeCode}. What's on your mind about it?`;

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
      },
      onError: (msg) => {
        setError(msg);
      },
    });
  }, [testType, result, voiceAgent]);

  const endSession = useCallback(() => {
    if (transcript.length > 0) {
      logEvent("voice_coach_session", {
        testType,
        payload: { transcript, resultSnapshot: result },
      });
    }
    voiceAgent.stop();
    setOpen(false);
  }, [voiceAgent, transcript, testType, result]);

  const vizState: "idle" | "connecting" | "user" | "agent" | "ready" = !open
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

  const statusLabel =
    !voiceAgent.connected && !voiceAgent.connecting
      ? "Tap start to talk"
      : voiceAgent.connecting
      ? "Connecting…"
      : voiceAgent.userSpeaking
      ? "Listening to you"
      : voiceAgent.agentSpeaking
      ? "Coach is talking"
      : "Your turn";

  return (
    <>
      {/* Floating trigger button — industrial cut-btn */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="cut-btn fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40"
        aria-label="Open voice coach"
      >
        <IconMic size={15} />
        <span>Talk to Coach</span>
      </motion.button>

      {/* Modal overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-xl border border-[var(--surface-600)] bg-[#0c0c10] overflow-hidden"
              style={{
                boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255, 77, 28, 0.06)",
              }}
            >
              {/* Crosshair corners */}
              <div className="crosshair" style={{ top: "-6px", left: "-6px" }} />
              <div className="crosshair" style={{ top: "-6px", right: "-6px" }} />
              <div className="crosshair" style={{ bottom: "-6px", left: "-6px" }} />
              <div className="crosshair" style={{ bottom: "-6px", right: "-6px" }} />

              {/* Heat from below */}
              <div
                className="absolute inset-0 pointer-events-none opacity-70"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(255, 77, 28, 0.10) 0%, transparent 60%)",
                }}
              />

              {/* Header stamp */}
              <div className="relative px-5 sm:px-6 py-3 flex items-center justify-between border-b border-[var(--surface-700)] bg-[var(--surface-900)]/80">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 flex-shrink-0 ${
                      voiceAgent.connected ? "bg-[var(--ember)] ember-pulse" : "bg-[var(--surface-600)]"
                    }`}
                  />
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] sm:tracking-[0.25em] text-[var(--ember)] truncate">
                    Voice Coach · {TEST_LABELS[testType] ?? testType}
                  </p>
                </div>
                <button
                  onClick={endSession}
                  className="w-8 h-8 flex items-center justify-center border border-[var(--surface-700)] text-[var(--surface-400)] hover:text-[var(--foreground)] hover:border-[var(--ember)] transition-colors"
                  aria-label="Close"
                >
                  <IconX />
                </button>
              </div>

              {/* Visualizer + status */}
              <div className="relative px-6 pt-7 pb-3 flex flex-col items-center">
                <Visualizer state={vizState} />
                <motion.p
                  key={vizState}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.22em] text-[var(--foreground)]"
                >
                  {statusLabel}
                </motion.p>
              </div>

              {/* Live transcript */}
              <div className="relative mx-5 sm:mx-6 mb-4 border border-[var(--surface-700)] bg-[var(--surface-900)]/70 overflow-hidden">
                <div className="px-3 py-2 border-b border-[var(--surface-700)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 ${
                        voiceAgent.connected ? "bg-[var(--ember)]" : "bg-[var(--surface-600)]"
                      }`}
                    />
                    <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-400)]">
                      Transcript
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--surface-500)] tabular-nums">
                    {String(transcript.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto p-3 space-y-2">
                  {transcript.length === 0 ? (
                    <p className="text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.2em] text-[var(--surface-500)] text-center py-6">
                      {voiceAgent.connected ? "Waiting for the coach…" : "Tap Start, then talk naturally"}
                    </p>
                  ) : (
                    <AnimatePresence initial={false}>
                      {transcript.map((t, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[88%] px-3 py-2 text-[13px] leading-relaxed ${
                              t.role === "user"
                                ? "bg-[var(--ember-muted)] border-l-2 border-[var(--ember)] text-[var(--foreground)]"
                                : "bg-[var(--surface-800)] border-l-2 border-[var(--surface-600)] text-[var(--surface-200)]"
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
                <p className="mx-6 mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--ember-hot)] text-center">
                  {error}
                </p>
              )}

              {/* Action buttons */}
              <div className="relative px-5 sm:px-6 pb-6 flex justify-center gap-3">
                {!voiceAgent.connected && !voiceAgent.connecting ? (
                  <button onClick={startSession} className="cut-btn">
                    <IconMic size={14} />
                    <span>Start</span>
                  </button>
                ) : (
                  <button onClick={endSession} className="cut-btn cut-btn-ghost">
                    <IconStop size={12} />
                    <span>End Call</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
