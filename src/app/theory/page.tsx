"use client";

import { theoryCards } from "@/data/offerings";
import TheoryCard from "@/components/cards/TheoryCard";
import Container from "@/components/ui/Container";
import { motion } from "motion/react";

export default function TheoryIndexPage() {
  return (
    <Container className="space-y-8">
      <header>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold"
        >
          Theory &amp; Research
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-surface-400"
        >
          Educational resources on personality typology systems. These pages
          provide context and research background.
        </motion.p>
      </header>

      <div className="space-y-4">
        {theoryCards.map((card, i) => (
          <TheoryCard
            key={card.id}
            title={card.title}
            description={card.description}
            href={card.href}
            delay={0.15 + i * 0.08}
          />
        ))}
      </div>
    </Container>
  );
}
