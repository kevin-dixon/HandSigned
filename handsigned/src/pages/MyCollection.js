import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../utils/assets';
import * as storage from '../services/storageService';

export default function MyCollection() {
  const { currentUser } = useContext(AuthContext);
  const { listings } = useContext(DataContext);

  const myPurchases = useMemo(() => 
    storage.getPurchasesByUser(currentUser?.id),
    [currentUser, listings] // eslint-disable-line
  );

  const purchasedListings = useMemo(() => {
    return myPurchases.map(p => {
      const listing = listings.find(l => l.id === p.listingId);
      return listing ? { ...listing, datePurchased: p.datePurchased } : null;
    }).filter(Boolean);
  }, [myPurchases, listings]);

  const handleDownload = (listing) => {
    // Create a download link for the artwork
    const link = document.createElement('a');
    link.href = getAssetUrl(listing.imageUrl);
    link.download = `${listing.title.replace(/[^a-z0-9]/gi, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentUser) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-700">Please sign in to view your collection.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Collection</h1>
      
      {purchasedListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't purchased any artwork yet.</p>
          <Link to="/marketplace" className="text-blue-600 hover:underline">Browse Marketplace</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedListings.map(listing => (
          <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-gray-50">
              <img src={getAssetUrl(listing.imageUrl)} alt={listing.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{listing.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Purchased: {listing.datePurchased}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleDownload(listing)} className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm text-white font-semibold hover:bg-blue-700">
                  Download
                </button>
                <Link to={`/listing/${listing.id}`} className="flex-1 rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-900 font-semibold hover:bg-gray-300 text-center">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
