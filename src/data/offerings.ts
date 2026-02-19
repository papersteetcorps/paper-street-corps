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
  badge?: string;
}

export const tests: Offering[] = [
  {
    id: "mbti",
    title: "Neurochemical MBTI",
    category: "test",
    description: "Neurochemical-based MBTI using nearest centroid classification.",
    longDescription:
      "Estimate your cognitive-emotional profile across 5 neurochemical axes using Mahalanobis distance to 16 type centroids. Powered by Gemini for personalized question generation and interpretation.",
    href: "/mbti",
    icon: "✦",
    color: "var(--color-accent-blue)",
    colorMuted: "var(--color-accent-blue-muted)",
  },
  {
    id: "temperament",
    title: "Temperaments",
    category: "test",
    description: "Variance-based assessment to identify your behavioral temperament.",
    longDescription:
      "Rate 5 biochemical markers and discover your primary temperament (Choleric, Melancholic, Phlegmatic, or Sanguine) through variance-based classification.",
    href: "/temperaments",
    icon: "⬡",
    color: "var(--color-accent-purple)",
    colorMuted: "var(--color-accent-purple-muted)",
  },
  {
    id: "moral-alignment",
    title: "Moral Alignment",
    category: "test",
    description: "Two-axis assessment mapping your ethical tendencies on a 3x3 grid.",
    longDescription:
      "Explore your moral orientation across the Structure (Lawful–Chaotic) and Impulse (Good–Evil) axes to locate your position in the 9-cell alignment grid.",
    href: "/moral-alignment",
    icon: "⚖",
    color: "var(--color-accent-teal)",
    colorMuted: "var(--color-accent-teal-muted)",
  },
  {
    id: "cjte",
    title: "Classic Jungian",
    category: "test",
    description: "8-question open-ended typing engine grounded in Jung's original definitions.",
    longDescription:
      "VRDW CJTE-3 — The most rigorous Jungian typing format. Eight qualitative questions analyzed against the full cognitive function corpus to determine your type and function stack.",
    href: "/cjte",
    icon: "◈",
    color: "var(--color-accent-blue)",
    colorMuted: "var(--color-accent-blue-muted)",
    badge: "CJTE-3",
  },
  {
    id: "socionics",
    title: "Socionics",
    category: "test",
    description: "Model A sociotype determination via information metabolism analysis.",
    longDescription:
      "VRDW KIME-3 — 16 questions targeting your information element preferences. Results include your sociotype, Model A function stack, quadra, and PoLR identification.",
    href: "/socionics",
    icon: "◉",
    color: "var(--color-accent-amber)",
    colorMuted: "var(--color-accent-amber-muted)",
    badge: "KIME-3",
  },
  {
    id: "potentiology",
    title: "Potentiology",
    category: "test",
    description: "Energy-based cognitive typing with burnout cycle analysis.",
    longDescription:
      "VRDW PBCE-1 — A proprietary cognitive framework. 16 mentor-style questions to determine your cognitive domain, energy stack, and burnout vulnerability pattern.",
    href: "/potentiology",
    icon: "⚡",
    color: "var(--color-accent-purple)",
    colorMuted: "var(--color-accent-purple-muted)",
    badge: "PBCE-1",
  },
];

export const theoryCards: Offering[] = [
  {
    id: "jungian",
    title: "Jungian Typology",
    category: "theory",
    description: "Context and research on the 16 personality types and neurochemical correlates.",
    href: "/theory/jungian",
  },
  {
    id: "socionics-theory",
    title: "Socionics & Model A",
    category: "theory",
    description: "Information elements, Model A structure, quadra dynamics, and PoLR.",
    href: "/theory/socionics",
  },
  {
    id: "potentiology-theory",
    title: "Potentiology",
    category: "theory",
    description: "Energy-based cognition, burnout cycles, and the 8-function stack model.",
    href: "/theory/potentiology",
  },
  {
    id: "moral-alignment",
    title: "Moral Alignment",
    category: "theory",
    description: "The 3x3 alignment grid: Impulse (Good/Neutral/Evil) and Structure (Lawful/Neutral/Chaotic).",
    href: "/theory/moral-alignment",
  },
  {
    id: "enneagram",
    title: "Enneagram",
    category: "theory",
    description: "Nine personality types and their interconnections in the enneagram system.",
    href: "/theory/enneagram",
  },
];

export const offerings: Offering[] = [...tests, ...theoryCards];
