import { NextResponse } from "next/server";
import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";
import { getPrompts, type TestType } from "@/lib/anthropic/prompts";
import { validateQuestions } from "@/lib/anthropic/schemas";
import type { WizardQuestion } from "@/lib/types/wizard";

export const maxDuration = 30;

const VALID_TYPES: TestType[] = [
  "temperaments",
  "moral-alignment",
  "cjte",
  "socionics",
  "potentiology",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testType } = body as { testType: TestType };

    if (!VALID_TYPES.includes(testType)) {
      return NextResponse.json({ error: "Invalid test type" }, { status: 400 });
    }

    const client = getAnthropicClient();
    if (!client) {
      return NextResponse.json({ questions: null, fallback: true });
    }

    const { generate: systemPrompt } = getPrompts(testType);

    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        { role: "user", content: "Generate the questions now. Return ONLY valid JSON as specified." },
      ],
    });

    const content =
      response.content[0]?.type === "text" ? response.content[0].text : null;

    if (!content) {
      return NextResponse.json({ questions: null, fallback: true });
    }

    const raw = validateQuestions(content);
    if (!raw) {
      return NextResponse.json({ questions: null, fallback: true });
    }

    // Determine answer type based on test type
    const isOpenEnded = testType === "cjte" || testType === "socionics" || testType === "potentiology";
    const answerType = isOpenEnded ? ("text" as const) : ("scale" as const);

    const questions: WizardQuestion[] = raw.map((q, i) => ({
      id: q.id ?? `${testType}-q${i + 1}`,
      text: q.text,
      answerType,
      labels: answerType === "scale" ? (["Strongly Disagree", "Strongly Agree"] as [string, string]) : undefined,
      min: answerType === "scale" ? 1 : undefined,
      max: answerType === "scale" ? 5 : undefined,
      meta: q.meta ?? {},
    }));

    return NextResponse.json({ questions, fallback: false });
  } catch {
    return NextResponse.json({ questions: null, fallback: true });
  }
}
