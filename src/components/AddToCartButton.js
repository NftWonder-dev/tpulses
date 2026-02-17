"use client";

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ product }) {
  const { addToCart, cart } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAddToCart = () => {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      // Show confirmation modal
      setShowConfirm(true);
    } else {
      // Add directly
      addToCart(product);
    }
  };

  const confirmAdd = () => {
    addToCart(product);
    setShowConfirm(false);
  };

  const cancelAdd = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button 
        onClick={handleAddToCart}
        className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded font-bold uppercase tracking-widest transition-all"
      >
        Add to Cart
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-deep-bg border border-white/10 rounded-xl p-6 max-w-md w-full">
            <h3 className="font-space-grotesk text-xl font-bold mb-3">
              Item Already in Cart
            </h3>
            <p className="text-slate-400 mb-6">
              <span className="text-white font-bold">{product.name}</span> is already in your cart. 
              Do you want to increase the quantity?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelAdd}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded font-bold uppercase text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmAdd}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded font-bold uppercase text-sm transition-all"
              >
                Add Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
