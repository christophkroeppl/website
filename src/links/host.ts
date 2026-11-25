export const LINKS_HOST = "links.kroeppl.ch"

const SHARED_PREFIXES = ["/_astro/", "/_image/", "/fonts/", "/favicon"]
const SHARED_PATHS = new Set(["/api/contact", "/api/contact/"])

export type LinksHostRoute = "rewrite" | "pass" | "block"

export function isLinksHost(hostname: string): boolean {
  return hostname === LINKS_HOST
}

export function linksHostRoute(hostname: string, pathname: string): LinksHostRoute {
  if (!isLinksHost(hostname)) return "pass"
  if (pathname === "/" || pathname === "/en" || pathname === "/en/") return "rewrite"
  if (isLinksPath(pathname)) return "pass"
  if (SHARED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return "pass"
  if (SHARED_PATHS.has(pathname)) return "pass"
  if (isAssetPath(pathname)) return "pass"
  return "block"
}

function isLinksPath(pathname: string): boolean {
  return (
    pathname === "/links" ||
    pathname.startsWith("/links/") ||
    pathname === "/en/links" ||
    pathname.startsWith("/en/links/")
  )
}

function isAssetPath(pathname: string): boolean {
  return pathname.slice(pathname.lastIndexOf("/") + 1).includes(".")
}
