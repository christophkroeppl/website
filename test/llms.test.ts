import { describe, expect, it } from "vitest"
import { assembleFull, llmsIndex } from "../src/lib/llms"
import { pagePaths, type PageId } from "../src/i18n/routes"
import { siteUrl } from "../src/content/site"
import { markdownPath } from "../src/lib/urls"
import { links } from "../src/generated/links"

const ids = Object.keys(pagePaths) as PageId[]

const de: Record<PageId, string> = {
  home: "Startbeschreibung",
  contact: "Kontaktbeschreibung",
  cv: "Lebenslaufbeschreibung",
  projects: "Projektbeschreibung",
  privacy: "Datenschutzbeschreibung",
}
const en: Record<PageId, string> = {
  home: "Home description",
  contact: "Contact description",
  cv: "CV description",
  projects: "Projects description",
  privacy: "Privacy description",
}
const index = (lang: "de" | "en") =>
  lang === "de" ? llmsIndex("de", de, en) : llmsIndex("en", en, de)

function urls(lang: "de" | "en"): string[] {
  return [...index(lang).matchAll(/\((https:\/\/[^)]+)\)/g)].flatMap((match) => {
    const url = match[1]
    return url ? [url] : []
  })
}

describe("llmsIndex", () => {
  it("starts with the site name and the home summary", () => {
    const body = index("de")

    expect(body.startsWith("# Christoph Kröppl\n\n> ")).toBe(true)
    expect(body).toContain("Deutsch ist die Standardsprache")
    expect(index("en")).toContain("German is the default language")
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
    const body = index("de")

    const href = (key: string) => links.find((link) => link.key === key)?.href
    expect(body).toContain(href("LINK_01_LINKEDIN"))
    expect(body).not.toContain(href("LINK_09_URL2"))
    expect(body).not.toContain(href("LINK_08_URL1"))
  })

  it("points at the sitemap", () => {
    expect(index("en")).toContain(`Sitemap: ${siteUrl}/sitemap.xml`)
  })
})

describe("assembleFull", () => {
  it("labels each document with its source and strips frontmatter", () => {
    const output = assembleFull("# Title\n", [
      { url: `${siteUrl}/`, markdown: '---\ntitle: "A"\n---\n\n# A\n' },
      { url: `${siteUrl}/projekte/`, markdown: '---\ntitle: "B"\n---\n\n# B\n' },
    ])

    expect(output).toBe(
      `# Title\n\nSource: ${siteUrl}/\n\n# A\n\n---\n\nSource: ${siteUrl}/projekte/\n\n# B\n`,
    )
  })

  it("keeps the header and ends with a single newline", () => {
    const output = assembleFull("# Title\n", [{ url: `${siteUrl}/`, markdown: "# A" }])

    expect(output.startsWith("# Title\n\n")).toBe(true)
    expect(output.endsWith("# A\n")).toBe(true)
  })
})
