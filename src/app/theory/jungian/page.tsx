import Link from "next/link";

export default function JungianTypologyPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header>
        <div className="text-xs text-surface-500 uppercase tracking-wide">Theory</div>
        <h1 className="mt-2 text-3xl font-semibold">Jungian Typology</h1>
        <p className="mt-2 text-surface-400">
          Psychological type theory as founded by Carl Jung and later systematized by
          Isabel Myers and Katharine Briggs.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Historical Foundation</h2>
        <p className="text-surface-400">
          Carl Jung introduced the theory of psychological types in 1921, proposing that
          individuals differ in their preferred modes of perception and judgment. His work
          defined two core attitudes&mdash;introversion and extraversion&mdash;and four psychological
          functions: sensation, intuition, thinking, and feeling.
        </p>
        <p className="text-surface-400">
          Isabel Myers and Katharine Briggs later expanded Jung&apos;s framework into a structured
          typology system. Their contribution was organizational rather than theoretical:
          clarifying preferences, formalizing type descriptions, and arranging Jung&apos;s
          functions into a consistent 16-type model.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Terminology</h2>
        <ul className="space-y-2 text-surface-400">
          <li><strong className="text-surface-300">Subject:</strong> Conscious entity which perceives the object.</li>
          <li><strong className="text-surface-300">Object:</strong> Content of consciousness which is being perceived by the subject.</li>
          <li><strong className="text-surface-300">Ego:</strong> Center of consciousness which selects, integrates, organizes, and identifies experience.</li>
          <li><strong className="text-surface-300">Suppressed:</strong> Consciously holding back something.</li>
          <li><strong className="text-surface-300">Repressed:</strong> Unconsciously blocked from awareness.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-medium">Jung&apos;s Definitions</h2>
        <h3 className="text-lg font-medium">Solo Functions</h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-surface-800 text-sm">
            <thead className="bg-surface-900 text-surface-300">
              <tr>
                <th className="border border-surface-800 p-2 text-left">Function</th>
                <th className="border border-surface-800 p-2 text-left">Jung&apos;s Definition</th>
                <th className="border border-surface-800 p-2 text-left">Simplification</th>
              </tr>
            </thead>
            <tbody className="text-surface-400 [&>tr:nth-child(even)]:bg-surface-900/50">
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Sensation (S)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Sensation is that psychological function which transmits the physical
                  stimulus to perception... It is the function which registers the concrete
                  reality of the object.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Sensing is the psychological function which perceives the reality through
                  5 senses. It understands object in concrete form.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Intuition (N)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Intuition is that psychological function which transmits perceptions in
                  an unconscious way... It is the function which sees around the corners and
                  anticipates the future.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Intuition is the psychological function which perceives in an unconscious
                  way. It sees indirect patterns and predicts the future.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Thinking (T)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Thinking, in so far as it is a conscious activity, is a process of perception
                  and judgement by means of concepts... It is the function which arranges
                  the contents of consciousness in an orderly series and connects them by
                  logical relations.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Thinking is the psychological function that perceives and judges through
                  concepts. It arranges contents of consciousness in a logical manner.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Feeling (F)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Feeling is a process of valuation... It is the function which assigns
                  values to the contents of consciousness... It says &lsquo;pleasant&rsquo; or &lsquo;unpleasant&rsquo;,
                  &lsquo;good&rsquo; or &lsquo;bad&rsquo;, &lsquo;beautiful&rsquo; or &lsquo;ugly&rsquo;.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Feeling is the psychological function that perceives and judges through
                  values. It assigns values to contents of consciousness.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-medium">Directed Functions</h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-surface-800 text-sm">
            <thead className="bg-surface-900 text-surface-300">
              <tr>
                <th className="border border-surface-800 p-2 text-left">Function</th>
                <th className="border border-surface-800 p-2 text-left">Jung&apos;s Definition</th>
                <th className="border border-surface-800 p-2 text-left">Simplification</th>
              </tr>
            </thead>
            <tbody className="text-surface-400 [&>tr:nth-child(even)]:bg-surface-900/50">
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Introverted Sensing (Si)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Introverted sensation is oriented by the intensity of the subjective sensation factor&hellip; It is a sensation which perceives the object through the medium of the subject&hellip; It is impressionistic and reproduces the object in a subjective form.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Introverted sensation is concerned with subjective sensation, perceiving the object with personal sensation &amp; impression.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Extraverted Sensing (Se)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Extraverted sensation is oriented by the intensity of the objective influence&hellip; It is a sensation which seeks the strongest possible sensation&hellip; It is absorbed in the object and lives in the moment.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Extraverted sensation is concerned with objective sensation. It seeks the strongest sensation and lives in the moment.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Introverted Intuition (Ni)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Introverted intuition is directed to the inner object, a subjective image&hellip; It perceives the images which arise from the a priori, inherited foundations of the unconscious&hellip; It sees behind the scenes and anticipates the future in a symbolic form.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Introverted intuition focuses on subjective image. It perceives images from indirect patterns or the unconscious realm. It predicts the future in symbolic form.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Extraverted Intuition (Ne)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Extraverted intuition is oriented by the object and by objective happenings&hellip; It is a perception of possibilities&hellip; It is always on the lookout for new possibilities and seeks to realize them.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Extraverted intuition is concerned with object and its effects. It looks for new possibilities, and seeks to understand them.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Introverted Thinking (Ti)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Introverted thinking is primarily oriented by the subjective factor&hellip; It does not adapt to the object, but tries to subordinate the object to its own subjective formula&hellip;&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Introverted thinking is concerned with subjective logic. It tries to make sense of object through its subjective logic.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Extraverted Thinking (Te)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;The extraverted thinking type&hellip; orients itself by objective data&hellip; The judgment always accords with objective conditions&hellip;&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Extraverted thinking is concerned with objective facts. It adapts to objective conditions, and focused on external world.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Introverted Feeling (Fi)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Introverted feeling is determined principally by the subjective factor&hellip; It is a feeling which seems cold to the outside observer&hellip;&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Introverted feeling considers personal values for judgement and seems cold from the outside. It seeks to understand its subjective values.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Extraverted Feeling (Fe)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Extraverted feeling is oriented by objective data&hellip; It is a feeling which adapts itself to the object&hellip; It seeks to establish harmony with the general emotional atmosphere.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Extraverted feeling is concerned with objective values. It adapts its values to match with the object, and seeks to adjust with the external emotional atmosphere.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-medium">Function Positions</h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-surface-800 text-sm">
            <thead className="bg-surface-900 text-surface-300">
              <tr>
                <th className="border border-surface-800 p-2 text-left">Position</th>
                <th className="border border-surface-800 p-2 text-left">Jung&apos;s Definition</th>
                <th className="border border-surface-800 p-2 text-left">Simplification</th>
              </tr>
            </thead>
            <tbody className="text-surface-400 [&>tr:nth-child(even)]:bg-surface-900/50">
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Superior (Dominant)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;Experience shows that the superior function is always in the most differentiated form, while the inferior function is in an archaic, primitive, and undifferentiated state.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Dominant function is the primary mode through which the ego relates to reality and performs its job.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Auxiliary</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;As a rule the second function is of a different nature from the first, and therefore cannot be antagonistic to it.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Auxiliary function can&apos;t be opposing to dominant function, rather it assists it.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Unnamed (Tertiary)</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;One function is consciously differentiated, another is less so, the third is only slightly differentiated, and the fourth is entirely unconscious.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Tertiary function is given very little priority by the ego to relate with reality.
                </td>
              </tr>
              <tr>
                <td className="border border-surface-800 p-2 font-medium">Inferior</td>
                <td className="border border-surface-800 p-2 italic">
                  &ldquo;The inferior function is practically identical with the unconscious, and in so far as it is conscious at all, it is always contaminated by unconscious elements.&rdquo;
                </td>
                <td className="border border-surface-800 p-2">
                  Inferior function is unconsciously repressed and contaminated by the dominant function to protect the ego (identity).
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-surface-400 text-sm">
          As any type could have 4 functions in their stack, the rest of the 4 could be used
          but they aren&apos;t ego-aligned, linear, or natural preference.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-medium">Quantitative Evidence (Correlational)</h2>
        <p className="text-surface-400">
          The following studies do not validate Jungian functions directly, but provide
          correlational evidence for cognitive processes aligned with their descriptions.
        </p>

        <ul className="space-y-2 text-sm text-surface-400">
          <li>Si &mdash; Hippocampal activation and autobiographical memory research: https://pmc.ncbi.nlm.nih.gov/articles/PMC2689362/</li>
          <li>Se &mdash; Sensory cortex and real-time perception: https://www.jneurosci.org/content/42/3/435</li>
          <li>Ni &mdash; Default Mode Network and future simulation: https://pmc.ncbi.nlm.nih.gov/articles/PMC4751480/</li>
          <li>Ne &mdash; Divergent thinking and associative networks: https://www.sciencedirect.com/science/article/pii/S0160289624000229</li>
          <li>Ti &mdash; Analytical reasoning and prefrontal cortex: https://pubmed.ncbi.nlm.nih.gov/15178381/</li>
          <li>Te &mdash; Executive function and DLPFC: https://www.nature.com/articles/s41386-021-01132-0</li>
          <li>Fi &mdash; Value-based judgment and vmPFC: https://pmc.ncbi.nlm.nih.gov/articles/PMC6608126/</li>
          <li>Fe &mdash; Empathy, mirror neurons, and insula: https://pmc.ncbi.nlm.nih.gov/articles/PMC3840169/</li>
        </ul>
      </section>

      <Link href="/theory" className="inline-block text-sm text-surface-400 hover:text-foreground transition-colors">
        &larr; Back to Theory
      </Link>
    </div>
  );
}
