import React, { useContext, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ScoreBadge from '../components/ScoreBadge';
import { getAssetUrl } from '../utils/assets';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, users, getSellerById, getReviewsForListing } = useContext(DataContext);
  const { currentUser } = useContext(AuthContext);
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const listing = useMemo(() => listings.find(l => l.id === id), [listings, id]);
  const seller = listing ? getSellerById(listing.sellerId) : null;
  const listingReviews = listing ? getReviewsForListing(listing.id) : [];

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }
    
    setIsAdding(true);
    try {
      addToCart(listing.id, 1);
      // Show success feedback
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
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

            {/* Add to Cart Button */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 lg:flex-none lg:min-w-[200px] rounded-lg bg-purple-600 px-8 py-3 text-white font-semibold shadow-md hover:bg-purple-700 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : isInCart(listing.id) ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    In Cart
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              {isInCart(listing.id) && (
                <Link
                  to="/cart"
                  className="rounded-lg border border-purple-600 text-purple-600 px-6 py-3 font-semibold hover:bg-purple-50 transition flex items-center gap-2"
                >
                  View Cart
                </Link>
              )}
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
