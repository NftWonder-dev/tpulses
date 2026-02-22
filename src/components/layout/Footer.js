import Link from "next/link";
import { Activity, Instagram, Youtube, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-footer-bg">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-cyan-500 rounded-sm rotate-45 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white -rotate-45" />
            </div>
            <span className="font-space-grotesk font-bold text-lg uppercase">
              TRIM Pulses
            </span>
          </div>
          <p className="text-slate-500 text-sm max-w-sm mb-8">
            Precision-engineered impulse responses for music producers. Bridging
            the gap between mathematical logic and organic acoustics.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 bg-white/5 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/5 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/5 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h5 className="font-space-mono text-[10px] text-white uppercase tracking-widest mb-6">
            Explore
          </h5>
          <ul className="text-slate-500 text-sm space-y-4">
            <li>
              <Link
                href="/collections"
                className="hover:text-cyan-400 transition-colors"
              >
                All Collections
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Featured Products
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-space-mono text-[10px] text-white uppercase tracking-widest mb-6">
            Support
          </h5>
          <ul className="text-slate-500 text-sm space-y-4">
            <li>
              <a href="faq" className="hover:text-cyan-400 transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a
                href="/specifications"
                className="hover:text-cyan-400 transition-colors"
              >
                IR Guide
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4">
        <span className="text-[10px] font-space-mono text-slate-600 uppercase">
          &copy; 2026 TRIM Pulses Sound Studies.
        </span>
      </div>
    </footer>
  );
}
