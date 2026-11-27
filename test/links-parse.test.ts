import { describe, expect, it } from "vitest"
import { humanize, parseHref, parseLinkSources } from "../src/links/parse"

describe("parseLinkSources", () => {
  it("records indexes and skips empty values", () => {
    const links = parseLinkSources({
      LINK_05_GITHUB: "https://example.com/profile",
      LINK_01_LINKEDIN: "  https://example.net/profile/  ",
      MASTODON_LINK: "",
      LINK_02_INSTAGRAM: "",
    })

    expect(links.map((link) => link.slug)).toEqual(["github", "linkedin"])
    expect(links.map((link) => link.order)).toEqual([5, 1])
    expect(links[1]?.href).toBe("https://example.net/profile/")
  })

  it("ignores keys that are not links", () => {
    const links = parseLinkSources({
      LINKS_TAGLINE: "hello",
      CONTACT_EMAIL: "mail@example.com",
      LINK_05_GITHUB: "https://example.com/profile",
    })

    expect(links).toHaveLength(1)
  })

  it("derives the slug from the whole platform part", () => {
    const [link] = parseLinkSources({ LINK_07_SOME_PLATFORM: "https://example.com" })
    expect(link?.slug).toBe("some-platform")
  })

  it("applies _LABEL overrides without treating them as links", () => {
    const links = parseLinkSources({
      LINK_09_URL3: "https://example.org/first",
      LINK_09_URL3_LABEL: "First",
      LINK_10_URL4: "https://example.org/second",
      LINK_10_URL4_LABEL: "Second",
    })

    expect(links).toHaveLength(2)
    expect(links.map((link) => link.label)).toEqual(["First", "Second"])
  })

  it("applies _ICON overrides without treating them as links", () => {
    const links = parseLinkSources({
      LINK_10_URL4: "https://example.org/second",
      LINK_10_URL4_ICON: "custom-icon",
    })

    expect(links).toHaveLength(1)
    expect(links[0]).toMatchObject({ key: "LINK_10_URL4", icon: "custom-icon" })
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
      expect(parseHref("LINK_04_X", value)).toBe(expected)
    }
  })

  it("keeps the URL as provided", () => {
    expect(parseHref("LINK_04_X", "https://example.com/path")).toBe("https://example.com/path")
    expect(parseHref("LINK_07_URL1", "https://example.org/path")).toBe("https://example.org/path")
    expect(parseHref("LINK_04_X", "https://example.com/file.pdf")).toBe(
      "https://example.com/file.pdf",
    )
  })

  it("rejects relative and non-http values", () => {
    expect(() => parseHref("LINK_04_X", "example.com")).toThrow(/not an absolute URL/)
    expect(() => parseHref("LINK_04_X", "/relative")).toThrow(/not an absolute URL/)
    expect(() => parseHref("LINK_04_X", "ftp://example.com")).toThrow(/must use http/)
    expect(() => parseHref("LINK_04_X", "mailto:")).toThrow(/missing destination/)
  })
})

describe("humanize", () => {
  it("humanizes slugs", () => {
    expect(humanize("some-platform")).toBe("Some Platform")
    expect(humanize("MY_PLATFORM")).toBe("My Platform")
    expect(humanize("another-platform")).toBe("Another Platform")
  })
})
