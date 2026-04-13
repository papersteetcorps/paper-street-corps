import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ASSEMBLYAI_API_KEY not configured" }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({ expires_in_seconds: "480" });
    const res = await fetch(
      `https://streaming.assemblyai.com/v3/token?${params}`,
      { method: "GET", headers: { Authorization: apiKey } }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("AssemblyAI token error:", res.status, body);
      return NextResponse.json({ error: "Failed to generate voice token" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ token: data.token });
  } catch (err) {
    console.error("Speech token fetch failed:", err);
    return NextResponse.json({ error: "Voice service unavailable" }, { status: 500 });
  }
}
