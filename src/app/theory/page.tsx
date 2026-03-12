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
          Five documented typological frameworks with original scoring methodology, terminology, and conceptual foundations. Read before or after taking a test.
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
                { name: "MBTI", href: "/cjte", engine: "VRDW CJTE-3 corpus", scoring: "AI interprets 8 open-ended answers" },
                { name: "Socionics KIME", href: "/socionics", engine: "VRDW KIME-3 corpus", scoring: "Model A inference from 16 open-ended answers" },
                { name: "Potentiology PBCE", href: "/potentiology", engine: "VRDW PBCE-1 corpus", scoring: "Energy-domain inference from 16 mentor questions" },
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

      {/* Unused tests notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="bg-surface-900 border border-surface-800 rounded-2xl p-5 text-sm text-surface-400 leading-relaxed"
      >
        <p className="font-medium text-surface-300 mb-1">Note on Enneagram</p>
        <p>
          The Enneagram theory page provides a conceptual overview but no interactive test is implemented. The scoring methodology requires structured clinical interviews which are not suitable for a self-administered format.
        </p>
      </motion.div>
    </Container>
  );
}
