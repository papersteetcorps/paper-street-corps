import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import SynthesisClient from "./SynthesisClient";

const TEST_LABELS: Record<string, string> = {
  temperaments: "Temperaments",
  "moral-alignment": "Moral Alignment",
  cjte: "MBTI",
  socionics: "Socionics (KIME)",
  potentiology: "Potentiology (PBCE)",
};

export default async function SynthesisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 space-y-6">
        <p className="text-5xl">🔬</p>
        <h1 className="text-2xl font-semibold text-foreground">Cross-Framework Synthesis</h1>
        <p className="text-surface-400 text-sm max-w-md mx-auto">
          Sign in and complete at least two tests to generate a unified psychological profile across all frameworks.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm bg-accent-blue hover:bg-accent-blue/90 text-white px-5 py-2.5 rounded-xl transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/"
            className="text-sm text-surface-400 hover:text-foreground border border-surface-700 px-5 py-2.5 rounded-xl transition-colors"
          >
            Take a test
          </Link>
        </div>
      </div>
    );
  }

  // Fetch one result per test type (most recent)
  const { data: rows } = await supabase
    .from("test_results")
    .select("test_type, result_json, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const seen = new Set<string>();
  const latestPerType: Array<{ testType: string; result: Record<string, unknown>; label: string }> = [];

  for (const row of rows ?? []) {
    const t = row.test_type as string;
    if (!seen.has(t)) {
      seen.add(t);
      latestPerType.push({
        testType: t,
        result: row.result_json as Record<string, unknown>,
        label: TEST_LABELS[t] ?? t,
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="pt-4">
        <p className="text-xs text-surface-500 uppercase tracking-widest mb-2">Cross-Framework Analysis</p>
        <h1 className="text-2xl font-semibold text-foreground">Profile Synthesis</h1>
        <p className="text-surface-400 text-sm mt-2 max-w-xl">
          Combines all your completed test results into one unified psychological profile.
          Identifies convergences, divergences, and the pattern that runs beneath all frameworks.
        </p>
      </div>

      <SynthesisClient availableResults={latestPerType} />
    </div>
  );
}
