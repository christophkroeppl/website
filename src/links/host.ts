export const LINKS_HOST = "links.kroeppl.ch"

const SHARED_PREFIXES = ["/_astro/", "/_image/", "/fonts/", "/favicon"]
const SHARED_PATHS = new Set(["/api/contact", "/api/contact/"])

export type LinksHostPolicy =
  | { kind: "rewrite"; target: string }
  | { kind: "pass"; noindex: boolean }
  | { kind: "block" }

export function isLinksHost(hostname: string): boolean {
  return hostname === LINKS_HOST
}

export function linksHostPolicy(hostname: string, pathname: string): LinksHostPolicy {
  if (!isLinksHost(hostname)) return { kind: "pass", noindex: false }

  if (pathname === "/" || pathname === "/en" || pathname === "/en/") {
    return { kind: "rewrite", target: pathname === "/" ? "/links/" : "/en/links/" }
  }

  if (isLinksPath(pathname)) return { kind: "pass", noindex: true }
  if (SHARED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return { kind: "pass", noindex: true }
  }
  if (SHARED_PATHS.has(pathname)) return { kind: "pass", noindex: true }
  if (pathname === "/robots.txt" || isAssetPath(pathname)) {
    return { kind: "pass", noindex: true }
  }

  return { kind: "block" }
}

export function notFound(): Response {
  return new Response("Not Found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  })
}

function isLinksPath(pathname: string): boolean {
  return (
    pathname === "/links" ||
    pathname.startsWith("/links/") ||
    pathname === "/en/links" ||
    pathname.startsWith("/en/links/")
  )
}

const ASSET_EXTENSIONS = new Set([
  "avif",
  "css",
  "gif",
  "ico",
  "jpeg",
  "jpg",
  "js",
  "json",
  "map",
  "mjs",
  "otf",
  "png",
  "svg",
  "ttf",
  "webp",
  "woff",
  "woff2",
])

function isAssetPath(pathname: string): boolean {
  const name = pathname.slice(pathname.lastIndexOf("/") + 1)
  const dot = name.lastIndexOf(".")
  if (dot === -1) return false
  return ASSET_EXTENSIONS.has(name.slice(dot + 1).toLowerCase())
}
