"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

// The cart is saved in the visitor's browser so it survives leaving the site,
// for example going to the LemonSqueezy checkout and coming back.
const STORAGE_KEY = 'tp_cart_v1';

function readStoredCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter(
      (item) =>
        item &&
        typeof item._id === 'string' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    // Storage blocked (private mode) or corrupted: start with an empty cart.
    return [];
  }
}

function writeStoredCart(cart) {
  try {
    if (cart.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  } catch {
    // Storage full or blocked: the cart still works for this visit.
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load the saved cart after the first render, so the server-rendered
  // page and the browser agree.
  useEffect(() => {
    setCart(readStoredCart());
    setLoaded(true);

    // Keep other open tabs in sync.
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setCart(readStoredCart());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Save every change once the saved cart has been loaded.
  useEffect(() => {
    if (loaded) writeStoredCart(cart);
  }, [cart, loaded]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if product already exists
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        // Increase quantity
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    // Remove the saved copy immediately. The order success page clears the
    // cart before the saved cart loads, so it must not come back afterwards.
    writeStoredCart([]);
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartLoaded: loaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
