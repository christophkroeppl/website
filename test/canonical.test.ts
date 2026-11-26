import { describe, expect, it } from "vitest"
import { canonicalFor } from "../src/lib/canonical"
import { locales } from "../src/i18n/locales"
import { pagePaths, type PageId } from "../src/i18n/routes"
import { absoluteUrl } from "../src/lib/urls"

describe("canonicalFor", () => {
  it("uses the route table for every page and locale", () => {
    for (const page of Object.keys(pagePaths) as PageId[]) {
      for (const lang of locales) {
        expect(canonicalFor(page, lang)).toBe(absoluteUrl(pagePaths[page][lang]))
      }
    }
  })
})
