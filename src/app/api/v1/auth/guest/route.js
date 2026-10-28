import { NextResponse } from "next/server";
import {
  createGuestSession,
  GUEST_SESSION_DURATION_MS,
  getSessionCookieOptions,
  SESSION_COOKIE,
} from "../../../../../features/auth/server/session";

export const runtime = "nodejs";

export async function POST() {
  const created = createGuestSession();
  if (!created) {
    return NextResponse.json(
      {
        error: {
          code: "AUTH_SESSION_NOT_CONFIGURED",
          message: "The session secret is not configured.",
        },
      },
      { status: 503 },
    );
  }
  const response = NextResponse.json(
    { data: { type: "guest", expiresAt: new Date(created.session.exp).toISOString() } },
    { status: 201 },
  );
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(
    SESSION_COOKIE,
    created.token,
    getSessionCookieOptions(GUEST_SESSION_DURATION_MS),
  );
  return response;
}
