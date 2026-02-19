import { getGeminiClient } from "@/lib/gemini/client";
import { getPrompts, type TestType } from "@/lib/gemini/prompts";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testType, result, messages } = body as {
      testType: TestType;
      result: Record<string, unknown>;
      messages: Array<{ role: "user" | "model"; text: string }>;
    };

    const client = getGeminiClient();
    if (!client) {
      return new Response(
        "Gemini API key not configured. Add GEMINI_API_KEY to your environment.",
        { status: 200, headers: { "Content-Type": "text/plain" } }
      );
    }

    // Build system instruction from the interpret prompt + result context
    const { interpret: basePrompt } = getPrompts(testType);
    const systemInstruction = `${basePrompt}

=== COMPLETED TEST RESULT (already computed) ===
${JSON.stringify(result, null, 2)}

You are now in a Doubt Session / Q&A mode. The user has received their result and wants to discuss it.
Rules:
- Assert the computed result confidently but remain open to nuance.
- Answer questions specifically using evidence from the result and the corpus.
- If the user challenges the result, defend it with framework-specific reasoning.
- Keep answers focused and under 200 words unless the question demands more.
- Do not repeat the full result unless asked.`;

    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction,
    });

    // Build chat history (all messages except the last user message)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return new Response("Invalid message format", { status: 400 });
    }

    const chat = model.startChat({ history });
    const result2 = await chat.sendMessageStream(lastMessage.text);

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result2.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Failed to generate response.", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
