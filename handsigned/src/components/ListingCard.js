import React from 'react';
import { Link } from 'react-router-dom';
import ScoreBadge from './ScoreBadge';
import { getAssetUrl } from '../utils/assets';

export default function ListingCard({ listing, seller }) {
  return (
    <Link to={`/listing/${listing.id}`} className="block rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
      <div className="aspect-[4/3] bg-gray-50">
        <img src={getAssetUrl(listing.thumbnailUrl)} alt={listing.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900">{listing.title}</h3>
          <ScoreBadge score={listing.aiAuthenticityScore} />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>By {seller?.username ?? 'Unknown'}</span>
          <span className="font-semibold text-purple-700">${listing.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
