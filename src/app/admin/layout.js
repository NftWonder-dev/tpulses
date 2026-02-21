// app/admin/layout.js
// The admin section has its own separate auth layer,
// and deliberately opts OUT of the Navigation/Footer/PasswordProtection
// that wraps the public site.

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Very simple cookie-based admin auth.
// Set ADMIN_PASSWORD env var (defaults to "TrimAdmin2024" if not set).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "TrimAdmin2024";
const COOKIE_NAME = "tp_admin_auth";

export const metadata = {
  title: "Admin · Trim Pulses",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  // Check cookie server-side
  const cookieStore = cookies();
  const auth = cookieStore.get(COOKIE_NAME);

  // If not authenticated, render the login page inline
  if (!auth || auth.value !== ADMIN_PASSWORD) {
    return <AdminLogin />;
  }

  return <div className="min-h-screen bg-[#0a0a12] text-white">{children}</div>;
}

// ── Client-side login form ────────────────────────────────────────────────
// We can't use client components directly in a server layout,
// so we render a raw HTML form that POSTs to /api/admin/auth.

function AdminLogin() {
  return (
    <html lang="en">
      <head>
        <title>Admin Login · Trim Pulses</title>
        <meta name="robots" content="noindex" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Space Mono', monospace;
            background: #0a0a12;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .card {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 16px;
            padding: 40px;
            width: 360px;
          }
          .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 32px;
          }
          .logo-icon {
            width: 32px; height: 32px;
            border-radius: 8px;
            background: linear-gradient(135deg, #00f3ff, #ff00ff);
            display: flex; align-items: center; justify-content: center;
            font-size: 16px;
          }
          .logo-text { font-size: 14px; font-weight: 700; color: #fff; }
          .logo-sub { font-size: 11px; color: #666; }
          h1 { font-size: 20px; margin-bottom: 6px; }
          p { font-size: 13px; color: #64748b; margin-bottom: 28px; }
          label { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 6px; letter-spacing: 0.05em; }
          input[type=password] {
            width: 100%; padding: 10px 14px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            color: #fff;
            font-family: 'Space Mono', monospace;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
          }
          input[type=password]:focus { border-color: rgba(0,243,255,0.4); }
          button {
            margin-top: 16px;
            width: 100%;
            padding: 11px;
            background: rgba(0,243,255,0.1);
            border: 1px solid rgba(0,243,255,0.25);
            border-radius: 8px;
            color: #00f3ff;
            font-family: 'Space Mono', monospace;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s;
          }
          button:hover { background: rgba(0,243,255,0.18); }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <div>
              <div className="logo-text">TrimPulses</div>
              <div className="logo-sub">Admin Console</div>
            </div>
          </div>
          <h1>Admin Login</h1>
          <p>Enter your admin password to continue.</p>
          <form method="POST" action="/api/admin/auth">
            <label htmlFor="password">ADMIN PASSWORD</label>
            <input type="password" name="password" id="password" autoFocus />
            <input type="hidden" name="redirect" value="/admin" />
            <button type="submit">→ Access Dashboard</button>
          </form>
        </div>
      </body>
    </html>
  );
}
