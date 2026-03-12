import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const TEST_META: Record<string, { label: string; href: string; color: string; icon: string }> = {
  temperaments: { label: "Temperaments", href: "/temperaments", color: "text-accent-purple", icon: "🔥" },
  "moral-alignment": { label: "Moral Alignment", href: "/moral-alignment", color: "text-accent-teal", icon: "⚖️" },
  cjte: { label: "MBTI", href: "/cjte", color: "text-accent-blue", icon: "🔍" },
  socionics: { label: "Socionics", href: "/socionics", color: "text-accent-amber", icon: "🌐" },
  potentiology: { label: "Potentiology", href: "/potentiology", color: "text-accent-purple", icon: "⚡" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getResultSummary(result: Record<string, unknown>): string {
  if (result.testType === "cjte") {
    const matches = result.matches as Array<{ type: string; confidence: number }> | undefined;
    if (matches?.[0]) return `${matches[0].type} — ${(matches[0].confidence * 100).toFixed(0)}% confidence`;
  }
  if (result.testType === "temperaments") {
    const primary = result.primary as string | undefined;
    const secondary = result.secondary as string | undefined;
    if (primary) return secondary ? `${primary} / ${secondary} blend` : primary;
  }
  if (result.testType === "moral-alignment") {
    const alignment = result.alignment as string | undefined;
    if (alignment) return alignment;
  }
  if (result.testType === "socionics") {
    const type = result.socType as string | undefined;
    if (type) return type;
  }
  if (result.testType === "potentiology") {
    const type = result.pbceType as string | undefined;
    if (type) return type;
  }
  return "Completed";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: results } = await supabase
    .from("test_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const grouped: Record<string, typeof results> = {};
  for (const r of results ?? []) {
    const t = r.test_type as string;
    if (!grouped[t]) grouped[t] = [];
    grouped[t]!.push(r);
  }

  const testCounts = Object.entries(grouped).map(([type, rows]) => ({
    type,
    count: rows?.length ?? 0,
    latest: rows?.[0],
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="pt-4">
        <p className="text-surface-400 text-sm mb-1">Signed in as</p>
        <h1 className="text-2xl font-semibold text-foreground">{user.email}</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tests taken", value: results?.length ?? 0 },
          { label: "Test types", value: testCounts.length },
          { label: "This month", value: (results ?? []).filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length },
          { label: "Frameworks", value: Object.keys(TEST_META).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
            <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
            <p className="text-surface-400 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Take a test</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(TEST_META).map(([type, meta]) => (
            <Link
              key={type}
              href={meta.href}
              className="bg-surface-900 border border-surface-800 hover:border-surface-600 rounded-xl p-4 flex items-center gap-3 transition-colors group"
            >
              <span className="text-xl">{meta.icon}</span>
              <div>
                <p className={`text-sm font-medium ${meta.color}`}>{meta.label}</p>
                <p className="text-surface-500 text-xs">
                  {grouped[type]?.length ?? 0} attempt{(grouped[type]?.length ?? 0) !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Test history</h2>

        {!results?.length ? (
          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">🧪</p>
            <p className="text-foreground font-medium mb-2">No tests yet</p>
            <p className="text-surface-400 text-sm mb-6">Complete a test to see your results here.</p>
            <Link
              href="/"
              className="inline-block bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              Explore tests
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((r) => {
              const meta = TEST_META[r.test_type as string] ?? { label: r.test_type, color: "text-surface-300", icon: "📊", href: "/" };
              const summary = getResultSummary(r.result_json as Record<string, unknown>);
              return (
                <div
                  key={r.id}
                  className="bg-surface-900 border border-surface-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xl shrink-0">{meta.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${meta.color} truncate`}>
                        {meta.label} &mdash; {summary}
                      </p>
                      <p className="text-surface-500 text-xs mt-0.5">{formatDate(r.created_at)}</p>
                    </div>
                  </div>
                  <Link
                    href={meta.href}
                    className="shrink-0 text-xs text-surface-400 hover:text-foreground border border-surface-700 hover:border-surface-500 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Retake
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Synthesis */}
      {(results?.length ?? 0) >= 2 && (
        <div className="border border-surface-700 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Cross-Framework Synthesis</p>
            <p className="text-xs text-surface-400">
              Combine your {testCounts.length} completed framework{testCounts.length !== 1 ? "s" : ""} into one unified psychological profile.
            </p>
          </div>
          <Link
            href="/synthesis"
            className="shrink-0 text-sm bg-accent-blue hover:bg-accent-blue/90 text-white px-5 py-2.5 rounded-xl transition-colors"
          >
            Synthesize →
          </Link>
        </div>
      )}

      {/* Sign out */}
      <div className="pb-8">
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="text-sm text-surface-400 hover:text-red-400 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
