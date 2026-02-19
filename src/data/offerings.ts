export type OfferingCategory = "test" | "theory";

export interface Offering {
  id: string;
  title: string;
  category: OfferingCategory;
  description: string;
  longDescription?: string;
  href: string;
  icon?: string;
  color?: string;
  colorMuted?: string;
}

export const tests: Offering[] = [
  {
    id: "mbti",
    title: "MBTI Test",
    category: "test",
    description:
      "Neurochemical-based MBTI test using nearest centroid classification.",
    longDescription:
      "Estimate your cognitive-emotional profile across 5 neurochemical axes using Mahalanobis distance to 16 type centroids.",
    href: "/mbti",
    icon: "\u2728",
    color: "var(--accent-blue)",
    colorMuted: "var(--accent-blue-muted)",
  },
  {
    id: "temperament",
    title: "Temperament Test",
    category: "test",
    description:
      "Variance-based assessment to identify your behavioral temperament patterns.",
    longDescription:
      "Rate 5 biochemical markers and discover your primary temperament through variance-based classification.",
    href: "/temperaments",
    icon: "\u26a1",
    color: "var(--accent-purple)",
    colorMuted: "var(--accent-purple-muted)",
  },
  {
    id: "moral-alignment",
    title: "Moral Alignment",
    category: "test",
    description:
      "Two-axis assessment mapping your ethical tendencies on a 3x3 alignment grid.",
    longDescription:
      "Explore your moral orientation across the Structure (Lawful-Chaotic) and Impulse (Good-Evil) axes.",
    href: "/moral-alignment",
    icon: "\u2696\ufe0f",
    color: "var(--accent-teal)",
    colorMuted: "var(--accent-teal-muted)",
  },
];

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

export const offerings: Offering[] = [...tests, ...theoryCards];
