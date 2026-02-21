// app/order-success/page.js
"use client";

import Link from "next/link";
import { CheckCircle, Download, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function OrderSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful order
    clearCart();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-50"></div>
            <CheckCircle className="relative w-24 h-24 text-cyan-400" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold mb-6">
          Thank You for Your Order! 🎉
        </h1>

        <p className="text-slate-400 text-xl mb-8 leading-relaxed">
          Your payment has been processed successfully.
        </p>

        {/* Email Notice */}
        <div className="glass-card p-8 rounded-xl mb-8">
          <div className="flex items-start gap-4 text-left">
            <Download className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-space-grotesk text-xl font-bold mb-2">
                Check Your Email
              </h2>
              <p className="text-slate-400 leading-relaxed">
                We've sent your download links to your email address. The links
                are valid for <strong className="text-white">24 hours</strong>.
              </p>
              <p className="text-slate-400 text-sm mt-3">
                Don't see it? Check your spam folder or contact us for
                assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="glass-card p-6 rounded-xl mb-8 text-left">
          <h3 className="font-space-grotesk text-lg font-bold mb-4 text-center">
            What's Next?
          </h3>
          <ul className="space-y-3 text-slate-400">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1">1.</span>
              <span>Check your email for the download link</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1">2.</span>
              <span>Download your impulse response files</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1">3.</span>
              <span>Load them into your DAW's convolution reverb plugin</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1">4.</span>
              <span>Start creating amazing music! 🎵</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/collections"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black px-8 py-4 rounded-lg font-bold uppercase tracking-widest transition-all"
          >
            Browse More Collections
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 glass-card hover:border-cyan-400/50 px-8 py-4 rounded-lg font-bold uppercase tracking-widest transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-slate-400 text-sm">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@trimpulses.com"
              className="text-cyan-400 hover:text-cyan-300"
            >
              support@trimpulses.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
