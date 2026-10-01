"use client";

import { useState } from "react";
import { Download, LogOut, User } from "lucide-react";

function formatDate(iso) {
  return iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
}

function DownloadButton({ productId, name }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/account/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error();
      const { downloadUrl } = await response.json();
      window.location.href = downloadUrl;
    } catch {
      alert(`Couldn't prepare the download for ${name}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
    >
      <Download className="w-4 h-4" />
      {loading ? "Preparing..." : "Download"}
    </button>
  );
}

export default function AccountDashboard({ email, orders }) {
  const name = orders[0]?.customerName;

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      {/* Orders */}
      <div className="lg:col-span-2">
        <h2 className="font-space-grotesk text-3xl font-bold mb-8">
          Your purchases
        </h2>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-white/5 font-space-mono text-xs uppercase tracking-widest text-slate-500">
                <span>
                  Order #{order.orderNumber}
                  {order.testMode && (
                    <span className="ml-2 text-magenta-500">Test</span>
                  )}
                </span>
                <span>
                  {formatDate(order.purchasedAt)} · {order.total?.toFixed(2)}{" "}
                  {order.currency}
                </span>
              </div>

              <ul className="space-y-3">
                {(order.products || []).filter(Boolean).map((product) => (
                  <li
                    key={product._id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="font-space-grotesk text-lg font-bold">
                      {product.name}
                    </span>
                    <DownloadButton productId={product._id} name={product.name} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-slate-500 text-sm mt-6">
          Each download link is created when you click and stays valid for 24
          hours.
        </p>
      </div>

      {/* Personal info */}
      <aside>
        <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center mb-4">
            <User className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="font-space-grotesk text-xl font-bold mb-4">
            Your details
          </h2>
          {name && <p className="text-white mb-1">{name}</p>}
          <p className="text-slate-400 text-sm break-all mb-6">{email}</p>

          <form action="/api/account/logout" method="POST">
            <button
              type="submit"
              className="font-space-mono text-xs uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
