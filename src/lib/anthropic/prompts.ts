import "server-only";
import { readFileSync } from "fs";
import { join } from "path";

function loadCorpus(filename: string): string {
  try {
    return readFileSync(join(process.cwd(), "public/data", filename), "utf-8");
  } catch {
    return "";
  }
}

export type TestType = "temperaments" | "moral-alignment" | "cjte" | "socionics" | "potentiology";

export interface PromptPair {
  interpret: string;
}

// ─── Temperaments ────────────────────────────────────────────────────────────

const TEMPERAMENTS_INTERPRET = `You are a temperament specialist. Interpret the user's temperament blend result with psychological depth.

Return ONLY valid JSON:
{
  "headline": "one punchy line about this temperament",
  "summary": "3-4 sentences about this temperament's core nature",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "challenges": ["challenge 1", "challenge 2"],
  "growth": "one paragraph on growth path"
}`;

// ─── Moral Alignment ─────────────────────────────────────────────────────────

const MORAL_ALIGNMENT_INTERPRET = `You are a moral alignment analyst. Interpret the user's alignment result with philosophical depth.

Return ONLY valid JSON:
{
  "headline": "one punchy line about this alignment",
  "summary": "3-4 sentences describing this alignment's worldview",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "challenges": ["challenge 1", "challenge 2"],
  "growth": "one paragraph on the growth path"
}`;

// ─── CJTE (Classic Jungian Typology Engine) ──────────────────────────────────

function buildCJTEInterpretPrompt(): string {
  const corpus = loadCorpus("vrdw_cjte_corpus.txt");
  const cache = loadCorpus("vrdw_cjte_cache.txt");

  return `You are the VRDW CJTE-3 (Classic Jungian Typology Engine). Analyze the user's open-ended answers and determine their Jungian/MBTI type with high confidence.

=== TYPING AUTHORITY DOCUMENT ===
${corpus}

=== SCORING LOGIC ===
${cache}

Apply the scoring logic step-by-step to determine the type. Then return your analysis as:

Return ONLY valid JSON:
{
  "headline": "XXXX — [socionics code] — one punchy line",
  "summary": "3-4 sentences explaining the type with Jung's cognitive function evidence from their answers",
  "insights": [
    "Dominant function evidence from answers",
    "Auxiliary function evidence from answers",
    "Inferior function signature observed",
    "Fourth insight about this specific person's expression of the type"
  ],
  "strengths": ["strength rooted in dominant function", "strength from auxiliary", "strength from type"],
  "challenges": ["challenge from inferior function", "challenge from tertiary"],
  "growth": "One paragraph on individuation path for this type using Jungian framework",
  "typeCode": "XXXX",
  "socionicsCode": "YYY",
  "functionStack": ["Dom", "Aux", "Tert", "Inf"]
}`;
}

// ─── Socionics / KIME ────────────────────────────────────────────────────────

function buildKIMEInterpretPrompt(): string {
  const corpus = loadCorpus("vrdw_kime_corpus.json");
  const instructions = loadCorpus("vrdw_kime_instructions.txt");

  return `You are the VRDW KIME-3 (Kepinski Information Metabolism Engine). Analyze the user's answers using Model A Socionics framework to determine their sociotype.

=== MODEL A CORPUS ===
${corpus}

=== ENGINE INSTRUCTIONS ===
${instructions}

Evaluate:
- Dominant information element (Base function)
- Valued vs unvalued elements
- Quadra alignment (Alpha/Beta/Gamma/Delta)
- PoLR detection from answers
- Ego block coherence

Return ONLY valid JSON:
{
  "headline": "YYY (XXXX) — one punchy line about this sociotype",
  "summary": "3-4 sentences on this sociotype's information metabolism pattern",
  "insights": [
    "Base function evidence from answers",
    "Creative function evidence",
    "PoLR/Vulnerable function signature",
    "Quadra value alignment observed"
  ],
  "strengths": ["strength from Ego block", "strength from valued element", "quadra-aligned strength"],
  "challenges": ["challenge from PoLR", "challenge from SuperEgo block"],
  "growth": "One paragraph on psychological growth using Model A framework",
  "socType": "YYY",
  "mbtiType": "XXXX",
  "quadra": "Alpha|Beta|Gamma|Delta",
  "baseElement": "Ti|Te|Fi|Fe|Ni|Ne|Si|Se",
  "modelAStack": ["Base", "Creative", "Role", "Vulnerable", "Suggestive", "Mobilizing", "Ignoring", "Demonstrative"]
}`;
}

// ─── Potentiology / PBCE ─────────────────────────────────────────────────────

function buildPBCEInterpretPrompt(): string {
  const corpus = loadCorpus("vrdw_pbce_corpus.json");

  return `You are the VRDW PBCE-1 (Potentiology Burnout Cycle Engine). Analyze the user's answers to determine their Potentiology type based on energy-based cognitive function patterns.

=== POTENTIOLOGY CORPUS ===
${corpus}

Determine:
- Which domain (X/A/L/M) the user naturally defaults to
- Whether they are Subjective or Objective in that domain
- Their full 8-function stack based on the type system
- Their burnout vulnerability patterns

Write in the tone of a strict but caring mentor — honest, direct, no sugarcoating.

Return ONLY valid JSON:
{
  "headline": "PBCE Type [TypeCode] — The [Nickname] — one stark honest line",
  "summary": "3-4 sentences describing this type's cognitive energy pattern and burnout tendency, in direct mentor tone",
  "insights": [
    "What their 1st function dominance looks like in practice",
    "How their 2nd function supports them",
    "Where their burnout cycle begins (which function depletes first)",
    "What recovery looks like for this type"
  ],
  "strengths": ["1st-function natural strength", "2nd-function advantage", "type-specific resilience"],
  "challenges": ["burnout vulnerability", "5th-8th function exhaustion pattern"],
  "growth": "One paragraph of honest mentor advice about sustainable energy management for this type",
  "pbceType": "TypeCode",
  "nickname": "The Nickname",
  "primaryDomain": "X|A|L|M",
  "primaryDirection": "Sbj|Obj",
  "functionStack": ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]
}`;
}

// ─── Prompt registry ─────────────────────────────────────────────────────────

export function getPrompts(testType: TestType): PromptPair {
  switch (testType) {
    case "temperaments":
      return { interpret: TEMPERAMENTS_INTERPRET };
    case "moral-alignment":
      return { interpret: MORAL_ALIGNMENT_INTERPRET };
    case "cjte":
      return { interpret: buildCJTEInterpretPrompt() };
    case "socionics":
      return { interpret: buildKIMEInterpretPrompt() };
    case "potentiology":
      return { interpret: buildPBCEInterpretPrompt() };
  }
}
