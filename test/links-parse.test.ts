import { describe, expect, it } from "vitest"
import { humanize, linkLabel, parseHref, parseLinkSources } from "../src/links/parse"

describe("parseLinkSources", () => {
  it("keeps the env order and skips empty values", () => {
    const links = parseLinkSources({
      GITHUB_LINK: "https://github.com/christophkroeppl",
      MASTODON_LINK: "",
      LINKEDIN_LINK: "  https://www.linkedin.com/in/christoph-kroeppl/  ",
    })

    expect(links.map((link) => link.slug)).toEqual(["github", "linkedin"])
    expect(links[1]?.href).toBe("https://www.linkedin.com/in/christoph-kroeppl/")
  })

  it("ignores keys that are not links", () => {
    const links = parseLinkSources({
      LINKS_TAGLINE: "hello",
      CONTACT_EMAIL: "mail@example.com",
      GITHUB_LINK: "https://github.com/christophkroeppl",
    })

    expect(links).toHaveLength(1)
  })

  it("tolerates a PUBLIC_ prefix", () => {
    const [link] = parseLinkSources({ PUBLIC_FACEBOOK_LINK: "https://facebook.com/x" })
    expect(link?.slug).toBe("facebook")
    expect(link?.key).toBe("PUBLIC_FACEBOOK_LINK")
  })

  it("derives the slug from the whole platform part", () => {
    const [link] = parseLinkSources({ SOME_PLATFORM_LINK: "https://example.com" })
    expect(link?.slug).toBe("some-platform")
  })

  it("applies _LABEL overrides without treating them as links", () => {
    const links = parseLinkSources({
      BITCR_LINK_HOME: "https://www.bitcr.org/",
      BITCR_LINK_HOME_LABEL: "Home",
      BITCR_LINK_USE_CASES: "https://www.bit.cr/",
      BITCR_LINK_USE_CASES_LABEL: "Use Cases",
    })

    expect(links).toHaveLength(2)
    expect(links.map((link) => link.label)).toEqual(["Home", "Use Cases"])
  })

  it("applies _ICON overrides without treating them as links", () => {
    const links = parseLinkSources({
      BITCR_LINK_USE_CASES: "https://www.bit.cr/",
      BITCR_LINK_USE_CASES_ICON: "bitcr-inverse",
    })

    expect(links).toHaveLength(1)
    expect(links[0]).toMatchObject({ key: "BITCR_LINK_USE_CASES", icon: "bitcr-inverse" })
  })

  it("keeps variants, including numeric ones", () => {
    const links = parseLinkSources({
      FACEBOOK_LINK: "https://facebook.com/a",
      FACEBOOK_LINK_PRIVATE: "https://facebook.com/b",
      FACEBOOK_LINK_2: "https://facebook.com/c",
    })

    expect(links.map((link) => link.variant)).toEqual([undefined, "PRIVATE", "2"])
  })
})

describe("parseHref", () => {
  it("accepts http, https, mailto and tel", () => {
    for (const [value, expected] of [
      ["https://example.com", "https://example.com/"],
      ["http://example.com", "http://example.com/"],
      ["mailto:mail@example.com", "mailto:mail@example.com"],
      ["tel:+4312345678", "tel:+4312345678"],
    ] satisfies [string, string][]) {
      expect(parseHref("X_LINK", value)).toBe(expected)
    }
  })

  it("keeps the URL as provided", () => {
    expect(parseHref("X_LINK", "https://x.com/christophkrppl")).toBe("https://x.com/christophkrppl")
    expect(parseHref("X_LINK", "https://free-cities.org")).toBe("https://free-cities.org/")
    expect(parseHref("X_LINK", "https://example.com/file.pdf")).toBe("https://example.com/file.pdf")
  })

  it("rejects relative and non-http values", () => {
    expect(() => parseHref("X_LINK", "example.com")).toThrow(/not an absolute URL/)
    expect(() => parseHref("X_LINK", "/relative")).toThrow(/not an absolute URL/)
    expect(() => parseHref("X_LINK", "ftp://example.com")).toThrow(/must use http/)
    expect(() => parseHref("X_LINK", "mailto:")).toThrow(/missing destination/)
  })
})

describe("labels", () => {
  it("appends a humanized variant unless it is a number", () => {
    expect(linkLabel("Facebook")).toBe("Facebook")
    expect(linkLabel("Facebook", "PRIVATE")).toBe("Facebook — Private")
    expect(linkLabel("Facebook", "PRIVATE_2")).toBe("Facebook — Private 2")
    expect(linkLabel("Facebook", "2")).toBe("Facebook")
  })

  it("humanizes slugs", () => {
    expect(humanize("some-platform")).toBe("Some Platform")
    expect(humanize("MY_PLATFORM")).toBe("My Platform")
    expect(humanize("free-cities-foundation")).toBe("Free Cities Foundation")
  })
})
