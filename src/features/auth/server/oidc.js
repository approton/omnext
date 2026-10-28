import {
  createHash,
  createPublicKey,
  randomBytes,
  randomUUID,
  timingSafeEqual,
  verify,
} from "node:crypto";
import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  SESSION_COOKIE,
  signSession,
  USER_SESSION_DURATION_MS,
} from "./session";

const STATE_COOKIE = "omnext_oidc_state";
const NONCE_COOKIE = "omnext_oidc_nonce";
const VERIFIER_COOKIE = "omnext_oidc_verifier";
const RETURN_COOKIE = "omnext_oidc_return";
const FLOW_DURATION_MS = 10 * 60 * 1000;
const discoveryCache = new Map();

function getOidcSettings() {
  const clientId = process.env.ENTRA_CLIENT_ID;
  const clientSecret = process.env.ENTRA_CLIENT_SECRET;
  const redirectUri = process.env.ENTRA_REDIRECT_URI;
  const metadataUrl = process.env.ENTRA_OIDC_METADATA_URL;
  const sessionSecret = process.env.AUTH_SESSION_SECRET;
  if (!clientId || !clientSecret || !redirectUri || !metadataUrl) return null;
  if (!sessionSecret || sessionSecret.length < 32 || sessionSecret.startsWith("example-only-"))
    return null;
  if (!/^[0-9a-f-]{36}$/i.test(clientId) || clientSecret.startsWith("example-only-")) return null;
  try {
    const parsedMetadataUrl = new URL(metadataUrl);
    if (
      parsedMetadataUrl.protocol !== "https:" ||
      !parsedMetadataUrl.hostname.endsWith(".ciamlogin.com")
    )
      return null;
  } catch {
    return null;
  }
  return { clientId, clientSecret, redirectUri, metadataUrl };
}

function randomToken() {
  return randomBytes(32).toString("base64url");
}

function safeReturnPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const url = new URL(value, "https://omnext.invalid");
    return url.origin === "https://omnext.invalid"
      ? `${url.pathname}${url.search}${url.hash}`
      : "/";
  } catch {
    return "/";
  }
}

function setFlowCookie(response, name, value, maxAge = FLOW_DURATION_MS) {
  response.cookies.set(name, value, getSessionCookieOptions(maxAge));
}

function clearFlowCookies(response) {
  for (const name of [STATE_COOKIE, NONCE_COOKIE, VERIFIER_COOKIE, RETURN_COOKIE]) {
    response.cookies.set(name, "", getSessionCookieOptions(0));
  }
}

function redirectToLogin(error) {
  const webUrl = process.env.APP_ORIGIN || process.env.WEB_APP_URL || "http://localhost:3000";
  const destination = new URL("/login", webUrl);
  if (error) destination.searchParams.set("authError", error);
  return NextResponse.redirect(destination, 303);
}

async function getMetadata(url) {
  const cached = discoveryCache.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("OIDC discovery request failed.");
  const metadata = await response.json();
  if (
    !metadata.authorization_endpoint ||
    !metadata.token_endpoint ||
    !metadata.issuer ||
    !metadata.jwks_uri
  ) {
    throw new Error("OIDC discovery document is incomplete.");
  }
  discoveryCache.set(url, { value: metadata, expiresAt: Date.now() + 60 * 60 * 1000 });
  return metadata;
}

async function verifyIdToken(idToken, metadata, settings, expectedNonce) {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("The identity token is invalid.");
  const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
  const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  if (header.alg !== "RS256" || !header.kid)
    throw new Error("Unsupported token signing algorithm.");

  const keysResponse = await fetch(metadata.jwks_uri, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!keysResponse.ok) throw new Error("Could not load identity signing keys.");
  const { keys = [] } = await keysResponse.json();
  const jwk = keys.find((key) => key.kid === header.kid && key.kty === "RSA");
  if (!jwk) throw new Error("Identity token signing key was not found.");
  const signatureIsValid = verify(
    "RSA-SHA256",
    Buffer.from(`${parts[0]}.${parts[1]}`),
    createPublicKey({ key: jwk, format: "jwk" }),
    Buffer.from(parts[2], "base64url"),
  );
  if (!signatureIsValid) throw new Error("Identity token signature is invalid.");

  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (claims.iss !== metadata.issuer || !audiences.includes(settings.clientId)) {
    throw new Error("Identity token issuer or audience is invalid.");
  }
  if (!claims.exp || claims.exp <= now || (claims.nbf && claims.nbf > now + 60)) {
    throw new Error("Identity token is expired or not active.");
  }
  if (claims.nonce !== expectedNonce) throw new Error("Identity token nonce is invalid.");
  if (audiences.length > 1 && claims.azp !== settings.clientId) {
    throw new Error("Identity token authorized party is invalid.");
  }
  return claims;
}

export async function beginSignIn(request) {
  const settings = getOidcSettings();
  if (!settings) {
    return NextResponse.json(
      {
        error: {
          code: "IDENTITY_PROVIDER_NOT_CONFIGURED",
          message: "Registered sign-in is not configured yet.",
        },
      },
      { status: 503 },
    );
  }
  try {
    const metadata = await getMetadata(settings.metadataUrl);
    const state = randomToken();
    const nonce = randomToken();
    const verifier = randomToken();
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    const authorizationUrl = new URL(metadata.authorization_endpoint);
    authorizationUrl.search = new URLSearchParams({
      client_id: settings.clientId,
      response_type: "code",
      response_mode: "query",
      redirect_uri: settings.redirectUri,
      scope: "openid profile email",
      state,
      nonce,
      code_challenge: challenge,
      code_challenge_method: "S256",
    }).toString();

    const response = NextResponse.redirect(authorizationUrl, 302);
    response.headers.set("Cache-Control", "no-store");
    setFlowCookie(response, STATE_COOKIE, state);
    setFlowCookie(response, NONCE_COOKIE, nonce);
    setFlowCookie(response, VERIFIER_COOKIE, verifier);
    setFlowCookie(
      response,
      RETURN_COOKIE,
      safeReturnPath(request.nextUrl.searchParams.get("next")),
    );
    return response;
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "IDENTITY_PROVIDER_UNAVAILABLE",
          message: "Could not start sign-in. Please try again.",
        },
      },
      { status: 503 },
    );
  }
}

export async function completeSignIn(request) {
  const settings = getOidcSettings();
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;
  const expectedNonce = request.cookies.get(NONCE_COOKIE)?.value;
  const verifier = request.cookies.get(VERIFIER_COOKIE)?.value;
  if (!settings || !state || !expectedState || !expectedNonce || !verifier) {
    const response = redirectToLogin("signin_failed");
    clearFlowCookies(response);
    return response;
  }
  const stateMatches =
    Buffer.byteLength(state) === Buffer.byteLength(expectedState) &&
    timingSafeEqual(Buffer.from(state), Buffer.from(expectedState));
  if (!stateMatches || request.nextUrl.searchParams.has("error") || !code) {
    const response = redirectToLogin("signin_cancelled");
    clearFlowCookies(response);
    return response;
  }

  try {
    const metadata = await getMetadata(settings.metadataUrl);
    const tokenResponse = await fetch(metadata.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        client_id: settings.clientId,
        client_secret: settings.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: settings.redirectUri,
        scope: "openid profile email",
        code_verifier: verifier,
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    const tokenSet = await tokenResponse.json();
    if (!tokenResponse.ok || typeof tokenSet.id_token !== "string")
      throw new Error("Token exchange failed.");
    const claims = await verifyIdToken(tokenSet.id_token, metadata, settings, expectedNonce);
    if (!claims.sub) throw new Error("Identity token has no subject.");
    const user = {
      sid: randomUUID(),
      sub: `entra:${claims.iss}:${claims.sub}`,
      type: "user",
      name:
        claims.name ||
        claims.given_name ||
        claims.email ||
        claims.preferred_username ||
        "Omnext member",
      email: claims.email || claims.preferred_username || null,
      iat: Date.now(),
      exp: Date.now() + USER_SESSION_DURATION_MS,
    };
    const sessionToken = signSession(user);
    if (!sessionToken) throw new Error("Session signing is not configured.");
    const returnPath = safeReturnPath(request.cookies.get(RETURN_COOKIE)?.value);
    const appUrl = process.env.APP_ORIGIN || process.env.WEB_APP_URL || request.nextUrl.origin;
    const response = NextResponse.redirect(new URL(returnPath, appUrl), 303);
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(
      SESSION_COOKIE,
      sessionToken,
      getSessionCookieOptions(USER_SESSION_DURATION_MS),
    );
    clearFlowCookies(response);
    return response;
  } catch {
    const response = redirectToLogin("signin_failed");
    clearFlowCookies(response);
    return response;
  }
}

export function getSignInConfiguration() {
  return Boolean(getOidcSettings());
}
