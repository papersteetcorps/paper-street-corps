import { NextResponse } from "next/server";
import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";
import { readFileSync } from "fs";
import { join } from "path";

export const maxDuration = 60;

function loadCorpus(filename: string): string {
  try {
    return readFileSync(join(process.cwd(), "public/enneagram-data", filename), "utf-8");
  } catch {
    return "";
  }
}

interface QuizRequest {
  phases: Record<string, unknown>[];
  comparedTypes: number[];
  round: number;
  previousAnswers?: { questionId: string; chosenType: number }[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuizRequest;
    const { phases, comparedTypes, round, previousAnswers } = body;

    if (!phases?.length || !comparedTypes?.length || comparedTypes.length < 2) {
      return NextResponse.json({ error: "Need phases and at least 2 types to compare" }, { status: 400 });
    }
    if (JSON.stringify(body).length > 100000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const client = getAnthropicClient();
    if (!client) {
      return NextResponse.json({ questions: null, error: "ANTHROPIC_API_KEY not configured" });
    }

    const corpus = loadCorpus("vrdw_inee_corpus.json");

    const systemPrompt = `You are the VRDW INEE-2 quiz engine. Your task is to generate 10 personalized quiz questions to help determine which Enneagram type the user is closest to.

=== ENNEAGRAM CORPUS ===
${corpus}

Rules for quiz generation:
- Each question must describe a CONCRETE scenario derived from or inspired by the user's own life phase data — alter the details slightly so it feels personal but is not a direct copy.
- Each question has one option per compared type. The option text describes how that Enneagram type would typically react, think, or feel in that scenario.
- Options should be written so the user picks the one that resonates most with their actual experience — not the one that sounds "best."
- Do NOT label options with type numbers — the user should not know which option maps to which type.
- Questions should cover different phases and different aspects (fixation, passion, trap, relationships, stress response, decision-making).
- Round ${round}: ${round > 1 ? "Generate DIFFERENT questions from previous rounds. Focus on more nuanced distinctions." : "Start with broad distinguishing scenarios."}

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "r${round}-q1",
      "scenario": "A concrete scenario derived from the user's life phases",
      "options": [
        { "type": 4, "text": "Description of how this type would process this scenario (without mentioning the type number)" }
      ]
    }
  ]
}`;

    const userMessage = JSON.stringify({
      phases,
      comparedTypes,
      round,
      previousAnswers: previousAnswers ?? [],
    });

    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const raw = response.content[0]?.type === "text" ? response.content[0].text : "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ questions: parsed.questions });
    } catch {
      return NextResponse.json({ questions: null, error: "Failed to parse quiz questions" });
    }
  } catch {
    return NextResponse.json({ questions: null, error: "Internal error" });
  }
}
