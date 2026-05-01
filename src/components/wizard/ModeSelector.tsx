"use client";

import { motion } from "motion/react";
import Container from "@/components/ui/Container";

export type TestMode = "classic" | "chat" | "voice";

interface ModeSelectorProps {
  title: string;
  subtitle: string;
  onSelect: (mode: TestMode) => void;
  estimateClassic?: string;
  estimateChat?: string;
  estimateVoice?: string;
  questionCount?: number;
  framework?: string;
}

function IconList(props: { className?: string; size?: number }) {
  const s = props.size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-surface-400">
      <span className="text-surface-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function Divider() {
  return <span className="w-1 h-1 rounded-full bg-surface-700" />;
}

function IconChat(props: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconWaveform(props: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <line x1="2" y1="12" x2="2.01" y2="12" />
      <line x1="6" y1="9" x2="6" y2="15" />
      <line x1="10" y1="6" x2="10" y2="18" />
      <line x1="14" y1="3" x2="14" y2="21" />
      <line x1="18" y1="6" x2="18" y2="18" />
      <line x1="22" y1="9" x2="22.01" y2="15" />
    </svg>
  );
}

export default function ModeSelector({
  title,
  subtitle,
  onSelect,
  estimateClassic = "~5 mins",
  estimateChat = "~10 mins",
  estimateVoice = "~10 mins",
  questionCount,
  framework,
}: ModeSelectorProps) {
  return (
    <Container className="py-12 space-y-10">
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        {framework && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-surface-500 uppercase tracking-widest font-medium"
          >
            {framework}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-surface-300 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* Stats line */}
        {questionCount !== undefined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="flex items-center justify-center gap-3 pt-2"
          >
            <Stat icon={<IconList size={14} />} label={`${questionCount} questions`} />
            <Divider />
            <Stat icon={<IconClock />} label="No right answer" />
            <Divider />
            <Stat icon={<IconHeart />} label="Be honest" />
          </motion.div>
        )}
      </header>

      {/* Mode picker label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-center"
      >
        <p className="text-xs text-surface-500 uppercase tracking-widest font-medium">
          Pick how you want to take it
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <ModeCard
          icon={<IconList />}
          label="Classic"
          title="Quick form"
          description="Answer one question at a time on a clean form. Fastest if you know what you want to say."
          estimate={estimateClassic}
          delay={0.15}
          onClick={() => onSelect("classic")}
        />
        <ModeCard
          icon={<IconChat />}
          label="Chat"
          title="Type or dictate"
          description="A chat conversation. Type your answers or tap the mic to dictate. AI follows up if needed."
          estimate={estimateChat}
          delay={0.22}
          onClick={() => onSelect("chat")}
        />
        <ModeCard
          icon={<IconWaveform />}
          label="Voice"
          title="Hands-free"
          description="Just talk. AI reads each question aloud and listens. No typing at all."
          estimate={estimateVoice}
          accent
          delay={0.29}
          onClick={() => onSelect("voice")}
        />
      </div>
    </Container>
  );
}

function ModeCard({
  icon,
  label,
  title,
  description,
  estimate,
  accent,
  delay,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  estimate: string;
  accent?: boolean;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={`text-left p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
        accent
          ? "border-accent-amber/40 bg-accent-amber/5 hover:border-accent-amber/60 hover:bg-accent-amber/10"
          : "border-surface-700 bg-surface-800/50 hover:border-surface-600 hover:bg-surface-800/80"
      }`}
    >
      {/* Subtle gradient glow on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
          accent ? "bg-gradient-to-br from-accent-amber/10 via-transparent to-accent-purple/10" : "bg-gradient-to-br from-surface-700/30 to-transparent"
        }`}
      />

      <div className="relative flex items-start justify-between mb-5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            accent
              ? "bg-accent-amber/15 text-accent-amber"
              : "bg-surface-700/60 text-surface-300"
          }`}
        >
          {icon}
        </div>
        <span
          className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${
            accent
              ? "bg-accent-amber/15 text-accent-amber"
              : "bg-surface-700 text-surface-400"
          }`}
        >
          {label}
        </span>
      </div>
      <h2 className="relative text-xl font-semibold mb-2">{title}</h2>
      <p className="relative text-sm text-surface-400 leading-relaxed mb-5">{description}</p>
      <div className="relative flex items-center justify-between">
        <p className="text-xs text-surface-500">{estimate}</p>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 group-hover:translate-x-1 ${accent ? "text-accent-amber" : "text-surface-500"}`}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </motion.button>
  );
}
