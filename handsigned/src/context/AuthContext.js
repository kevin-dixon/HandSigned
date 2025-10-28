import React, { createContext, useEffect, useMemo, useState } from 'react';
import * as storage from '../services/storageService';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('hs_current_user_id'));
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Ensure storage is initialized
    storage.initializeStorage();
  }, []);

  const currentUser = useMemo(() => {
    return storage.getUserById(currentUserId) || null;
  }, [currentUserId, refreshKey]);

  useEffect(() => {
    if (currentUserId) localStorage.setItem('hs_current_user_id', currentUserId);
    else localStorage.removeItem('hs_current_user_id');
  }, [currentUserId]);

  const login = (userId) => setCurrentUserId(userId);
  const logout = () => setCurrentUserId(null);
  
  const updateCurrentUser = (updates) => {
    if (!currentUserId) return;
    storage.updateUser(currentUserId, updates);
  // Trigger re-render by updating refresh key
  setRefreshKey(k => k + 1);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
