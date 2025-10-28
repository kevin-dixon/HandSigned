import React, { createContext, useMemo, useState, useCallback, useEffect } from 'react';
import * as storage from '../services/storageService';

export const DataContext = createContext({});

export function DataProvider({ children }) {
  // Trigger re-render when localStorage changes
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Initialize storage with seed data on first load
    storage.initializeStorage();
    // Ensure consumers see seeded data on first render
    setRefreshKey(k => k + 1);
  }, []);

  const addListing = useCallback((listing) => {
    storage.createListing(listing);
    setRefreshKey(k => k + 1);
  }, []);

  const updateListing = useCallback((id, updates) => {
    storage.updateListing(id, updates);
    setRefreshKey(k => k + 1);
  }, []);

  const deleteListing = useCallback((id) => {
    storage.deleteListing(id);
    setRefreshKey(k => k + 1);
  }, []);

  const makePurchase = useCallback((listingId, buyerId) => {
    storage.createPurchase({ listingId, buyerId });
    setRefreshKey(k => k + 1);
  }, []);

  const refreshData = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  const value = useMemo(() => {
    const users = storage.getUsers();
    const listings = storage.getListings();
    const reviews = storage.getReviews();
    const usersById = Object.fromEntries(users.map(u => [u.id, u]));

    const getSellerById = (id) => usersById[id];
    const getReviewsForListing = (listingId) => storage.getReviewsForListing(listingId);

    return { 
      users, 
      listings, 
      reviews, 
      getSellerById, 
      getReviewsForListing, 
      addListing,
      updateListing,
      deleteListing,
      makePurchase,
      refreshData
    };
  }, [refreshKey, addListing, updateListing, deleteListing, makePurchase, refreshData]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
