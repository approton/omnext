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

export function isPublicPage(pathname) {
  return PUBLIC_PATHS.has(pathname) || pathname.startsWith("/blog/");
}
