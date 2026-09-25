// lib/adminAuth.js - Admin session tokens shared by middleware, layout and login.
// Uses Web Crypto so it runs in both the Edge middleware and Node routes.
//
// The cookie holds "<expiry>.<signature>", where the signature is an
// HMAC-SHA256 of the expiry keyed with ADMIN_PASSWORD. It never contains
// the password itself, and changing ADMIN_PASSWORD logs out every session.

export const ADMIN_COOKIE = "tp_admin_auth";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8; // 8 hours

const encoder = new TextEncoder();

async function sign(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// No fallback: without ADMIN_PASSWORD the admin area stays locked.
function adminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length > 0 ? password : null;
}

export function checkAdminPassword(candidate) {
  const password = adminPassword();
  if (!password || typeof candidate !== "string") return false;
  return safeEqual(candidate, password);
}

export async function createAdminToken() {
  const password = adminPassword();
  if (!password) throw new Error("ADMIN_PASSWORD is not configured");
  const expires = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS);
  return `${expires}.${await sign(`tp-admin:${expires}`, password)}`;
}

export async function verifyAdminToken(token) {
  const password = adminPassword();
  if (!password || typeof token !== "string") return false;

  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;

  const expected = await sign(`tp-admin:${expires}`, password);
  return safeEqual(signature, expected);
}
