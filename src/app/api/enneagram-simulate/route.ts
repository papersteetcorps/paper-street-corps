import { NextResponse } from "next/server";
import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";
import { getPrompts } from "@/lib/anthropic/prompts";

export const maxDuration = 30;

interface SimulationRequest {
  phases: Record<string, unknown>[];
  selectedTypes: number[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SimulationRequest;
    const { phases, selectedTypes } = body;

    if (!phases?.length || !selectedTypes?.length) {
      return NextResponse.json({ error: "Phases and selectedTypes required" }, { status: 400 });
    }
    if (JSON.stringify(phases).length > 100000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    if (selectedTypes.length > 3) {
      return NextResponse.json({ error: "Maximum 3 types" }, { status: 400 });
    }

    const client = getAnthropicClient();
    if (!client) {
      return NextResponse.json({ simulation: null, error: "ANTHROPIC_API_KEY not configured" });
    }

    const { interpret: systemPrompt } = getPrompts("enneagram");

    const userMessage = JSON.stringify({
      phases,
      selectedTypes,
      instruction: `Simulate types ${selectedTypes.join(", ")} against the user's life phases. Be CONCISE — every sentence must earn its place.

For EACH type return:
- "tldr": Exactly 1-2 sentences. The single core pattern for this type across all phases. Ultra specific to user's data, not generic.
- "fixation": { "name": "...", "evidence": "1 sentence max — cite a specific moment or pattern from user's phases" }
- "passion": same format, 1 sentence max
- "trap": same format, 1 sentence max
- "shocking": 1 sentence — something the user did not consciously realize, derived from simulation. Make it hit.

Do NOT include a narrative field. Keep total output SHORT.

Return ONLY valid JSON:
{
  "simulations": [
    {
      "type": 3,
      "tldr": "1-2 sentences",
      "fixation": { "name": "Vanity", "evidence": "1 sentence" },
      "passion": { "name": "Deceit", "evidence": "1 sentence" },
      "trap": { "name": "Efficiency", "evidence": "1 sentence" },
      "shocking": "1 sentence"
    }
  ],
  "headline": "Under 10 words",
  "summary": "1-2 sentences comparing the simulated types"
}`,
    });

    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const raw = response.content[0]?.type === "text" ? response.content[0].text : "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const simulation = JSON.parse(cleaned);
      return NextResponse.json({ simulation });
    } catch {
      return NextResponse.json({ simulation: null, rawText: raw, error: "Failed to parse simulation" });
    }
  } catch {
    return NextResponse.json({ simulation: null, error: "Internal error" });
  }
}
