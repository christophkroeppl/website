import { describe, expect, it } from "vitest"
import { inLanguage, siteUrl } from "../src/lib/seo"
import {
  activePage,
  localizedRoutes,
  pagePaths,
  pageRoutes,
  pathFor,
  type PageId,
} from "../src/i18n/routes"
import { defaultLocale, locales, type Locale } from "../src/i18n/locales"

describe("inLanguage", () => {
  it("uses de-AT for German and en for English", () => {
    expect(inLanguage("de")).toBe("de-AT")
    expect(inLanguage("en")).toBe("en")
  })
})

describe("route registration", () => {
  it("maps every content page to a distinct route", () => {
    const routes = Object.values(pageRoutes)
    expect(new Set(routes).size).toBe(routes.length)
  })

  it("derives pagePaths from localizedRoutes for every page and locale", () => {
    for (const page of Object.keys(pageRoutes) as PageId[]) {
      for (const lang of locales as readonly Locale[]) {
        const prefix = lang === defaultLocale ? "" : "/" + lang
        const raw = prefix + localizedRoutes[pageRoutes[page]][lang]
        const expected = raw.endsWith("/") ? raw : raw + "/"
        expect(pathFor(page, lang), page + "/" + lang).toBe(expected)
        expect(pagePaths[page][lang], page + "/" + lang).toBe(expected)
      }
    }
  })

  it("registers the links page in both locales without listing it as a content page", () => {
    expect(localizedRoutes["/links"].de + "/").toBe("/links/")
    expect("/en" + localizedRoutes["/links"].en + "/").toBe("/en/links/")
    expect(pagePaths).not.toHaveProperty("links")
  })

  it("resolves every page path back to its own id", () => {
    for (const page of Object.keys(pageRoutes) as PageId[]) {
      for (const lang of locales as readonly Locale[]) {
        expect(activePage(pagePaths[page][lang]), page + "/" + lang).toBe(page)
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
