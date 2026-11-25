import { describe, expect, it } from "vitest"
import { isLinksHost, linksHostRoute } from "../src/links/host"

describe("linksHostRoute", () => {
  it("passes every path through on other hostnames", () => {
    for (const pathname of ["/", "/links/", "/impressum/", "/en/"]) {
      expect(linksHostRoute("kroeppl.ch", pathname)).toBe("pass")
      expect(linksHostRoute("www.kroeppl.ch", pathname)).toBe("pass")
      expect(linksHostRoute("website.example.workers.dev", pathname)).toBe("pass")
    }
  })

  it("rewrites the subdomain roots to the localized links pages", () => {
    expect(isLinksHost("links.kroeppl.ch")).toBe(true)
    expect(linksHostRoute("links.kroeppl.ch", "/")).toBe("rewrite")
    expect(linksHostRoute("links.kroeppl.ch", "/en")).toBe("rewrite")
    expect(linksHostRoute("links.kroeppl.ch", "/en/")).toBe("rewrite")
  })

  it("serves the links path and shared assets on the subdomain", () => {
    for (const pathname of [
      "/links",
      "/links/",
      "/en/links",
      "/en/links/",
      "/_astro/BaseLayout.css",
      "/_image/?href=%2F_astro%2Fbullet.webp&w=224&h=224&f=webp",
      "/fonts/inter-latin-var.woff2",
      "/favicon.svg",
      "/robots.txt",
      "/api/contact",
      "/api/contact/",
    ]) {
      expect(linksHostRoute("links.kroeppl.ch", pathname)).toBe("pass")
    }
  })

  it("blocks the rest of the site on the subdomain", () => {
    for (const pathname of ["/impressum/", "/datenschutz/", "/en/privacy/"]) {
      expect(linksHostRoute("links.kroeppl.ch", pathname)).toBe("block")
    }
  })
})
