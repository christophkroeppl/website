import { pathFor, type PageId } from "../i18n/routes"
import type { Locale } from "../i18n/locales"
import { siteUrl } from "./seo"

export function absoluteUrl(path: string, origin: URL | string = siteUrl): string {
  return new URL(path, origin).href
}

export function markdownPath(lang: Locale, page: PageId): string {
  const path = pathFor(page, lang)
  if (path === "/") return "/index.md"
  if (path === "/en/") return "/en/index.md"
  return `${path.replace(/\/$/, "")}.md`
}
