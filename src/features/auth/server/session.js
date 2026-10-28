import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "omnext_session";
export const GUEST_SESSION_DURATION_MS = 2 * 60 * 1000;
export const USER_SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  return secret && secret.length >= 32 && !secret.startsWith("example-only-") ? secret : null;
}

export function signSession(session) {
  const secret = getSessionSecret();
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readSessionToken(token) {
  const secret = getSessionSecret();
  if (!secret || !token) return null;
  const [payload, encodedSignature, extra] = token.split(".");
  if (!payload || !encodedSignature || extra) return null;

  try {
    const expected = createHmac("sha256", secret).update(payload).digest();
    const actual = Buffer.from(encodedSignature, "base64url");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.sid || !session.sub || !session.exp || session.exp <= Date.now()) return null;
    if (!new Set(["guest", "user"]).has(session.type)) return null;
    return session;
  } catch {
    return null;
  }
}

export function createGuestSession() {
  const now = Date.now();
  const session = {
    sid: randomUUID(),
    sub: `guest:${randomUUID()}`,
    type: "guest",
    name: "Guest session",
    readOnly: true,
    iat: now,
    exp: now + GUEST_SESSION_DURATION_MS,
  };
  const token = signSession(session);
  return token ? { token, session } : null;
}

export function getSessionCookieOptions(maxAge) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(maxAge / 1000),
  };
  if (process.env.AUTH_COOKIE_DOMAIN) options.domain = process.env.AUTH_COOKIE_DOMAIN;
  return options;
}
