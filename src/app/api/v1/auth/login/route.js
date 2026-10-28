import { beginSignIn } from "../../../../../features/auth/server/oidc";

export const runtime = "nodejs";

export async function GET(request) {
  return beginSignIn(request);
}
