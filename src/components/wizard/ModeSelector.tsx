"use client";

import { motion } from "motion/react";

export type TestMode = "classic" | "voice";

interface ModeSelectorProps {
  title: string;
  subtitle: string;
  onSelect: (mode: TestMode) => void;
  estimateClassic?: string;
  estimateVoice?: string;
  questionCount?: number;
  framework?: string;
}

function IconList(props: { size?: number }) {
  const s = props.size ?? 22;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="butt" strokeLinejoin="miter">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconWaveform(props: { size?: number }) {
  const s = props.size ?? 22;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="butt" strokeLinejoin="miter">
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
  estimateVoice = "~10 mins",
  questionCount,
  framework,
}: ModeSelectorProps) {
  return (
    <div className="relative min-h-[80vh] py-12 sm:py-16 px-5 sm:px-8 md:px-12">
      <div className="precision-grid" />
      <div
        className="absolute pointer-events-none opacity-70"
        style={{
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255, 77, 28, 0.10) 0%, transparent 60%)",
        }}
      />
      <div className="crosshair hidden sm:block" style={{ top: "32px", left: "32px" }} />
      <div className="crosshair hidden sm:block" style={{ top: "32px", right: "32px" }} />

      <div className="relative max-w-3xl mx-auto z-10">
        {/* Stamp */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]"
        >
          <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
          <span>{framework ?? "Forge Assessment"}</span>
          <span className="flex-1 h-px bg-[var(--surface-700)]" />
          <span className="text-[var(--surface-500)]">/ Mode Select</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-[14vw] sm:text-6xl md:text-7xl leading-[0.92] tracking-[-0.03em] text-[var(--foreground)] mb-5"
          style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144' }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[14px] sm:text-[15px] text-[var(--surface-300)] leading-relaxed max-w-xl mb-8"
        >
          {subtitle}
        </motion.p>

        {/* Stats */}
        {questionCount !== undefined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="flex flex-wrap gap-x-6 gap-y-2 mb-12 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--surface-400)]"
          >
            <span>
              <span className="text-[var(--ember)]">{String(questionCount).padStart(2, "0")}</span>{" "}
              Questions
            </span>
            <span className="text-[var(--surface-600)]">·</span>
            <span>No right answer</span>
            <span className="text-[var(--surface-600)]">·</span>
            <span>Be specific</span>
          </motion.div>
        )}

        {/* Mode picker label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)] mb-4"
        >
          / Pick how you take it
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[var(--surface-700)]">
          <ModeCard
            icon={<IconList />}
            index="A"
            label="Classic"
            title="Form with Mic"
            description="Answer one question at a time. Type or dictate. Fast and reliable."
            estimate={estimateClassic}
            delay={0.15}
            onClick={() => onSelect("classic")}
            position="left"
          />
          <ModeCard
            icon={<IconWaveform />}
            index="B"
            label="Voice"
            title="Hands-Free"
            description="Just talk. AI reads each question aloud and listens. No typing."
            estimate={estimateVoice}
            accent
            delay={0.22}
            onClick={() => onSelect("voice")}
            position="right"
          />
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  icon,
  index,
  label,
  title,
  description,
  estimate,
  accent,
  delay,
  onClick,
  position,
}: {
  icon: React.ReactNode;
  index: string;
  label: string;
  title: string;
  description: string;
  estimate: string;
  accent?: boolean;
  delay: number;
  onClick: () => void;
  position: "left" | "right";
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`group relative text-left p-6 sm:p-8 transition-colors cursor-pointer ${
        position === "left"
          ? "border-b md:border-b-0 md:border-r border-[var(--surface-700)]"
          : ""
      } ${
        accent
          ? "bg-[var(--ember-muted)] hover:bg-[var(--ember-muted)] hover:brightness-150"
          : "hover:bg-[var(--surface-900)]/60"
      }`}
    >
      {/* Ember top rule on hover */}
      <span
        className={`absolute top-0 left-0 right-0 h-[2px] bg-[var(--ember)] origin-left transition-transform duration-300 ${
          accent ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />

      <div className="flex items-start justify-between mb-6">
        <span
          className={`text-[10px] font-mono uppercase tracking-[0.25em] ${
            accent ? "text-[var(--ember)]" : "text-[var(--surface-500)] group-hover:text-[var(--ember)] transition-colors"
          }`}
        >
          {index} / {label}
        </span>
        <span
          className={`${
            accent ? "text-[var(--ember)]" : "text-[var(--surface-500)] group-hover:text-[var(--ember)] transition-colors"
          }`}
        >
          {icon}
        </span>
      </div>

      <h2
        className="font-display text-2xl sm:text-3xl tracking-[-0.02em] text-[var(--foreground)] mb-3"
        style={{ fontWeight: 500 }}
      >
        {title}
      </h2>
      <p className="text-[13px] sm:text-[14px] text-[var(--surface-300)] leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-dashed border-[var(--surface-700)]">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--surface-500)]">
          {estimate}
        </span>
        <span
          className={`text-lg transition-transform ${
            accent ? "text-[var(--ember)]" : "text-[var(--surface-500)] group-hover:text-[var(--ember)]"
          } group-hover:translate-x-1`}
        >
          →
        </span>
      </div>
    </motion.button>
  );
}
