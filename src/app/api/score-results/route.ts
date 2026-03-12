import { NextResponse } from "next/server";
import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";
import { getPrompts, type TestType } from "@/lib/anthropic/prompts";
import { validateInterpretation } from "@/lib/anthropic/schemas";
import { createClient } from "@/lib/supabase/server";

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

    const anthropicClient = getAnthropicClient();

    const [interpretation] = await Promise.all([
      anthropicClient
        ? (async () => {
            const { interpret: systemPrompt } = getPrompts(testType);
            const response = await anthropicClient.messages.create({
              model: ANTHROPIC_MODEL,
              max_tokens: 4096,
              system: systemPrompt,
              messages: [
                { role: "user", content: JSON.stringify({ answers, localResult }) },
              ],
            });
            const text =
              response.content[0]?.type === "text" ? response.content[0].text : "";
            return validateInterpretation(text);
          })().catch(() => null)
        : Promise.resolve(null),
      saveToHistory(),
    ]);

    return NextResponse.json({ interpretation });
  } catch {
    return NextResponse.json({ interpretation: null });
  }
}
