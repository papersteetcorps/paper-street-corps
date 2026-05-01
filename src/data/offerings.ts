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
    id: "cjte",
    title: "Classic Jungian",
    category: "test",
    description: "8 open-ended questions to find your cognitive type. The most popular starting point.",
    longDescription:
      "8 open-ended questions analyzed against cognitive function research to determine your type and function stack.",
    href: "/cjte",
    icon: "◈",
    color: "var(--color-accent-blue)",
    colorMuted: "var(--color-accent-blue-muted)",
  },
  {
    id: "socionics",
    title: "Socionics",
    category: "test",
    description: "16 questions on how you process information. Reveals your sociotype and interaction style.",
    longDescription:
      "16 questions targeting your information processing preferences. Results include your sociotype, function stack, quadra, and interaction style.",
    href: "/socionics",
    icon: "◉",
    color: "var(--color-accent-amber)",
    colorMuted: "var(--color-accent-amber-muted)",
  },
  {
    id: "potentiology",
    title: "Energy Profile",
    category: "test",
    description: "16 questions about where your mental energy goes and when you burn out.",
    longDescription:
      "16 mentor-style questions to find your cognitive domain, energy stack, and burnout patterns.",
    href: "/potentiology",
    icon: "⚡",
    color: "var(--color-accent-purple)",
    colorMuted: "var(--color-accent-purple-muted)",
  },
  {
    id: "temperament",
    title: "Temperaments",
    category: "test",
    description: "5 quick scale questions to discover your behavioral chemistry blend.",
    longDescription:
      "Rate 5 traits and discover your primary temperament: Choleric, Melancholic, Phlegmatic, or Sanguine.",
    href: "/temperaments",
    icon: "⬡",
    color: "var(--color-accent-purple)",
    colorMuted: "var(--color-accent-purple-muted)",
  },
  {
    id: "moral-alignment",
    title: "Moral Alignment",
    category: "test",
    description: "12 questions to map where you fall on the order-chaos and good-evil axes.",
    longDescription:
      "Find where you land on the 3x3 moral grid: Lawful to Chaotic, Good to Evil.",
    href: "/moral-alignment",
    icon: "⚖",
    color: "var(--color-accent-teal)",
    colorMuted: "var(--color-accent-teal-muted)",
  },
  {
    id: "enneagram",
    title: "Enneagram",
    category: "test",
    description: "Enter your life experiences and see which of the 9 types actually fits you.",
    longDescription:
      "Describe real life experiences, then see how each of the 9 types would have processed them. Optional quiz to narrow it down.",
    href: "/enneagram",
    icon: "◎",
    color: "var(--color-accent-amber)",
    colorMuted: "var(--color-accent-amber-muted)",
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
    title: "Energy Profile",
    category: "theory",
    description: "Cognitive energy, burnout cycles, and the 8-function stack model.",
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
