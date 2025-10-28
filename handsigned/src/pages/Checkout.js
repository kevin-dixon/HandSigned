import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { getAssetUrl } from '../utils/assets';

export default function Checkout() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { listings, getSellerById, makePurchase } = useContext(DataContext);
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [step, setStep] = useState(1); // 1: billing, 2: payment, 3: review
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: 'Demo',
    lastName: 'User',
    email: currentUser?.email || 'demo@example.com',
    address: '123 Demo Street',
    city: 'Demo City',
    state: 'CA',
    zipCode: '12345',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '4532 1234 5678 9012',
    expiryDate: '12/28',
    cvv: '123',
    cardholderName: 'Demo User'
  });

  if (!currentUser) {
    return (
      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to complete your purchase.</p>
          <button
            onClick={() => navigate('/login')}
            className="rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white hover:bg-purple-700 transition"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items to Checkout</h1>
          <p className="text-gray-600 mb-8">Your cart is empty. Add some items to proceed with checkout.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white hover:bg-purple-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  const cartWithListings = cartItems.map(cartItem => ({
    ...cartItem,
    listing: listings.find(l => l.id === cartItem.listingId)
  })).filter(item => item.listing);

  const total = getCartTotal(listings);

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Create purchase records for each item
      cartWithListings.forEach(({ listing, quantity }) => {
        for (let i = 0; i < quantity; i++) {
          makePurchase(listing.id, currentUser.id);
        }
      });
      
      // Clear cart
      clearCart();
      
      // Navigate to success page
      navigate('/my-collection?purchase=success');
    }, 2000);
  };

  const StepIndicator = ({ currentStep }) => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNum) => (
        <React.Fragment key={stepNum}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            stepNum <= currentStep 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {stepNum}
          </div>
          {stepNum < 3 && (
            <div className={`w-12 h-1 mx-2 ${
              stepNum < currentStep ? 'bg-purple-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Secure Checkout</h1>
      
      <StepIndicator currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={handleBillingSubmit} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={billingInfo.firstName}
                      onChange={(e) => setBillingInfo(prev => ({...prev, firstName: e.target.value}))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={billingInfo.lastName}
                      onChange={(e) => setBillingInfo(prev => ({...prev, lastName: e.target.value}))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => setBillingInfo(prev => ({...prev, email: e.target.value}))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={billingInfo.address}
                      onChange={(e) => setBillingInfo(prev => ({...prev, address: e.target.value}))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={billingInfo.city}
                      onChange={(e) => setBillingInfo(prev => ({...prev, city: e.target.value}))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={billingInfo.zipCode}
                      onChange={(e) => setBillingInfo(prev => ({...prev, zipCode: e.target.value}))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-purple-600 px-4 py-3 text-base font-semibold text-white hover:bg-purple-700 transition"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo(prev => ({...prev, cardNumber: e.target.value}))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo(prev => ({...prev, expiryDate: e.target.value}))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo(prev => ({...prev, cvv: e.target.value}))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => setPaymentInfo(prev => ({...prev, cardholderName: e.target.value}))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🔒 This is a demo site. No real payment will be processed.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-purple-600 px-4 py-3 text-base font-semibold text-white hover:bg-purple-700 transition"
                >
                  Review Order
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleCompleteOrder} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Review</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Billing Address</h3>
                    <p className="text-sm text-gray-600">
                      {billingInfo.firstName} {billingInfo.lastName}<br />
                      {billingInfo.address}<br />
                      {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>
                    <p className="text-sm text-gray-600">
                      Card ending in {paymentInfo.cardNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition"
                  disabled={isProcessing}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-base font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    'Complete Order'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cartWithListings.map(({ listing, quantity }) => {
                const seller = getSellerById(listing.sellerId);
                return (
                  <div key={listing.id} className="flex gap-3">
                    <img
                      src={getAssetUrl(listing.thumbnailUrl || listing.imageUrl)}
                      alt={listing.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {listing.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        By {seller?.username || 'Unknown'}
                      </p>
                      <p className="text-sm font-medium">
                        {quantity} × ${listing.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-purple-700">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}