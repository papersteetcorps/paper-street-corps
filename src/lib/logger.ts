"use client";

const SESSION_KEY = "forge-session-id";

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

interface LogEventOpts {
  testType?: string;
  mode?: string;
  payload?: Record<string, unknown>;
}

/**
 * Fire-and-forget event logger. Sends to /api/log in the background.
 * Never blocks, never throws, never surfaces errors to the user.
 */
export function logEvent(eventType: string, opts: LogEventOpts = {}): void {
  if (typeof window === "undefined") return;
  const session_id = getSessionId();
  if (!session_id) return;

  const body = JSON.stringify({
    session_id,
    event_type: eventType,
    test_type: opts.testType,
    mode: opts.mode,
    payload: opts.payload ?? {},
  });

  // Prefer sendBeacon (works during page unload, fire-and-forget by design)
  // Fallback to fetch with keepalive
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/log", blob);
      return;
    }
  } catch {
    // fall through
  }

  try {
    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* swallow */
  }
}
