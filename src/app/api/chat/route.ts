import { getAnthropicClient, ANTHROPIC_MODEL } from "@/lib/anthropic/client";
import { getPrompts, type TestType } from "@/lib/anthropic/prompts";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testType, result, messages } = body as {
      testType: TestType;
      result: Record<string, unknown>;
      messages: Array<{ role: "user" | "assistant"; text: string }>;
    };

    // Input length limits
    const bodyStr = JSON.stringify(body);
    if (bodyStr.length > 50000) {
      return new Response("Request too large", { status: 413 });
    }

    const client = getAnthropicClient();
    if (!client) {
      return new Response("Service not configured", { status: 503 });
    }

    // Build system instruction from the interpret prompt + result context
    const { interpret: basePrompt } = getPrompts(testType);
    const systemPrompt = `${basePrompt}

=== COMPLETED TEST RESULT (already computed) ===
${JSON.stringify(result, null, 2)}

You are now in a Doubt Session / Q&A mode. The user has received their result and wants to discuss it.
Rules:
- Assert the computed result confidently but remain open to nuance.
- Answer questions specifically using evidence from the result and the corpus.
- If the user challenges the result, defend it with framework-specific reasoning.
- Keep answers focused and under 200 words unless the question demands more.
- Do not repeat the full result unless asked.`;

    // Build chat history for Anthropic format
    // All messages except the last become history, last is the new user message
    const anthropicMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.text,
    }));

    // Stream the response
    const stream = client.messages.stream({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
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
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Failed to generate response.", { status: 500 });
  }
}
