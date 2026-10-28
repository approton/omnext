import { NextResponse } from "next/server";
import { getSignInConfiguration } from "../../../../../features/auth/server/oidc";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { data: { registeredSignInConfigured: getSignInConfiguration() } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
