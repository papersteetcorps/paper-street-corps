import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai/client";
import { SYSTEM_PROMPTS, type TestType } from "@/lib/openai/prompts";
import { validateInterpretation } from "@/lib/openai/schemas";
import { createClient } from "@/lib/supabase/server";

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
            result_json: localResult,
          });
        }
      } catch {
        // Non-fatal — don't block the response
      }
    };

    const client = getOpenAIClient();

    // Run save + LLM in parallel
    const [interpretation] = await Promise.all([
      client
        ? client.chat.completions
            .create({
              model: "gpt-4o",
              messages: [
                { role: "system", content: SYSTEM_PROMPTS[testType].interpret },
                { role: "user", content: JSON.stringify({ answers, localResult }) },
              ],
              temperature: 0.7,
              max_tokens: 1500,
            })
            .then((r) => validateInterpretation(r.choices[0]?.message?.content ?? ""))
            .catch(() => null)
        : Promise.resolve(null),
      saveToHistory(),
    ]);

    return NextResponse.json({ interpretation });
  } catch {
    return NextResponse.json({ interpretation: null });
  }
}
