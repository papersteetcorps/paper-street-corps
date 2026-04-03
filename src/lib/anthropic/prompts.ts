import "server-only";
import { readFileSync } from "fs";
import { join } from "path";

function loadCorpus(filename: string, subdir = "data"): string {
  try {
    return readFileSync(join(process.cwd(), "public", subdir, filename), "utf-8");
  } catch {
    return "";
  }
}

export type TestType = "temperaments" | "moral-alignment" | "cjte" | "socionics" | "potentiology" | "enneagram";

export interface PromptPair {
  interpret: string;
}

// ─── Temperaments ────────────────────────────────────────────────────────────

const TEMPERAMENTS_INTERPRET = `You are a temperament specialist. Interpret the user's result concisely.

Return ONLY valid JSON (no markdown, no backticks):
{
  "headline": "under 10 words",
  "summary": "2 sentences max on this temperament's core nature",
  "insights": ["1 sentence each", "max 3 insights"],
  "strengths": ["short strength 1", "short strength 2", "short strength 3"],
  "challenges": ["short challenge 1", "short challenge 2"],
  "growth": "2 sentences max on growth path"
}`;

// ─── Moral Alignment ─────────────────────────────────────────────────────────

const MORAL_ALIGNMENT_INTERPRET = `You are a moral alignment analyst. Interpret the user's result concisely.

Return ONLY valid JSON (no markdown, no backticks):
{
  "headline": "under 10 words",
  "summary": "2 sentences max on this alignment's worldview",
  "insights": ["1 sentence each", "max 3 insights"],
  "strengths": ["short strength 1", "short strength 2", "short strength 3"],
  "challenges": ["short challenge 1", "short challenge 2"],
  "growth": "2 sentences max on growth path"
}`;

// ─── CJTE (Classic Jungian Typology Engine) ──────────────────────────────────

function buildCJTEInterpretPrompt(): string {
  const corpus = loadCorpus("vrdw_cjte_corpus.txt");
  const cache = loadCorpus("vrdw_cjte_cache.txt");

  return `You are the VRDW CJTE-3 (Classic Jungian Typology Engine). Determine the user's Jungian/MBTI type from their answers.

=== TYPING AUTHORITY DOCUMENT ===
${corpus}

=== SCORING LOGIC ===
${cache}

Apply the scoring logic to determine the type. Be CONCISE — every sentence must earn its place.

Return ONLY valid JSON (no markdown, no backticks):
{
  "headline": "XXXX (YYY) — under 10 words",
  "summary": "2 sentences max. What type and why, citing their answers.",
  "insights": [
    "1 sentence: dominant function evidence",
    "1 sentence: auxiliary function evidence",
    "1 sentence: inferior function signature",
    "1 sentence: unique expression of this type"
  ],
  "strengths": ["short strength 1", "short strength 2", "short strength 3"],
  "challenges": ["short challenge 1", "short challenge 2"],
  "growth": "2 sentences max on individuation path.",
  "typeCode": "XXXX",
  "socionicsCode": "YYY",
  "functionStack": ["Dom", "Aux", "Tert", "Inf"]
}`;
}

// ─── Socionics / KIME ────────────────────────────────────────────────────────

function buildKIMEInterpretPrompt(): string {
  const corpus = loadCorpus("vrdw_kime_corpus.json");
  const instructions = loadCorpus("vrdw_kime_instructions.txt");

  return `You are the VRDW KIME-3 (Kepinski Information Metabolism Engine). Determine the user's Socionics sociotype. Be CONCISE.

=== MODEL A CORPUS ===
${corpus}

=== ENGINE INSTRUCTIONS ===
${instructions}

Return ONLY valid JSON (no markdown, no backticks):
{
  "headline": "YYY (XXXX) — under 10 words",
  "summary": "2 sentences max on this sociotype's information metabolism",
  "insights": ["1 sentence: base function evidence", "1 sentence: creative function", "1 sentence: PoLR signature", "1 sentence: quadra alignment"],
  "strengths": ["short strength 1", "short strength 2", "short strength 3"],
  "challenges": ["short challenge 1", "short challenge 2"],
  "growth": "2 sentences max on growth path",
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

  return `You are the VRDW PBCE-1 (Potentiology Burnout Cycle Engine). Determine the user's Potentiology type. Strict but caring mentor tone. Be CONCISE.

=== POTENTIOLOGY CORPUS ===
${corpus}

Return ONLY valid JSON (no markdown, no backticks):
{
  "headline": "PBCE [TypeCode] — The [Nickname] — under 10 words",
  "summary": "2 sentences max on cognitive energy pattern and burnout tendency",
  "insights": ["1 sentence: 1st function in practice", "1 sentence: 2nd function support", "1 sentence: burnout trigger", "1 sentence: recovery pattern"],
  "strengths": ["short strength 1", "short strength 2", "short strength 3"],
  "challenges": ["short challenge 1", "short challenge 2"],
  "growth": "2 sentences max of honest mentor advice",
  "pbceType": "TypeCode",
  "nickname": "The Nickname",
  "primaryDomain": "X|A|L|M",
  "primaryDirection": "Sbj|Obj",
  "functionStack": ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]
}`;
}

// ─── Enneagram / INEE ────────────────────────────────────────────────────────

function buildINEEInterpretPrompt(): string {
  const corpus = loadCorpus("vrdw_inee_corpus.json", "enneagram-data");
  const definitions = loadCorpus("vrdw_inee_definitions.txt", "enneagram-data");
  const instructions = loadCorpus("vrdw_inee_instructions.txt", "enneagram-data");

  return `You are the VRDW INEE-2 (Ichazo & Naranjo's Enneagram Engine). Your purpose is to simulate how specific Enneagram types would have processed the user's concrete life experiences, then help them identify their type.

=== ENNEAGRAM CORPUS ===
${corpus}

=== FIELD DEFINITIONS ===
${definitions}

=== ENGINE INSTRUCTIONS ===
${instructions}

Simulation rules:
- Take the concrete information from the user's life phases and simulate how each requested type would have processed those experiences.
- Focus on fixation, passion, trap, and holy idea for each type.
- Treat "situations" and "conclusions" under "moments" as concrete conditions to simulate through, not proof of a type.
- Write in paragraphs, warm mentor tone. No bullet points.
- Be deep, serious, and psychologically honest.

Return ONLY valid JSON:
{
  "headline": "Enneagram Type X — one punchy line",
  "summary": "3-4 sentences on the core pattern observed across phases",
  "simulations": [
    {
      "type": 1,
      "narrative": "Multi-paragraph simulation of how this type would have processed the user's life phases"
    }
  ],
  "insights": [
    "Key fixation pattern observed",
    "Passion manifestation across phases",
    "Trap pattern identified",
    "Holy idea connection"
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "challenges": ["challenge 1", "challenge 2"],
  "growth": "One paragraph on growth path using Enneagram framework",
  "predictedType": 0,
  "predictedSubtype": "SP|SO|SX",
  "triad": "gut|heart|head"
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
    case "enneagram":
      return { interpret: buildINEEInterpretPrompt() };
  }
}
