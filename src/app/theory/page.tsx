"use client";

import { theoryCards } from "@/data/offerings";
import TheoryCard from "@/components/cards/TheoryCard";
import Container from "@/components/ui/Container";
import { motion } from "motion/react";
import Link from "next/link";

export default function TheoryIndexPage() {
  return (
    <Container className="space-y-12 pb-16">
      <header className="pt-4 space-y-3">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-surface-500 uppercase tracking-widest"
        >
          Research
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Theory &amp; Research
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-surface-400 max-w-xl leading-relaxed"
        >
          Six documented typological frameworks with original scoring methodology, terminology, and conceptual foundations. Read before or after taking a test.
        </motion.p>
      </header>

      {/* Theory pages */}
      <section className="space-y-4">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-lg font-semibold text-surface-300"
        >
          Framework Theory Pages
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {theoryCards.map((card, i) => (
            <TheoryCard
              key={card.id}
              title={card.title}
              description={card.description}
              href={card.href}
              delay={0.18 + i * 0.07}
            />
          ))}
        </div>
      </section>

      {/* Tests */}
      <section className="space-y-4">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg font-semibold text-surface-300"
        >
          Interactive Assessments
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="overflow-x-auto"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">Test</th>
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">Engine</th>
                <th className="text-left py-3 text-surface-500 font-medium">Scoring</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {[
                { name: "Temperaments", href: "/temperaments", engine: "Variance minimization", scoring: "4 temperament ideal vectors, blend threshold 0.5" },
                { name: "Moral Alignment", href: "/moral-alignment", engine: "2-axis dual scoring", scoring: "3x3 grid classification (Structure × Impulse)" },
                { name: "MBTI", href: "/cjte", engine: "Jungian corpus", scoring: "8 open-ended answers, research-scored" },
                { name: "Socionics", href: "/socionics", engine: "Socionics corpus", scoring: "Model A inference from 16 open-ended answers" },
                { name: "Energy Profile", href: "/potentiology", engine: "Energy profile corpus", scoring: "Energy-domain inference from 16 questions" },
                { name: "Enneagram", href: "/enneagram", engine: "Enneagram corpus", scoring: "Life-phase simulation + personalized quiz" },
              ].map(({ name, href, engine, scoring }) => (
                <tr key={name} className="hover:bg-surface-900/50 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={href} className="text-accent-blue hover:underline font-medium">{name}</Link>
                  </td>
                  <td className="py-3 pr-4 text-surface-400">{engine}</td>
                  <td className="py-3 text-surface-400">{scoring}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* Source materials */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="border-t border-surface-800 pt-8"
      >
        <Link
          href="/resources"
          className="text-surface-400 hover:text-foreground text-sm transition-colors"
        >
          View all source materials and research documents &rarr;
        </Link>
      </motion.section>

    </Container>
  );
}
