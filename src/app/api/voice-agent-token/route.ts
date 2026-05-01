import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ASSEMBLYAI_API_KEY not configured" }, { status: 500 });
  }

  // Try to mint a short-lived temp token for browser use.
  // Falls back to the API key if AssemblyAI's token endpoint isn't reachable.
  try {
    const res = await fetch("https://api.assemblyai.com/v3/voice-agents/token", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expires_in_seconds: 600 }),
    });
    if (res.ok) {
      const data = await res.json() as { token?: string };
      if (data.token) {
        return NextResponse.json({ token: data.token });
      }
    }
  } catch {
    // fall through to direct key fallback
  }

  return NextResponse.json({ token: apiKey });
}
