import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../context/DataContext';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';

export default function Marketplace() {
  const { listings, users } = useContext(DataContext);
  const [query, setQuery] = useState('');
  const [minScore, setMinScore] = useState(0);

  const usersById = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter(l => {
      const seller = usersById[l.sellerId];
      const matchesQuery = !q || l.title.toLowerCase().includes(q) || seller?.username.toLowerCase().includes(q);
      const matchesScore = l.aiAuthenticityScore >= minScore;
      return matchesQuery && matchesScore;
    });
  }, [listings, usersById, query, minScore]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
      </div>
      <SearchBar query={query} setQuery={setQuery} minScore={minScore} setMinScore={setMinScore} />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(l => (
          <ListingCard key={l.id} listing={l} seller={usersById[l.sellerId]} />
        ))}
      </div>
    </main>
  );
}
