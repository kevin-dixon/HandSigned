import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import ListingCard from '../components/ListingCard';
import { getAssetUrl } from '../utils/assets';

export default function SellerProfile() {
  const { id } = useParams();
  const { users, listings } = useContext(DataContext);
  const seller = users.find(u => u.id === id);
  const sellerListings = useMemo(() => listings.filter(l => l.sellerId === id), [listings, id]);

  if (!seller) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-700">Seller not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start gap-6">
        <img src={getAssetUrl(seller.profilePicUrl)} alt={seller.username} className="h-20 w-20 rounded-full ring-2 ring-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{seller.username}</h1>
          <p className="text-gray-700 mt-2 max-w-2xl">{seller.bio}</p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Listings</h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellerListings.map(l => (
          <ListingCard key={l.id} listing={l} seller={seller} />
        ))}
      </div>
    </main>
  );
}
