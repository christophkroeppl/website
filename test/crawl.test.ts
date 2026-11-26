import { describe, expect, it } from "vitest"
import { robotsTxt, sitemapXml } from "../src/lib/crawl"
import { LINKS_HOST } from "../src/links/host"
import { defaultLocale, locales } from "../src/i18n/locales"
import { pagePaths, type PageId } from "../src/i18n/routes"
import { inLanguage, siteUrl } from "../src/lib/seo"
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

describe("sitemapXml", () => {
  const body = sitemapXml()

  const entries = body
    .split("<url>")
    .slice(1)
    .map((block) => ({
      loc: /<loc>([^<]+)<\/loc>/.exec(block)?.[1],
      alternates: Object.fromEntries(
        [...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((match) => [
          match[1],
          match[2],
        ]),
      ),
    }))

  it("lists every localized page exactly once", () => {
    const locations = entries.map((entry) => entry.loc)

    expect(locations).toHaveLength(ids.length * locales.length)
    expect(new Set(locations).size).toBe(locations.length)

    for (const page of ids) {
      expect(locations).toContain(`${siteUrl}${pagePaths[page].de}`)
      expect(locations).toContain(`${siteUrl}${pagePaths[page].en}`)
    }
  })

  it("points every alternate at the right url", () => {
    for (const page of ids) {
      const de = `${siteUrl}${pagePaths[page].de}`
      const en = `${siteUrl}${pagePaths[page].en}`
      const expected = {
        ...Object.fromEntries(
          locales.map((lang) => [inLanguage(lang), `${siteUrl}${pagePaths[page][lang]}`]),
        ),
        "x-default": `${siteUrl}${pagePaths[page][defaultLocale]}`,
      }

      expect(entries.find((entry) => entry.loc === de)?.alternates, page).toEqual(expected)
      expect(entries.find((entry) => entry.loc === en)?.alternates, page).toEqual(expected)
    }
  })

  it("emits an ISO lastmod on every url", () => {
    const lastmods = [...body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1])

    expect(lastmods).toHaveLength(ids.length * 2)
    for (const lastmod of lastmods) {
      expect(lastmod).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    }
  })

  it("never lists the links subdomain or error pages", () => {
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
