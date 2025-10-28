import React, { useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import ScoreBadge from '../components/ScoreBadge';
import { getAssetUrl } from '../utils/assets';

export default function ListingDetail() {
  const { id } = useParams();
  const { listings, users, getSellerById, getReviewsForListing, makePurchase } = useContext(DataContext);
  const { currentUser } = useContext(AuthContext);
  const listing = useMemo(() => listings.find(l => l.id === id), [listings, id]);
  const seller = listing ? getSellerById(listing.sellerId) : null;
  const listingReviews = listing ? getReviewsForListing(listing.id) : [];

  const handlePurchase = () => {
    if (!currentUser) {
      alert('Please sign in to purchase artwork.');
      return;
    }
    makePurchase(listing.id, currentUser.id);
    alert(`Successfully purchased "${listing.title}"! View it in your collection.`);
  };

  if (!listing) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-700">Listing not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img src={getAssetUrl(listing.imageUrl)} alt={listing.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <span className="bg-white/70 text-gray-900 font-semibold px-4 py-2 rounded-md border border-gray-300">HandSigned Preview</span>
          </div>
        </div>
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            <ScoreBadge score={listing.aiAuthenticityScore} />
          </div>
          <p className="mt-4 text-gray-700">{listing.description}</p>
          <p className="mt-4 text-2xl font-semibold text-blue-700">${listing.price.toFixed(2)}</p>
          <div className="mt-6 flex items-center gap-3">
            <img src={getAssetUrl(seller?.profilePicUrl)} alt={seller?.username} className="h-10 w-10 rounded-full ring-2 ring-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Seller</p>
              <Link to={`/seller/${seller?.id}`} className="font-semibold text-gray-900 hover:text-blue-700">{seller?.username}</Link>
            </div>
          </div>
          <div className="mt-8">
            <button onClick={handlePurchase} className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700">Purchase</button>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
        <div className="space-y-4">
          {listingReviews.length === 0 && <p className="text-gray-600">No reviews yet.</p>}
          {listingReviews.map(r => {
            const reviewer = users.find(u => u.id === r.userId);
            return (
              <div key={r.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <img src={getAssetUrl(reviewer?.profilePicUrl)} alt={reviewer?.username} className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{reviewer?.username}</p>
                    <p className="text-sm text-gray-600">{new Date(r.datePosted).toLocaleDateString()}</p>
                  </div>
                  <div className="text-yellow-500 font-semibold">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                </div>
                <p className="mt-2 text-gray-700">{r.comment}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
