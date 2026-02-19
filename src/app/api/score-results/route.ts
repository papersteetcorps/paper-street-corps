import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai/client";
import { SYSTEM_PROMPTS, type TestType } from "@/lib/openai/prompts";
import { validateInterpretation } from "@/lib/openai/schemas";

export const maxDuration = 15;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testType, answers, localResult } = body as {
      testType: TestType;
      answers: { questionId: string; value: number }[];
      localResult: Record<string, unknown>;
    };

    if (!SYSTEM_PROMPTS[testType]) {
      return NextResponse.json(
        { error: "Invalid test type" },
        { status: 400 }
      );
    }

    const client = getOpenAIClient();
    if (!client) {
      return NextResponse.json({ interpretation: null });
    }

    const systemPrompt = SYSTEM_PROMPTS[testType].interpret;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            answers,
            localResult,
          }),
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ interpretation: null });
    }

    const interpretation = validateInterpretation(content);
    return NextResponse.json({ interpretation });
  } catch {
    return NextResponse.json({ interpretation: null });
  }
}
