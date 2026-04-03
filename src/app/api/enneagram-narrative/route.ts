import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";
import { getPrompts } from "@/lib/anthropic/prompts";

export const maxDuration = 45;

interface NarrativeRequest {
  phases: Record<string, unknown>[];
  type: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NarrativeRequest;
    const { phases, type } = body;

    if (!phases?.length || !type) {
      return new Response("Missing phases or type", { status: 400 });
    }

    const client = getAnthropicClient();
    if (!client) {
      return new Response("ANTHROPIC_API_KEY not configured", { status: 200 });
    }

    const { interpret: systemPrompt } = getPrompts("enneagram");

    const userMessage = JSON.stringify({
      phases,
      selectedTypes: [type],
      instruction: `Simulate ONLY Type ${type} against the user's life phases. Write the full phase-by-phase narrative as per engine instructions — paragraphs, warm mentor tone, covering fixation, passion, trap, and holy idea as they manifest in the concrete situations. Start from the first phase to the last. Return ONLY the narrative text, no JSON.`,
    });

    const stream = client.messages.stream({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response("Failed to generate narrative.", { status: 200 });
  }
}
