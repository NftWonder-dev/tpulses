// app/test-email/page.js - Test page with multiple products option
"use client";

import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [multiProduct, setMultiProduct] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSendTest = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);

    try {
      // Single product test data
      const singleProductData = {
        customerEmail: email,
        customerName: name || 'Test Customer',
        products: [
          {
            name: '50.00 % LIN',
            fileKey: 'products/test-product-1/test-product-1.zip'
          }
        ],
        orderTotal: '10.00'
      };

      // Multiple products test data
      const multiProductData = {
        customerEmail: email,
        customerName: name || 'Test Customer',
        products: [
          {
            name: '50.00 % LIN',
            fileKey: 'products/test-product-1/test-product-1.zip'
          },
          {
            name: '29.95 % HS033',
            fileKey: 'products/test-product-1/test-product-1.zip'
          },
          {
            name: '40.40 % SC044',
            fileKey: 'products/test-product-1/test-product-1.zip'
          }
        ],
        orderTotal: '30.00'
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(multiProduct ? multiProductData : singleProductData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: 'Email sent successfully! Check your inbox.' });
      } else {
        setResult({ success: false, message: data.error || 'Failed to send email' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Error sending email' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-space-grotesk text-5xl font-bold mb-8">
          Test Email System
        </h1>
        
        <div className="glass-card p-8 rounded-xl">
          <p className="text-slate-400 mb-6">
            Send a test purchase confirmation email with download links.
          </p>

          <form onSubmit={handleSendTest} className="space-y-4">
            <div>
              <label className="block text-sm font-space-mono text-slate-400 mb-2">
                Your Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-space-mono text-slate-400 mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
              <input
                type="checkbox"
                id="multiProduct"
                checked={multiProduct}
                onChange={(e) => setMultiProduct(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="multiProduct" className="text-sm text-slate-400">
                Test with multiple products (3 items)
              </label>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-lg font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send Test Email'}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {result.message}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="font-space-grotesk font-bold mb-2">Test Details:</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              {multiProduct ? (
                <>
                  <li>• 3 products with individual download buttons</li>
                  <li>• Total: $30.00</li>
                </>
              ) : (
                <>
                  <li>• Single product: 50.00 % LIN</li>
                  <li>• Price: $10.00</li>
                </>
              )}
              <li>• Download links valid for 24 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
