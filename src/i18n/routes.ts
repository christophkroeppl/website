import type { Locale } from "./ui"

export type { Locale }

export const pagePaths = {
  home: { de: "/", en: "/en/" },
  contact: { de: "/impressum/", en: "/en/contact/" },
  privacy: { de: "/datenschutz/", en: "/en/privacy/" },
} as const

export type PageId = keyof typeof pagePaths

export const localizedRoutes = {
  "/": { de: "/", en: "/" },
  "/contact": { de: "/impressum", en: "/contact" },
  "/privacy": { de: "/datenschutz", en: "/privacy" },
} as const

export function pathFor(page: PageId, lang: Locale): string {
  return pagePaths[page][lang]
}
