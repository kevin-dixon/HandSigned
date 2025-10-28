import React, { useContext, useMemo, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { Link, useSearchParams } from 'react-router-dom';
import { getAssetUrl } from '../utils/assets';
import * as storage from '../services/storageService';

export default function MyCollection() {
  const { currentUser } = useContext(AuthContext);
  const { listings } = useContext(DataContext);
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('purchase') === 'success') {
      setShowSuccess(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const myPurchases = useMemo(
    () => storage.getPurchasesByUser(currentUser?.id),
    [currentUser, listings] // eslint-disable-line
  );

  const purchasedListings = useMemo(() => {
    return myPurchases
      .map(p => {
        const listing = listings.find(l => l.id === p.listingId);
        return listing ? { ...listing, datePurchased: p.datePurchased } : null;
      })
      .filter(Boolean);
  }, [myPurchases, listings]);

  const handleDownload = listing => {
    const link = document.createElement('a');
    link.href = getAssetUrl(listing.imageUrl);
    link.download = `${listing.title.replace(/[^a-z0-9]/gi, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <p className="text-gray-700 text-lg">Please sign in to view your collection.</p>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {showSuccess && (
          <div className="mb-8 rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-green-800 font-semibold">Purchase Successful!</h3>
            </div>
            <p className="text-green-700 mt-1">
              Your artwork has been successfully purchased and added to your collection. You can now download your digital art files.
            </p>
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">My Collection</h1>

        {purchasedListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't purchased any artwork yet.</p>
            <Link
              to="/marketplace"
              className="inline-block rounded-lg bg-purple-600 px-6 py-2 text-white font-semibold shadow hover:bg-purple-700 transition"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedListings.map(listing => (
              <div
                key={listing.id}
                className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                  <img
                    src={getAssetUrl(listing.imageUrl)}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Purchased: {listing.datePurchased}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleDownload(listing)}
                      className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
                    >
                      Download
                    </button>
                    <Link
                      to={`/listing/${listing.id}`}
                      className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 text-center transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
