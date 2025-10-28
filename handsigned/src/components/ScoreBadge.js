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
      <img
        src={process.env.PUBLIC_URL + '/assets/images/icons/Authentic-Light.svg'}
        alt=""
        className="h-3 w-3"
      />
      {score}%
    </span>
  );
}
