import { NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "../../../../../features/auth/server/session";

export const runtime = "nodejs";

export async function GET(request) {
  const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const headers = { "Cache-Control": "no-store" };
  if (!session) {
    return NextResponse.json(
      { error: { code: "AUTHENTICATION_REQUIRED", message: "No active session." } },
      { status: 401, headers },
    );
  }
  return NextResponse.json(
    {
      data: {
        session: {
          type: session.type,
          name: session.name,
          email: session.email || null,
          expiresAt: new Date(session.exp).toISOString(),
          readOnly: session.type === "guest" || session.readOnly === true,
        },
      },
    },
    { headers },
  );
}
