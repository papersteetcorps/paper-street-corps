"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { tests } from "@/data/offerings";
import TestCard from "@/components/cards/TestCard";
import Container from "@/components/ui/Container";

const RESULT_PREVIEW = {
  type: "INTJ",
  nickname: "The Architect",
  oneLiner: "You redesign the model, never your conviction.",
  strengths: ["Strategic thinking", "Independent analysis", "Long-range vision"],
  challenges: ["Emotional blind spots", "Impatience with process", "Over-reliance on logic"],
  howYouThink: "You process the world through internal models. When something doesn't fit, you don't adjust your expectations. You rebuild the framework. Most people experience this as stubbornness. You experience it as integrity.",
  whatPeopleGetWrong: "They think you don't care. You do. You just don't perform it. Your loyalty shows up in problem-solving, not in words. When you fix something for someone without being asked, that's your version of love.",
  burnoutCycle: "You burn out silently. First you over-optimize. Then you stop sleeping properly. Then you lose interest in the thing you were obsessed with last week. By the time anyone notices, you've already mentally left. Recovery requires solitude and a new problem worth solving.",
  whereYouExcel: "Complex systems with clear goals. Give you a hard problem, enough autonomy, and people who can execute without hand-holding. You'll deliver something better than what was asked for. Strategy, architecture, long-term planning, debugging systems that nobody else can see through.",
  whereYouStruggle: "Anything requiring emotional performance. Small talk, team morale, giving feedback that's gentle instead of accurate. You also struggle with delegation because nobody meets your internal standard on the first try.",
  howToGrow: "Stop waiting for people to earn your trust before you let them in. Start explaining your thinking out loud, even when it feels inefficient. The gap between your clarity and everyone else's confusion is the problem you actually need to solve.",
  atWork: "You're the one who sees the flaw in the plan three steps ahead. You won't say it in the meeting. You'll send a message after with a better version. You'd rather be right than credited.",
  inRelationships: "You show love through competence. You fix things, optimize things, plan things. The people closest to you sometimes wish you'd just sit with them instead of solving their problems. Learning to be present without a purpose is your real edge.",
  crossFramework: [
    { framework: "Enneagram", result: "Type 5w6", color: "text-accent-amber" },
    { framework: "Temperament", result: "Melancholic", color: "text-accent-purple" },
    { framework: "Moral Alignment", result: "Lawful Neutral", color: "text-accent-teal" },
    { framework: "Energy Profile", result: "SbjA", color: "text-accent-blue" },
  ],
};

export default function HomePage() {
  return (
    <div className="pb-32">

      {/* ═══════════════ HERO ═══════════════ */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="aurora" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
          <div className="orb orb-d" />
        </div>
        <div className="aurora-vignette" aria-hidden="true" />
        <div className="aurora-line" aria-hidden="true" />
        <div className="dot-grid" aria-hidden="true" />
        <Container>
          <section className="relative z-10 text-center max-w-4xl mx-auto space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.0] tracking-tight">
                Figure yourself out.
              </h1>
              <p className="text-2xl md:text-3xl text-surface-300 font-medium">
                Then do something about it.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-surface-400 max-w-2xl mx-auto leading-relaxed"
            >
              Forge uses 6 research-backed psychological frameworks to map who you are
              from your real experiences, not multiple-choice guesses.
              For individuals who want clarity. For teams that want to work better.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <Link
                href="/cjte"
                className="bg-accent-blue hover:brightness-110 text-white font-semibold px-10 py-4 rounded-2xl transition-all text-base shadow-lg shadow-accent-blue/25"
              >
                Take the assessment
              </Link>
              <Link
                href="mailto:admin@forge.com"
                className="bg-surface-800/60 hover:bg-surface-700/60 text-surface-300 font-medium px-10 py-4 rounded-2xl transition-colors text-base border border-surface-700 backdrop-blur-sm"
              >
                Join the waitlist
              </Link>
            </motion.div>

            {/* Academic credibility */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-6"
            >
              {["Jungian cognitive function theory", "Socionics Model A", "Enneagram (Ichazo & Naranjo)"].map((framework) => (
                <span key={framework} className="text-sm text-surface-300 px-4 py-2 rounded-xl border border-surface-700 bg-surface-800/30 backdrop-blur-sm">
                  {framework}
                </span>
              ))}
            </motion.div>
          </section>
        </Container>
      </div>

      {/* ═══════════════ DIFFERENTIATOR ═══════════════ */}
      <div className="py-28">
        <Container>
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-sm text-surface-400 uppercase tracking-widest mb-3 font-medium">Why Forge is different</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold">Your life is the data.</h2>
              <p className="mt-4 text-surface-300 text-base leading-relaxed">
                Other tests ask you to rate yourself. Forge asks you to describe what actually happened.
                Self-rating is unreliable. Your life story isn't.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Other tests */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-surface-700 bg-surface-900/30 p-8 space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center text-surface-400 text-sm">?</div>
                  <p className="text-sm text-surface-400 font-semibold">Traditional personality tests</p>
                </div>
                <div className="space-y-4">
                  <p className="text-base text-surface-200 italic">&ldquo;I prefer being alone to being in groups.&rdquo;</p>
                  <div className="flex flex-wrap gap-2">
                    {["Strongly agree", "Agree", "Neutral", "Disagree"].map((opt) => (
                      <span key={opt} className="px-3 py-2 rounded-lg border border-surface-600 text-sm text-surface-400 bg-surface-800/30">
                        {opt}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-surface-700 space-y-1.5">
                    <p className="text-sm text-surface-300 font-medium">Result: You are an introvert.</p>
                    <p className="text-sm text-surface-500">Based on: what you chose to tell it.</p>
                  </div>
                </div>
              </motion.div>

              {/* Forge */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-accent-blue/25 p-8 space-y-6"
                style={{ background: "linear-gradient(135deg, rgba(124, 92, 252, 0.04) 0%, rgba(232, 98, 42, 0.03) 100%)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-blue/15 flex items-center justify-center text-accent-blue text-sm font-bold">F</div>
                  <p className="text-sm text-accent-blue font-semibold">Forge</p>
                </div>
                <div className="space-y-4">
                  <p className="text-base text-surface-100 font-medium">&ldquo;Tell me about a time you burned out. What caused it? What were the warning signs?&rdquo;</p>
                  <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-5 space-y-3">
                    <p className="text-sm text-surface-200 leading-relaxed">
                      I was working 14-hour days for three months straight. I stopped eating properly. The sign was when I couldn't remember the last time I laughed...
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-accent-blue/10 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-blue"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                      </div>
                      <span className="text-xs text-surface-400">Voice input available</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-accent-blue/15 space-y-1.5">
                    <p className="text-sm text-surface-200 font-medium">Result: Your burnout maps to SbjA energy depletion.</p>
                    <p className="text-sm text-surface-400">Based on: what actually happened to you.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </Container>
      </div>

      {/* ═══════════════ CREDIBILITY STRIP ═══════════════ */}
      <div className="border-y border-surface-700 bg-surface-900/20 py-14">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "6", label: "Frameworks" },
              { value: "16+", label: "Types mapped" },
              { value: "Open-ended", label: "Question format" },
              { value: "Peer-reviewed", label: "Source material" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-surface-500 mt-2 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </motion.div>
        </Container>
      </div>

      {/* ═══════════════ RESULT PREVIEW ═══════════════ */}
      <div className="py-32">
        <Container>
          <motion.section
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-sm text-surface-400 uppercase tracking-widest font-medium mb-6 text-center">
              Sample report
            </p>

            <div className="gradient-border rounded-3xl border border-surface-700 bg-surface-900/60 overflow-hidden backdrop-blur-sm">
              <div className="p-10 md:p-14 text-center space-y-4 border-b border-surface-700">
                <p className="font-display text-6xl md:text-8xl font-bold text-accent-blue">
                  {RESULT_PREVIEW.type}
                </p>
                <p className="text-xl text-surface-300">{RESULT_PREVIEW.nickname}</p>
                <p className="text-surface-400 text-sm max-w-md mx-auto italic">
                  &ldquo;{RESULT_PREVIEW.oneLiner}&rdquo;
                </p>
              </div>

              <div className="p-8 md:p-10 space-y-3 border-b border-surface-700">
                <p className="text-sm text-accent-blue uppercase tracking-widest font-medium">How you think</p>
                <p className="text-surface-200 text-sm leading-relaxed">{RESULT_PREVIEW.howYouThink}</p>
              </div>

              <div className="p-8 md:p-10 space-y-3 border-b border-surface-700">
                <p className="text-sm text-accent-purple uppercase tracking-widest font-medium">What people get wrong about you</p>
                <p className="text-surface-200 text-sm leading-relaxed">{RESULT_PREVIEW.whatPeopleGetWrong}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-700 border-b border-surface-700">
                <div className="p-8 space-y-4">
                  <p className="text-sm text-accent-teal uppercase tracking-widest font-medium">What you're built for</p>
                  <div className="space-y-2">
                    {RESULT_PREVIEW.strengths.map((s) => (
                      <p key={s} className="text-surface-200 text-sm">{s}</p>
                    ))}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-sm text-accent-amber uppercase tracking-widest font-medium">What trips you up</p>
                  <div className="space-y-2">
                    {RESULT_PREVIEW.challenges.map((c) => (
                      <p key={c} className="text-surface-200 text-sm">{c}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* BURNOUT CYCLE */}
              <div className="p-8 md:p-10 space-y-3 border-b border-surface-700">
                <p className="text-sm text-accent-amber uppercase tracking-widest font-medium">Your burnout cycle</p>
                <p className="text-surface-200 text-sm leading-relaxed">{RESULT_PREVIEW.burnoutCycle}</p>
              </div>

              {/* EXCEL + STRUGGLE */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-700 border-b border-surface-700">
                <div className="p-8 space-y-3">
                  <p className="text-sm text-accent-teal uppercase tracking-widest font-medium">Where you excel</p>
                  <p className="text-surface-200 text-sm leading-relaxed">{RESULT_PREVIEW.whereYouExcel}</p>
                </div>
                <div className="p-8 space-y-3">
                  <p className="text-sm text-accent-amber uppercase tracking-widest font-medium">Where you struggle</p>
                  <p className="text-surface-200 text-sm leading-relaxed">{RESULT_PREVIEW.whereYouStruggle}</p>
                </div>
              </div>

              {/* AT WORK + IN RELATIONSHIPS */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-700 border-b border-surface-700">
                <div className="p-8 space-y-3">
                  <p className="text-sm text-surface-400 uppercase tracking-widest font-medium font-medium">At work</p>
                  <p className="text-surface-200 text-sm leading-relaxed">{RESULT_PREVIEW.atWork}</p>
                </div>
                <div className="p-8 space-y-3">
                  <p className="text-sm text-surface-400 uppercase tracking-widest font-medium font-medium">In relationships</p>
                  <p className="text-surface-200 text-sm leading-relaxed">{RESULT_PREVIEW.inRelationships}</p>
                </div>
              </div>

              {/* HOW TO GROW */}
              <div className="p-8 md:p-10 space-y-3 border-b border-surface-700"
                style={{ background: "linear-gradient(135deg, rgba(124, 92, 252, 0.03) 0%, rgba(45, 212, 191, 0.03) 100%)" }}
              >
                <p className="text-sm text-accent-teal uppercase tracking-widest font-medium">How to become better</p>
                <p className="text-surface-200 text-sm leading-relaxed">{RESULT_PREVIEW.howToGrow}</p>
              </div>

              {/* CROSS-FRAMEWORK */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-b border-surface-700">
                {RESULT_PREVIEW.crossFramework.map((cf) => (
                  <div key={cf.framework} className="p-6 text-center border-r border-surface-700 last:border-r-0">
                    <p className="text-xs text-surface-400 uppercase tracking-widest font-medium">{cf.framework}</p>
                    <p className={`font-display text-lg font-bold mt-1 ${cf.color}`}>{cf.result}</p>
                  </div>
                ))}
              </div>

              <div className="p-8 md:p-10 text-center space-y-4">
                <p className="text-surface-400 text-sm">This is a sample. Yours goes deeper.</p>
                <Link
                  href="/cjte"
                  className="inline-block bg-accent-blue hover:brightness-110 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all text-sm shadow-lg shadow-accent-blue/20"
                >
                  Get your real report
                </Link>
              </div>
            </div>
          </motion.section>
        </Container>
      </div>

      {/* ═══════════════ FOR TEAMS ═══════════════ */}
      <div className="py-28" id="for-teams">
        <Container>
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="rounded-3xl border border-surface-700 overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(232, 98, 42, 0.03) 0%, rgba(124, 92, 252, 0.04) 100%)" }}
            >
              <div className="p-10 md:p-14 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg bg-accent-amber/10 text-accent-amber text-xs font-medium uppercase tracking-wider">
                    For Teams
                  </div>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  Your team already has patterns.<br />
                  <span className="text-surface-400">Forge makes them visible.</span>
                </h2>
                <p className="text-surface-400 text-sm leading-relaxed max-w-xl">
                  Same frameworks, built for the workplace. Understand how your team thinks,
                  communicates, and handles pressure. No facilitator required.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {[
                    { title: "Team profiles", desc: "See each member's type, strengths, and blind spots side by side." },
                    { title: "Compatibility maps", desc: "Know where people align and where they'll clash before it happens." },
                    { title: "Growth playbooks", desc: "Actionable steps for each person, specific to how they work." },
                  ].map(({ title, desc }) => (
                    <div key={title} className="rounded-xl border border-surface-700 bg-surface-800/30 p-5 space-y-2">
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-xs text-surface-400 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link
                    href="mailto:admin@forge.com"
                    className="inline-block bg-accent-amber/10 hover:bg-accent-amber/20 text-accent-amber border border-accent-amber/20 font-medium px-8 py-3.5 rounded-2xl transition-colors text-sm"
                  >
                    Join the waitlist
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        </Container>
      </div>

      {/* ═══════════════ ASSESSMENTS ═══════════════ */}
      <div className="py-28" id="assessments">
        <Container>
          <section className="space-y-12 scroll-mt-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="text-center max-w-xl mx-auto"
            >
              <p className="text-sm text-surface-400 uppercase tracking-widest font-medium mb-3">Assessments</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Six angles. One you.</h2>
              <p className="mt-4 text-surface-400 text-base leading-relaxed">
                Each framework reads personality differently. Take one to start, or all six for the full picture.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tests.map((test, i) => (
                <TestCard
                  key={test.id}
                  title={test.title}
                  description={test.description}
                  href={test.href}
                  accentColor={test.color || "var(--color-accent-blue)"}
                  accentMuted={test.colorMuted || "var(--color-accent-blue-muted)"}
                  icon={test.icon || "✦"}
                  badge={test.badge}
                  delay={0.1 + i * 0.06}
                />
              ))}
            </div>
          </section>
        </Container>
      </div>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <div className="border-y border-surface-700 bg-surface-900/30 py-28">
        <Container>
          <section className="space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="text-center max-w-lg mx-auto"
            >
              <p className="text-sm text-surface-400 uppercase tracking-widest font-medium mb-3">How it works</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Simple. Honest. Useful.</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Tell your story",
                  body: "Open-ended questions about your real life. Experiences, relationships, reactions, what drives you.",
                },
                {
                  step: "02",
                  title: "Patterns get read",
                  body: "Your answers analyzed across 6 psychological frameworks using published research.",
                },
                {
                  step: "03",
                  title: "See who you are",
                  body: "Your type, strengths, blind spots, and what to do next. Based on your life, not your guesses.",
                },
              ].map(({ step, title, body }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center space-y-4"
                >
                  <span className="font-display text-6xl font-bold text-surface-600">{step}</span>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed max-w-xs mx-auto">{body}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </Container>
      </div>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <div className="py-32">
        <Container>
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold">
              Ready to see the real you?
            </h2>
            <p className="text-surface-400 text-lg max-w-lg mx-auto">
              5 minutes. Open-ended. Based on your actual life. Not a quiz.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/cjte"
                className="inline-block bg-accent-blue hover:brightness-110 text-white font-semibold px-12 py-5 rounded-2xl transition-all text-lg shadow-lg shadow-accent-blue/25"
              >
                Start the assessment
              </Link>
              <Link
                href="mailto:admin@forge.com"
                className="inline-block bg-surface-800/60 hover:bg-surface-700/60 text-surface-300 font-medium px-12 py-5 rounded-2xl transition-colors text-lg border border-surface-700"
              >
                Join the waitlist
              </Link>
            </div>
          </motion.section>
        </Container>
      </div>
    </div>
  );
}
