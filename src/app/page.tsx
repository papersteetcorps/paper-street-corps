"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { tests, theoryCards } from "@/data/offerings";
import TestCard from "@/components/cards/TestCard";
import TheoryCard from "@/components/cards/TheoryCard";
import Container from "@/components/ui/Container";

export default function HomePage() {
  return (
    <Container className="space-y-20 py-4">
      {/* Hero */}
      <section className="max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-semibold leading-tight tracking-tight"
        >
          Formal psychological assessments grounded in research.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-surface-400 leading-relaxed"
        >
          Neurochemical-based personality tests and educational resources on
          typology systems. All assessments use documented scoring methods with
          no data collection.
        </motion.p>
      </section>

      {/* Test Cards Grid */}
      <section className="space-y-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-medium"
        >
          Assessments
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tests.map((test, i) => (
            <TestCard
              key={test.id}
              title={test.title}
              description={test.longDescription || test.description}
              href={test.href}
              accentColor={test.color || "var(--accent-blue)"}
              accentMuted={test.colorMuted || "var(--accent-blue-muted)"}
              icon={test.icon || "\u2728"}
              delay={0.25 + i * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Theory Section */}
      <section className="space-y-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-medium"
        >
          Theory &amp; Research
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {theoryCards.map((card, i) => (
            <TheoryCard
              key={card.id}
              title={card.title}
              description={card.description}
              href={card.href}
              delay={0.55 + i * 0.08}
            />
          ))}
        </div>
      </section>

      {/* Ethos */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-medium">Ethos</h2>
        <ul className="space-y-2 text-surface-400 max-w-2xl">
          <li>All scoring algorithms are transparent and documented.</li>
          <li>Assessments are grounded in research and published methods.</li>
          <li>No accounts, no tracking, no data collection.</li>
        </ul>
      </motion.section>

      {/* Resources Link */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="border-t border-surface-800 pt-8"
      >
        <Link
          href="/resources"
          className="text-surface-400 hover:text-foreground text-sm transition-colors"
        >
          View source materials and research papers &rarr;
        </Link>
      </motion.section>
    </Container>
  );
}
