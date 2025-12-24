export default function JungianTypologyPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <div className="text-xs text-neutral-500 uppercase tracking-wide">Theory</div>
        <h1 className="mt-2 text-3xl font-semibold">Jungian Typology</h1>
        <p className="mt-2 text-neutral-400">
          Context and research on the 16 personality types and their neurochemical correlates.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Origins</h2>
        <p className="text-neutral-400">
          Carl Jung&apos;s psychological types, introduced in 1921, proposed that people differ
          in their preferred cognitive functions. Jung identified two main attitudes
          (extraversion and introversion) and four functions (thinking, feeling, sensing,
          and intuition).
        </p>
        <p className="text-neutral-400">
          Isabel Myers and Katharine Briggs later developed the MBTI (Myers-Briggs Type
          Indicator) based on Jung&apos;s work, adding the Judging/Perceiving dimension to create
          16 distinct types.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">The Four Dichotomies</h2>
        <div className="space-y-3">
          <div className="border border-neutral-800 p-4">
            <h3 className="font-medium">Extraversion (E) vs Introversion (I)</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Direction of energy — outward toward action and people, or inward toward
              reflection and ideas.
            </p>
          </div>
          <div className="border border-neutral-800 p-4">
            <h3 className="font-medium">Sensing (S) vs Intuition (N)</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Information gathering — concrete facts and details, or patterns and possibilities.
            </p>
          </div>
          <div className="border border-neutral-800 p-4">
            <h3 className="font-medium">Thinking (T) vs Feeling (F)</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Decision making — logical analysis and objectivity, or values and interpersonal
              harmony.
            </p>
          </div>
          <div className="border border-neutral-800 p-4">
            <h3 className="font-medium">Judging (J) vs Perceiving (P)</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Lifestyle orientation — structured and decisive, or flexible and adaptable.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Neurochemical Correlates</h2>
        <p className="text-neutral-400">
          Research by Helen Fisher and others has explored potential neurochemical bases
          for personality differences. While speculative, these correlations offer an
          interesting biological lens:
        </p>
        <ul className="space-y-2 text-neutral-400">
          <li>
            <strong className="text-neutral-300">Dopamine</strong> — Associated with
            novelty-seeking, exploration, and extraversion
          </li>
          <li>
            <strong className="text-neutral-300">Serotonin</strong> — Associated with
            conscientiousness, tradition, and structure
          </li>
          <li>
            <strong className="text-neutral-300">Testosterone</strong> — Associated with
            analytical thinking, directness, and competitiveness
          </li>
          <li>
            <strong className="text-neutral-300">Estrogen/Oxytocin</strong> — Associated with
            empathy, intuition, and social bonding
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Limitations</h2>
        <p className="text-neutral-400">
          Type-based systems have been criticized for forcing continuous traits into discrete
          categories. Personality research increasingly favors dimensional models (like the
          Big Five) that treat traits as spectrums rather than binary opposites.
        </p>
        <p className="text-neutral-400">
          The neurochemical correlations remain largely theoretical and should not be taken
          as established science. Human personality emerges from complex interactions between
          genetics, environment, and experience.
        </p>
      </section>

      <a
        href="/theory"
        className="inline-block text-sm text-neutral-400 hover:text-white"
      >
        ← Back to Theory
      </a>
    </div>
  );
}
