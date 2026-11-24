import { describe, expect, it } from "vitest"
import { assembleFull, llmsIndex } from "../src/lib/llms"
import { pagePaths, type PageId } from "../src/i18n/routes"
import { siteUrl } from "../src/lib/seo"
import { markdownPath } from "../src/lib/urls"

const ids = Object.keys(pagePaths) as PageId[]

function urls(lang: "de" | "en"): string[] {
  return [...llmsIndex(lang).matchAll(/\((https:\/\/[^)]+)\)/g)].flatMap((match) => {
    const url = match[1]
    return url ? [url] : []
  })
}

describe("llmsIndex", () => {
  it("starts with the site name and the home summary", () => {
    const body = llmsIndex("de")

    expect(body.startsWith("# Christoph Kröppl\n\n> ")).toBe(true)
    expect(body).toContain("Deutsch ist die Standardsprache")
    expect(llmsIndex("en")).toContain("German is the default language")
  })

  it("links the markdown twin of every page in both locales", () => {
    const linked = urls("de")

    for (const page of ids) {
      expect(linked, page).toContain(`${siteUrl}${markdownPath("de", page)}`)
      expect(linked, page).toContain(`${siteUrl}${markdownPath("en", page)}`)
    }
  })

  it("links the full text of its own locale", () => {
    expect(urls("de")).toContain(`${siteUrl}/llms-full.txt`)
    expect(urls("en")).toContain(`${siteUrl}/en/llms-full.txt`)
    expect(urls("en")).not.toContain(`${siteUrl}/llms-full.txt`)
  })

  it("lists only profile links as optional", () => {
    const body = llmsIndex("de")

    expect(body).toContain("https://www.linkedin.com/in/christoph-kroeppl/")
    expect(body).not.toContain("https://bitcoin.org/en/bitcoin-paper")
    expect(body).not.toContain("https://free-cities.org/")
  })

  it("points at the sitemap", () => {
    expect(llmsIndex("en")).toContain(`Sitemap: ${siteUrl}/sitemap.xml`)
  })
})

describe("assembleFull", () => {
  it("labels each document with its source and strips frontmatter", () => {
    const output = assembleFull("# Title\n", [
      { url: "https://kroeppl.ch/", markdown: '---\ntitle: "A"\n---\n\n# A\n' },
      { url: "https://kroeppl.ch/projekte/", markdown: '---\ntitle: "B"\n---\n\n# B\n' },
    ])

    expect(output).toBe(
      "# Title\n\nSource: https://kroeppl.ch/\n\n# A\n\n---\n\nSource: https://kroeppl.ch/projekte/\n\n# B\n",
    )
  })

  it("keeps the header and ends with a single newline", () => {
    const output = assembleFull("# Title\n", [{ url: "https://kroeppl.ch/", markdown: "# A" }])

    expect(output.startsWith("# Title\n\n")).toBe(true)
    expect(output.endsWith("# A\n")).toBe(true)
  })
})
