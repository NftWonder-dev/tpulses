"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

export default function PasswordProtection({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if already authenticated on mount
  useEffect(() => {
    // Skip password protection entirely for admin routes
    if (window.location.pathname.startsWith("/admin")) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }
    const auth = sessionStorage.getItem("siteAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check password (use environment variable in production)
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD || "Batman1";

    if (password === correctPassword) {
      sessionStorage.setItem("siteAuthenticated", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  // Show loading state briefly to check authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-bg flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-magenta-500 rounded-lg rotate-45"></div>
        </div>
      </div>
    );
  }

  // If authenticated, show the site
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show password modal with blurred background
  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred background preview */}
      <div className="absolute inset-0 blur-md opacity-50">{children}</div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Password Modal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-deep-bg border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-magenta-500 rounded-lg rotate-45 flex items-center justify-center">
              <Activity className="w-10 h-10 text-white -rotate-45" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-space-grotesk text-2xl font-bold text-center mb-2">
            Welcome to TRIM Pulses
          </h1>
          <p className="text-slate-400 text-center mb-8 text-sm">
            Enter password to access the site
          </p>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded-lg font-bold uppercase tracking-widest transition-all"
            >
              Access Site
            </button>
          </form>

          {/* Info */}
          <p className="text-slate-500 text-xs text-center mt-6">
            Your session will remain active until you close your browser
          </p>
        </div>
      </div>
    </div>
  );
}
