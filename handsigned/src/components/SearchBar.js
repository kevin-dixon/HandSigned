import React from 'react';

export default function SearchBar({ query, setQuery, minScore, setMinScore }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title or seller..."
        className="w-full sm:w-80 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={minScore}
        onChange={(e) => setMinScore(Number(e.target.value))}
        className="w-full sm:w-56 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={0}>All authenticity scores</option>
        <option value={90}>90%+ Authentic</option>
        <option value={80}>80%+ Authentic</option>
        <option value={70}>70%+ Authentic</option>
        <option value={60}>60%+ Authentic</option>
      </select>
    </div>
  );
}
