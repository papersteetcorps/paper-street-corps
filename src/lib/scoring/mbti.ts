// MBTI Nearest Centroid Classifier
// Ported from mbti.py - uses Euclidean distance to classify personality types
// Order: [Dopamine, Serotonin, Testosterone/Androgenicity, Estrogen/Oxytocin]

export type MBTIType =
  | "ISTJ" | "ISFJ" | "INFJ" | "INTJ"
  | "ISTP" | "ISFP" | "INFP" | "INTP"
  | "ESTP" | "ESFP" | "ENFP" | "ENTP"
  | "ESTJ" | "ESFJ" | "ENFJ" | "ENTJ";

export interface MBTIResult {
  type: MBTIType;
  distance: number;
  ranking: Array<{ type: MBTIType; distance: number }>;
  userScores: {
    dopamine: number;
    serotonin: number;
    testosterone: number;
    estrogen: number;
  };
}

// Centroids for each of the 16 MBTI types
// Values represent ideal neurochemical levels (1-5 scale)
const CENTROIDS: Record<MBTIType, [number, number, number, number]> = {
  ISTJ: [2, 5, 3, 2],
  ISFJ: [2, 5, 2, 3],
  INFJ: [3, 3, 2, 5],
  INTJ: [3, 2, 4, 3],
  ISTP: [4, 2, 4, 2],
  ISFP: [3, 3, 2, 4],
  INFP: [3, 2, 1, 5],
  INTP: [4, 2, 4, 2],
  ESTP: [5, 1, 5, 1],
  ESFP: [5, 2, 3, 3],
  ENFP: [5, 2, 2, 4],
  ENTP: [5, 1, 4, 2],
  ESTJ: [3, 4, 5, 1],
  ESFJ: [2, 5, 2, 4],
  ENFJ: [4, 3, 2, 5],
  ENTJ: [4, 2, 5, 2],
};

// Calculate Euclidean distance between two points
function euclideanDistance(a: number[], b: number[]): number {
  const sumOfSquares = a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0);
  return Math.sqrt(sumOfSquares);
}

// Classify user scores to an MBTI type
export function classifyMBTI(
  dopamine: number,
  serotonin: number,
  testosterone: number,
  estrogen: number
): MBTIResult {
  const userScores = [dopamine, serotonin, testosterone, estrogen];

  // Calculate distance to each centroid
  const distances: Array<{ type: MBTIType; distance: number }> = [];

  for (const [type, centroid] of Object.entries(CENTROIDS)) {
    const distance = euclideanDistance(userScores, centroid);
    distances.push({ type: type as MBTIType, distance });
  }

  // Sort by distance (closest first)
  distances.sort((a, b) => a.distance - b.distance);

  return {
    type: distances[0].type,
    distance: distances[0].distance,
    ranking: distances,
    userScores: { dopamine, serotonin, testosterone, estrogen },
  };
}

// Get centroid values for a specific type
export function getCentroid(type: MBTIType): [number, number, number, number] {
  return CENTROIDS[type];
}

// Get all MBTI types
export function getAllTypes(): MBTIType[] {
  return Object.keys(CENTROIDS) as MBTIType[];
}

// Neurochemical axis descriptions for UI
export const AXIS_DESCRIPTIONS = {
  dopamine: {
    label: "Dopamine",
    description: "Novelty-seeking, excitement, energy, curiosity, impulsivity",
    low: "Cautious, routine-oriented",
    high: "Adventurous, spontaneous",
  },
  serotonin: {
    label: "Serotonin",
    description: "Calmness, caution, respect for rules/authority, organization, tradition",
    low: "Flexible, unconventional",
    high: "Structured, traditional",
  },
  testosterone: {
    label: "Testosterone/Androgenicity",
    description: "Assertiveness, competitiveness, analytical thinking, directness",
    low: "Cooperative, diplomatic",
    high: "Competitive, direct",
  },
  estrogen: {
    label: "Estrogen/Oxytocin",
    description: "Empathy, emotional sensitivity, holistic thinking, people-focused",
    low: "Task-focused, analytical",
    high: "People-focused, empathetic",
  },
};
