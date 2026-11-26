import { describe, expect, it } from "vitest"
import { pageAlternates } from "../src/lib/alternates"
import { defaultLocale, locales } from "../src/i18n/locales"
import { pagePaths } from "../src/i18n/routes"
import { inLanguage } from "../src/lib/seo"

describe("pageAlternates", () => {
  it("lists every locale and x-default at the default path", () => {
    const alternates = pageAlternates("home")

    expect(alternates.map((alternate) => alternate.hreflang)).toEqual([
      ...locales.map((lang) => inLanguage(lang)),
      "x-default",
    ])
    expect(alternates.at(-1)?.path).toBe(pagePaths.home[defaultLocale])
  })

  it("uses the page's localized paths", () => {
    expect(pageAlternates("projects").find((a) => a.hreflang === inLanguage("en"))?.path).toBe(
      pagePaths.projects.en,
    )
  })
})
