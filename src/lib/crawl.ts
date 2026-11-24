import { pagePaths, type PageId } from "../i18n/routes"
import { inLanguage, siteUrl } from "./seo"
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

export function sitemapXml(origin: URL | string = siteUrl): string {
  const ids = Object.keys(pagePaths) as PageId[]

  const entries = ids.flatMap((id) => {
    const pair = pagePaths[id]
    const pairs: [string, string][] = [
      [inLanguage("de"), pair.de],
      ["en", pair.en],
      ["x-default", pair.de],
    ]
    const alternates = pairs
      .map(
        ([hreflang, path]) =>
          `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${xmlEscape(absoluteUrl(path, origin))}" />`,
      )
      .join("\n")

    return [pair.de, pair.en].map(
      (path) => `  <url>
    <loc>${xmlEscape(absoluteUrl(path, origin))}</loc>
${alternates}
  </url>`,
    )
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`
}
