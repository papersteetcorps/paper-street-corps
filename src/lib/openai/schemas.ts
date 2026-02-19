import "server-only";

interface RawMBTIQuestion {
  text: string;
  weights: Record<string, number>;
}

interface RawTemperamentQuestion {
  text: string;
  chemical: string;
  lowLabel: string;
  highLabel: string;
}

interface RawMoralAlignmentQuestion {
  text: string;
  axis: string;
  lowLabel: string;
  highLabel: string;
}

export interface InterpretationResult {
  narrative: string;
  insights: string[];
  typeDescription: string;
}

const VALID_MBTI_CHEMICALS = [
  "dopamine",
  "serotonin",
  "norepinephrine",
  "acetylcholine",
  "oxytocin",
];

const VALID_TEMP_CHEMICALS = [
  "cortisol",
  "dopamine",
  "oxytocin",
  "serotonin",
  "androgenicity",
];

function parseJSON(text: string): unknown {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

export function validateMBTIQuestions(raw: string): RawMBTIQuestion[] | null {
  try {
    const parsed = parseJSON(raw);
    if (!Array.isArray(parsed)) return null;
    const valid = parsed.filter(
      (q: RawMBTIQuestion) =>
        typeof q.text === "string" &&
        q.text.length > 0 &&
        typeof q.weights === "object" &&
        Object.keys(q.weights).every(
          (k) =>
            VALID_MBTI_CHEMICALS.includes(k) &&
            typeof q.weights[k] === "number" &&
            q.weights[k] > 0 &&
            q.weights[k] <= 1
        ) &&
        Object.keys(q.weights).length > 0
    );
    return valid.length > 0 ? valid : null;
  } catch {
    return null;
  }
}

export function validateTemperamentQuestions(
  raw: string
): RawTemperamentQuestion[] | null {
  try {
    const parsed = parseJSON(raw);
    if (!Array.isArray(parsed)) return null;
    const valid = parsed.filter(
      (q: RawTemperamentQuestion) =>
        typeof q.text === "string" &&
        q.text.length > 0 &&
        typeof q.chemical === "string" &&
        VALID_TEMP_CHEMICALS.includes(q.chemical) &&
        typeof q.lowLabel === "string" &&
        typeof q.highLabel === "string"
    );
    return valid.length > 0 ? valid : null;
  } catch {
    return null;
  }
}

export function validateMoralAlignmentQuestions(
  raw: string
): RawMoralAlignmentQuestion[] | null {
  try {
    const parsed = parseJSON(raw);
    if (!Array.isArray(parsed)) return null;
    const valid = parsed.filter(
      (q: RawMoralAlignmentQuestion) =>
        typeof q.text === "string" &&
        q.text.length > 0 &&
        typeof q.axis === "string" &&
        ["structure", "impulse"].includes(q.axis) &&
        typeof q.lowLabel === "string" &&
        typeof q.highLabel === "string"
    );
    return valid.length > 0 ? valid : null;
  } catch {
    return null;
  }
}

export function validateInterpretation(
  raw: string
): InterpretationResult | null {
  try {
    const parsed = parseJSON(raw) as InterpretationResult;
    if (
      typeof parsed.narrative === "string" &&
      Array.isArray(parsed.insights) &&
      parsed.insights.every((i: unknown) => typeof i === "string") &&
      typeof parsed.typeDescription === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
