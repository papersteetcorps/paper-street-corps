import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ASSEMBLYAI_API_KEY not configured" }, { status: 500 });
  }

  // Return the key for the client to use in the WebSocket connection.
  // The client connects directly to AssemblyAI's WebSocket endpoint.
  return NextResponse.json({ token: apiKey });
}
