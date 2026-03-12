import Link from "next/link";

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
          A cognitive energy framework that models perception as a structured system of domains, directions, and energy capacities. Defines four fundamental perceptual domains &mdash; Experience, Abstraction, Logic, and Morality &mdash; each operating in subjective or objective orientation, yielding eight distinct cognitive functions.
        </p>
        <p className="text-surface-500 text-xs">
          By Gourav Kumar Mallick &middot; Parul University &middot; CC BY 4.0
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

      {/* Core Premise */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Core Premise</h2>
        <div className="space-y-3 text-surface-300 leading-relaxed text-sm">
          <p>
            Potentiology describes <strong>how a subject perceives, evaluates, and stabilizes reality</strong> through distinct modes of perception called cognitive functions. Rather than focusing on behavior, traits, or personality descriptions, the theory models cognition as a <strong>dynamic system of perceptual domains and energy capacities</strong>.
          </p>
          <p>
            The ego defaults to whichever cognitive function has the highest available energy at a given moment. As energy depletes through use, the ego cascades down the function stack. Recovery is slower than depletion, introducing asymmetry that allows the model to account for <strong>burnout, dissatisfaction, stress behavior, and functional shifts</strong> without invoking pathology.
          </p>
          <p>
            Potentiology is not a diagnostic or predictive tool. It does not claim to measure intelligence, morality, or mental health. Its purpose is <strong>explanatory</strong>: to provide a structural language for discussing perceptual bias, evaluative conflict, and environmental fit.
          </p>
          <p>
            The theory draws conceptual inspiration from Jungian psychology and related typological systems but is <strong>not derived from them</strong>. All definitions, mechanisms, and type structures are internally defined and operate according to their own logic.
          </p>
        </div>
      </section>

      {/* Terminologies */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Terminologies</h2>
        <div className="space-y-3">
          {TERMINOLOGIES.map(({ term, definition }) => (
            <div key={term} className="border border-surface-800 rounded-xl p-4">
              <h3 className="font-medium text-sm text-foreground">{term}</h3>
              <p className="mt-1 text-sm text-surface-400">{definition}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Four Domains */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">The Four Domains</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOMAINS.map(({ key, name, definition, description, color }) => (
            <div key={key} className="border border-surface-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold font-mono ${color}`}>{key}</span>
                <span className="font-medium text-foreground">{name}</span>
              </div>
              <p className="text-xs text-surface-500 italic">{definition}</p>
              <p className="text-sm text-surface-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Directions */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Directions for Functions</h2>
        <p className="text-surface-400 text-sm leading-relaxed">
          Each domain can be oriented in one of two directions, producing a subjective or objective variant of that function.
        </p>
        <div className="space-y-4">
          <div className="border border-surface-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-foreground">Subjective (s)</h3>
            <p className="text-xs text-surface-500 italic">
              &quot;Using subjective functions, the subject evaluates the object with reference to the available impressions of target function domain with the subject. This perception is then merged into existing impressions as a single unit. Also its independent of the object.&quot;
            </p>
            <p className="text-sm text-surface-400 leading-relaxed">
              The subject understands the object by recalling past perceptions stored as a singular impression. New perceptions merge into this impression, expanding understanding. The subject can reflect upon this impression without depending on active stimulus from the object. Because the subject matches the object to each content present in the impression, it usually processes <strong>slower</strong> than objective functions.
            </p>
          </div>
          <div className="border border-surface-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-foreground">Objective (o)</h3>
            <p className="text-xs text-surface-500 italic">
              &quot;Using objective functions, the subject evaluates the object with reference to the available details of target function domain about the object. This perception pulls the subject towards mentally adapting to those details, thus dependent on object.&quot;
            </p>
            <p className="text-sm text-surface-400 leading-relaxed">
              The subject understands the object by noticing the details it possesses. These perceptions are seen as something fresh and new, not stored as a unit impression &mdash; just temporary adaptation to the object&apos;s details until active stimulus ends. Because the subject isolates the object as a system, it usually processes <strong>faster</strong> than subjective functions.
            </p>
          </div>
        </div>
      </section>

      {/* 8 Cognitive Functions */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">The 8 Cognitive Functions</h2>
        <div className="space-y-4">
          {FUNCTIONS.map(({ code, name, definition, description, color }) => (
            <div key={code} className="border border-surface-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold font-mono ${color}`}>{code}</span>
                <span className="font-medium text-foreground text-sm">{name}</span>
              </div>
              <p className="text-xs text-surface-500 italic">{definition}</p>
              <p className="text-sm text-surface-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Energy & Positioning System */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Positioning System</h2>

        <div className="space-y-5">
          <div className="border border-surface-800 rounded-2xl p-6 space-y-4 bg-surface-900/30">
            <h3 className="font-bold text-foreground">Energy Theory</h3>
            <div className="space-y-3 text-sm text-surface-300 leading-relaxed">
              <p>
                The 8 cognitive functions are arranged in <strong>decreasing order of energy capacity</strong>. The 1st function has the highest energy storage, the 8th has the lowest. The ego tends to default to the function with the highest energy at a given moment.
              </p>
              <p>
                When all functions are at full capacity, the ego defaults to the 1st function. As the 1st function&apos;s energy drops below the 2nd function&apos;s level (minus a switching cost), the ego cascades to the 2nd function. This continues down the stack. If the 1st function recovers above the current function, the ego returns to it.
              </p>
              <p>
                Cognitive functions <strong>deplete energy during use</strong> but recover <strong>only when disengaged</strong>. Recovery is not automatic and occurs under conditions specific to each function&apos;s domain. Recovery is slower than depletion, introducing asymmetry that allows burnout, cascade, and delayed stabilization.
              </p>
              <p>
                What ego chooses by default and what the subject manually chooses to use <strong>aren&apos;t the same</strong>. The ego directs the tendency of the subject toward the function with highest energy, but the subject can consciously choose a function at any position. Operating against tendency is usually <strong>unhealthy</strong>, resulting in frequent burnout and dissatisfaction.
              </p>
            </div>
          </div>

          <div className="border border-surface-800 rounded-2xl p-6 space-y-4 bg-surface-900/30">
            <h3 className="font-bold text-foreground">Positioning Logic</h3>
            <div className="space-y-3 text-sm text-surface-300 leading-relaxed">
              <p>
                If the 1st function is <strong>s</strong> type, all odd positions (3rd, 5th, 7th) are also s type, and the even positions (2nd, 4th, 6th, 8th) are o type. If the 1st function is <strong>o</strong> type, the pattern is reversed.
              </p>
              <p>
                <strong>Opposing domains:</strong> Experience (X) and Abstraction (A) in the same direction are completely opposite to each other, just like Logic (L) and Morality (M) in the same direction. Only one of each pair can be used at a time.
              </p>
              <p>
                The position of a complete opposite is determined by equal radius from the center of the stack. If oM is at 1st, oL would be at 8th. If oM is at 2nd, oL would be at 7th, and so on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Types Table */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">The 16 Potentiology Types</h2>
          <p className="text-surface-400 text-sm mt-1">Each type with its 8-function stack ordered from most capacitive (1st) to least capacitive (8th).</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 pr-3 text-surface-500 font-medium">Type</th>
                <th className="text-left py-3 pr-2 text-surface-500 font-medium">1st</th>
                <th className="text-left py-3 pr-2 text-surface-500 font-medium">2nd</th>
                <th className="text-left py-3 pr-2 text-surface-500 font-medium">3rd</th>
                <th className="text-left py-3 pr-2 text-surface-500 font-medium">4th</th>
                <th className="text-left py-3 pr-2 text-surface-500 font-medium">5th</th>
                <th className="text-left py-3 pr-2 text-surface-500 font-medium">6th</th>
                <th className="text-left py-3 pr-2 text-surface-500 font-medium">7th</th>
                <th className="text-left py-3 text-surface-500 font-medium">8th</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {TYPES_TABLE.map(({ type, stack }) => (
                <tr key={type} className="hover:bg-surface-900/50 transition-colors">
                  <td className="py-2.5 pr-3 font-mono font-bold text-foreground">{type}</td>
                  {stack.map((fn, i) => (
                    <td key={i} className={`py-2.5 pr-2 font-mono text-xs ${FUNC_COLORS[fn.slice(-1)] ?? "text-surface-400"}`}>
                      {fn}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Porting Equivalent Types */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">Porting Equivalent Types</h2>
          <p className="text-surface-400 text-sm mt-1">
            Approximate mappings to other Jungian typologies. These are approximations to the closest type, but not static given theoretical differences across each system.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">Potentiology</th>
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">Classic Jungian</th>
                <th className="text-left py-3 pr-4 text-surface-500 font-medium">MBTI</th>
                <th className="text-left py-3 text-surface-500 font-medium">Socionics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {PORTING_TABLE.map(({ pot, jung, mbti, soc }) => (
                <tr key={pot} className="hover:bg-surface-900/50 transition-colors">
                  <td className="py-2.5 pr-4 font-mono font-bold text-foreground">{pot}</td>
                  <td className="py-2.5 pr-4 text-surface-400">{jung}</td>
                  <td className="py-2.5 pr-4 text-surface-400">{mbti}</td>
                  <td className="py-2.5 text-surface-400">{soc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Type Explanations */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Type Explanations</h2>
        <p className="text-surface-400 text-sm leading-relaxed">
          Each type is defined by its most capacitive function (1st) and evaluative axis. The ego defaults to the highest-energy function. Satisfaction occurs when the environment matches the primary function&apos;s natural mode.
        </p>
        <div className="space-y-3">
          {TYPE_EXPLANATIONS.map(({ type, nickname, group, behavior }) => (
            <div key={type} className="border border-surface-800 rounded-xl p-5 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-lg font-bold font-mono text-foreground">{type}</span>
                <span className="text-sm text-surface-300">{nickname}</span>
                <span className="text-xs text-surface-500 bg-surface-800 px-2 py-0.5 rounded-full">{group}</span>
              </div>
              <p className="text-sm text-surface-400 leading-relaxed">{behavior}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compatible Groups */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Compatible Groups</h2>
        <div className="space-y-3">
          {COMPATIBLE_GROUPS.map(({ group, members, reason }) => (
            <div key={group} className="border border-surface-800 rounded-xl p-5 space-y-2">
              <h3 className="font-bold text-foreground">{group}</h3>
              <p className="text-sm text-surface-300 font-mono">{members}</p>
              <p className="text-sm text-surface-400">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notes */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Important Notes</h2>
        <div className="space-y-4">
          <div className="border border-surface-800 rounded-2xl p-5 space-y-2">
            <h3 className="font-bold text-sm text-foreground">For Mental Health Professionals</h3>
            <div className="text-sm text-surface-400 leading-relaxed space-y-2">
              <p>
                Potentiology is <strong>not a diagnostic or clinical framework</strong> and must not be used as a substitute for established psychological or psychiatric models. It describes cognitive perception styles and energy dynamics, not mental health conditions or pathology.
              </p>
              <p>
                Types, crashes, leakages, and dissatisfaction do not indicate disorders. They represent energy conflicts or misalignment between a subject&apos;s dominant functions and their environment.
              </p>
              <p>
                Potentiology should always be applied <strong>alongside, never in place of</strong>, evidence-based assessment, diagnosis, and treatment.
              </p>
            </div>
          </div>
          <div className="border border-surface-800 rounded-2xl p-5 space-y-2">
            <h3 className="font-bold text-sm text-foreground">For Educators &amp; Researchers</h3>
            <div className="text-sm text-surface-400 leading-relaxed space-y-2">
              <p>
                Potentiology is intended as a <strong>theoretical and exploratory cognitive model</strong>, not a validated educational or scientific instrument. It may be useful for conceptual analysis, comparative theory, and hypothesis generation, but it should not be presented as established psychological fact.
              </p>
              <p>
                Empirical claims drawn from the model must be clearly labeled as speculative unless independently validated. Treat it as a <strong>framework for structured thinking</strong>, not as a replacement for experimentally grounded models.
              </p>
            </div>
          </div>
          <div className="border border-surface-800 rounded-2xl p-5 space-y-2">
            <h3 className="font-bold text-sm text-foreground">For Hobbyists &amp; General Users</h3>
            <div className="text-sm text-surface-400 leading-relaxed space-y-2">
              <p>
                Potentiology is a <strong>self-exploratory and explanatory framework</strong>, not a test, label, or measure of worth. Types describe how perception and evaluation tend to operate, not intelligence, maturity, or success.
              </p>
              <p>
                Use the model to understand <strong>patterns of satisfaction, burnout, and preference</strong>, not to box yourself or others into rigid identities. People can and do operate outside their dominant functions, often at an energy cost.
              </p>
              <p>
                Potentiology works best as a <strong>tool for reflection</strong>, not comparison. Treat it as a map for understanding tendencies, not a rulebook for judging behavior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* References */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">References</h2>
        <ul className="text-sm text-surface-400 leading-relaxed space-y-1 list-none">
          <li>[1] Jung, C. G. (1921). <em>Psychological Types</em>. Princeton University Press.</li>
          <li>[2] Myers, I. B., &amp; McCaulley, M. H. (1985). <em>Manual: A Guide to the Development and Use of the Myers-Briggs Type Indicator</em>. Consulting Psychologists Press.</li>
          <li>[3] Augusta, A. (1995). <em>The Theory of Information Metabolism</em>. Vilnius.</li>
          <li>[4] Kahneman, D. (1973). <em>Attention and Effort</em>. Prentice-Hall.</li>
        </ul>
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

/* ── Data ── */

const TERMINOLOGIES = [
  { term: "Function", definition: "Shorter term for cognitive function." },
  { term: "Cognitive Function", definition: "Mode of perception with a direction of focus." },
  { term: "Subject", definition: "Conscious entity which perceives the object." },
  { term: "Object", definition: "Content of consciousness which is being perceived by subject." },
  { term: "Ego", definition: "Center of consciousness which selects, integrates, organizes, and identifies experiences for the subject." },
  { term: "Suppressed", definition: "Consciously holding back something." },
  { term: "Repressed", definition: "Unconsciously blocked from awareness." },
  { term: "Seed", definition: "The point on the timeline from where a function starts fresh after a previous crash." },
  { term: "Crash", definition: "A temporary shutdown of a function caused by sustained conflict with its opposing function domain, leading to loss of evaluative authority by the primary function." },
  { term: "Impression", definition: "A compressed, internally stored representation of repeated perceptions within a domain." },
  { term: "Leakage", definition: "Conscious or unconscious use of a cognitive function at a lower position." },
];

const DOMAINS = [
  {
    key: "X",
    name: "Experience",
    color: "text-accent-blue",
    definition: "Experience is a domain of cognitive functions in which the subject perceives the object concretely, as an experience.",
    description: "Concrete perception — the object is perceived as it is in concrete form, as a matter of fact. It doesn't seek to notice any pattern, logic, or value in it. For an experiencer, it's just the input and output they experienced.",
  },
  {
    key: "A",
    name: "Abstraction",
    color: "text-accent-purple",
    definition: "Abstraction is a domain of cognitive functions in which the subject perceives the object in terms of latent patterns.",
    description: "Pattern-based perception — the object is perceived in terms of latent patterns. It understands existing or potential patterns related to the object. It doesn't see the object as something concrete, but something explaining or creating patterns.",
  },
  {
    key: "L",
    name: "Logic",
    color: "text-accent-teal",
    definition: "Logic is a domain of cognitive functions in which the subject perceives the object in terms of logical properties.",
    description: "Mechanical perception — the object is perceived in terms of logical properties and connections. It sees the object as something with logical properties governing its nature, noticing its logical details first.",
  },
  {
    key: "M",
    name: "Morality",
    color: "text-accent-amber",
    definition: "Morality is a domain of cognitive functions in which the subject perceives the object in terms of moral values.",
    description: "Value-based perception — the object is perceived in terms of moral values. It sees the object as something that holds some value in it, or displays moral values in some way.",
  },
];

const FUNC_COLORS: Record<string, string> = {
  X: "text-accent-blue",
  A: "text-accent-purple",
  L: "text-accent-teal",
  M: "text-accent-amber",
};

const FUNCTIONS = [
  {
    code: "sX",
    name: "Subjective Experience",
    domain: "X",
    color: "text-accent-blue",
    definition: "Using subjective experience, the subject evaluates the object with reference to available concrete impressions with the subject. This experience is then merged into existing impressions as a single experience. Independent of the object.",
    description: "Perceives the object and reflects upon how that experience makes sense to existing impression of experiences. Accepts the experience if it aligns with impression, might reject it if it seems different. Can still acquire newer experiences through oX leakages.",
  },
  {
    code: "oX",
    name: "Objective Experience",
    domain: "X",
    color: "text-accent-blue",
    definition: "Using objective experience, the subject evaluates the object with reference to available concrete details about the object. Pulls the subject towards mentally adapting to those experiences, dependent on object.",
    description: "Perceives the object and notices the concrete details, then seeks to mentally adapt. Open to adapting newer experiences even if they don't align with personal experiences. Can still form impressions through sX leakages.",
  },
  {
    code: "sA",
    name: "Subjective Abstraction",
    domain: "A",
    color: "text-accent-purple",
    definition: "Using subjective abstraction, the subject evaluates the object with reference to available abstract impressions with the subject. Merged into existing impressions about latent patterns as a single abstract. Independent of the object.",
    description: "Perceives the object and reflects upon how that abstraction makes sense to existing abstract impressions. Accepts the abstract if it aligns, might reject it if different. Can still acquire newer abstractions through oA leakages.",
  },
  {
    code: "oA",
    name: "Objective Abstraction",
    domain: "A",
    color: "text-accent-purple",
    definition: "Using objective abstraction, the subject evaluates the object with reference to available abstract details about the object. Pulls the subject towards mentally adapting to those patterns, dependent on object.",
    description: "Perceives the object and notices the abstract details, then seeks to mentally adapt to those patterns. Open to adapting newer abstractions even if they don't align with personal abstract understanding. Can still form impressions through sA leakages.",
  },
  {
    code: "sL",
    name: "Subjective Logic",
    domain: "L",
    color: "text-accent-teal",
    definition: "Using subjective logic, the subject evaluates the object with reference to available logical impressions with the subject. Merged into existing impressions about logical properties as a single logic. Independent of the object.",
    description: "Perceives the object and reflects upon how that logic makes sense to existing logical impressions. Accepts the logical property if it aligns, might reject it if different. Can still acquire newer logic through oL leakages.",
  },
  {
    code: "oL",
    name: "Objective Logic",
    domain: "L",
    color: "text-accent-teal",
    definition: "Using objective logic, the subject evaluates the object with reference to available logical details about the object. Pulls the subject towards mentally adapting to those logical properties, dependent on object.",
    description: "Perceives the object and notices the logical details, then seeks to mentally adapt. Open to adapting newer logic even if they don't align with personal logical understanding. Can still form impressions through sL leakages.",
  },
  {
    code: "sM",
    name: "Subjective Morality",
    domain: "M",
    color: "text-accent-amber",
    definition: "Using subjective morality, the subject evaluates the object with reference to available moral impressions with the subject. Merged into existing impressions about morality as a single unit. Independent of the object.",
    description: "Perceives the object and reflects upon how that value makes sense to existing moral impressions. Accepts the value if it aligns, might reject it if different from personal morals. Can still acquire newer values through oM leakages.",
  },
  {
    code: "oM",
    name: "Objective Morality",
    domain: "M",
    color: "text-accent-amber",
    definition: "Using objective morality, the subject evaluates the object with reference to available moral details about the object. Pulls the subject towards mentally adapting to those morals, dependent on object.",
    description: "Perceives the object and notices the moral details, then seeks to mentally adapt to those values. Open to adapting newer values even if they don't align with personal morals. Can still form impressions through sM leakages.",
  },
];

const TYPES_TABLE = [
  { type: "sXL", stack: ["sX", "oL", "sM", "oA", "oX", "sL", "oM", "sA"] },
  { type: "sXM", stack: ["sX", "oM", "sL", "oA", "oX", "sM", "oL", "sA"] },
  { type: "oLX", stack: ["oL", "sX", "oA", "sM", "sL", "oX", "sA", "oM"] },
  { type: "oMX", stack: ["oM", "sX", "oA", "sL", "sM", "oX", "sA", "oL"] },
  { type: "sLX", stack: ["sL", "oX", "sA", "oM", "oL", "sX", "oA", "sM"] },
  { type: "sMX", stack: ["sM", "oX", "sA", "oL", "oM", "sX", "oA", "sL"] },
  { type: "oXL", stack: ["oX", "sL", "oM", "sA", "sX", "oL", "sM", "oA"] },
  { type: "oXM", stack: ["oX", "sM", "oL", "sA", "sX", "oM", "sL", "oA"] },
  { type: "sAL", stack: ["sA", "oL", "sM", "oX", "oA", "sL", "oM", "sX"] },
  { type: "sAM", stack: ["sA", "oM", "sL", "oX", "oA", "sM", "oL", "sX"] },
  { type: "oLA", stack: ["oL", "sA", "oX", "sM", "sL", "oA", "sX", "oM"] },
  { type: "oMA", stack: ["oM", "sA", "oX", "sL", "sM", "oA", "sX", "oL"] },
  { type: "sLA", stack: ["sL", "oA", "sX", "oM", "oL", "sA", "oX", "sM"] },
  { type: "sMA", stack: ["sM", "oA", "sX", "oL", "oM", "sA", "oX", "sL"] },
  { type: "oAL", stack: ["oA", "sL", "oM", "sX", "sA", "oL", "sM", "oX"] },
  { type: "oAM", stack: ["oA", "sM", "oL", "sX", "sA", "oM", "sL", "oX"] },
];

const PORTING_TABLE = [
  { pot: "sXL", jung: "IS(T)", mbti: "ISTJ", soc: "SLI" },
  { pot: "sXM", jung: "IS(F)", mbti: "ISFJ", soc: "SEI" },
  { pot: "oLX", jung: "ET(S)", mbti: "ESTJ", soc: "LSE" },
  { pot: "oMX", jung: "EF(S)", mbti: "ESFJ", soc: "ESE" },
  { pot: "sLX", jung: "IT(S)", mbti: "ISTP", soc: "LSI" },
  { pot: "sMX", jung: "IF(S)", mbti: "ISFP", soc: "ESI" },
  { pot: "oXL", jung: "ES(T)", mbti: "ESTP", soc: "SLE" },
  { pot: "oXM", jung: "ES(F)", mbti: "ESFP", soc: "SEE" },
  { pot: "sAM", jung: "IN(F)", mbti: "INFJ", soc: "IEI" },
  { pot: "sMA", jung: "IF(N)", mbti: "INFP", soc: "EII" },
  { pot: "oMA", jung: "EF(N)", mbti: "ENFJ", soc: "EIE" },
  { pot: "oAM", jung: "EN(F)", mbti: "ENFP", soc: "IEE" },
  { pot: "sAL", jung: "IN(T)", mbti: "INTJ", soc: "ILI" },
  { pot: "sLA", jung: "IT(N)", mbti: "INTP", soc: "LII" },
  { pot: "oLA", jung: "ET(N)", mbti: "ENTJ", soc: "LIE" },
  { pot: "oAL", jung: "EN(T)", mbti: "ENTP", soc: "ILE" },
];

const TYPE_EXPLANATIONS = [
  {
    type: "sXL",
    nickname: "The Specialist",
    group: "Troubleshooters",
    behavior: "Mostly prefers being in situations requiring known experiences, often seeks to adapt with logical systems comfortably, prefers being in situations requiring known morality during mild burnout, and seeks to adapt with latent patterns during serious burnout.",
  },
  {
    type: "sXM",
    nickname: "The Communitarian",
    group: "Mediators",
    behavior: "Mostly prefers being in situations requiring known experiences, often seeks to adapt with moral values comfortably, prefers being in situations requiring known logical systems during mild burnout, and seeks to adapt with latent patterns during serious burnout.",
  },
  {
    type: "oLX",
    nickname: "The Rebuilder",
    group: "Troubleshooters",
    behavior: "Mostly seeks to adapt with logical systems comfortably, often prefers to be in situations requiring known experiences, seeks to adapt with latent patterns during mild burnout, and prefers being in situations requiring known moral values during serious burnout.",
  },
  {
    type: "oMX",
    nickname: "The Welfarer",
    group: "Mediators",
    behavior: "Mostly seeks to adapt with moral values comfortably, often prefers to be in situations requiring known experiences, seeks to adapt with latent patterns during mild burnout, and prefers being in situations requiring known logical systems during serious burnout.",
  },
  {
    type: "sLX",
    nickname: "The Specialist",
    group: "Risk Takers",
    behavior: "Mostly prefers being in situations requiring known logical systems, often seeks to adapt with experiences comfortably, prefers being in situations requiring known logical systems during mild burnout, and seeks to adapt with moral values during serious burnout.",
  },
  {
    type: "sMX",
    nickname: "The Crusader",
    group: "Risk Takers",
    behavior: "Mostly prefers being in situations requiring known moral values, often seeks to adapt with experiences comfortably, prefers being in situations requiring known latent patterns during mild burnout, and seeks to adapt with logical systems during serious burnout.",
  },
  {
    type: "oXL",
    nickname: "The Gambit",
    group: "Risk Takers",
    behavior: "Mostly seeks to adapt with experiences comfortably, often prefers to be in situations requiring known logical systems, seeks to adapt with moral values during mild burnout, and prefers being in situations requiring known latent patterns during serious burnout.",
  },
  {
    type: "oXM",
    nickname: "The Firebrand",
    group: "Risk Takers",
    behavior: "Mostly seeks to adapt with experiences comfortably, often prefers to be in situations requiring known moral values, seeks to adapt with logical systems during mild burnout, and prefers being in situations requiring known latent patterns during serious burnout.",
  },
  {
    type: "sAL",
    nickname: "The Visionary",
    group: "Troubleshooters",
    behavior: "Mostly prefers being in situations requiring known latent patterns, often seeks to adapt with logical systems comfortably, prefers being in situations requiring known moral values during mild burnout, and seeks to adapt with experiences during serious burnout.",
  },
  {
    type: "sAM",
    nickname: "The Philosopher",
    group: "Mediators",
    behavior: "Mostly prefers being in situations requiring known latent patterns, often seeks to adapt with moral values comfortably, prefers being in situations requiring known logical systems during mild burnout, and seeks to adapt with experiences during serious burnout.",
  },
  {
    type: "oLA",
    nickname: "The Strategist",
    group: "Troubleshooters",
    behavior: "Mostly seeks to adapt with logical systems comfortably, often prefers to be in situations requiring known latent patterns, seeks to adapt with experiences during mild burnout, and prefers being in situations requiring known morality during serious burnout.",
  },
  {
    type: "oMA",
    nickname: "The Reformer",
    group: "Mediators",
    behavior: "Mostly seeks to adapt with moral values comfortably, often prefers to be in situations requiring known latent patterns, seeks to adapt with experiences during mild burnout, and prefers being in situations requiring known logical systems during serious burnout.",
  },
  {
    type: "sLA",
    nickname: "The Craftsman",
    group: "Ideators",
    behavior: "Mostly prefers being in situations requiring known logical systems, often seeks to adapt with latent patterns comfortably, prefers being in situations requiring known experiences during mild burnout, and seeks to adapt with moral values during serious burnout.",
  },
  {
    type: "sMA",
    nickname: "The Pioneer",
    group: "Ideators",
    behavior: "Mostly prefers being in situations requiring known moral values, often seeks to adapt with latent patterns comfortably, prefers being in situations requiring known experiences during mild burnout, and seeks to adapt with logical systems during serious burnout.",
  },
  {
    type: "oAL",
    nickname: "The Innovator",
    group: "Ideators",
    behavior: "Mostly seeks to adapt with latent patterns comfortably, often prefers to be in situations requiring known logical systems, seeks to adapt with moral values during mild burnout, and prefers being in situations requiring known experiences during serious burnout.",
  },
  {
    type: "oAM",
    nickname: "The Ninja",
    group: "Ideators",
    behavior: "Mostly seeks to adapt with latent patterns comfortably, often prefers to be in situations requiring known moral values, seeks to adapt with logical systems during mild burnout, and prefers being in situations requiring known experiences during serious burnout.",
  },
];

const COMPATIBLE_GROUPS = [
  {
    group: "Risk Takers",
    members: "oXL, oXM, sLX, sMX",
    reason: "Rarely conflicting on grounds of adapting to experiences (oX).",
  },
  {
    group: "Ideators",
    members: "oAL, oAM, sLA, sMA",
    reason: "Rarely conflicting on grounds of adapting to latent patterns (oA).",
  },
  {
    group: "Troubleshooters",
    members: "oLA, oLX, sAL, sXL",
    reason: "Rarely conflicting on grounds of adapting to logical systems (oL).",
  },
  {
    group: "Mediators",
    members: "oMA, oMX, sAM, sXM",
    reason: "Rarely conflicting on grounds of adapting to moral values (oM).",
  },
];
