import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";
import { readFileSync } from "fs";
import { join } from "path";

export const maxDuration = 45;

function loadCorpus(filename: string): string {
  try {
    return readFileSync(join(process.cwd(), "public/data", filename), "utf-8");
  } catch {
    return "";
  }
}

function buildSynthesisPrompt(results: Array<{ testType: string; result: Record<string, unknown> }>) {
  const cjtCorpus = loadCorpus("vrdw_cjte_corpus.txt");
  const kimeCorpus = loadCorpus("vrdw_kime_corpus.json");
  const pbceCorpus = loadCorpus("vrdw_pbce_corpus.json");

  const frameworks = results.map((r) => r.testType).join(", ");

  return `You are a master personality analyst with deep expertise in all five frameworks used on this platform:
1. Classic Jungian CJTE — 8 cognitive functions, Jungian typology
2. Socionics KIME — Model A, 16 sociotypes, information elements
3. Potentiology PBCE — 8 cognitive functions, energy/burnout model
4. Temperaments — Choleric / Melancholic / Phlegmatic / Sanguine
5. Moral Alignment — 3x3 grid (Structure × Impulse axes)

=== JUNGIAN CORPUS ===
${cjtCorpus}

=== SOCIONICS CORPUS ===
${kimeCorpus}

=== POTENTIOLOGY CORPUS ===
${pbceCorpus}

=== USER'S COMPLETED TEST RESULTS ===
Frameworks taken: ${frameworks}
${results.map((r) => `\n--- ${r.testType.toUpperCase()} ---\n${JSON.stringify(r.result, null, 2)}`).join("\n")}

Your task: Synthesize ALL provided results into one unified psychological profile.

Instructions:
- Find the common thread across all results — what single underlying pattern explains them all?
- Identify where frameworks converge (confirming the same underlying trait) and where they diverge (adding nuance or revealing internal conflict).
- Do not just summarize each test separately — create something NEW by combining them.
- Be specific: cite the actual types/scores from the results.
- Write with psychological depth, not pop-psychology optimism.

Return ONLY valid JSON:
{
  "title": "A short evocative title for this synthesis (e.g. 'The Structured Lone Architect')",
  "coreProfile": "2-3 sentences identifying the single underlying pattern that runs across ALL results",
  "convergences": [
    { "frameworks": ["cjte", "socionics"], "insight": "What these two frameworks both confirm about this person" }
  ],
  "divergences": [
    { "insight": "Where one framework adds nuance or appears to contradict another, and what that means" }
  ],
  "unifiedStrengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "unifiedChallenges": ["challenge 1", "challenge 2", "challenge 3"],
  "blindSpots": "One paragraph on the structural blind spots revealed by combining all frameworks — the things multiple frameworks flag simultaneously",
  "growthPath": "One paragraph on the growth trajectory suggested by the full profile — where this person is being pulled developmentally",
  "frameworks": ["list of frameworks included in this synthesis"]
}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { results } = body as {
      results: Array<{ testType: string; result: Record<string, unknown> }>;
    };

    if (!results || results.length < 2) {
      return Response.json({ error: "At least 2 test results required for synthesis" }, { status: 400 });
    }

    const client = getAnthropicClient();
    if (!client) {
      return Response.json({ synthesis: null, error: "ANTHROPIC_API_KEY not configured" });
    }

    const systemPrompt = buildSynthesisPrompt(results);

    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        { role: "user", content: "Generate the cross-framework synthesis now. Return ONLY valid JSON." },
      ],
    });

    const raw =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const synthesis = JSON.parse(cleaned);
      return Response.json({ synthesis });
    } catch {
      return Response.json({ synthesis: null, error: "Failed to parse synthesis" });
    }
  } catch {
    return Response.json({ synthesis: null, error: "Internal error" });
  }
}
