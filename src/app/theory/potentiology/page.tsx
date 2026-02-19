import Link from "next/link";

const FUNCTIONS = [
  { code: "SbjX", name: "Subjective Experiencer", domain: "X", dir: "Sbj", description: "Evaluates the object with reference to available concrete impressions already held by the subject. Independent of the object itself — merges new experience into existing internal impression." },
  { code: "ObjX", name: "Objective Experiencer", domain: "X", dir: "Obj", description: "Evaluates the object with reference to its concrete details as they exist in reality. Pulls the subject toward mentally adapting to the object&rsquo;s experiential properties." },
  { code: "SbjA", name: "Subjective Abstractor", domain: "A", dir: "Sbj", description: "Evaluates the object against available abstract impressions within the subject. Integrates new patterns into an internally held latent framework. Independent of object." },
  { code: "ObjA", name: "Objective Abstractor", domain: "A", dir: "Obj", description: "Evaluates the object&rsquo;s abstract details as they exist externally. Pulls the subject toward adapting to the object&rsquo;s latent patterns and possibilities." },
  { code: "SbjL", name: "Subjective Logician", domain: "L", dir: "Sbj", description: "Evaluates via internal logical impressions already held. Merges new logical data into a refined personal logical system. Self-referential consistency is paramount." },
  { code: "ObjL", name: "Objective Logician", domain: "L", dir: "Obj", description: "Evaluates using the logical properties of the object itself. Pulls the subject toward adapting to the object&rsquo;s system, structure, or rules." },
  { code: "SbjM", name: "Subjective Moralist", domain: "M", dir: "Sbj", description: "Evaluates via personal moral impressions. Merges new moral data into a private, internally consistent value system. Conviction-driven." },
  { code: "ObjM", name: "Objective Moralist", domain: "M", dir: "Obj", description: "Evaluates using the object&rsquo;s moral properties as they exist in the world. Pulls the subject toward adapting to external ethical norms and relational obligations." },
];

const TYPES = [
  { code: "SbjXL", nick: "The Maintainer", stack: "SbjX → ObjL → SbjM → ObjA → ObjX → SbjL → ObjM → SbjA" },
  { code: "SbjXM", nick: "The Communitarian", stack: "SbjX → ObjM → SbjL → ObjA → ObjX → SbjM → ObjL → SbjA" },
  { code: "ObjLX", nick: "The Rebuilder", stack: "ObjL → SbjX → ObjM → SbjA → SbjL → ObjX → SbjM → ObjA" },
  { code: "ObjMX", nick: "The Welfarer", stack: "ObjM → SbjX → ObjL → SbjA → SbjM → ObjX → SbjL → ObjA" },
  { code: "SbjLX", nick: "The Specialist", stack: "SbjL → ObjX → SbjM → ObjA → ObjL → SbjX → ObjM → SbjA" },
  { code: "SbjMX", nick: "The Crusader", stack: "SbjM → ObjX → SbjL → ObjA → ObjM → SbjX → ObjL → SbjA" },
  { code: "ObjXL", nick: "The Gambit", stack: "ObjX → SbjL → ObjA → SbjM → SbjX → ObjL → SbjA → ObjM" },
  { code: "ObjXM", nick: "The Firebrand", stack: "ObjX → SbjM → ObjA → SbjL → SbjX → ObjM → SbjA → ObjL" },
  { code: "SbjAL", nick: "The Visionary", stack: "SbjA → ObjL → SbjX → ObjM → ObjA → SbjL → ObjX → SbjM" },
  { code: "SbjAM", nick: "The Philosopher", stack: "SbjA → ObjM → SbjX → ObjL → ObjA → SbjM → ObjX → SbjL" },
  { code: "ObjLA", nick: "The Strategist", stack: "ObjL → SbjA → ObjX → SbjM → SbjL → ObjA → SbjX → ObjM" },
  { code: "ObjMA", nick: "The Reformer", stack: "ObjM → SbjA → ObjX → SbjL → SbjM → ObjA → SbjX → ObjL" },
  { code: "SbjLA", nick: "The Craftsman", stack: "SbjL → ObjA → SbjX → ObjM → ObjL → SbjA → ObjX → SbjM" },
  { code: "SbjMA", nick: "The Pioneer", stack: "SbjM → ObjA → SbjX → ObjL → ObjM → SbjA → ObjX → SbjL" },
  { code: "ObjAL", nick: "The Innovator", stack: "ObjA → SbjL → ObjX → SbjM → SbjA → ObjL → SbjX → ObjM" },
  { code: "ObjAM", nick: "The Ninja", stack: "ObjA → SbjM → ObjX → SbjL → SbjA → ObjM → SbjX → ObjL" },
];

const DOMAIN_COLORS: Record<string, string> = {
  X: "text-accent-blue",
  A: "text-accent-purple",
  L: "text-accent-teal",
  M: "text-accent-amber",
};

const DOMAIN_NAMES: Record<string, string> = {
  X: "Experience",
  A: "Abstraction",
  L: "Logic",
  M: "Morality",
};

export default function PotentiologyTheoryPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-14 pb-16">
      {/* Header */}
      <div className="pt-4 space-y-3">
        <Link href="/theory" className="text-sm text-surface-500 hover:text-surface-300 transition-colors">
          &larr; Theory
        </Link>
        <p className="text-xs text-surface-500 uppercase tracking-widest">Framework</p>
        <h1 className="text-4xl font-bold">Potentiology</h1>
        <p className="text-surface-400 leading-relaxed max-w-2xl">
          Potentiology is a cognitive framework that models how a subject perceives, evaluates, and stabilizes reality through distinct modes of perception called cognitive functions.
          Unlike trait-based or behavioral typologies, Potentiology is built around energy — each cognitive function has a finite capacity that depletes with use and recovers when disengaged.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/potentiology"
            className="bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple border border-accent-purple/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            Take PBCE Test &rarr;
          </Link>
        </div>
      </div>

      {/* Core premise */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Core Premise</h2>
        <div className="space-y-3 text-surface-300 leading-relaxed text-sm">
          <p>
            Potentiology is not a diagnostic or predictive tool. It does not claim to measure intelligence, morality, or mental health. Its purpose is <strong>explanatory</strong>: to provide a structural language for discussing perceptual bias, evaluative conflict, and environmental fit.
          </p>
          <p>
            The ego defaults to whichever cognitive function has the highest available energy at a given moment. As energy depletes through use, the ego cascades down the function stack. Recovery is slower than depletion, introducing asymmetry that allows the model to account for <strong>burnout, dissatisfaction, stress behavior, and functional shifts</strong> without invoking pathology.
          </p>
          <p>
            Conscious choice can override this default tendency — but it carries an energy cost. Choosing to operate from a lower-stack function persistently leads to accelerated burnout.
          </p>
        </div>
      </section>

      {/* Domains */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">The Four Domains</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(DOMAIN_NAMES).map(([key, name]) => (
            <div key={key} className="border border-surface-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold font-mono ${DOMAIN_COLORS[key]}`}>{key}</span>
                <span className="font-medium text-foreground">{name}</span>
              </div>
              <p className="text-sm text-surface-400">
                {key === "X" && "Perception of the object as a concrete, direct experience — sensory, immediate, lived."}
                {key === "A" && "Perception of the object in terms of latent patterns, possibilities, and hidden structure."}
                {key === "L" && "Perception of the object in terms of its logical properties — consistency, structure, efficiency."}
                {key === "M" && "Perception of the object in terms of moral values — rightness, obligation, relational meaning."}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-surface-400 leading-relaxed">
          Each domain can be oriented <strong>subjectively</strong> (evaluated against internal impressions, independent of the object) or <strong>objectively</strong> (evaluated against the object&rsquo;s own properties, pulling the subject toward adaptation). This gives 8 cognitive functions.
        </p>
      </section>

      {/* 8 Functions */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">The 8 Cognitive Functions</h2>
        <div className="space-y-3">
          {FUNCTIONS.map(({ code, name, domain, dir, description }) => (
            <div key={code} className="border border-surface-800 rounded-xl p-4 flex gap-4">
              <span className={`text-lg font-bold font-mono shrink-0 w-12 ${DOMAIN_COLORS[domain]}`}>{code}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground text-sm">{name}</p>
                  <span className="text-xs text-surface-500">({dir === "Sbj" ? "Subjective" : "Objective"})</span>
                </div>
                <p className="text-sm text-surface-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Energy model */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Energy &amp; Burnout Model</h2>
        <div className="border border-surface-800 rounded-2xl p-6 space-y-4 bg-surface-900/30">
          <div className="space-y-3 text-sm text-surface-300 leading-relaxed">
            <p>
              <strong>Stack ordering by energy capacity:</strong> The 1st function has the highest energy storage, the 8th has the lowest. When at full capacity, the ego defaults to the 1st function.
            </p>
            <p>
              <strong>Depletion and cascade:</strong> As the 1st function&rsquo;s energy drops below the 2nd function&rsquo;s level (minus switching cost), the ego cascades to the 2nd function. This continues down the stack. If the 1st function recovers above the 3rd, the ego returns to the 1st.
            </p>
            <p>
              <strong>Crash:</strong> A temporary shutdown of a function caused by sustained conflict with its opposing function domain, leading to loss of evaluative authority by the primary function.
            </p>
            <p>
              <strong>Recovery:</strong> Recovery is domain-specific. Cognitive functions recover only when disengaged — rest for the domain, not general rest. This explains why some recovery activities restore one type but exhaust another.
            </p>
            <p>
              <strong>Leakage:</strong> Conscious or unconscious use of a cognitive function below its natural position. The ego&rsquo;s tendency is toward the highest-energy function, but the subject can choose against tendency — at increasing energy cost.
            </p>
          </div>
        </div>
      </section>

      {/* 16 Types table */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">The 16 Potentiology Types</h2>
          <p className="text-surface-400 text-sm mt-1">Each type is defined by its 1st and 2nd function. The full 8-function stack follows deterministically.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">Type</th>
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">Nickname</th>
                <th className="text-left py-3 text-surface-500 font-medium">Function Stack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {TYPES.map(({ code, nick, stack }) => {
                const domain = code.slice(-1);
                return (
                  <tr key={code} className="hover:bg-surface-900/50 transition-colors">
                    <td className={`py-3 pr-4 font-mono font-bold ${DOMAIN_COLORS[domain] ?? "text-foreground"}`}>{code}</td>
                    <td className="py-3 pr-4 text-surface-300">{nick}</td>
                    <td className="py-3 text-surface-500 text-xs font-mono">{stack}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <div className="flex gap-4 pt-4">
        <Link
          href="/potentiology"
          className="bg-accent-purple hover:bg-accent-purple/90 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
        >
          Take PBCE-1 Test
        </Link>
        <Link
          href="/resources"
          className="text-sm text-surface-400 hover:text-surface-200 border border-surface-700 px-5 py-3 rounded-xl transition-colors"
        >
          Research materials
        </Link>
      </div>
    </div>
  );
}
