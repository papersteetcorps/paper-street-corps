"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { tests, theoryCards } from "@/data/offerings";
import { FLAGS } from "@/lib/flags";
import TestCard from "@/components/cards/TestCard";
import TheoryCard from "@/components/cards/TheoryCard";
import Container from "@/components/ui/Container";

const STATS = [
  { value: "6", label: "Frameworks" },
  { value: "16", label: "Personality types" },
  { value: "0", label: "Data collected" },
  { value: "∞", label: "Self-understanding" },
];

const PRINCIPLES = [
  {
    icon: "⬡",
    title: "Research-grounded",
    body: "Every scoring algorithm derives from published psychological literature. No pop-psychology shortcuts. Methods are documented and transparent.",
  },
  {
    icon: "◈",
    title: "No data collection",
    body: "Your responses exist only in your browser session. No accounts required. No tracking pixels. No analytics on your answers.",
  },
  {
    icon: "✦",
    title: "Multi-framework",
    body: "Six distinct typological frameworks — MBTI, Socionics KIME, Potentiology PBCE, Temperaments, Moral Alignment, and Enneagram.",
  },
  {
    icon: "◉",
    title: "AI-interpreted",
    body: "AI generates contextual questions and interprets your results using the full research corpus as ground truth — not generic personality descriptions.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-28 pb-16">
      <Container>
        {/* Hero */}
        <section className="pt-8 max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs text-surface-500 uppercase tracking-widest mb-4">Paper Street Corps</p>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              Know what you are.
              <br />
              <span className="text-surface-400">Not what you wish to be.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-lg text-surface-400 leading-relaxed max-w-2xl"
          >
            Six rigorous psychological frameworks. Open-ended qualitative analysis.
            AI interpretation backed by full research corpora. No flattery. No data collection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/cjte"
              className="bg-accent-blue hover:bg-accent-blue/90 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Take MBTI &rarr;
            </Link>
            <Link
              href="/potentiology"
              className="bg-surface-800 hover:bg-surface-700 text-surface-200 font-medium px-6 py-3 rounded-xl transition-colors text-sm border border-surface-700"
            >
              Explore Potentiology
            </Link>
          </motion.div>
        </section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="bg-surface-900 border border-surface-800 rounded-2xl p-5"
            >
              <p className="text-3xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-surface-500 mt-1">{label}</p>
            </motion.div>
          ))}
        </motion.section>
      </Container>

      {/* Tests */}
      <Container>
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Assessments</p>
            <h2 className="text-3xl font-bold">Six frameworks, one truth.</h2>
            <p className="mt-2 text-surface-400 max-w-2xl text-sm leading-relaxed">
              Each framework approaches personality from a different axis — neurochemical, cognitive, moral, energetic, or ego-structural.
              Use one or all. They are designed to triangulate, not to repeat each other.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test, i) => (
              <TestCard
                key={test.id}
                title={test.title}
                description={test.longDescription || test.description}
                href={test.href}
                accentColor={test.color || "var(--color-accent-blue)"}
                accentMuted={test.colorMuted || "var(--color-accent-blue-muted)"}
                icon={test.icon || "✦"}
                badge={test.badge}
                delay={0.38 + i * 0.08}
              />
            ))}
          </div>
        </section>
      </Container>

      {/* Deep dive section */}
      <div className="border-y border-surface-800 bg-surface-900/30 py-16">
        <Container>
          <section className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">How it works</p>
              <h2 className="text-3xl font-bold">Research in, insight out.</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  step: "01",
                  title: "AI loads your framework corpus",
                  body: "Before your test begins, AI ingests the full research document for your chosen framework — cognitive function definitions, scoring rules, type descriptions — as system context.",
                },
                {
                  step: "02",
                  title: "Fixed diagnostic questions",
                  body: "Each framework uses a fixed set of questions designed to reveal the specific dimensions it measures. For qualitative tests (MBTI, KIME, PBCE), these are open-ended and diagnostic.",
                },
                {
                  step: "03",
                  title: "Local deterministic scoring",
                  body: "For quantitative tests, your answers are scored locally in your browser using documented algorithms — Mahalanobis distance, variance minimization, 2-axis mapping. No black boxes.",
                },
                {
                  step: "04",
                  title: "Corpus-backed interpretation",
                  body: "AI interprets your result against the research corpus: cognitive function evidence, quadra alignment, burnout pattern, or moral axis positioning — specific to your answers, not generic descriptions.",
                },
              ].map(({ step, title, body }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="flex gap-5"
                >
                  <span className="text-4xl font-bold text-surface-800 shrink-0 leading-tight">{step}</span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                    <p className="text-sm text-surface-400 leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </Container>
      </div>

      {/* Theory */}
      <Container>
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Theory</p>
            <h2 className="text-3xl font-bold">Understand the frameworks.</h2>
            <p className="mt-2 text-surface-400 max-w-2xl text-sm leading-relaxed">
              Before or after taking a test, explore the theoretical foundations. Every framework here has a documented methodology — not borrowed from pop typology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theoryCards.map((card, i) => (
              <TheoryCard
                key={card.id}
                title={card.title}
                description={card.description}
                href={card.href}
                delay={0.62 + i * 0.07}
              />
            ))}
          </div>
        </section>
      </Container>

      {/* Principles */}
      <Container>
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Principles</p>
            <h2 className="text-3xl font-bold">Why this exists.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PRINCIPLES.map(({ icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72 + i * 0.08 }}
                className="bg-surface-900 border border-surface-800 rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-surface-400">{icon}</span>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-sm text-surface-400 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </Container>

      {/* Framework comparison table */}
      <div className="border-y border-surface-800 bg-surface-900/20 py-16">
        <Container>
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="space-y-6"
          >
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Compare</p>
              <h2 className="text-3xl font-bold">Which test should I take?</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-800">
                    <th className="text-left py-3 pr-4 text-surface-500 font-medium">Framework</th>
                    <th className="text-left py-3 pr-4 text-surface-500 font-medium">Questions</th>
                    <th className="text-left py-3 pr-4 text-surface-500 font-medium">Format</th>
                    <th className="text-left py-3 text-surface-500 font-medium">Best for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                  {[
                    { name: "MBTI", q: "8", format: "Open-ended", for: "Deep qualitative Jungian typing with function stack", href: "/cjte", color: "text-accent-blue" },
                    { name: "Socionics (KIME)", q: "16", format: "Open-ended", for: "Model A sociotype and information metabolism", href: "/socionics", color: "text-accent-amber" },
                    { name: "Potentiology (PBCE)", q: "16", format: "Open-ended", for: "Burnout cycles and cognitive energy mapping", href: "/potentiology", color: "text-accent-purple" },
                    { name: "Temperaments", q: "20", format: "Scale 1-5", for: "Behavioral chemistry and social drive patterns", href: "/temperaments", color: "text-accent-purple" },
                    { name: "Moral Alignment", q: "12", format: "Scale 1-5", for: "Understanding your ethical architecture", href: "/moral-alignment", color: "text-accent-teal" },
                    { name: "Enneagram (INEE)", q: "Life phases", format: "Structured form", for: "Ego-structural simulation via fixation, passion, and trap", href: "/enneagram", color: "text-accent-amber" },
                  ].map(({ name, q, format, for: forText, href, color }) => (
                    <tr key={name} className="group hover:bg-surface-900/50 transition-colors">
                      <td className="py-3 pr-4">
                        <Link href={href} className={`font-medium ${color} hover:underline`}>{name}</Link>
                      </td>
                      <td className="py-3 pr-4 text-surface-400">{q}</td>
                      <td className="py-3 pr-4 text-surface-400">{format}</td>
                      <td className="py-3 text-surface-400">{forText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        </Container>
      </div>

      {/* Footer CTA */}
      <Container>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="border-t border-surface-800 pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <p className="font-medium text-foreground">Ready to begin?</p>
            <p className="text-sm text-surface-400 mt-0.5">
              {FLAGS.AUTH_ENABLED
                ? "Create an account to save your results and track your history across all tests."
                : "Pick a framework and start your assessment. No account needed."}
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            {FLAGS.AUTH_ENABLED && (
              <Link
                href="/auth/signup"
                className="bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                Create account
              </Link>
            )}
            <Link
              href="/resources"
              className="text-sm text-surface-400 hover:text-surface-200 border border-surface-700 hover:border-surface-500 px-5 py-2.5 rounded-xl transition-colors"
            >
              Source materials
            </Link>
          </div>
        </motion.section>
      </Container>
    </div>
  );
}
