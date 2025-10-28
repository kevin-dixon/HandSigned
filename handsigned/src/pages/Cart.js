import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import WatermarkedImage from '../components/WatermarkedImage';

export default function Cart() {
  const { listings, getSellerById } = useContext(DataContext);
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  // Get full listing data for cart items
  const cartWithListings = cartItems.map(cartItem => ({
    ...cartItem,
    listing: listings.find(l => l.id === cartItem.listingId)
  })).filter(item => item.listing); // Filter out items where listing wasn't found

  const total = getCartTotal(listings);

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto mb-8 w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Browse the marketplace to discover amazing hand-crafted digital art.</p>
          <Link
            to="/marketplace"
            className="inline-block rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white hover:bg-purple-700 transition"
          >
            Explore Marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartWithListings.map(({ listing, quantity, id }) => {
            const seller = getSellerById(listing.sellerId);
            return (
              <div key={id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <WatermarkedImage
                      src={listing.thumbnailUrl || listing.imageUrl}
                      alt={listing.title}
                      className="w-20 h-20 rounded-lg"
                      watermarkSize="sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          By {seller?.username || 'Unknown Artist'}
                        </p>
                        <p className="text-lg font-bold text-purple-700 mt-1">
                          ${listing.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(listing.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove from cart"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Quantity:</label>
                        <select
                          value={quantity}
                          onChange={(e) => updateQuantity(listing.id, parseInt(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal:</p>
                        <p className="font-semibold text-gray-900">
                          ${(listing.price * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-purple-700">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full block text-center rounded-lg bg-purple-600 px-4 py-3 text-base font-semibold text-white hover:bg-purple-700 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/marketplace"
              className="w-full block text-center mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}