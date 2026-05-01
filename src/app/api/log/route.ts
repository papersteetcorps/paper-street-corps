import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      // Silently no-op if Supabase is not configured — never block the user
      return Response.json({ ok: true, logged: false });
    }

    const body = await request.json() as {
      session_id: string;
      event_type: string;
      test_type?: string;
      mode?: string;
      payload?: Record<string, unknown>;
    };

    if (!body.session_id || !body.event_type) {
      return Response.json({ ok: true, logged: false });
    }

    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from("forge_events").insert({
      session_id: body.session_id,
      event_type: body.event_type,
      test_type: body.test_type ?? null,
      mode: body.mode ?? null,
      payload: body.payload ?? {},
    });

    if (error) {
      // Log server-side, but never surface to user
      console.error("[forge-log] insert failed:", error.message);
      return Response.json({ ok: true, logged: false });
    }

    return Response.json({ ok: true, logged: true });
  } catch {
    // Silent fail — never block user flow
    return Response.json({ ok: true, logged: false });
  }
}
