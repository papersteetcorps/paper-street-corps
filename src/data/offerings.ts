export type OfferingCategory = "test" | "theory";

export interface Offering {
  id: string;
  title: string;
  category: OfferingCategory;
  description: string;
  href: string;
}

// Interactive tests with scoring
export const tests: Offering[] = [
  {
    id: "mbti",
    title: "MBTI Test",
    category: "test",
    description:
      "Neurochemical-based MBTI test using nearest centroid classification.",
    href: "/mbti",
  },
  {
    id: "temperament",
    title: "Temperament Test",
    category: "test",
    description:
      "Variance-based assessment to identify your behavioral temperament patterns.",
    href: "/temperaments",
  },
];

// Educational theory cards (no interactive tests)
export const theoryCards: Offering[] = [
  {
    id: "jungian",
    title: "Jungian Typology",
    category: "theory",
    description:
      "Context and research on the 16 personality types and neurochemical correlates.",
    href: "/theory/jungian",
  },
  {
    id: "moral-alignment",
    title: "Moral Alignment",
    category: "theory",
    description:
      "The 3x3 alignment grid: Impulse (Good/Neutral/Evil) and Structure (Lawful/Neutral/Chaotic).",
    href: "/theory/moral-alignment",
  },
  {
    id: "enneagram",
    title: "Enneagram",
    category: "theory",
    description:
      "Nine personality types and their interconnections in the enneagram system.",
    href: "/theory/enneagram",
  },
];

// Combined for backwards compatibility
export const offerings: Offering[] = [...tests, ...theoryCards];
