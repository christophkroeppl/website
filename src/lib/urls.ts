import { pathFor, type PageId } from "../i18n/routes"
import { localeMeta, type Locale } from "../i18n/locales"
import { siteUrl } from "./seo"

export function absoluteUrl(path: string, origin: URL | string = siteUrl): string {
  return new URL(path, origin).href
}

export function markdownPath(lang: Locale, page: PageId): string {
  if (page === "home") return `${localeMeta[lang].prefix}/index.md`
  return `${pathFor(page, lang).replace(/\/$/, "")}.md`
}
