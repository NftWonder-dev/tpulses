"use client";

import { useCart } from '@/context/CartContext';
import { urlFor } from '@/lib/sanity';
import Link from 'next/link';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart? This action cannot be undone.')) {
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-space-grotesk text-5xl font-bold mb-6">Your Cart</h1>
          <p className="text-slate-400 text-xl mb-8">Your cart is empty</p>
          <Link
            href="/collections"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-full font-bold uppercase text-sm transition-all"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-cyan-400 font-space-mono text-xs uppercase tracking-widest mb-12 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold mb-12">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div
                key={item._id}
                className="glass-card p-3 md:p-4 rounded-xl"
              >
                {/* Mobile Layout */}
                <div className="flex flex-col sm:hidden gap-3">
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    {item.previewImages?.[0] && (
                      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-900">
                        <img
                          src={urlFor(item.previewImages[0]).width(150).url()}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-space-grotesk text-sm font-bold truncate">
                        {item.name}
                      </h3>
                      {item.productCode && (
                        <p className="text-slate-500 text-[9px] font-space-mono">
                          {item.productCode}
                        </p>
                      )}
                      <div className="text-white font-bold font-space-mono text-sm mt-1">
                        ${item.price}
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity & Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="font-space-mono text-sm w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-slate-400 text-sm font-space-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex gap-4 items-center">
                  {/* Thumbnail */}
                  {item.previewImages?.[0] && (
                    <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-900">
                      <img
                        src={urlFor(item.previewImages[0]).width(150).url()}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-space-grotesk text-base font-bold truncate">
                      {item.name}
                    </h3>
                    {item.productCode && (
                      <p className="text-slate-500 text-[10px] font-space-mono">
                        {item.productCode}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-white font-bold font-space-mono text-sm">
                    ${item.price}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="font-space-mono text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div className="text-slate-400 text-sm font-space-mono w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleClearCart}
              className="text-slate-400 hover:text-red-400 text-sm font-space-mono transition-colors mt-4"
            >
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 md:p-8 rounded-xl lg:sticky lg:top-32">
              <h2 className="font-space-grotesk text-xl md:text-2xl font-bold mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-400 text-sm md:text-base">
                  <span>Subtotal</span>
                  <span className="font-space-mono">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm md:text-base">
                  <span>Tax</span>
                  <span className="font-space-mono text-xs md:text-sm">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-lg md:text-xl font-bold">
                  <span>Total</span>
                  <span className="font-space-mono">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded font-bold uppercase tracking-widest transition-all mb-3 text-sm md:text-base">
                Checkout
              </button>
              
              <Link
                href="/collections"
                className="block text-center text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
