import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai/client";
import { SYSTEM_PROMPTS, type TestType } from "@/lib/openai/prompts";
import {
  validateMBTIQuestions,
  validateTemperamentQuestions,
  validateMoralAlignmentQuestions,
} from "@/lib/openai/schemas";
import type { WizardQuestion } from "@/lib/types/wizard";

export const maxDuration = 15;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testType, questionCount = 7 } = body as {
      testType: TestType;
      questionCount?: number;
    };

    if (!SYSTEM_PROMPTS[testType]) {
      return NextResponse.json(
        { error: "Invalid test type" },
        { status: 400 }
      );
    }

    const client = getOpenAIClient();
    if (!client) {
      return NextResponse.json({ questions: null, fallback: true });
    }

    const systemPrompt = SYSTEM_PROMPTS[testType].generate;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate exactly ${questionCount} questions.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ questions: null, fallback: true });
    }

    const questions = transformQuestions(testType, content, questionCount);
    if (!questions) {
      return NextResponse.json({ questions: null, fallback: true });
    }

    return NextResponse.json({ questions, fallback: false });
  } catch {
    return NextResponse.json({ questions: null, fallback: true });
  }
}

function transformQuestions(
  testType: TestType,
  raw: string,
  count: number
): WizardQuestion[] | null {
  switch (testType) {
    case "mbti": {
      const validated = validateMBTIQuestions(raw);
      if (!validated) return null;
      return validated.slice(0, count).map((q, i) => ({
        id: `llm-mbti-${i}`,
        text: q.text,
        description: `Chemical axis: ${Object.keys(q.weights).join(", ")}`,
        answerType: "scale" as const,
        labels: ["Strongly Disagree", "Strongly Agree"] as [string, string],
        min: 1,
        max: 5,
        meta: { weights: q.weights },
      }));
    }
    case "temperaments": {
      const validated = validateTemperamentQuestions(raw);
      if (!validated) return null;
      return validated.slice(0, count).map((q, i) => ({
        id: `llm-temp-${i}`,
        text: q.text,
        description: `Biochemical marker: ${q.chemical}`,
        answerType: "scale" as const,
        labels: [q.lowLabel, q.highLabel] as [string, string],
        min: 1,
        max: 5,
        meta: { chemical: q.chemical },
      }));
    }
    case "moral-alignment": {
      const validated = validateMoralAlignmentQuestions(raw);
      if (!validated) return null;
      return validated.slice(0, count).map((q, i) => ({
        id: `llm-ma-${i}`,
        text: q.text,
        description: `Axis: ${q.axis}`,
        answerType: "scale" as const,
        labels: [q.lowLabel, q.highLabel] as [string, string],
        min: 1,
        max: 5,
        meta: { axis: q.axis },
      }));
    }
    default:
      return null;
  }
}
