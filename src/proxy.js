import { NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "./features/auth/server/session";
const PUBLIC_PATHS = new Set([
  "/",
  "/about",
  "/blog",
  "/contact",
  "/search",
  "/website-development",
  "/software-development",
  "/login",
  "/signup",
]);
const PUBLIC_API_PATHS = new Set([
  "/api/v1/health",
  "/api/v1/auth/login",
  "/api/v1/auth/callback",
  "/api/v1/auth/guest",
  "/api/v1/auth/session",
  "/api/v1/auth/logout",
  "/api/v1/auth/configuration",
  "/api/v1/contact",
]);

export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  if (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/blog/") ||
    PUBLIC_API_PATHS.has(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = readSessionToken(token);
  if (session) {
    if (session.type === "guest" && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      return NextResponse.json(
        { error: { code: "GUEST_READ_ONLY", message: "Guest sessions are read-only." } },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    const response = NextResponse.json(
      { error: { code: "AUTHENTICATION_REQUIRED", message: "Sign in to continue." } },
      { status: 401 },
    );
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  const destination = new URL("/login", request.url);
  destination.searchParams.set("next", `${pathname}${search}`);
  const response = NextResponse.redirect(destination);
  if (token) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
