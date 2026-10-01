"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function AccountLoginForm({ linkExpired = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="max-w-xl border border-cyan-500/30 bg-cyan-500/5 rounded-2xl p-8">
        <CheckCircle2 className="w-8 h-8 text-cyan-400 mb-4" />
        <h2 className="font-space-grotesk text-2xl font-bold mb-3">
          Check your inbox
        </h2>
        <p className="text-slate-400 leading-relaxed mb-6">
          If <span className="text-white">{email}</span> has a Trim Pulses
          account, a login link is on its way. The link is valid for 15
          minutes.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setEmail("");
          }}
          className="font-space-mono text-xs uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h2 className="font-space-grotesk text-3xl font-bold mb-2">
        Log in to your account
      </h2>
      <p className="text-slate-400 mb-8">
        Enter the email address you used when purchasing.
      </p>

      {(linkExpired || status === "error") && (
        <div className="flex items-start gap-3 border border-magenta-500/30 bg-magenta-500/5 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-magenta-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            {status === "error"
              ? "Something went wrong sending your login link. Please try again."
              : "That login link has expired or is invalid. Enter your email to get a new one."}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail address"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-full font-bold uppercase text-sm transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending..." : "Send login link"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
