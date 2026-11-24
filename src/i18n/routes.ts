import type { Locale } from "./locales"

export type { Locale }

export const pagePaths = {
  home: { de: "/", en: "/en/" },
  contact: { de: "/impressum/", en: "/en/contact/" },
  cv: { de: "/lebenslauf/", en: "/en/cv/" },
  privacy: { de: "/datenschutz/", en: "/en/privacy/" },
} as const satisfies Record<string, Record<Locale, string>>

export type PageId = keyof typeof pagePaths

export const localizedRoutes = {
  "/": { de: "/", en: "/" },
  "/contact": { de: "/impressum", en: "/contact" },
  "/cv": { de: "/lebenslauf", en: "/cv" },
  "/privacy": { de: "/datenschutz", en: "/privacy" },
} as const satisfies Record<string, Record<Locale, string>>

export function pathFor(page: PageId, lang: Locale): string {
  return pagePaths[page][lang]
}
