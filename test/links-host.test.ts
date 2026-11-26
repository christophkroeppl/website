import { describe, expect, it } from "vitest"
import { siteHost } from "../src/content/site"
import { isLinksHost, linksHostPolicy } from "../src/links/host"

function kind(host: string, pathname: string) {
  return linksHostPolicy(host, pathname).kind
}

const linksHost = `links.${siteHost}`
const wwwHost = `www.${siteHost}`

describe("linksHostPolicy", () => {
  it("passes every path without noindex on other hostnames", () => {
    for (const pathname of ["/", "/links/", "/impressum/", "/en/"]) {
      for (const host of [siteHost, wwwHost, "website.example.workers.dev"]) {
        expect(linksHostPolicy(host, pathname)).toEqual({ kind: "pass", noindex: false })
      }
    }
  })

  it("rewrites the subdomain roots to the localized links pages", () => {
    expect(isLinksHost(linksHost)).toBe(true)
    expect(linksHostPolicy(linksHost, "/")).toEqual({
      kind: "rewrite",
      target: "/links/",
    })
    expect(linksHostPolicy(linksHost, "/en")).toEqual({
      kind: "rewrite",
      target: "/en/links/",
    })
    expect(linksHostPolicy(linksHost, "/en/")).toEqual({
      kind: "rewrite",
      target: "/en/links/",
    })
  })

  it("serves links paths and shared assets with noindex on the subdomain", () => {
    for (const pathname of [
      "/links",
      "/links/",
      "/en/links",
      "/en/links/",
      "/_astro/BaseLayout.css",
      "/_image/?href=%2F_astro%2Fbullet.webp&w=224&h=224&f=webp",
      "/fonts/inter-latin-var.woff2",
      "/favicon.svg",
      "/og.png",
      "/icons/bitcr.svg",
      "/api/contact",
      "/api/contact/",
      "/robots.txt",
    ]) {
      expect(linksHostPolicy(linksHost, pathname)).toEqual({
        kind: "pass",
        noindex: true,
      })
    }
  })

  it("blocks the rest of the site on the subdomain", () => {
    for (const pathname of [
      "/impressum/",
      "/datenschutz/",
      "/en/privacy/",
      "/projekte.md",
      "/en/projects.md",
      "/datenschutz.md",
      "/en/cv.md",
      "/llms.txt",
      "/en/llms.txt",
      "/llms-full.txt",
      "/sitemap.xml",
    ]) {
      expect(kind(linksHost, pathname)).toBe("block")
    }
  })
})
