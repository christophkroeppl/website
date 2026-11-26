import type { Locale } from "./locales"
import type { TranslationKey } from "./ui"

export type { Locale }

export const pagePaths = {
  home: { de: "/", en: "/en/" },
  contact: { de: "/impressum/", en: "/en/contact/" },
  cv: { de: "/lebenslauf/", en: "/en/cv/" },
  projects: { de: "/projekte/", en: "/en/projects/" },
  privacy: { de: "/datenschutz/", en: "/en/privacy/" },
} as const satisfies Record<string, Record<Locale, string>>

export type PageId = keyof typeof pagePaths

export const pageTitleKey = {
  home: "home.title",
  contact: "impressum.title",
  cv: "cv.title",
  projects: "projects.title",
  privacy: "nav.privacy",
} as const satisfies Record<PageId, TranslationKey>

export const routePage = {
  "/": "home",
  "/contact": "contact",
  "/cv": "cv",
  "/projects": "projects",
  "/privacy": "privacy",
} as const satisfies Partial<Record<RouteKey, PageId>>

export type RouteKey = keyof typeof localizedRoutes

export const localizedRoutes = {
  "/": { de: "/", en: "/" },
  "/api/project-slides": { de: "/api/project-slides", en: "/api/project-slides" },
  "/contact": { de: "/impressum", en: "/contact" },
  "/cv": { de: "/lebenslauf", en: "/cv" },
  "/links": { de: "/links", en: "/links" },
  "/projects": { de: "/projekte", en: "/projects" },
  "/privacy": { de: "/datenschutz", en: "/privacy" },
} as const satisfies Record<string, Record<Locale, string>>

export function pathFor(page: PageId, lang: Locale): string {
  return pagePaths[page][lang]
}

export function activePage(pathname: string): PageId | undefined {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`
  return (Object.keys(pagePaths) as PageId[]).find(
    (page) => pagePaths[page].de === normalized || pagePaths[page].en === normalized,
  )
}
