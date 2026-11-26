import type { Locale } from "./locales"
import { defaultLocale, locales } from "./locales"
import type { TranslationKey } from "./ui"

export type { Locale }

export const localizedRoutes = {
  "/": { de: "/", en: "/" },
  "/contact": { de: "/impressum", en: "/contact" },
  "/cv": { de: "/lebenslauf", en: "/cv" },
  "/links": { de: "/links", en: "/links" },
  "/projects": { de: "/projekte", en: "/projects" },
  "/privacy": { de: "/datenschutz", en: "/privacy" },
} as const satisfies Record<string, Record<Locale, string>>

export type RouteKey = keyof typeof localizedRoutes

export const pageRoutes = {
  home: "/",
  contact: "/contact",
  cv: "/cv",
  projects: "/projects",
  privacy: "/privacy",
} as const satisfies Record<string, RouteKey>

export type PageId = keyof typeof pageRoutes

function pagePath(route: RouteKey, lang: Locale): string {
  const prefix = lang === defaultLocale ? "" : "/" + lang
  const raw = prefix + localizedRoutes[route][lang]
  return raw.endsWith("/") ? raw : raw + "/"
}

export const pagePaths = Object.fromEntries(
  (Object.keys(pageRoutes) as PageId[]).map((page) => [
    page,
    Object.fromEntries(locales.map((lang) => [lang, pagePath(pageRoutes[page], lang)])),
  ]),
) as Record<PageId, Record<Locale, string>>

export const pageTitleKey = {
  home: "home.title",
  contact: "impressum.title",
  cv: "cv.title",
  projects: "projects.title",
  privacy: "nav.privacy",
} as const satisfies Record<PageId, TranslationKey>

export function pathFor(page: PageId, lang: Locale): string {
  return pagePaths[page][lang]
}

export function activePage(pathname: string): PageId | undefined {
  const normalized = pathname.endsWith("/") ? pathname : pathname + "/"
  return (Object.keys(pagePaths) as PageId[]).find((page) =>
    locales.some((lang) => pagePaths[page][lang] === normalized),
  )
}
