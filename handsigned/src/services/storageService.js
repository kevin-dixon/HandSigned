import initialData from '../data/mockDatabase.json';

const STORAGE_KEYS = {
  USERS: 'hs_users',
  LISTINGS: 'hs_listings',
  REVIEWS: 'hs_reviews',
  PURCHASES: 'hs_purchases',
  CART: 'hs_cart',
  INITIALIZED: 'hs_initialized'
};

// Initialize localStorage with seed data on first load
export function initializeStorage() {
  // TEMP: Force refresh data for new mock database - remove this after first load
  const forceRefresh = false; // Set to false after testing
  
  if (forceRefresh) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialData.users));
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(initialData.listings));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialData.reviews));
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    return;
  }

  // 1) Migrate users to include password if missing (non-destructive)
  const existingUsersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
  if (existingUsersRaw) {
    try {
      const users = JSON.parse(existingUsersRaw);
      const needsMigration = Array.isArray(users) && users.some(u => !u.password);
      if (needsMigration) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialData.users));
      }
    } catch {
      // If corrupted, re-seed users
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialData.users));
    }
  }

  // 2) Seed on first load
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialData.users));
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(initialData.listings));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialData.reviews));
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    return;
  }

  // 3) Ensure presence for demo: if arrays are empty or missing, re-seed (non-destructive)
  const ensureArray = (key, seed) => {
    try {
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr) || arr.length === 0) {
        localStorage.setItem(key, JSON.stringify(seed));
      }
    } catch {
      localStorage.setItem(key, JSON.stringify(seed));
    }
  };

  ensureArray(STORAGE_KEYS.USERS, initialData.users);
  ensureArray(STORAGE_KEYS.LISTINGS, initialData.listings);
  ensureArray(STORAGE_KEYS.REVIEWS, initialData.reviews);
  if (!localStorage.getItem(STORAGE_KEYS.PURCHASES)) {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify([]));
  }
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

// Cart Management
export function getCartItems() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
}

export function saveCartItems(cartItems) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.CART);
}

// Force refresh data from mockDatabase.json
export function forceRefreshData() {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.LISTINGS);
  localStorage.removeItem(STORAGE_KEYS.REVIEWS);
  localStorage.removeItem(STORAGE_KEYS.PURCHASES);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  initializeStorage();
}
