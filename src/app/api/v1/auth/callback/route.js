import { completeSignIn } from "../../../../../features/auth/server/oidc";

export const runtime = "nodejs";

export async function GET(request) {
  return completeSignIn(request);
}
