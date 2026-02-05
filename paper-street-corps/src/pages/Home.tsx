import UpdateCard from '../components/cards/UpdateCard';
import SuggestionCard from '../components/cards/SuggestionCard';
import { updates, suggestions } from '../data/homeData';

export default function Home() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      {/* Latest Updates */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
        {updates.map((u, i) => (
          <UpdateCard
            key={i}
            title={u.title}
            description={u.description}
            access={u.access as 'Free' | 'Paid'}
            category={u.category as 'Typology' | 'Software'}
          />
        ))}
      </section>

      {/* Suggestions */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Suggestions</h2>
        {suggestions.map((s, i) => (
          <SuggestionCard
            key={i}
            title={s.title}
            description={s.description}
          />
        ))}
      </section>

      {/* Ethos */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Ethos</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Paper Street Corps exists to explore typology, systems,
          and tools without dilution or theatrics.
        </p>
      </section>
    </main>
  );
}
