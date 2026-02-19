import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini/client";
import { getPrompts, type TestType } from "@/lib/gemini/prompts";
import { validateQuestions } from "@/lib/gemini/schemas";
import type { WizardQuestion } from "@/lib/types/wizard";

export const maxDuration = 30;

const VALID_TYPES: TestType[] = [
  "mbti",
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

    const client = getGeminiClient();
    if (!client) {
      return NextResponse.json({ questions: null, fallback: true });
    }

    const { generate: systemPrompt } = getPrompts(testType);
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(
      "Generate the questions now. Return ONLY valid JSON as specified."
    );
    const content = result.response.text();

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
