import "server-only";

export interface WizardQuestionRaw {
  id: string;
  text: string;
  meta?: Record<string, unknown>;
}

export interface InterpretationResult {
  headline: string;
  summary: string;
  insights: string[];
  strengths: string[];
  challenges: string[];
  growth: string;
  // CJTE extras
  typeCode?: string;
  socionicsCode?: string;
  functionStack?: string[];
  // Socionics extras
  socType?: string;
  mbtiType?: string;
  quadra?: string;
  baseElement?: string;
  modelAStack?: string[];
  // PBCE extras
  pbceType?: string;
  nickname?: string;
  primaryDomain?: string;
  primaryDirection?: string;
}

function parseJSON(text: string): unknown {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

export function validateQuestions(raw: string): WizardQuestionRaw[] | null {
  try {
    const parsed = parseJSON(raw) as { questions?: WizardQuestionRaw[] };
    const questions = parsed?.questions;
    if (!Array.isArray(questions)) return null;
    const valid = questions.filter(
      (q) => typeof q.id === "string" && typeof q.text === "string" && q.text.length > 5
    );
    return valid.length > 0 ? valid : null;
  } catch {
    return null;
  }
}

export function validateInterpretation(raw: string): InterpretationResult | null {
  try {
    const parsed = parseJSON(raw) as InterpretationResult;
    if (
      typeof parsed.headline === "string" &&
      typeof parsed.summary === "string" &&
      Array.isArray(parsed.insights) &&
      parsed.insights.every((i) => typeof i === "string")
    ) {
      return {
        headline: parsed.headline,
        summary: parsed.summary,
        insights: parsed.insights,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
        growth: typeof parsed.growth === "string" ? parsed.growth : "",
        typeCode: parsed.typeCode,
        socionicsCode: parsed.socionicsCode,
        functionStack: parsed.functionStack,
        socType: parsed.socType,
        mbtiType: parsed.mbtiType,
        quadra: parsed.quadra,
        baseElement: parsed.baseElement,
        modelAStack: parsed.modelAStack,
        pbceType: parsed.pbceType,
        nickname: parsed.nickname,
        primaryDomain: parsed.primaryDomain,
        primaryDirection: parsed.primaryDirection,
      };
    }
    return null;
  } catch {
    return null;
  }
}
