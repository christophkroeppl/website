import { defaultLocale, locales } from "../i18n/locales"
import { pathFor, type PageId } from "../i18n/routes"
import { inLanguage } from "./seo"

export type PageAlternate = {
  hreflang: string
  path: string
}

export function pageAlternates(page: PageId): PageAlternate[] {
  return [
    ...locales.map((lang) => ({
      hreflang: inLanguage(lang),
      path: pathFor(page, lang),
    })),
    { hreflang: "x-default", path: pathFor(page, defaultLocale) },
  ]
}
