import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini/client";
import { getPrompts, type TestType } from "@/lib/gemini/prompts";
import { validateInterpretation } from "@/lib/gemini/schemas";
import { createClient } from "@/lib/supabase/server";

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
    const { testType, answers, localResult } = body as {
      testType: TestType;
      answers: Array<{ questionId: string; value: number | string }>;
      localResult: Record<string, unknown>;
    };

    if (!VALID_TYPES.includes(testType)) {
      return NextResponse.json({ error: "Invalid test type" }, { status: 400 });
    }

    // Save to Supabase if user is logged in (fire-and-forget)
    const saveToHistory = async () => {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("test_results").insert({
            user_id: user.id,
            test_type: testType,
            result_json: { ...localResult, answers },
          });
        }
      } catch {
        // Non-fatal
      }
    };

    const geminiClient = getGeminiClient();

    const [interpretation] = await Promise.all([
      geminiClient
        ? (async () => {
            const { interpret: systemPrompt } = getPrompts(testType);
            const model = geminiClient.getGenerativeModel({
              model: "gemini-2.5-flash-lite",
              systemInstruction: systemPrompt,
            });
            const result = await model.generateContent(
              JSON.stringify({ answers, localResult })
            );
            return validateInterpretation(result.response.text());
          })().catch(() => null)
        : Promise.resolve(null),
      saveToHistory(),
    ]);

    return NextResponse.json({ interpretation });
  } catch {
    return NextResponse.json({ interpretation: null });
  }
}
