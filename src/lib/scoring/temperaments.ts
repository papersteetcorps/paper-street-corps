// Temperament Variance-Based Classifier
// Ported from temperament.c - uses variance of differences to classify temperament
// Order: [Cortisol, Dopamine, Oxytocin, Serotonin, Androgenicity]

export type Temperament = "Choleric" | "Melancholic" | "Phlegmatic" | "Sanguine";

export interface TemperamentResult {
  primary: Temperament;
  secondary: Temperament | null;
  isBlend: boolean;
  variance: number;
  variances: Record<Temperament, number>;
  userScores: {
    cortisol: number;
    dopamine: number;
    oxytocin: number;
    serotonin: number;
    androgenicity: number;
  };
}

// Ideal biochemical profiles for each temperament
// Order: [Cortisol, Dopamine, Oxytocin, Serotonin, Androgenicity]
const IDEAL_PROFILES: Record<Temperament, [number, number, number, number, number]> = {
  Choleric: [3, 5, 1, 2, 5],    // High D, high A, low O
  Melancholic: [5, 1, 3, 4, 1], // High C, high S, low D, low A
  Phlegmatic: [1, 2, 5, 5, 1],  // High O, high S, low C, low A
  Sanguine: [1, 5, 3, 3, 3],    // High D, low C, balanced others
};

// Calculate population variance of an array
function variance(values: number[]): number {
  const n = values.length;
  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / n;
}

// Classify user scores to a temperament
export function classifyTemperament(
  cortisol: number,
  dopamine: number,
  oxytocin: number,
  serotonin: number,
  androgenicity: number
): TemperamentResult {
  const userScores = [cortisol, dopamine, oxytocin, serotonin, androgenicity];

  // Calculate variance for each temperament
  const variances: Record<Temperament, number> = {} as Record<Temperament, number>;

  for (const [temperament, ideal] of Object.entries(IDEAL_PROFILES)) {
    // Calculate differences
    const differences = userScores.map((score, i) => score - ideal[i]);
    // Calculate variance of differences
    variances[temperament as Temperament] = variance(differences);
  }

  // Sort temperaments by variance (lowest first = best match)
  const sorted = (Object.entries(variances) as [Temperament, number][])
    .sort((a, b) => a[1] - b[1]);

  const primary = sorted[0][0];
  const primaryVariance = sorted[0][1];
  const secondary = sorted[1][0];
  const secondaryVariance = sorted[1][1];

  // Check for blend: if difference between first and second is < 0.5
  const isBlend = (secondaryVariance - primaryVariance) < 0.5;

  return {
    primary,
    secondary: isBlend ? secondary : null,
    isBlend,
    variance: primaryVariance,
    variances,
    userScores: { cortisol, dopamine, oxytocin, serotonin, androgenicity },
  };
}

// Get ideal profile for a specific temperament
export function getIdealProfile(temperament: Temperament): [number, number, number, number, number] {
  return IDEAL_PROFILES[temperament];
}

// Get all temperament types
export function getAllTemperaments(): Temperament[] {
  return Object.keys(IDEAL_PROFILES) as Temperament[];
}

// Biochemical descriptions for UI
export const CHEMICAL_DESCRIPTIONS = {
  cortisol: {
    label: "Cortisol",
    description: "Stress response, alertness, anxiety levels",
    low: "Calm, relaxed",
    high: "Alert, anxious",
  },
  dopamine: {
    label: "Dopamine",
    description: "Motivation, reward-seeking, energy",
    low: "Steady, methodical",
    high: "Driven, energetic",
  },
  oxytocin: {
    label: "Oxytocin",
    description: "Social bonding, trust, emotional connection",
    low: "Independent, reserved",
    high: "Nurturing, connected",
  },
  serotonin: {
    label: "Serotonin",
    description: "Mood stability, contentment, patience",
    low: "Restless, impulsive",
    high: "Stable, patient",
  },
  androgenicity: {
    label: "Androgenicity",
    description: "Assertiveness, dominance, competitiveness (testosterone/estrogen)",
    low: "Passive, accommodating",
    high: "Assertive, dominant",
  },
};

// Temperament descriptions for results
export const TEMPERAMENT_DESCRIPTIONS: Record<Temperament, {
  title: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
}> = {
  Choleric: {
    title: "The Leader",
    traits: ["Ambitious", "Decisive", "Energetic", "Competitive"],
    strengths: ["Natural leadership", "Goal-oriented", "Quick decision-making"],
    challenges: ["Impatience", "Domineering tendencies", "Difficulty relaxing"],
  },
  Melancholic: {
    title: "The Analyst",
    traits: ["Thoughtful", "Detailed", "Cautious", "Perfectionist"],
    strengths: ["Deep thinking", "Quality-focused", "Thorough planning"],
    challenges: ["Overthinking", "Pessimism", "Difficulty with change"],
  },
  Phlegmatic: {
    title: "The Peacemaker",
    traits: ["Calm", "Patient", "Supportive", "Diplomatic"],
    strengths: ["Emotional stability", "Team harmony", "Reliability"],
    challenges: ["Passivity", "Difficulty with confrontation", "Resistance to change"],
  },
  Sanguine: {
    title: "The Enthusiast",
    traits: ["Optimistic", "Social", "Spontaneous", "Expressive"],
    strengths: ["Charisma", "Adaptability", "Positive energy"],
    challenges: ["Disorganization", "Following through", "Impulsiveness"],
  },
};
