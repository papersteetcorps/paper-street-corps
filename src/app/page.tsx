import Tabs from "@/components/Tabs";

export default function HomePage() {
  return (
    <section className="space-y-16 max-w-5xl">
      {/* Hero */}
      <section>
        <h1 className="text-4xl font-semibold leading-tight">
          Formal psychological assessments grounded in research.
        </h1>

        <p className="mt-4 text-neutral-400 max-w-3xl">
          Neurochemical-based personality tests and educational resources on typology systems.
          All assessments use documented scoring methods with no data collection.
        </p>

        <div className="mt-6 flex gap-4">
          <a
            href="/mbti"
            className="px-4 py-2 bg-white text-black text-sm font-medium"
          >
            Take MBTI Test
          </a>

          <a
            href="/temperaments"
            className="px-4 py-2 border border-neutral-700 text-sm text-neutral-300 hover:text-white"
          >
            Temperament Test
          </a>
        </div>
      </section>

      {/* Tabs with Tests and Theory Cards */}
      <section>
        <Tabs />
      </section>

      {/* Ethos */}
      <section>
        <h2 className="text-2xl font-medium">Ethos</h2>
        <ul className="mt-4 space-y-2 text-neutral-400 max-w-3xl">
          <li>All scoring algorithms are transparent and documented.</li>
          <li>Assessments are grounded in research and published methods.</li>
          <li>No accounts, no tracking, no data collection.</li>
        </ul>
      </section>

      {/* Resources Link */}
      <section className="border-t border-neutral-800 pt-8">
        <a
          href="/resources"
          className="text-neutral-400 hover:text-white text-sm"
        >
          View source materials and research papers →
        </a>
      </section>
    </section>
  );
}
