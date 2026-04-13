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

  return `You are writing a personal profile for someone who just took multiple personality assessments. Your job is to combine their results into one honest, clear picture of who they are.

Reference material:

=== JUNGIAN ===
${cjtCorpus}

=== SOCIONICS ===
${kimeCorpus}

=== ENERGY PROFILE ===
${pbceCorpus}

=== THIS PERSON'S RESULTS ===
Frameworks: ${frameworks}
${results.map((r) => `\n--- ${r.testType.toUpperCase()} ---\n${JSON.stringify(r.result, null, 2)}`).join("\n")}

WRITING RULES (follow these exactly):
- Write like you're talking directly to this person. Use "you" and "your."
- Keep every sentence short. No sentence over 20 words.
- Never use em dashes. Use periods or commas instead.
- No filler phrases like "it is worth noting" or "this suggests that" or "in essence."
- Be warm but honest. Don't sugarcoat, but don't be cold either.
- Be specific. Reference their actual types and scores, not vague generalizations.
- Don't summarize each test separately. Find what connects them.
- Strengths and challenges should be 5-8 words each, not full sentences.
- The core profile should feel like someone who really gets them wrote it.
- blindSpots: be direct. Tell them the thing they probably don't want to hear. 2-3 sentences max.
- growthPath: be concrete. Tell them what to actually do, not abstract advice. 2-3 sentences max.

Return ONLY valid JSON:
{
  "title": "3-5 word title that captures who they are (e.g. 'The Quiet Strategist')",
  "coreProfile": "2-3 short sentences. The thread that connects all their results. Write it like you know them.",
  "convergences": [
    { "frameworks": ["cjte", "socionics"], "insight": "One sentence. What both frameworks see in this person." }
  ],
  "divergences": [
    { "insight": "One sentence. Where frameworks disagree and what that actually means for them." }
  ],
  "unifiedStrengths": ["short phrase", "short phrase", "short phrase", "short phrase"],
  "unifiedChallenges": ["short phrase", "short phrase", "short phrase"],
  "blindSpots": "2-3 direct sentences about what they consistently miss about themselves.",
  "growthPath": "2-3 concrete sentences about what they should actually work on.",
  "frameworks": ["list of frameworks used"]
}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { results } = body as {
      results: Array<{ testType: string; result: Record<string, unknown> }>;
    };

    if (JSON.stringify(body).length > 100000) {
      return Response.json({ error: "Payload too large" }, { status: 413 });
    }
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
