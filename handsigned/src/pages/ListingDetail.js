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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <p className="text-gray-700 text-lg">Listing not found.</p>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Listing Header */}
        <div className="lg:flex lg:items-start lg:gap-12 animate-fadeIn">
          {/* Listing Image */}
          <div className="lg:flex-1 relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <img
              src={getAssetUrl(listing.imageUrl)}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <span className="bg-white/70 text-gray-900 font-semibold px-4 py-2 rounded-md border border-gray-300">
                HandSigned Preview
              </span>
            </div>
          </div>

          {/* Listing Info */}
          <div className="lg:flex-1 mt-8 lg:mt-0">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-4xl font-bold text-gray-900">{listing.title}</h1>
              <ScoreBadge score={listing.aiAuthenticityScore} />
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed">{listing.description}</p>
            <p className="mt-6 text-3xl font-semibold text-purple-700">${listing.price.toFixed(2)}</p>

            {/* Seller Info */}
            <div className="mt-6 flex items-center gap-3">
              <img
                src={getAssetUrl(seller?.profilePicUrl)}
                alt={seller?.username}
                className="h-12 w-12 rounded-full ring-2 ring-purple-600"
              />
              <div>
                <p className="text-sm text-gray-600">Seller</p>
                <Link
                  to={`/seller/${seller?.id}`}
                  className="font-semibold text-gray-900 hover:text-purple-700"
                >
                  {seller?.username}
                </Link>
              </div>
            </div>

            {/* Purchase Button */}
            <div className="mt-8">
              <button
                onClick={handlePurchase}
                className="w-full lg:w-auto rounded-lg bg-purple-600 px-8 py-3 text-white font-semibold shadow-md hover:bg-purple-700 hover:shadow-lg transition-all"
              >
                Purchase
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          <div className="space-y-6">
            {listingReviews.length === 0 && (
              <p className="text-gray-600">No reviews yet.</p>
            )}

            {listingReviews.map(r => {
              const reviewer = users.find(u => u.id === r.userId);
              return (
                <div
                  key={r.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={getAssetUrl(reviewer?.profilePicUrl)}
                      alt={reviewer?.username}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{reviewer?.username}</p>
                      <p className="text-xs text-gray-500">{new Date(r.datePosted).toLocaleDateString()}</p>
                    </div>
                    <div className="text-yellow-500 font-semibold">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700">{r.comment}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
