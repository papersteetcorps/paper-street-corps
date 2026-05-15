"use client";

import { motion } from "motion/react";
import { Fragment } from "react";

interface WordsRevealProps {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  emberLast?: boolean;
}

/**
 * Reveals each word with a small upward slide + fade as the parent enters view.
 * Uses inline-block so words wrap naturally. Pure CSS transform — mobile-safe.
 */
export default function WordsReveal({
  text,
  className = "",
  delay = 0,
  step = 0.07,
  emberLast = false,
}: WordsRevealProps) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <Fragment key={i}>
            <motion.span
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: delay + i * step,
                ease: [0.2, 0.85, 0.3, 1],
              }}
              className={`inline-block ${
                isLast && emberLast ? "text-[var(--ember)]" : ""
              }`}
            >
              {word}
            </motion.span>
            {!isLast && " "}
          </Fragment>
        );
      })}
    </span>
  );
}
