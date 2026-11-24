import { describe, expect, it } from "vitest"
import { inLanguage, siteUrl } from "../src/lib/seo"
import { activePage, localizedRoutes, pagePaths, routePage, type PageId } from "../src/i18n/routes"
import { defaultLocale, locales, type Locale } from "../src/i18n/locales"

const ids = Object.keys(pagePaths) as PageId[]

describe("inLanguage", () => {
  it("uses de-AT for German and en for English", () => {
    expect(inLanguage("de")).toBe("de-AT")
    expect(inLanguage("en")).toBe("en")
  })
})

describe("route registration", () => {
  function fullPath(route: keyof typeof localizedRoutes, lang: Locale): string {
    const prefix = lang === defaultLocale ? "" : `/${lang}`
    const raw = `${prefix}${localizedRoutes[route][lang]}`
    return raw.endsWith("/") ? raw : `${raw}/`
  }

  it("maps every localized route to exactly one page", () => {
    const pages = Object.values(routePage)

    expect(new Set(pages).size).toBe(pages.length)
    expect([...pages].sort()).toEqual([...ids].sort())
  })

  it("agrees with pagePaths for every route and locale", () => {
    for (const route of Object.keys(localizedRoutes) as (keyof typeof localizedRoutes)[]) {
      for (const lang of locales as readonly Locale[]) {
        const path = fullPath(route, lang)

        expect(routePage[route], route).toBeDefined()
        expect(pagePaths[routePage[route]][lang], `${route}/${lang}`).toBe(path)
      }
    }
  })

  it("resolves every page path back to its own id", () => {
    for (const page of ids) {
      for (const lang of locales as readonly Locale[]) {
        expect(activePage(pagePaths[page][lang]), `${page}/${lang}`).toBe(page)
      }
    }
  })

  it("returns undefined for unknown paths", () => {
    for (const path of ["/nope/", "/en/nope/", "/404/", "/en/404/", "/links/"]) {
      expect(activePage(path), path).toBeUndefined()
    }
  })
})

describe("site url", () => {
  it("is the production origin without a trailing slash", () => {
    expect(siteUrl).toBe("https://kroeppl.ch")
    expect(new URL(pagePaths.home.de, siteUrl).href).toBe("https://kroeppl.ch/")
  })
})
