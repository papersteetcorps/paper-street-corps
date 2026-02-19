export type StructureAxis = "Lawful" | "Neutral" | "Chaotic";
export type ImpulseAxis = "Good" | "Neutral" | "Evil";

export interface MoralAlignmentResult {
  alignment: string;
  archetype: string;
  structure: StructureAxis;
  impulse: ImpulseAxis;
  structureScore: number;
  impulseScore: number;
}

const ARCHETYPES: Record<string, string> = {
  "Lawful Good": "The Crusader",
  "Neutral Good": "The Benefactor",
  "Chaotic Good": "The Rebel",
  "Lawful Neutral": "The Judge",
  "True Neutral": "The Undecided",
  "Chaotic Neutral": "The Free Spirit",
  "Lawful Evil": "The Dominator",
  "Neutral Evil": "The Malefactor",
  "Chaotic Evil": "The Destroyer",
};

function classifyAxis3<T extends string>(
  score: number,
  low: T,
  mid: T,
  high: T
): T {
  if (score <= 2.33) return low;
  if (score <= 3.67) return mid;
  return high;
}

export function classifyMoralAlignment(
  structureScore: number,
  impulseScore: number
): MoralAlignmentResult {
  const structure = classifyAxis3<StructureAxis>(
    structureScore,
    "Chaotic",
    "Neutral",
    "Lawful"
  );
  const impulse = classifyAxis3<ImpulseAxis>(
    impulseScore,
    "Evil",
    "Neutral",
    "Good"
  );

  const alignmentName =
    structure === "Neutral" && impulse === "Neutral"
      ? "True Neutral"
      : `${structure} ${impulse}`;

  return {
    alignment: alignmentName,
    archetype: ARCHETYPES[alignmentName] || "Unknown",
    structure,
    impulse,
    structureScore,
    impulseScore,
  };
}

export const ALIGNMENT_COLORS: Record<string, string> = {
  "Lawful Good": "#3b82f6",
  "Neutral Good": "#14b8a6",
  "Chaotic Good": "#a855f7",
  "Lawful Neutral": "#6b7280",
  "True Neutral": "#71717a",
  "Chaotic Neutral": "#f59e0b",
  "Lawful Evil": "#ef4444",
  "Neutral Evil": "#dc2626",
  "Chaotic Evil": "#991b1b",
};

export const ALL_ALIGNMENTS = [
  { name: "Lawful Good", archetype: "The Crusader", row: 0, col: 0 },
  { name: "Neutral Good", archetype: "The Benefactor", row: 0, col: 1 },
  { name: "Chaotic Good", archetype: "The Rebel", row: 0, col: 2 },
  { name: "Lawful Neutral", archetype: "The Judge", row: 1, col: 0 },
  { name: "True Neutral", archetype: "The Undecided", row: 1, col: 1 },
  { name: "Chaotic Neutral", archetype: "The Free Spirit", row: 1, col: 2 },
  { name: "Lawful Evil", archetype: "The Dominator", row: 2, col: 0 },
  { name: "Neutral Evil", archetype: "The Malefactor", row: 2, col: 1 },
  { name: "Chaotic Evil", archetype: "The Destroyer", row: 2, col: 2 },
];
