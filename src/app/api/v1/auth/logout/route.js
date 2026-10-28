import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  SESSION_COOKIE,
} from "../../../../../features/auth/server/session";

export const runtime = "nodejs";

export async function POST() {
  const response = new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
  response.cookies.set(SESSION_COOKIE, "", getSessionCookieOptions(0));
  return response;
}
