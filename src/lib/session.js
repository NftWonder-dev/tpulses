// Signed tokens for customer login — no database or extra packages needed.
// A token is: base64url(JSON payload) + "." + HMAC signature.
// Anyone can read a token, but nobody can change it or forge one without
// ACCOUNT_SESSION_SECRET, which only lives on the server.
import crypto from "crypto";

const SECRET = process.env.ACCOUNT_SESSION_SECRET;

export const SESSION_COOKIE = "tp_session";
export const LOGIN_LINK_MINUTES = 15;
export const SESSION_DAYS = 30;

function sign(data) {
  if (!SECRET) throw new Error("ACCOUNT_SESSION_SECRET is not set");
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function createToken(payload, lifetimeSeconds) {
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Date.now() + lifetimeSeconds * 1000 }),
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

// Returns the payload if the token is genuine, unexpired and for the right purpose.
// Returns null otherwise.
export function readToken(token, purpose) {
  if (!token || typeof token !== "string") return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.purpose !== purpose) return null;
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Reads the logged-in customer's email from the cookie store (server only).
export function getSessionEmail(cookieStore) {
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return readToken(token, "session")?.email || null;
}
