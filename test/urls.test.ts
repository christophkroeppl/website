import { describe, expect, it } from "vitest"
import { absoluteUrl, markdownPath } from "../src/lib/urls"
import { pagePaths, type PageId } from "../src/i18n/routes"
import { locales, type Locale } from "../src/i18n/locales"
import { siteUrl } from "../src/lib/seo"

const ids = Object.keys(pagePaths) as PageId[]

describe("absoluteUrl", () => {
  it("resolves paths against the production origin", () => {
    expect(absoluteUrl("/projekte/")).toBe(`${siteUrl}/projekte/`)
    expect(absoluteUrl("/", "https://example.com")).toBe("https://example.com/")
  })
})

describe("markdownPath", () => {
  it("maps every page and locale to a markdown twin", () => {
    const paths = (locales as readonly Locale[]).flatMap((lang) =>
      ids.map((page) => markdownPath(lang, page)),
    )

    expect(paths).toHaveLength(ids.length * 2)
    expect(new Set(paths).size).toBe(paths.length)

    for (const path of paths) {
      expect(path.startsWith("/")).toBe(true)
      expect(path.endsWith(".md")).toBe(true)
      expect(path).not.toContain("//")
    }
  })

  it("mirrors the html routes", () => {
    expect(markdownPath("de", "home")).toBe("/index.md")
    expect(markdownPath("en", "home")).toBe("/en/index.md")
    expect(markdownPath("de", "projects")).toBe("/projekte.md")
    expect(markdownPath("en", "projects")).toBe("/en/projects.md")
  })
})
