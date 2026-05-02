"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useVoiceAgent } from "@/lib/hooks/useVoiceAgent";
import { logEvent } from "@/lib/logger";

interface ResultDictateProps {
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

/* ── Build a natural-sounding script from a result ──────────────────── */

function buildScript(testType: string, result: Record<string, unknown>): string {
  const parts: string[] = [];

  const typeCode =
    (result.typeCode as string) ||
    (result.alignment as string) ||
    (result.primary as string);
  const nickname = result.nickname as string | undefined;
  const confidence = typeof result.confidence === "number" ? result.confidence : null;
  const headline = result.headline as string | undefined;
  const summary = result.summary as string | undefined;
  const narrative = result.narrative as string | undefined;
  const strengths = Array.isArray(result.strengths) ? result.strengths : null;
  const challenges = Array.isArray(result.challenges) ? result.challenges : null;
  const growthPath = (result.growthPath as string) || (result.growth_path as string);
  const blindSpots = (result.blindSpots as string) || (result.blind_spots as string);

  const label = TEST_LABELS[testType] ?? testType;
  parts.push(`Here are your ${label} results.`);

  if (typeCode) {
    let line = `You came out as ${typeCode}`;
    if (nickname) line += `, ${nickname}`;
    if (confidence !== null) line += `, with about ${Math.round(confidence * 100)} percent confidence`;
    line += ".";
    parts.push(line);
  } else if (headline) {
    parts.push(headline + ".");
  }

  if (summary) parts.push(summary);
  if (narrative && narrative !== summary) parts.push(narrative);

  if (strengths && strengths.length) {
    parts.push(`Your strengths: ${strengths.slice(0, 5).join(". ")}.`);
  }
  if (challenges && challenges.length) {
    parts.push(`Where it gets harder: ${challenges.slice(0, 4).join(". ")}.`);
  }
  if (blindSpots) parts.push(`A blind spot to watch: ${blindSpots}`);
  if (growthPath) parts.push(`To grow from here: ${growthPath}`);

  parts.push("That's your result. Tap the chat or the voice coach below to dig deeper.");

  return parts.filter(Boolean).join(" ");
}

/* ── Icons ──────────────────────────────────────────────────────────── */

function IconPlay({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

function IconPause({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function IconStop({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function IconHeadphones({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */

export default function ResultDictate({ testType, result, accentColor = "var(--color-accent-amber)" }: ResultDictateProps) {
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const voiceAgent = useVoiceAgent();
  const startedRef = useRef(false);
  const finishedRef = useRef(false);

  // Auto-end the session shortly after the agent stops speaking
  useEffect(() => {
    if (!active || !startedRef.current) return;
    if (voiceAgent.agentSpeaking) {
      finishedRef.current = false;
      return;
    }
    if (finishedRef.current) return;
    // Agent stopped speaking — give a small buffer in case there's a pause
    const timer = setTimeout(() => {
      if (!voiceAgent.agentSpeaking && active) {
        finishedRef.current = true;
        voiceAgent.stop();
        setActive(false);
        setDone(true);
        startedRef.current = false;
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [voiceAgent.agentSpeaking, active, voiceAgent]);

  const startReading = useCallback(async () => {
    if (active) return;
    setDone(false);
    setActive(true);
    finishedRef.current = false;

    const script = buildScript(testType, result);

    const systemPrompt = `You are reading the user's personality test result aloud to them, like a narrator.

YOUR ONLY JOB:
- Read the text in your greeting clearly and naturally — slight warmth, like a friend.
- Then STOP. Do NOT add anything. Do NOT ask "any questions?" Do NOT continue talking.
- If the user speaks, do NOT respond. You are a one-way narrator.
- If the user asks something mid-read, finish reading and then go silent.

NEVER:
- Improvise or add commentary
- Ask if they want more
- Engage in conversation`;

    logEvent("result_dictate_started", { testType, payload: {} });

    await voiceAgent.start({
      systemPrompt,
      greeting: script,
      voice: "ivy",
      onTranscriptUser: () => { /* ignore */ },
      onTranscriptAgent: () => { /* don't track */ },
      onError: () => {
        setActive(false);
        startedRef.current = false;
      },
      onReady: () => {
        startedRef.current = true;
      },
    });
  }, [active, testType, result, voiceAgent]);

  const stopReading = useCallback(() => {
    voiceAgent.stop();
    setActive(false);
    startedRef.current = false;
    finishedRef.current = true;
  }, [voiceAgent]);

  const isPlaying = active && voiceAgent.connected;
  const isConnecting = active && voiceAgent.connecting;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="border border-surface-700/60 bg-surface-900/40 backdrop-blur-sm rounded-2xl p-4 mb-6 flex items-center gap-4"
    >
      <button
        onClick={isPlaying ? stopReading : startReading}
        disabled={isConnecting}
        className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-medium transition-all hover:brightness-110 disabled:opacity-50 ${
          isPlaying ? "bg-red-500" : ""
        }`}
        style={
          !isPlaying
            ? {
                background: `linear-gradient(135deg, ${accentColor}, var(--color-accent-purple))`,
                boxShadow: `0 6px 20px -6px ${accentColor}88`,
              }
            : { boxShadow: "0 6px 20px -6px rgba(239, 68, 68, 0.5)" }
        }
        aria-label={isPlaying ? "Stop reading" : "Listen to result"}
      >
        {isConnecting ? (
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        ) : isPlaying ? (
          <IconPause size={18} />
        ) : (
          <IconPlay size={18} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <IconHeadphones size={14} className="text-surface-400" />
          <p className="text-xs uppercase tracking-widest text-surface-400 font-semibold">
            Listen to your result
          </p>
        </div>
        <p className="text-sm text-surface-300">
          {isConnecting
            ? "Connecting…"
            : isPlaying
            ? voiceAgent.agentSpeaking
              ? "Reading your profile aloud…"
              : "Finishing up…"
            : done
            ? "Done. Tap to listen again."
            : "Tap play and we'll read it to you."}
        </p>
      </div>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="flex items-center gap-1 shrink-0"
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: accentColor }}
                animate={{
                  height: voiceAgent.agentSpeaking ? [4, 16, 4] : 4,
                }}
                transition={{
                  duration: 0.8,
                  repeat: voiceAgent.agentSpeaking ? Infinity : 0,
                  delay: i * 0.12,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
