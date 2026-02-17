"use client";

import Link from "next/link";
import { ShoppingCart, Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navigation() {
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-deep-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-6 h-6 bg-gradient-to-tr from-cyan-500 to-magenta-500 rounded-sm rotate-45 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white -rotate-45" />
          </div>
          <span className="font-space-grotesk font-bold text-xl tracking-tighter uppercase">
            TRIM Pulses
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 font-space-mono text-xs uppercase tracking-widest text-slate-400">
          <Link
            href="/theory"
            className="hover:text-cyan-400 transition-colors"
          >
            Theory
          </Link>
          <Link
            href="/collections"
            className="hover:text-cyan-400 transition-colors"
          >
            Collections
          </Link>
          <Link href="/faq" className="hover:text-cyan-400 transition-colors">
            FAQ
          </Link>
          <a
            href="#technical"
            className="hover:text-cyan-400 transition-colors"
          >
            Specifications
          </a>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/cart" className="relative group">
            <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-magenta-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
          </Link>
          <button className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-tighter hover:bg-cyan-400 transition-all duration-300">
            Get Free Pack
          </button>
        </div>

        {/* Mobile Menu Button & Cart */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" className="relative group">
            <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-magenta-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-deep-bg">
          <div className="px-6 py-4 space-y-4">
            <Link
              href="/theory"
              className="block font-space-mono text-sm uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Theory
            </Link>
            <Link
              href="/collections"
              className="block font-space-mono text-sm uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/faq"
              className="block font-space-mono text-sm uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <a
              href="#technical"
              className="block font-space-mono text-sm uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Specifications
            </a>
            <button className="w-full bg-white text-black px-5 py-3 rounded-full text-sm font-bold uppercase tracking-tighter hover:bg-cyan-400 transition-all duration-300 mt-4">
              Get Free Pack
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
