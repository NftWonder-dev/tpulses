"use client";

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ product }) {
  const { addToCart, cart } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      // Show confirmation modal
      setShowConfirm(true);
    } else {
      // Add directly and show success
      addToCart(product);
      setShowSuccess(true);
    }
  };

  const confirmAdd = () => {
    addToCart(product);
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const cancelAdd = () => {
    setShowConfirm(false);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <button 
        onClick={handleAddToCart}
        className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded font-bold uppercase tracking-widest transition-all"
      >
        Add to Cart
      </button>

      {/* Confirmation Modal (Item Already Exists) */}
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

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-deep-bg border border-white/10 rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-xl font-bold mb-2">
                Item Added to Cart
              </h3>
              <p className="text-slate-400">
                <span className="text-white font-bold">{product.name}</span> has been added to your cart.
              </p>
            </div>
            <button
              onClick={closeSuccess}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded font-bold uppercase text-sm transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
