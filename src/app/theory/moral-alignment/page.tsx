import Link from "next/link";
import { ALL_ALIGNMENTS, ALIGNMENT_COLORS } from "@/lib/scoring/moralAlignment";

export default function MoralAlignmentTheoryPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <div className="text-xs text-surface-500 uppercase tracking-wide">Theory</div>
        <h1 className="mt-2 text-3xl font-semibold">Moral Alignment</h1>
        <p className="mt-2 text-surface-400">
          The 3&times;3 alignment grid exploring the intersection of ethical impulse and
          structural orientation.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Origins</h2>
        <p className="text-surface-400">
          The alignment system originated in tabletop role-playing games (D&amp;D, 1977) as a
          tool for character development. It has since been adopted more broadly as a
          framework for understanding moral and behavioral tendencies.
        </p>
        <p className="text-surface-400">
          The system uses two independent axes: one measuring ethical impulse (Good/Neutral/Evil)
          and another measuring orientation toward structure (Lawful/Neutral/Chaotic).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">The Two Axes</h2>
        <div className="space-y-4">
          <div className="border border-surface-800 rounded-lg p-4">
            <h3 className="font-medium">Impulse Axis (Good &rarr; Evil)</h3>
            <ul className="mt-2 space-y-1 text-sm text-surface-400">
              <li><strong className="text-surface-300">Good:</strong> Prioritizes others&apos; wellbeing, altruism, compassion</li>
              <li><strong className="text-surface-300">Neutral:</strong> Balanced self-interest and consideration for others</li>
              <li><strong className="text-surface-300">Evil:</strong> Prioritizes self-interest, willing to harm others for gain</li>
            </ul>
          </div>
          <div className="border border-surface-800 rounded-lg p-4">
            <h3 className="font-medium">Structure Axis (Lawful &rarr; Chaotic)</h3>
            <ul className="mt-2 space-y-1 text-sm text-surface-400">
              <li><strong className="text-surface-300">Lawful:</strong> Values order, tradition, rules, hierarchy</li>
              <li><strong className="text-surface-300">Neutral:</strong> Pragmatic about rules, neither rigid nor rebellious</li>
              <li><strong className="text-surface-300">Chaotic:</strong> Values freedom, individuality, flexibility</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">The 9 Alignments</h2>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {ALL_ALIGNMENTS.map((a) => {
            const color = ALIGNMENT_COLORS[a.name];
            return (
              <div
                key={a.name}
                className="border rounded-lg p-3 text-center transition-colors hover:opacity-100 opacity-80"
                style={{
                  borderColor: color,
                  background: `${color}10`,
                }}
              >
                <div className="font-medium" style={{ color }}>
                  {a.name}
                </div>
                <div className="text-surface-500 text-xs mt-1">{a.archetype}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Application</h2>
        <p className="text-surface-400">
          While originally designed for fictional characters, the alignment grid can serve
          as a reflective tool for examining one&apos;s own moral intuitions and relationship
          with authority and structure.
        </p>
        <p className="text-surface-400">
          Most people don&apos;t fit cleanly into one box — alignment can shift based on context,
          relationships, and circumstances. The framework is best used as a starting point
          for moral reflection rather than a rigid classification.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Limitations</h2>
        <p className="text-surface-400">
          The alignment system oversimplifies moral philosophy. Real ethical frameworks
          (consequentialism, deontology, virtue ethics) offer more nuanced approaches to
          understanding moral reasoning.
        </p>
        <p className="text-surface-400">
          Additionally, labeling anything &quot;evil&quot; can be problematic when applied to real
          people. The system works better for examining abstract moral tendencies than
          for judging actual human behavior.
        </p>
      </section>

      <Link
        href="/theory"
        className="inline-block text-sm text-surface-400 hover:text-foreground transition-colors"
      >
        &larr; Back to Theory
      </Link>
    </div>
  );
}
