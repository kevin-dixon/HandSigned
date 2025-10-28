import initialData from '../data/mockDatabase.json';

const STORAGE_KEYS = {
  USERS: 'hs_users',
  LISTINGS: 'hs_listings',
  REVIEWS: 'hs_reviews',
  PURCHASES: 'hs_purchases',
  INITIALIZED: 'hs_initialized'
};

// Initialize localStorage with seed data on first load
export function initializeStorage() {
  const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  
  // Check if users need password field added (migration)
  if (existingUsers) {
    const users = JSON.parse(existingUsers);
    const needsMigration = users.some(u => !u.password);
    
    if (needsMigration) {
      // Re-initialize with new data that includes passwords
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialData.users));
    }
  }
  
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) return;
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialData.users));
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(initialData.listings));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialData.reviews));
  localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

// Users
export function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

export function getUserById(id) {
  return getUsers().find(u => u.id === id);
}

export function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return users[index];
}

export function createUser(user) {
  const users = getUsers();
  const newUser = { id: `u-${Date.now()}`, ...user };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
}

// Listings
export function getListings() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
}

export function getListingById(id) {
  return getListings().find(l => l.id === id);
}

export function createListing(listing) {
  const listings = getListings();
  const newListing = { id: `l-${Date.now()}`, datePosted: new Date().toISOString().split('T')[0], ...listing };
  listings.push(newListing);
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  return newListing;
}

export function updateListing(id, updates) {
  const listings = getListings();
  const index = listings.findIndex(l => l.id === id);
  if (index === -1) return null;
  listings[index] = { ...listings[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  return listings[index];
}

export function deleteListing(id) {
  const listings = getListings().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
}

export function getListingsBySeller(sellerId) {
  return getListings().filter(l => l.sellerId === sellerId);
}

// Reviews
export function getReviews() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
}

export function getReviewsForListing(listingId) {
  return getReviews().filter(r => r.listingId === listingId);
}

export function createReview(review) {
  const reviews = getReviews();
  const newReview = { id: `r-${Date.now()}`, datePosted: new Date().toISOString().split('T')[0], ...review };
  reviews.push(newReview);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return newReview;
}

// Purchases
export function getPurchases() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PURCHASES) || '[]');
}

export function getPurchasesByUser(userId) {
  return getPurchases().filter(p => p.buyerId === userId);
}

export function createPurchase(purchase) {
  const purchases = getPurchases();
  const newPurchase = { 
    id: `p-${Date.now()}`, 
    datePurchased: new Date().toISOString().split('T')[0], 
    ...purchase 
  };
  purchases.push(newPurchase);
  localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  return newPurchase;
}

export function getSalesForSeller(sellerId) {
  const purchases = getPurchases();
  const listings = getListings();
  return purchases.filter(p => {
    const listing = listings.find(l => l.id === p.listingId);
    return listing && listing.sellerId === sellerId;
  });
}

export function getRevenueForSeller(sellerId) {
  const sales = getSalesForSeller(sellerId);
  const listings = getListings();
  return sales.reduce((total, sale) => {
    const listing = listings.find(l => l.id === sale.listingId);
    return total + (listing?.price || 0);
  }, 0);
}
