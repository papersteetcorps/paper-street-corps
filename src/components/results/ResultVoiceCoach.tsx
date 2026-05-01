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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconStop({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

/* ── Visualizer ─────────────────────────────────────────────────────── */

function Visualizer({
  state,
  accentColor,
}: {
  state: "idle" | "connecting" | "user" | "agent" | "ready";
  accentColor: string;
}) {
  const isUser = state === "user";
  const isAgent = state === "agent";
  const isActive = isUser || isAgent;
  const color = isUser ? "rgb(248, 113, 113)" : isAgent ? accentColor : accentColor;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        animate={{
          opacity: isActive ? [0.4, 0.7, 0.4] : 0.2,
          scale: isActive ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 1.6, repeat: isActive ? Infinity : 0 }}
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 65%)` }}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: `${color}40` }}
          animate={
            isActive
              ? { scale: [0.85, 1.45, 0.85], opacity: [0, 0.5, 0] }
              : { scale: 1, opacity: 0 }
          }
          transition={{
            duration: 2.4,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.6,
            ease: "easeOut",
          }}
          initial={{ width: 150, height: 150 }}
        />
      ))}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 130,
          height: 130,
          border: `1px solid ${color}55`,
          background: `radial-gradient(circle at 50% 30%, ${color}22, transparent 70%)`,
        }}
        animate={{ scale: isActive ? [1, 1.03, 1] : 1 }}
        transition={{ duration: 1.6, repeat: isActive ? Infinity : 0 }}
      />
      <motion.div
        className="relative w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-sm"
        style={{
          background: isActive
            ? `radial-gradient(circle at 50% 30%, ${color}30, ${color}10)`
            : "linear-gradient(180deg, rgba(42,42,58,0.6), rgba(16,16,24,0.8))",
          boxShadow: isActive
            ? `0 0 40px ${color}55, inset 0 0 30px ${color}33`
            : "0 0 20px rgba(0,0,0,0.4)",
        }}
        animate={{ scale: state === "user" ? [1, 1.06, 1] : state === "agent" ? [1, 1.03, 1] : 1 }}
        transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
      >
        {isAgent ? <IconSpeaker size={32} className="text-foreground" /> : <IconMic size={32} className="text-foreground" />}
      </motion.div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */

export default function ResultVoiceCoach({ testType, result, accentColor = "var(--color-accent-amber)" }: ResultVoiceCoachProps) {
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const voiceAgent = useVoiceAgent();
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript]);

  // Stop session if modal closes
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
    // Log the full coach transcript before closing
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

  return (
    <>
      {/* Floating trigger button (bottom-left to avoid conflict with chat bubble at bottom-right) */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl border font-semibold text-sm transition-all"
        style={{
          background: `linear-gradient(135deg, ${accentColor}, var(--color-accent-purple))`,
          borderColor: accentColor,
          color: "white",
          boxShadow: `0 8px 32px -8px ${accentColor}88`,
        }}
        aria-label="Open voice coach"
      >
        <IconMic size={18} />
        <span>Talk to coach</span>
      </motion.button>

      {/* Modal overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              // Close only when clicking the backdrop, not the modal content
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-xl rounded-3xl overflow-hidden border border-surface-700 bg-surface-900 shadow-2xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(22,22,31,0.95) 0%, rgba(13,13,20,0.98) 100%)",
              }}
            >
              {/* Subtle aurora background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  className="absolute rounded-full blur-3xl"
                  style={{
                    width: 400,
                    height: 400,
                    top: "-20%",
                    left: "-10%",
                    background: `radial-gradient(circle, ${accentColor}33, transparent 65%)`,
                  }}
                  animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute rounded-full blur-3xl"
                  style={{
                    width: 350,
                    height: 350,
                    bottom: "-20%",
                    right: "-10%",
                    background: "radial-gradient(circle, rgba(168,85,247,0.18), transparent 65%)",
                  }}
                  animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
                  transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Header */}
              <div className="relative px-6 py-4 flex items-center justify-between border-b border-surface-800/60">
                <div>
                  <p className="text-xs uppercase tracking-widest text-surface-500 font-medium">Voice Coach</p>
                  <p className="text-sm font-semibold mt-0.5">Talk about your {TEST_LABELS[testType] ?? testType} result</p>
                </div>
                <button
                  onClick={endSession}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-surface-400 hover:text-foreground hover:bg-surface-800 transition-colors"
                  aria-label="Close"
                >
                  <IconX />
                </button>
              </div>

              {/* Visualizer + status */}
              <div className="relative px-6 pt-6 pb-3 flex flex-col items-center">
                <Visualizer state={vizState} accentColor={accentColor} />
                <motion.p
                  key={vizState}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-base font-medium"
                >
                  {!voiceAgent.connected && !voiceAgent.connecting
                    ? "Tap Start to talk"
                    : voiceAgent.connecting
                    ? "Connecting…"
                    : voiceAgent.userSpeaking
                    ? "Listening to you"
                    : voiceAgent.agentSpeaking
                    ? "Coach is talking"
                    : "Your turn"}
                </motion.p>
              </div>

              {/* Live transcript */}
              <div className="relative mx-6 mb-4 border border-surface-800 rounded-xl bg-surface-900/40 overflow-hidden">
                <div className="px-3 py-2 border-b border-surface-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        voiceAgent.connected ? "bg-emerald-400 animate-pulse" : "bg-surface-600"
                      }`}
                    />
                    <p className="text-[10px] uppercase tracking-widest text-surface-500 font-semibold">Transcript</p>
                  </div>
                  <span className="text-[10px] text-surface-600 tabular-nums">{transcript.length}</span>
                </div>
                <div className="max-h-56 overflow-y-auto p-3 space-y-2">
                  {transcript.length === 0 ? (
                    <p className="text-xs text-surface-500 text-center py-6">
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
                            className={`max-w-[85%] rounded-xl px-3 py-1.5 text-sm leading-relaxed ${
                              t.role === "user"
                                ? "bg-accent-amber/10 border border-accent-amber/20"
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
                <p className="mx-6 mb-3 text-xs text-red-400 text-center">{error}</p>
              )}

              {/* Action buttons */}
              <div className="relative px-6 pb-6 flex justify-center gap-2">
                {!voiceAgent.connected && !voiceAgent.connecting ? (
                  <button
                    onClick={startSession}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm flex items-center gap-2 transition-all hover:brightness-110"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, var(--color-accent-purple))`,
                      boxShadow: `0 4px 16px -4px ${accentColor}88`,
                    }}
                  >
                    <IconMic size={16} />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={endSession}
                    className="px-6 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-surface-200 font-medium text-sm hover:bg-surface-700 transition-colors flex items-center gap-2"
                  >
                    <IconStop size={14} />
                    End call
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
