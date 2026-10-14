"use client";

import { useCart } from "@/context/CartContext";
import { urlFor } from "@/lib/sanity";
import ProductPath from "@/components/ProductPath";
import Link from "next/link";
import { Trash2, ArrowLeft, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const {
    cart,
    isCartLoaded,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paths, setPaths] = useState({});

  // Collection › Category › Sub-Pack, looked up by the server once per set of
  // products (older saved carts don't store it). While loading or on failure
  // the names are shown without a path.
  const cartIds = cart.map((item) => item._id).join(",");
  useEffect(() => {
    if (!cartIds) return;
    let cancelled = false;
    fetch("/api/cart-paths", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: cartIds.split(",") }),
    })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setPaths(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [cartIds]);

  const handleClearCart = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your entire cart? This action cannot be undone.",
      )
    ) {
      clearCart();
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      setIsCheckingOut(true);

      const response = await fetch("/api/cart-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Only IDs are sent. The server looks up prices itself.
          productIds: cart.map((item) => item._id),
          customerEmail: "", // Optional pre-fill
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Checkout failed");
      }

      const { checkoutUrl } = await response.json();

      // Redirect to LemonSqueezy checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert(`Failed to start checkout: ${error.message}`);
      setIsCheckingOut(false);
    }
  };

  // Wait for the saved cart so "empty" doesn't flash before items appear.
  if (!isCartLoaded) {
    return <div className="min-h-screen pt-32 pb-20" />;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-space-grotesk text-5xl font-bold mb-6">
            Your Cart
          </h1>
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

        <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold mb-12">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item._id} className="glass-card p-4 md:p-6 rounded-xl">
                <div className="flex gap-4 md:gap-6">
                  {/* Image */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={urlFor(item.image).width(200).height(200).url()}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-cyan-400" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {paths[item._id] && (
                        <ProductPath product={paths[item._id]} />
                      )}
                      <h3 className="font-space-grotesk text-lg md:text-xl font-bold">
                        {item.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                      {/* Price */}
                      <div className="text-slate-400 text-sm font-space-mono">
                        €{item.price?.toFixed(2)}
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
                  <span>Items ({cart.length})</span>
                  <span className="font-space-mono">
                    €{getCartTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm md:text-base">
                  <span>Tax</span>
                  <span className="font-space-mono text-xs md:text-sm">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-lg md:text-xl font-bold">
                  <span>Total</span>
                  <span className="font-space-mono text-cyan-400">
                    €{getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black py-4 rounded-lg font-bold uppercase tracking-widest transition-all mb-3 text-sm md:text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </button>

              <p className="text-slate-400 text-xs text-center mb-1">
                Secure payment by LemonSqueezy
              </p>

              <p className="text-slate-500 text-xs text-center mb-4">
                By checking out you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-2 hover:text-cyan-400 transition-colors"
                >
                  Terms &amp; Refunds
                </Link>
              </p>

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
