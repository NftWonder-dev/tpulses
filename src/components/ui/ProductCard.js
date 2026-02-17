"use client";

import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function ProductCard({ product }) {
  const {
    name,
    slug,
    price,
    percentage,
    productCode,
    collection,
    previewImages,
  } = product;

  const { addToCart, cart } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const confirmAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const cancelAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  const closeSuccess = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSuccess(false);
  };

  return (
    <>
      <Link href={`/products/${slug.current}`}>
        <div className="product-item rounded-xl border border-white/5 cursor-pointer group overflow-hidden flex h-full">
          {/* Left side - Content */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-space-grotesk text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">
                    {name}
                  </h4>
                  {productCode && (
                    <span className="font-space-mono text-[9px] text-slate-500 uppercase">
                      {productCode}
                    </span>
                  )}
                </div>
                {percentage && (
                  <span className="font-space-mono text-xs text-cyan-400 ml-2">
                    {percentage}
                  </span>
                )}
              </div>

              {collection && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-white/5 rounded text-[9px] font-space-mono text-slate-400 uppercase">
                    {collection.emoji} {collection.name}
                  </span>
                </div>
              )}
            </div>

            {/* Price and Button */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
              <span className="font-space-mono text-xl font-bold text-white">
                ${price}
              </span>
              <button 
                onClick={handleAddToCart}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Right side - Full Height Image */}
          {previewImages?.[0] && (
            <div className="w-40 flex-shrink-0 self-stretch">
              <img
                src={urlFor(previewImages[0]).width(300).url()}
                alt={name}
                className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-500"
              />
            </div>
          )}
        </div>
      </Link>

      {/* Confirmation Modal (Item Already Exists) */}
      {showConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={cancelAdd}
        >
          <div 
            className="bg-deep-bg border border-white/10 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-space-grotesk text-xl font-bold mb-3">
              Item Already in Cart
            </h3>
            <p className="text-slate-400 mb-6">
              <span className="text-white font-bold">{name}</span> is already in your cart. 
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeSuccess}
        >
          <div 
            className="bg-deep-bg border border-white/10 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
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
                <span className="text-white font-bold">{name}</span> has been added to your cart.
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
