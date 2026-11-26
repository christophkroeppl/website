import type { Locale } from "../i18n/locales"
import { pathFor, type PageId } from "../i18n/routes"
import { absoluteUrl } from "./urls"

export function canonicalFor(page: PageId, lang: Locale): string {
  return absoluteUrl(pathFor(page, lang))
}
