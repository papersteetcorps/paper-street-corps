import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";
import type { WizardQuestion, WizardAnswer } from "@/lib/types/wizard";

export const maxDuration = 45;

type Turn = { role: "ai" | "user"; text: string };

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      questions: WizardQuestion[];
      transcript: Turn[];
    };
    const { questions, transcript } = body;

    if (!questions?.length || !transcript?.length) {
      return Response.json({ error: "Missing questions or transcript" }, { status: 400 });
    }

    const client = getAnthropicClient();
    if (!client) {
      return Response.json({ error: "Anthropic not configured" }, { status: 500 });
    }

    const transcriptText = transcript
      .map((t) => `${t.role === "ai" ? "Coach" : "User"}: ${t.text}`)
      .join("\n");

    const questionList = questions
      .map((q, i) => {
        if (q.answerType === "slider") {
          const min = q.min ?? 1;
          const max = q.max ?? 5;
          const lbls = q.labels ? ` (${q.labels[0]} = ${min}, ${q.labels[1]} = ${max})` : "";
          return `${i + 1}. [${q.id}] [SCALE ${min}-${max}${lbls}] ${q.text}`;
        }
        return `${i + 1}. [${q.id}] [TEXT] ${q.text}`;
      })
      .join("\n");

    const prompt = `You read a casual conversation between an interviewer and a user, and extract answers to a fixed list of personality test questions from what the user said.

THE QUESTIONS TO ANSWER:
${questionList}

THE FULL CONVERSATION:
${transcriptText}

YOUR JOB:
- For each question, extract the user's actual answer based on EVERYTHING they said in the conversation. Connect dots across multiple turns if needed.
- For [TEXT] questions: write a concise paragraph (2-4 sentences) capturing what the user expressed about that topic. Use the user's own words/phrasing where possible. If the user didn't address a topic at all, say "Not discussed."
- For [SCALE] questions: pick a number in the given range based on the user's overall sentiment. If unclear, default to the middle.
- Do NOT make up information the user didn't share. If a topic wasn't covered, mark it as "Not discussed."

Return ONLY valid JSON in this exact shape:
{
  "answers": [
    { "questionId": "<id from question>", "value": "<extracted answer text or number>" }
  ]
}`;

    const msg = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return Response.json({ error: "Could not parse Claude response" }, { status: 500 });
    }

    const parsed = JSON.parse(match[0]) as { answers: WizardAnswer[] };

    // Coerce slider values to numbers; clamp to question range
    const answers: WizardAnswer[] = parsed.answers.map((a) => {
      const q = questions.find((x) => x.id === a.questionId);
      if (q?.answerType === "slider") {
        const min = q.min ?? 1;
        const max = q.max ?? 5;
        const num = typeof a.value === "number" ? a.value : parseInt(String(a.value), 10);
        const clamped = isNaN(num) ? Math.round((min + max) / 2) : Math.max(min, Math.min(max, num));
        return { questionId: a.questionId, value: clamped };
      }
      return { questionId: a.questionId, value: String(a.value ?? "Not discussed") };
    });

    return Response.json({ answers });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
