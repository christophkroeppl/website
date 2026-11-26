import { describe, expect, it } from "vitest"
import { robotsTxt, sitemapEntries, sitemapXml, xmlEscape } from "../src/lib/crawl"
import { LINKS_HOST } from "../src/links/host"
import { defaultLocale, locales } from "../src/i18n/locales"
import { pagePaths, type PageId } from "../src/i18n/routes"
import { siteUrl } from "../src/content/site"
import { inLanguage } from "../src/lib/seo"
import { GET as robots } from "../src/pages/robots.txt"
import { GET as sitemap } from "../src/pages/sitemap.xml"

const ids = Object.keys(pagePaths) as PageId[]

type Context = Parameters<typeof robots>[0]

function context(url: string): Context {
  return { site: new URL(siteUrl), url: new URL(url) } as Context
}

describe("robotsTxt", () => {
  it("allows crawling, blocks the api and points at the sitemap", () => {
    const body = robotsTxt()

    expect(body).toContain("User-agent: *")
    expect(body).toContain("Content-Signal: search=yes, ai-input=yes, ai-train=no")
    expect(body).toContain("Allow: /")
    expect(body).toContain("Disallow: /api/")
    expect(body).toContain(`Sitemap: ${siteUrl}/sitemap.xml`)
  })
})

describe("robots endpoint", () => {
  it("serves plain text with caching", async () => {
    const response = await robots(context(`${siteUrl}/robots.txt`))

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("cache-control")).toBe("public, max-age=3600")
    expect(await response.text()).toBe(robotsTxt())
  })

  it("serves the same body on the links host so noindex stays visible", async () => {
    const response = await robots(context(`https://${LINKS_HOST}/robots.txt`))

    expect(await response.text()).toBe(robotsTxt())
  })
})

describe("sitemap entries", () => {
  const entries = sitemapEntries().map((entry) => ({
    loc: entry.loc,
    alternates: Object.fromEntries(entry.alternates.map(({ hreflang, href }) => [hreflang, href])),
    lastmod: entry.lastmod,
  }))

  it("lists every localized page exactly once", () => {
    const locations = entries.map((entry) => entry.loc)

    expect(locations).toHaveLength(ids.length * locales.length)
    expect(new Set(locations).size).toBe(locations.length)

    for (const page of ids) {
      for (const lang of locales) {
        expect(locations).toContain(`${siteUrl}${pagePaths[page][lang]}`)
      }
    }
  })

  it("points every alternate at the right url", () => {
    for (const page of ids) {
      const expected = {
        ...Object.fromEntries(
          locales.map((lang) => [inLanguage(lang), `${siteUrl}${pagePaths[page][lang]}`]),
        ),
        "x-default": `${siteUrl}${pagePaths[page][defaultLocale]}`,
      }

      for (const lang of locales) {
        const loc = `${siteUrl}${pagePaths[page][lang]}`
        expect(entries.find((entry) => entry.loc === loc)?.alternates, page).toEqual(expected)
      }
    }
  })

  it("emits an ISO lastmod on every url", () => {
    const lastmods = entries.map((entry) => entry.lastmod)

    expect(lastmods).toHaveLength(ids.length * locales.length)
    for (const lastmod of lastmods) {
      expect(lastmod).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    }
  })
})

describe("sitemapXml", () => {
  it("serializes the entries as xml", () => {
    const body = sitemapXml()

    expect(body).toContain("<urlset")
    expect(body).toContain("<loc>")
  })

  it("never lists the links subdomain or error pages", () => {
    const body = sitemapXml()

    expect(body).not.toContain(LINKS_HOST)
    expect(body).not.toContain("/404")
  })
})

describe("sitemap endpoint", () => {
  it("serves xml with caching", async () => {
    const response = await sitemap(context(`${siteUrl}/sitemap.xml`))

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe("application/xml; charset=utf-8")
    expect(response.headers.get("cache-control")).toBe("public, max-age=3600")
  })

  it("is not served on the links host", async () => {
    const response = await sitemap(context(`https://${LINKS_HOST}/sitemap.xml`))

    expect(response.status).toBe(404)
  })
})

describe("xmlEscape", () => {
  it("escapes all five XML entities in one pass", () => {
    expect(xmlEscape(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&apos;")
  })
})
