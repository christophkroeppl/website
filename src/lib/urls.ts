import { pathFor, type PageId } from "../i18n/routes"
import { localePrefix, type Locale } from "../i18n/locales"
import { siteUrl } from "./seo"

export function absoluteUrl(path: string, origin: URL | string = siteUrl): string {
  return new URL(path, origin).href
}

export function markdownPath(lang: Locale, page: PageId): string {
  if (page === "home") return `${localePrefix(lang)}/index.md`
  return `${pathFor(page, lang).replace(/\/$/, "")}.md`
}
