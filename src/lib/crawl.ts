import { locales } from "../i18n/locales"
import { pagePaths, type PageId } from "../i18n/routes"
import { buildTime } from "./build-time"
import { canonicalFor } from "./canonical"
import { pageAlternates } from "./alternates"
import { siteUrl } from "./seo"
import { absoluteUrl } from "./urls"

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function robotsTxt(origin: URL | string = siteUrl): string {
  return `User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
Disallow: /api/

Sitemap: ${absoluteUrl("/sitemap.xml", origin)}
`
}

export type SitemapAlternate = { hreflang: string; href: string }
export type SitemapEntry = { loc: string; alternates: SitemapAlternate[]; lastmod: string }

export function sitemapEntries(origin: URL | string = siteUrl): SitemapEntry[] {
  const ids = Object.keys(pagePaths) as PageId[]

  return ids.flatMap((id) => {
    const alternates = pageAlternates(id).map(({ hreflang, path }) => ({
      hreflang,
      href: absoluteUrl(path, origin),
    }))

    return locales.map((lang) => ({
      loc: canonicalFor(id, lang),
      alternates,
      lastmod: buildTime,
    }))
  })
}

export function sitemapXml(origin: URL | string = siteUrl): string {
  const entries = sitemapEntries(origin).map(
    ({ loc, alternates, lastmod }) => `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
${alternates
  .map(
    ({ hreflang, href }) =>
      `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${xmlEscape(href)}" />`,
  )
  .join("\n")}
  </url>`,
  )

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`
}
