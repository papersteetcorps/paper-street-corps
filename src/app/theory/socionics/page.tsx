import Link from "next/link";

const IE_TABLE = [
  { code: "Ti", name: "Introverted Logic", alias: "Structural Logic", question: "Is this internally consistent?", fn: "Builds structural architecture, definitions, classifications." },
  { code: "Te", name: "Extraverted Logic", alias: "Pragmatic Logic", question: "Does this work?", fn: "Builds measurable output, efficiency, optimization." },
  { code: "Fi", name: "Introverted Ethics", alias: "Relational Ethics", question: "Where do I stand with this person?", fn: "Tracks personal bonds, moral distance, loyalty." },
  { code: "Fe", name: "Extraverted Ethics", alias: "Emotional Field", question: "What is the emotional climate?", fn: "Regulates shared emotional space, group mood, expressiveness." },
  { code: "Ni", name: "Introverted Intuition", alias: "Time / Trajectory", question: "Where is this heading?", fn: "Perceives temporal movement, inevitability, long-term direction." },
  { code: "Ne", name: "Extraverted Intuition", alias: "Potential / Possibility", question: "What else could this become?", fn: "Expands conceptual space, alternatives, hidden potential." },
  { code: "Si", name: "Introverted Sensing", alias: "Internal State / Comfort", question: "How does this feel internally?", fn: "Regulates internal equilibrium, body awareness, harmony." },
  { code: "Se", name: "Extraverted Sensing", alias: "Force / Will / Impact", question: "Who controls this space?", fn: "Enforces external reality, territory, assertiveness." },
];

const MODEL_A = [
  { pos: "1. Base (Leading)", strength: "Very Strong", conscious: true, role: "Core worldview processor", behavior: "Most natural and stable perception lens. Feels self-evident." },
  { pos: "2. Creative", strength: "Strong", conscious: true, role: "Flexible implementation tool", behavior: "Supports Base function. Situational and applied." },
  { pos: "3. Role", strength: "Weak", conscious: true, role: "Social adaptation mask", behavior: "Used because expected. Draining when overused." },
  { pos: "4. Vulnerable (PoLR)", strength: "Very Weak", conscious: true, role: "Blind spot", behavior: "Low stress tolerance. Deep insecurity area." },
  { pos: "5. Suggestive", strength: "Weak", conscious: false, role: "Psychological need", behavior: "Feels nourishing when provided by others." },
  { pos: "6. Mobilizing", strength: "Medium", conscious: false, role: "Growth trigger", behavior: "Area of aspiration. Praise motivates." },
  { pos: "7. Ignoring", strength: "Strong", conscious: false, role: "Strong but unvalued", behavior: "Can use but dismisses as low priority." },
  { pos: "8. Demonstrative", strength: "Very Strong", conscious: false, role: "Automatic background processor", behavior: "Operates effortlessly without emphasis." },
];

const QUADRAS = [
  { name: "Alpha", elements: ["Ne", "Ti", "Fe", "Si"], description: "Alpha values intellectual exploration, internal consistency, warm group dynamics, and sensory comfort. Enthusiastic, curious, collaborative." },
  { name: "Beta", elements: ["Ni", "Fe", "Ti", "Se"], description: "Beta values long-range vision, collective emotional energy, structural logic, and willful action. Driven, ideological, intense." },
  { name: "Gamma", elements: ["Ni", "Te", "Fi", "Se"], description: "Gamma values strategic foresight, practical efficiency, personal loyalty, and decisive action. Pragmatic, ambitious, self-reliant." },
  { name: "Delta", elements: ["Ne", "Te", "Fi", "Si"], description: "Delta values creative potential, measurable results, authentic bonds, and bodily harmony. Constructive, caring, grounded." },
];

export default function SocionicsTheoryPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-14 pb-16">
      {/* Header */}
      <div className="pt-4 space-y-3">
        <Link href="/theory" className="text-sm text-surface-500 hover:text-surface-300 transition-colors">
          &larr; Theory
        </Link>
        <p className="text-xs text-surface-500 uppercase tracking-widest">Framework</p>
        <h1 className="text-4xl font-bold">Socionics &amp; Model A</h1>
        <p className="text-surface-400 leading-relaxed max-w-2xl">
          Socionics is a theory of information metabolism — how different psychological types process and interact with different kinds of information.
          The primary tool is Model A, a structural model that assigns 8 information elements to 8 functional positions, each with a defined strength, consciousness level, and psychological role.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/socionics"
            className="bg-accent-amber/10 hover:bg-accent-amber/20 text-accent-amber border border-accent-amber/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            Take the test &rarr;
          </Link>
        </div>
      </div>

      {/* What is Socionics */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What is Socionics?</h2>
        <div className="prose-custom space-y-3 text-surface-300 leading-relaxed text-sm">
          <p>
            Socionics was developed by Aušra Augustinavičiūtė in the 1970s, building on Carl Jung&rsquo;s psychological types and Antoni K&#281;pi&#324;ski&rsquo;s theory of information metabolism.
            Where MBTI focuses on self-reported behavioral preferences, Socionics attempts to model the underlying cognitive structure — specifically, <em>how</em> a person processes different categories of information.
          </p>
          <p>
            The 8 information elements (Ti, Te, Fi, Fe, Ni, Ne, Si, Se) correspond to Jung&rsquo;s 8 cognitive functions. But in Socionics, each type has all 8 functions — what differs is their <strong>position in Model A</strong>, which determines each function&rsquo;s strength, level of consciousness, and psychological role.
          </p>
          <p>
            This produces 16 sociotypes (or &ldquo;socionic types&rdquo;), each named by their two-letter &ldquo;sociotype code&rdquo; (e.g., ILI, ESE, LII) which maps to an MBTI type but carries different theoretical implications.
          </p>
        </div>
      </section>

      {/* Information Elements */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">The 8 Information Elements</h2>
          <p className="text-surface-400 text-sm mt-1">Each element defines a domain of reality that a type perceives with a particular strength and style.</p>
        </div>
        <div className="space-y-3">
          {IE_TABLE.map(({ code, name, alias, question, fn }) => (
            <div key={code} className="border border-surface-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold font-mono text-accent-amber w-8">{code}</span>
                <div>
                  <p className="font-medium text-foreground text-sm">{name}</p>
                  <p className="text-xs text-surface-500">{alias}</p>
                </div>
              </div>
              <p className="text-xs text-surface-500 italic">&ldquo;{question}&rdquo;</p>
              <p className="text-sm text-surface-400">{fn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Model A */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">Model A — Functional Positions</h2>
          <p className="text-surface-400 text-sm mt-1">
            Model A assigns each information element to one of 8 positions. Each position has a defined strength and consciousness level. The Ego block (1+2) is the most reliable; the PoLR (4) is the structural blind spot.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">Position</th>
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">Strength</th>
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">Conscious</th>
                <th className="text-left py-3 text-surface-500 font-medium">Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {MODEL_A.map(({ pos, strength, conscious, behavior }) => (
                <tr key={pos}>
                  <td className="py-3 pr-4 font-medium text-foreground">{pos}</td>
                  <td className="py-3 pr-4 text-surface-400">{strength}</td>
                  <td className="py-3 pr-4 text-surface-400">{conscious ? "Yes" : "No"}</td>
                  <td className="py-3 text-surface-400">{behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-surface-500">
          <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
            <p className="font-semibold text-foreground mb-1">Ego Block (1+2)</p>
            <p>Most natural and reliable. The Ego block defines the type&rsquo;s core worldview and primary mode of action. Valued and developed throughout life.</p>
          </div>
          <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
            <p className="font-semibold text-foreground mb-1">SuperId Block (5+6)</p>
            <p>The psychological &ldquo;need zone.&rdquo; Information from these elements feels nourishing when provided by compatible types (duals). A source of deep aspiration.</p>
          </div>
        </div>
      </section>

      {/* Quadra */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">The Four Quadras</h2>
          <p className="text-surface-400 text-sm mt-1">
            Quadras are groups of 4 types that share the same <em>valued</em> information elements (Ego + SuperId). Types within a quadra communicate effortlessly and share cultural values.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUADRAS.map(({ name, elements, description }) => (
            <div key={name} className="border border-surface-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">{name}</h3>
                <div className="flex gap-1.5">
                  {elements.map((e) => (
                    <span key={e} className="text-xs font-mono text-accent-amber border border-accent-amber/20 bg-accent-amber/5 px-1.5 py-0.5 rounded">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-surface-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intertype relations note */}
      <section className="border border-surface-800 rounded-2xl p-6 space-y-3 bg-surface-900/40">
        <h3 className="font-semibold text-foreground">Intertype Relations</h3>
        <p className="text-sm text-surface-400 leading-relaxed">
          Socionics defines 14 intertype relations between sociotypes, ranging from &ldquo;Dual&rdquo; (most compatible — provides each other&rsquo;s SuperId needs) to &ldquo;Conflicting&rdquo; (most stressful — Base function of one is PoLR of the other). Relations are symmetric and deterministic based on type alone.
        </p>
        <p className="text-sm text-surface-400">
          This is a theory page. Full intertype relation computation is not implemented here. Take the Socionics test to determine your sociotype first.
        </p>
      </section>

      {/* CTA */}
      <div className="flex gap-4 pt-4">
        <Link
          href="/socionics"
          className="bg-accent-amber hover:bg-accent-amber/90 text-black font-medium px-6 py-3 rounded-xl text-sm transition-colors"
        >
          Take the Socionics test
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
