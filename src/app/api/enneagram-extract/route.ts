import { NextResponse } from "next/server";
import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { text } = (await request.json()) as { text: string };

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const client = getAnthropicClient();
    if (!client) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" });
    }

    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: `You extract structured life-phase data from free-text descriptions. Be precise — only include what is explicitly stated or clearly implied. Leave fields as empty strings or empty arrays if not mentioned. Do not invent details.

Return ONLY valid JSON (no markdown, no backticks):
{
  "phaseName": "short name for this life period",
  "map": "location or empty string",
  "submaps": [{ "name": "place name", "slice": "when", "frequency": "how often" }],
  "info": { "ageRange": "", "occupation": "", "illness": [] },
  "lifestyle": { "routine": [], "facilities": [], "scarcity": [] },
  "environment": {
    "locality": "",
    "people": {
      "guardianRelation": [],
      "siblingRelation": [],
      "friendsRelation": [],
      "mentorRelation": []
    },
    "society": { "elements": [], "societalValues": [] }
  },
  "moments": [{ "situation": "what happened", "conclusion": "what came of it" }]
}`,
      messages: [{ role: "user", content: text }],
    });

    const raw = response.content[0]?.type === "text" ? response.content[0].text : "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const extracted = JSON.parse(cleaned);
      return NextResponse.json({ extracted });
    } catch {
      return NextResponse.json({ error: "Failed to parse extraction" });
    }
  } catch {
    return NextResponse.json({ error: "Internal error" });
  }
}
