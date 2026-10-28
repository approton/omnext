const RETURN_PATH_ORIGIN = "https://omnext.invalid";

export function getSafeReturnPath(search, fallback = "/products") {
  const requestedPath = new URLSearchParams(search).get("next");
  if (!requestedPath) return fallback;

  try {
    const destination = new URL(requestedPath, RETURN_PATH_ORIGIN);
    if (destination.origin !== RETURN_PATH_ORIGIN) return fallback;
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallback;
  }
}
