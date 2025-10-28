import React from 'react';

const getColor = (score) => {
  if (score >= 95) return 'bg-green-600';
  if (score >= 90) return 'bg-green-500';
  if (score >= 80) return 'bg-yellow-500';
  if (score >= 70) return 'bg-orange-500';
  return 'bg-red-500';
};

export default function ScoreBadge({ score }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-semibold ${getColor(score)}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
      {score}%
    </span>
  );
}
