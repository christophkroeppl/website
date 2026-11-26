import { describe, expect, it } from "vitest"
import { parse } from "yaml"
import { locales, type Locale } from "../src/i18n/locales"

const pages = ["home", "contact", "cv", "projects", "privacy"] as const

const sources = import.meta.glob("../src/content/pages/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function description(lang: Locale, page: (typeof pages)[number]): string {
  const path =
    page === "projects"
      ? `../src/content/pages/meta/projects.${lang}.md`
      : `../src/content/pages/${page}/${lang}.md`
  const source = sources[path]
  expect(source, path).toBeDefined()
  const block = source?.match(/^---\n([\s\S]*?)\n---/)
  expect(block, path).not.toBeNull()
  const data = parse(block?.[1] ?? "") as { description?: string }

  const fileLocale = path.match(/(?:\.|\/)(de|en)\.md$/)?.[1]
  expect(fileLocale, path).toBe(lang)
  expect(typeof data.description, path).toBe("string")
  return data.description ?? ""
}

describe("page descriptions", () => {
  for (const lang of locales as readonly Locale[]) {
    it(`has five unique descriptions for ${lang}`, () => {
      const descriptions = pages.map((page) => description(lang, page))

      expect(descriptions).toHaveLength(5)
      expect(new Set(descriptions).size).toBe(descriptions.length)
      for (const value of descriptions) {
        expect(value.length, value).toBeGreaterThanOrEqual(90)
        expect(value.length, value).toBeLessThanOrEqual(160)
      }
    })
  }
})
