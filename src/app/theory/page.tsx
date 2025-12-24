import { theoryCards } from "@/data/offerings";

export default function TheoryIndexPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Theory & Research</h1>
        <p className="mt-2 text-neutral-400">
          Educational resources on personality typology systems. These cards provide context
          and research background without interactive assessments.
        </p>
      </header>

      <div className="space-y-4">
        {theoryCards.map((card) => (
          <a
            key={card.id}
            href={card.href}
            className="block border border-neutral-800 p-5 hover:border-neutral-600 transition-colors"
          >
            <div className="text-xs text-neutral-500 uppercase tracking-wide">Theory</div>
            <h2 className="mt-2 text-lg font-medium">{card.title}</h2>
            <p className="mt-1 text-sm text-neutral-400">{card.description}</p>
            <span className="mt-3 inline-block text-sm text-neutral-300">Read More →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
