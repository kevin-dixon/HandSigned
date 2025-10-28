import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as storage from '../services/storageService';

export const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from localStorage on initialization
    const savedCart = storage.getCartItems();
    setCartItems(savedCart);
  }, []);

  const addToCart = useCallback((listingId, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.listingId === listingId);
      let updatedItems;
      
      if (existingItem) {
        // Update quantity if item already exists
        updatedItems = prevItems.map(item =>
          item.listingId === listingId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        const newItem = {
          id: `cart-${Date.now()}`,
          listingId,
          quantity,
          dateAdded: new Date().toISOString()
        };
        updatedItems = [...prevItems, newItem];
      }
      
      // Save to localStorage
      storage.saveCartItems(updatedItems);
      return updatedItems;
    });
  }, []);

  const removeFromCart = useCallback((listingId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.listingId !== listingId);
      storage.saveCartItems(updatedItems);
      return updatedItems;
    });
  }, []);

  const updateQuantity = useCallback((listingId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(listingId);
      return;
    }
    
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.listingId === listingId
          ? { ...item, quantity }
          : item
      );
      storage.saveCartItems(updatedItems);
      return updatedItems;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    storage.clearCart();
  }, []);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getCartTotal = useCallback((listings) => {
    return cartItems.reduce((total, item) => {
      const listing = listings.find(l => l.id === item.listingId);
      return total + (listing ? listing.price * item.quantity : 0);
    }, 0);
  }, [cartItems]);

  const isInCart = useCallback((listingId) => {
    return cartItems.some(item => item.listingId === listingId);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};