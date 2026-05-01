import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";

export const maxDuration = 15;

export async function POST(request: Request) {
  try {
    const { question, answer } = await request.json() as {
      question: string;
      answer: string;
    };

    if (!question || !answer) {
      return Response.json({ valid: false, reason: "Missing question or answer" }, { status: 400 });
    }

    // Cheap local check: clearly too short
    const trimmed = answer.trim();
    if (trimmed.length < 5) {
      return Response.json({ valid: false, reason: "Could you say a bit more?" });
    }

    const client = getAnthropicClient();
    if (!client) {
      // Fallback: word-count heuristic if Claude unavailable
      const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
      return Response.json({ valid: wordCount >= 8 });
    }

    const msg = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Question: ${question}\n\nUser's answer: ${answer}\n\nIs this answer substantive enough to capture the user's perspective? An answer is substantive if it provides specific details, examples, or personal reflection. Vague one-liners or single words are NOT substantive.\n\nReply with JSON only:\n{"valid": true} if the answer is substantive\n{"valid": false, "reason": "<one short sentence asking for more — friendly tone>"} if too vague`,
        },
      ],
    });

    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]) as { valid: boolean; reason?: string };
        return Response.json(parsed);
      } catch {
        return Response.json({ valid: true });
      }
    }
    return Response.json({ valid: true });
  } catch {
    // On any error, accept the answer rather than blocking the user
    return Response.json({ valid: true });
  }
}
