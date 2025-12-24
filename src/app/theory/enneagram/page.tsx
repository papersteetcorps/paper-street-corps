export default function EnneagramPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <div className="text-xs text-neutral-500 uppercase tracking-wide">Theory</div>
        <h1 className="mt-2 text-3xl font-semibold">Enneagram</h1>
        <p className="mt-2 text-neutral-400">
          Nine personality types and their interconnections in a geometric system of
          psychological patterns.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Origins</h2>
        <p className="text-neutral-400">
          The Enneagram has diverse historical roots, drawing from Sufi traditions,
          Christian mysticism, and 20th-century psychological work by Oscar Ichazo and
          Claudio Naranjo. It describes nine distinct personality types arranged in a
          geometric figure.
        </p>
        <p className="text-neutral-400">
          Unlike type-based systems that focus on behavior, the Enneagram emphasizes
          core motivations, fears, and desires that drive personality patterns.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">The Nine Types</h2>
        <div className="space-y-3">
          {TYPES.map((type) => (
            <div key={type.number} className="border border-neutral-800 p-4">
              <h3 className="font-medium">
                Type {type.number}: {type.name}
              </h3>
              <p className="mt-1 text-sm text-neutral-400">{type.description}</p>
              <div className="mt-2 text-xs text-neutral-500">
                Core fear: {type.fear} • Core desire: {type.desire}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Centers of Intelligence</h2>
        <p className="text-neutral-400">
          The nine types are grouped into three &quot;triads&quot; based on their dominant
          center of intelligence:
        </p>
        <div className="space-y-3">
          <div className="border border-neutral-800 p-4">
            <h3 className="font-medium">Body/Instinctive Center (8, 9, 1)</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Process the world through gut instinct and physical sensation.
              Core emotion: Anger (expressed, repressed, or denied)
            </p>
          </div>
          <div className="border border-neutral-800 p-4">
            <h3 className="font-medium">Heart/Feeling Center (2, 3, 4)</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Process the world through emotions and relationships.
              Core emotion: Shame (about identity and worth)
            </p>
          </div>
          <div className="border border-neutral-800 p-4">
            <h3 className="font-medium">Head/Thinking Center (5, 6, 7)</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Process the world through analysis and mental frameworks.
              Core emotion: Fear (about security and competence)
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Wings and Lines</h2>
        <p className="text-neutral-400">
          Each type is influenced by its adjacent types (wings) and connected to two
          other types through integration and disintegration lines. A Type 5, for
          example, may have a 4-wing or 6-wing, and connects to Type 8 (integration)
          and Type 7 (disintegration).
        </p>
        <p className="text-neutral-400">
          This creates significant variation within each type and explains how people
          may express different aspects of their personality under stress or growth.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Limitations</h2>
        <p className="text-neutral-400">
          The Enneagram lacks strong empirical validation compared to research-backed
          models like the Big Five. Its origins in spiritual traditions mean it&apos;s
          better understood as a reflective tool than a scientific framework.
        </p>
        <p className="text-neutral-400">
          The system&apos;s depth can also lead to over-identification with a type or
          using it to explain away behavior rather than taking responsibility for growth.
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

const TYPES = [
  {
    number: 1,
    name: "The Perfectionist",
    description: "Principled, purposeful, self-controlled, and perfectionistic.",
    fear: "Being corrupt or defective",
    desire: "To be good, balanced, and have integrity",
  },
  {
    number: 2,
    name: "The Helper",
    description: "Generous, demonstrative, people-pleasing, and possessive.",
    fear: "Being unloved or unwanted",
    desire: "To feel loved and appreciated",
  },
  {
    number: 3,
    name: "The Achiever",
    description: "Adaptable, excelling, driven, and image-conscious.",
    fear: "Being worthless or without value",
    desire: "To feel valuable and worthwhile",
  },
  {
    number: 4,
    name: "The Individualist",
    description: "Expressive, dramatic, self-absorbed, and temperamental.",
    fear: "Having no identity or significance",
    desire: "To find themselves and their significance",
  },
  {
    number: 5,
    name: "The Investigator",
    description: "Perceptive, innovative, secretive, and isolated.",
    fear: "Being useless or incapable",
    desire: "To be capable and competent",
  },
  {
    number: 6,
    name: "The Loyalist",
    description: "Engaging, responsible, anxious, and suspicious.",
    fear: "Being without support or guidance",
    desire: "To have security and support",
  },
  {
    number: 7,
    name: "The Enthusiast",
    description: "Spontaneous, versatile, acquisitive, and scattered.",
    fear: "Being deprived or trapped in pain",
    desire: "To be satisfied and content",
  },
  {
    number: 8,
    name: "The Challenger",
    description: "Self-confident, decisive, willful, and confrontational.",
    fear: "Being harmed or controlled by others",
    desire: "To protect themselves and control their environment",
  },
  {
    number: 9,
    name: "The Peacemaker",
    description: "Receptive, reassuring, complacent, and resigned.",
    fear: "Loss, fragmentation, or separation",
    desire: "To have inner stability and peace of mind",
  },
];
