"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { tests } from "@/data/offerings";
import CountUp from "@/components/motion/CountUp";
import WordsReveal from "@/components/motion/WordsReveal";

const RESULT_PREVIEW = {
  type: "INTJ",
  nickname: "The Architect",
  oneLiner: "You redesign the model, never your conviction.",
  strengths: ["Strategic thinking", "Independent analysis", "Long-range vision"],
  challenges: ["Emotional blind spots", "Impatience with process", "Over-reliance on logic"],
  howYouThink:
    "You process the world through internal models. When something doesn't fit, you don't adjust your expectations. You rebuild the framework. Most people experience this as stubbornness. You experience it as integrity.",
  whatPeopleGetWrong:
    "They think you don't care. You do. You just don't perform it. Your loyalty shows up in problem-solving, not in words. When you fix something for someone without being asked, that's your version of love.",
  burnoutCycle:
    "You burn out silently. First you over-optimize. Then you stop sleeping properly. Then you lose interest in the thing you were obsessed with last week. By the time anyone notices, you've already mentally left.",
  crossFramework: [
    { framework: "Enneagram", result: "5w6" },
    { framework: "Temperament", result: "Melancholic" },
    { framework: "Moral Align.", result: "Lawful N." },
    { framework: "Energy", result: "SbjA" },
  ],
};

const enterEase: [number, number, number, number] = [0.2, 0.85, 0.3, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

export default function HomePage() {
  return (
    <div className="relative">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* HERO — editorial magazine cover, typographic                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col overflow-hidden border-b border-[var(--surface-700)]">
        <div className="precision-grid" />

        {/* Ambient heat: large soft ember radial behind the type */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "10%",
            right: "-20%",
            width: "85vw",
            height: "85vw",
            maxWidth: "1100px",
            maxHeight: "1100px",
            background:
              "radial-gradient(circle at center, rgba(255, 77, 28, 0.14) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        {/* Top stamp — full width thin bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center justify-between gap-3 px-5 sm:px-8 md:px-12 py-3 border-b border-[var(--surface-700)] text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] sm:tracking-[0.28em]"
        >
          <span className="flex items-center gap-2 text-[var(--ember)] min-w-0">
            <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse flex-shrink-0" />
            <span className="truncate">Live · v0.6 / Specimen No. 0001</span>
          </span>
          <span className="hidden sm:inline text-[var(--surface-500)] flex-shrink-0">
            Vol. 01 — 2026
          </span>
        </motion.div>

        {/* Main editorial grid */}
        <div className="relative z-10 flex-1 grid grid-cols-12 px-5 sm:px-8 md:px-12 py-10 sm:py-14 md:py-16 gap-y-10 md:gap-x-8">
          {/* LEFT — typographic mass */}
          <div className="col-span-12 md:col-span-8 flex flex-col justify-center">
            <h1
              className="font-display leading-[0.84] tracking-[-0.045em] text-[var(--foreground)]"
              style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144, "SOFT" 0' }}
            >
              {/* Line 1 — "Figure" solid */}
              <motion.span
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.55, delay: 0.05, ease: enterEase }}
                className="block text-[16vw] sm:text-[14vw] md:text-[11vw] lg:text-[10rem]"
              >
                Figure
              </motion.span>

              {/* Line 2 — "yourself" outlined (text-stroke trick) */}
              <motion.span
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.55, delay: 0.15, ease: enterEase }}
                className="block text-[16vw] sm:text-[14vw] md:text-[11vw] lg:text-[10rem] italic font-light"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(245, 245, 247, 0.85)",
                  paintOrder: "stroke fill",
                  fontVariationSettings: '"opsz" 144, "SOFT" 100',
                }}
              >
                yourself
              </motion.span>

              {/* Line 3 — "out." ember italic, the punch */}
              <motion.span
                initial={{ opacity: 0, y: 24, filter: "blur(8px)", scale: 0.98 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                transition={{ duration: 0.65, delay: 0.25, ease: enterEase }}
                className="block text-[20vw] sm:text-[17vw] md:text-[14vw] lg:text-[13rem] italic font-light text-[var(--ember)]"
                style={{
                  fontVariationSettings: '"opsz" 144, "SOFT" 100',
                  textShadow:
                    "0 0 50px rgba(255, 77, 28, 0.45), 0 0 100px rgba(255, 77, 28, 0.2)",
                }}
              >
                out
                <motion.span
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7, ease: [0.2, 1.4, 0.4, 1] }}
                  className="inline-block"
                >
                  .
                </motion.span>
              </motion.span>
            </h1>

            {/* CTAs anchor directly under the headline */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.55 }}
              className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mt-10 sm:mt-12"
            >
              <Link href="/cjte" className="cut-btn">
                <span>Open the Assessment</span>
                <span>→</span>
              </Link>
              <Link href="#how" className="cut-btn cut-btn-ghost">
                <span>How it works</span>
              </Link>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--surface-500)] sm:ml-2">
                ~5 min · no login · free
              </span>
            </motion.div>
          </div>

          {/* RIGHT — live specimen card (the product showing itself) */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: enterEase }}
            className="col-span-12 md:col-span-4 flex flex-col justify-center gap-5 md:pl-6 md:border-l md:border-[var(--surface-700)]"
          >
            <div className="relative border border-[var(--surface-600)] bg-[var(--surface-900)]/70 backdrop-blur-sm">
              {/* Corner crosshairs */}
              <span className="absolute -top-px -left-px w-2.5 h-2.5 border-l border-t border-[var(--ember)]" />
              <span className="absolute -top-px -right-px w-2.5 h-2.5 border-r border-t border-[var(--ember)]" />
              <span className="absolute -bottom-px -left-px w-2.5 h-2.5 border-l border-b border-[var(--ember)]" />
              <span className="absolute -bottom-px -right-px w-2.5 h-2.5 border-r border-b border-[var(--ember)]" />

              {/* Card header */}
              <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 border-b border-[var(--surface-700)] bg-[var(--surface-900)]/80">
                <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
                  <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
                  <span>Specimen / Live</span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--surface-500)]">
                  No. 0001
                </span>
              </div>

              {/* Type glyph + nickname */}
              <div className="p-5 sm:p-6 border-b border-[var(--surface-700)]">
                <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--surface-500)] mb-2">
                  Primary type · Jungian
                </p>
                <motion.p
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.55, ease: enterEase }}
                  className="font-display text-[72px] sm:text-[88px] leading-[0.82] tracking-[-0.05em] text-[var(--ember)]"
                  style={{
                    fontWeight: 500,
                    fontVariationSettings: '"opsz" 144',
                    textShadow: "0 0 40px rgba(255, 77, 28, 0.35)",
                  }}
                >
                  {RESULT_PREVIEW.type}
                </motion.p>
                <p
                  className="font-display text-xl sm:text-2xl italic font-light mt-2 text-[var(--foreground)]"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                >
                  {RESULT_PREVIEW.nickname}
                </p>
                <p className="text-[12px] text-[var(--surface-400)] mt-2 italic leading-[1.55]">
                  &ldquo;{RESULT_PREVIEW.oneLiner}&rdquo;
                </p>
              </div>

              {/* Cross-framework grid — the triangulation proof */}
              <div className="grid grid-cols-2">
                {RESULT_PREVIEW.crossFramework.map((cf, i) => (
                  <motion.div
                    key={cf.framework}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.75 + i * 0.06 }}
                    className={`px-4 py-3 ${
                      i % 2 === 0 ? "border-r border-[var(--surface-700)]" : ""
                    } ${i < 2 ? "border-b border-[var(--surface-700)]" : ""}`}
                  >
                    <p className="text-[8px] font-mono uppercase tracking-[0.22em] text-[var(--surface-500)]">
                      {cf.framework}
                    </p>
                    <p
                      className="font-display text-[15px] sm:text-base mt-0.5 text-[var(--foreground)]"
                      style={{ fontWeight: 500 }}
                    >
                      {cf.result}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Caption under the card */}
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--surface-500)] flex items-center gap-2">
              <span className="w-1 h-1 bg-[var(--ember)]" />
              <span>Sample reading · yours goes deeper</span>
            </p>
          </motion.aside>
        </div>

        {/* Bottom band — single thin line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="relative z-10 border-t border-[var(--surface-700)] px-5 sm:px-8 md:px-12 py-3.5 flex items-center justify-between gap-4 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)]"
        >
          <span className="truncate">
            Six frameworks · Voice or text · Open-ended
          </span>
          <motion.span
            className="flex items-center gap-2 flex-shrink-0"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>Scroll</span>
            <span className="text-[var(--ember)]">↓</span>
          </motion.span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 01 — PREMISE / DIFFERENTIATOR                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 border-b border-[var(--surface-700)]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: enterEase }}
              className="col-span-12 md:col-span-3"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--ember)]">
                01 / Premise
              </p>
            </motion.div>
            <div className="col-span-12 md:col-span-9">
              <h2
                className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.03em] text-[var(--foreground)]"
                style={{ fontWeight: 500 }}
              >
                <WordsReveal text="Your life is the data." />
                <br />
                <span className="text-[var(--surface-400)] italic font-light">
                  <WordsReveal text="Not your guesses." delay={0.25} />
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border border-[var(--surface-700)]">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: enterEase }}
              className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[var(--surface-700)] bg-[var(--surface-900)]/40"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)]">
                  A · Traditional Test
                </span>
                <span className="flex-1 h-px bg-[var(--surface-700)]" />
                <span className="text-[10px] font-mono text-[var(--surface-600)]">[obsolete]</span>
              </div>

              <div className="relative inline-block mb-5">
                <p className="text-[15px] text-[var(--surface-300)] italic">
                  &ldquo;I prefer being alone to being in groups.&rdquo;
                </p>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.7, delay: 0.5, ease: enterEase }}
                  className="absolute left-0 right-0 top-1/2 h-px bg-[var(--surface-500)] origin-left"
                />
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.7 } },
                }}
                className="flex flex-wrap gap-2 mb-8"
              >
                {["Strongly agree", "Agree", "Neutral", "Disagree"].map((opt) => (
                  <motion.span
                    key={opt}
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono border border-[var(--surface-700)] text-[var(--surface-500)]"
                  >
                    {opt}
                  </motion.span>
                ))}
              </motion.div>

              <div className="pt-4 border-t border-dashed border-[var(--surface-700)]">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)] mb-2">
                  Output
                </p>
                <p className="text-[var(--surface-400)] text-sm">
                  &ldquo;You are an introvert.&rdquo;
                </p>
                <p className="text-[var(--surface-600)] text-[11px] mt-1 font-mono">
                  basis: what you chose to claim
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: enterEase, delay: 0.15 }}
              className="relative p-8 md:p-10 bg-[var(--surface-800)]/30"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--ember)] origin-left"
              />

              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
                  B · The Forge Method
                </span>
                <span className="flex-1 h-px bg-[var(--ember)]/30" />
                <span className="text-[10px] font-mono text-[var(--ember)]">[live]</span>
              </div>

              <p className="text-[15px] text-[var(--foreground)] mb-5 font-medium">
                &ldquo;Tell me about a time you burned out. What caused it?
                What were the warning signs?&rdquo;
              </p>

              <div className="border border-[var(--surface-700)] bg-[var(--surface-900)]/70 p-4 mb-8">
                <p className="text-[13px] text-[var(--surface-300)] leading-relaxed">
                  I was working 14-hour days for three months straight. I stopped eating
                  properly. The sign was when I couldn&apos;t remember the last time I
                  laughed...
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed border-[var(--surface-700)] text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--surface-500)]">
                  <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
                  <span>Voice input · live transcription</span>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-[var(--ember)]/30">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)] mb-2">
                  Output
                </p>
                <p className="text-[var(--foreground)] text-sm">
                  Burnout pattern maps to{" "}
                  <strong className="text-[var(--ember)]">SbjA energy depletion</strong>;
                  cross-loaded with Type 5w6 withdrawal.
                </p>
                <p className="text-[var(--surface-400)] text-[11px] mt-1 font-mono">
                  basis: events that actually occurred
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* DATA STRIP — count up                                            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[var(--surface-700)] bg-[var(--surface-900)]/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0">
          {[
            { value: 6, label: "Frameworks", pad: 2 },
            { value: 16, label: "Types Mapped", suffix: "+" },
            { value: 5, label: "Min To Finish", suffix: "" },
            { value: 0, label: "Trackers", pad: 1 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: i * 0.1, ease: enterEase }}
              className={`flex items-baseline gap-2 sm:gap-3 ${
                i > 0 ? "md:border-l md:border-[var(--surface-700)] md:pl-6" : ""
              } ${i === 1 || i === 3 ? "border-l border-[var(--surface-700)] pl-4 md:pl-6" : ""}`}
            >
              <span
                className="font-display text-4xl sm:text-5xl text-[var(--foreground)]"
                style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144' }}
              >
                <CountUp
                  to={stat.value}
                  pad={stat.pad}
                  suffix={stat.suffix ?? ""}
                  duration={1.6}
                />
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] sm:tracking-[0.25em] text-[var(--surface-400)]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 02 — SPECIMEN / Identity Plate reveal                            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 border-b border-[var(--surface-700)]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: enterEase }}
              className="col-span-12 md:col-span-3"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--ember)]">
                02 / Specimen
              </p>
            </motion.div>
            <div className="col-span-12 md:col-span-9">
              <h2
                className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.03em]"
                style={{ fontWeight: 500 }}
              >
                <WordsReveal text="A sample report." />
                <br />
                <span className="text-[var(--surface-400)] italic font-light">
                  <WordsReveal text="Yours goes deeper." delay={0.25} />
                </span>
              </h2>
            </div>
          </div>

          <div className="relative">
            <div className="crosshair" style={{ top: "-6px", left: "-6px" }} />
            <div className="crosshair" style={{ top: "-6px", right: "-6px" }} />
            <div className="crosshair" style={{ bottom: "-6px", left: "-6px" }} />
            <div className="crosshair" style={{ bottom: "-6px", right: "-6px" }} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: enterEase }}
              className="border border-[var(--surface-600)] bg-[#0c0c10]"
            >
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, delay: 0.2, ease: enterEase }}
                className="flex items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 border-b border-[var(--surface-700)] text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[var(--surface-400)] bg-[var(--surface-900)]/80"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 bg-[var(--ember)] flex-shrink-0" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Forge </span>Identity Plate · No. 0001
                  </span>
                </span>
                <span className="flex-shrink-0">
                  <span className="hidden sm:inline">Issued · </span>
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                </span>
              </motion.div>

              <div className="grid grid-cols-12 border-b border-[var(--surface-700)]">
                <div className="col-span-12 md:col-span-7 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[var(--surface-700)]">
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={VIEWPORT}
                    transition={{ delay: 0.3 }}
                    className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)] mb-3"
                  >
                    Primary Type · Jungian
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
                    whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 1.1, delay: 0.5, ease: enterEase }}
                    className="font-display text-[26vw] md:text-[12rem] leading-[0.82] tracking-[-0.05em] text-[var(--ember)]"
                    style={{
                      fontWeight: 500,
                      fontVariationSettings: '"opsz" 144, "SOFT" 0',
                      textShadow: "0 0 60px rgba(255, 77, 28, 0.45), 0 0 120px rgba(255, 77, 28, 0.2)",
                    }}
                  >
                    {RESULT_PREVIEW.type}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="font-display text-3xl md:text-4xl mt-4 italic font-light text-[var(--foreground)]"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                  >
                    {RESULT_PREVIEW.nickname}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.5, delay: 1.4 }}
                    className="text-[14px] text-[var(--surface-400)] mt-3 italic max-w-md"
                  >
                    &ldquo;{RESULT_PREVIEW.oneLiner}&rdquo;
                  </motion.p>
                </div>

                <div className="col-span-12 md:col-span-5 grid grid-cols-2 grid-rows-2">
                  {RESULT_PREVIEW.crossFramework.map((cf, i) => (
                    <motion.div
                      key={cf.framework}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={VIEWPORT}
                      transition={{ duration: 0.45, delay: 0.7 + i * 0.12, ease: enterEase }}
                      className={`p-5 md:p-6 ${
                        i % 2 === 0 ? "border-r border-[var(--surface-700)]" : ""
                      } ${i < 2 ? "border-b border-[var(--surface-700)]" : ""}`}
                    >
                      <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)]">
                        {cf.framework}
                      </p>
                      <p
                        className="font-display text-2xl md:text-3xl mt-2 text-[var(--foreground)]"
                        style={{ fontWeight: 500 }}
                      >
                        {cf.result}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <PlateRow label={<>§ How<br className="hidden md:block" /><span className="md:hidden"> </span>you think</>}>
                <p
                  className="font-display text-lg sm:text-xl md:text-2xl leading-[1.45] text-[var(--foreground)] tracking-[-0.01em]"
                  style={{ fontWeight: 400 }}
                >
                  <span
                    className="float-left font-display text-5xl sm:text-6xl leading-[0.85] mr-2 sm:mr-3 text-[var(--ember)] italic"
                    style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                  >
                    Y
                  </span>
                  {RESULT_PREVIEW.howYouThink.slice(1)}
                </p>
              </PlateRow>

              <PlateRow label={<>§ What<br className="hidden md:block" /><span className="md:hidden"> </span>people miss</>}>
                <p className="text-[15px] text-[var(--surface-200)] leading-relaxed">
                  {RESULT_PREVIEW.whatPeopleGetWrong}
                </p>
              </PlateRow>

              <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[var(--surface-700)]">
                <PlateHalf label="+ Built For" emberLabel>
                  <ul className="divide-y divide-dashed divide-[var(--surface-700)]">
                    {RESULT_PREVIEW.strengths.map((s, i) => (
                      <motion.li
                        key={s}
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={VIEWPORT}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-baseline gap-3 py-2.5"
                      >
                        <span className="text-[10px] font-mono text-[var(--surface-500)] w-5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[15px] text-[var(--foreground)]">{s}</span>
                      </motion.li>
                    ))}
                  </ul>
                </PlateHalf>
                <PlateHalf label="− Trips You Up" border>
                  <ul className="divide-y divide-dashed divide-[var(--surface-700)]">
                    {RESULT_PREVIEW.challenges.map((c, i) => (
                      <motion.li
                        key={c}
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={VIEWPORT}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-baseline gap-3 py-2.5"
                      >
                        <span className="text-[10px] font-mono text-[var(--surface-500)] w-5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[15px] text-[var(--surface-300)]">{c}</span>
                      </motion.li>
                    ))}
                  </ul>
                </PlateHalf>
              </div>

              <PlateRow label={<>§ Burnout<br className="hidden md:block" /><span className="md:hidden"> </span>cycle</>}>
                <p className="text-[15px] text-[var(--surface-200)] leading-relaxed italic">
                  {RESULT_PREVIEW.burnoutCycle}
                </p>
              </PlateRow>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 bg-[var(--surface-900)]/60">
                <p className="text-[12px] font-mono uppercase tracking-[0.2em] text-[var(--surface-400)]">
                  This is a sample. Yours goes deeper.
                </p>
                <Link href="/cjte" className="cut-btn">
                  <span>Generate My Report</span>
                  <span>→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 03 — INVENTORY                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 border-b border-[var(--surface-700)]" id="assessments">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: enterEase }}
              className="col-span-12 md:col-span-3"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--ember)]">
                03 / Inventory
              </p>
            </motion.div>
            <div className="col-span-12 md:col-span-9">
              <h2
                className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.03em]"
                style={{ fontWeight: 500 }}
              >
                <WordsReveal text="Six angles." />{" "}
                <span className="italic font-light text-[var(--ember)]">
                  <WordsReveal text="One you." delay={0.3} />
                </span>
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-5 text-[15px] text-[var(--surface-300)] max-w-xl leading-relaxed"
              >
                Each framework reads personality differently. Take one to start, or all six
                to triangulate. They sharpen each other.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
            }}
            className="border-y border-[var(--surface-700)] divide-y divide-[var(--surface-700)]"
          >
            {tests.map((test, i) => (
              <motion.div
                key={test.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: enterEase } },
                }}
              >
                <Link
                  href={test.href}
                  className="group flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center px-4 sm:px-5 md:px-6 py-5 md:py-7 hover:bg-[var(--surface-900)]/60 transition-colors"
                >
                  <div className="flex items-baseline justify-between md:contents">
                    <div className="flex items-baseline gap-3 md:col-span-5 md:gap-4">
                      <span className="text-[11px] font-mono text-[var(--surface-500)] group-hover:text-[var(--ember)] transition-colors md:col-span-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="font-display text-xl sm:text-2xl md:text-3xl tracking-[-0.02em] text-[var(--foreground)] group-hover:text-[var(--ember)] transition-colors md:col-span-4"
                        style={{ fontWeight: 500 }}
                      >
                        {test.title}
                      </h3>
                    </div>
                    <span className="md:hidden text-[var(--surface-500)] group-hover:text-[var(--ember)] transition-colors">
                      →
                    </span>
                  </div>
                  <p className="mt-2 md:mt-0 md:col-span-6 text-[13px] sm:text-[14px] text-[var(--surface-300)] leading-relaxed md:pl-0 pl-9">
                    {test.description}
                  </p>
                  <span className="hidden md:flex md:col-span-1 md:justify-end text-[var(--surface-500)] group-hover:text-[var(--ember)] group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 04 — METHOD                                                      */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-32 border-b border-[var(--surface-700)] bg-[var(--surface-900)]/30"
        id="how"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6 }}
              className="col-span-12 md:col-span-3"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--ember)]">
                04 / Method
              </p>
            </motion.div>
            <div className="col-span-12 md:col-span-9">
              <h2
                className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.03em]"
                style={{ fontWeight: 500 }}
              >
                <WordsReveal text="Simple. Honest." />{" "}
                <span className="italic font-light text-[var(--ember)]">
                  <WordsReveal text="Useful." delay={0.3} />
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[var(--surface-700)]">
            {[
              {
                step: "01",
                title: "Tell your story",
                body: "Open-ended questions about your real life. Experiences, relationships, reactions, the things that drive you.",
              },
              {
                step: "02",
                title: "Patterns read",
                body: "Your answers analyzed across six psychological frameworks using peer-reviewed research, not pop quizzes.",
              },
              {
                step: "03",
                title: "See who you are",
                body: "Your type, strengths, blind spots, and what to do next. Based on your life, not your guesses.",
              },
            ].map(({ step, title, body }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, delay: i * 0.15, ease: enterEase }}
                className={`p-8 md:p-10 space-y-4 ${
                  i < 2 ? "border-b md:border-b-0 md:border-r border-[var(--surface-700)]" : ""
                }`}
              >
                <motion.p
                  initial={{ scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={VIEWPORT}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.15 + 0.15,
                    ease: [0.2, 1.3, 0.4, 1],
                  }}
                  className="font-display text-7xl md:text-8xl leading-none text-[var(--ember)] origin-left"
                  style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144' }}
                >
                  {step}
                </motion.p>
                <h3
                  className="font-display text-2xl tracking-[-0.02em] text-[var(--foreground)]"
                  style={{ fontWeight: 500 }}
                >
                  {title}
                </h3>
                <p className="text-[14px] text-[var(--surface-300)] leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 05 — FOR TEAMS                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 border-b border-[var(--surface-700)]" id="for-teams">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6 }}
              className="col-span-12 md:col-span-3"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--ember)]">
                05 / For Teams
              </p>
            </motion.div>
            <div className="col-span-12 md:col-span-9">
              <h2
                className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.03em]"
                style={{ fontWeight: 500 }}
              >
                <WordsReveal text="Your team has patterns." />
                <br />
                <span className="text-[var(--ember)] italic font-light">
                  <WordsReveal text="Forge makes them visible." delay={0.3} />
                </span>
              </h2>
            </div>
          </div>

          <div className="border border-[var(--surface-700)] bg-[var(--surface-900)]/30">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="grid grid-cols-1 md:grid-cols-3 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-[var(--surface-700)]"
            >
              {[
                {
                  title: "Team profiles",
                  desc: "Each member's type, strengths, blind spots, side by side.",
                },
                {
                  title: "Compatibility maps",
                  desc: "Where people align and where they clash — before it happens.",
                },
                {
                  title: "Growth playbooks",
                  desc: "Actionable steps for each person, specific to how they work.",
                },
              ].map((b, i) => (
                <motion.div
                  key={b.title}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: enterEase } },
                  }}
                  className="p-7 space-y-3"
                >
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
                    {String(i + 1).padStart(2, "0")} ·
                  </p>
                  <p className="font-display text-xl text-[var(--foreground)]" style={{ fontWeight: 500 }}>
                    {b.title}
                  </p>
                  <p className="text-[13px] text-[var(--surface-300)] leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </motion.div>
            <div className="border-t border-[var(--surface-700)] p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-[13px] text-[var(--surface-300)] max-w-md">
                Same frameworks, built for the workplace. No facilitator required.
              </p>
              <Link href="mailto:admin@forge.com" className="cut-btn cut-btn-ghost">
                <span>Join the Waitlist</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 06 — BEGIN / final CTA                                           */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255, 77, 28, 0.12) 0%, transparent 60%)",
          }}
        />
        <div className="precision-grid" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 md:px-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--ember)] mb-5 sm:mb-6"
          >
            06 / Begin
          </motion.p>
          <h2
            className="font-display text-[13vw] sm:text-[10vw] md:text-9xl leading-[0.88] tracking-[-0.04em]"
            style={{ fontWeight: 500, fontVariationSettings: '"opsz" 144' }}
          >
            <WordsReveal text="Ready to see the" />
            <br />
            <span
              className="italic font-light text-[var(--ember)]"
              style={{
                fontVariationSettings: '"opsz" 144, "SOFT" 100',
                textShadow: "0 0 50px rgba(255, 77, 28, 0.4)",
              }}
            >
              <WordsReveal text="real you?" delay={0.3} />
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 sm:mt-8 text-[11px] sm:text-[13px] font-mono uppercase tracking-[0.2em] text-[var(--surface-400)]"
          >
            5 minutes · open-ended · based on your actual life
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3 sm:gap-4"
          >
            <Link href="/cjte" className="cut-btn">
              <span>Start the Assessment</span>
              <span>→</span>
            </Link>
            <Link href="mailto:admin@forge.com" className="cut-btn cut-btn-ghost">
              <span>Join the Waitlist</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Identity-Plate row helpers (kept inline to avoid extra files)
   ──────────────────────────────────────────────────────────────────────── */

function PlateRow({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, ease: enterEase }}
      className="grid grid-cols-12 border-b border-[var(--surface-700)]"
    >
      <div className="col-span-12 md:col-span-2 p-6 md:p-8 md:border-r border-[var(--surface-700)]">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ember)]">
          {label}
        </p>
      </div>
      <div className="col-span-12 md:col-span-10 p-6 md:p-8">{children}</div>
    </motion.div>
  );
}

function PlateHalf({
  label,
  emberLabel,
  border,
  children,
}: {
  label: string;
  emberLabel?: boolean;
  border?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, ease: enterEase }}
      className={`p-6 md:p-8 ${border ? "border-l-0 md:border-l border-[var(--surface-700)]" : ""}`}
    >
      <p
        className={`text-[10px] font-mono uppercase tracking-[0.25em] mb-4 ${
          emberLabel ? "text-[var(--ember)]" : "text-[var(--surface-400)]"
        }`}
      >
        {label}
      </p>
      {children}
    </motion.div>
  );
}
