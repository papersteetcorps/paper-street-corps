export interface ScoringMatch {
  type: string;
  distance: number;
  confidence: number;
}

export interface MBTIScoringResult {
  testType: "mbti";
  matches: ScoringMatch[];
  userScores: Record<string, number>;
}

export interface TemperamentScoringResult {
  testType: "temperaments";
  primary: string;
  secondary: string | null;
  isBlend: boolean;
  variance: number;
  variances: Record<string, number>;
  userScores: Record<string, number>;
}

export interface MoralAlignmentScoringResult {
  testType: "moral-alignment";
  alignment: string;
  structureScore: number;
  impulseScore: number;
}

export type ScoringResult =
  | MBTIScoringResult
  | TemperamentScoringResult
  | MoralAlignmentScoringResult;
