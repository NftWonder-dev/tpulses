"use client";

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function CheckoutButton({ product }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.lemonsqueezyVariantId, // You'll add this to Sanity
          customerEmail: '', // Optional - can be pre-filled if user is logged in
          productName: product.name,
          fileKey: product.fileUrl, // S3 file key
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect to LemonSqueezy checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black py-4 px-6 rounded-lg font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="w-5 h-5" />
      {isLoading ? 'Processing...' : 'Buy Now'}
    </button>
  );
}
