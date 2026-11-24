import { pagePaths, type PageId } from "../i18n/routes"
import { locales, type Locale } from "../i18n/locales"
import { useTranslations, type TranslationKey } from "../i18n/ui"
import { person } from "../content/site"
import { links } from "../generated/links"
import { isProfile } from "./schema"
import { pageDescription } from "./seo"
import { stripFrontmatter } from "./text"
import { absoluteUrl, markdownPath } from "./urls"

const pages = Object.keys(pagePaths) as PageId[]

const titleKey = {
  home: "home.title",
  contact: "impressum.title",
  cv: "cv.title",
  projects: "projects.title",
  privacy: "nav.privacy",
} as const satisfies Record<PageId, TranslationKey>

export function pageTitle(lang: Locale, page: PageId): string {
  return useTranslations(lang)(titleKey[page])
}

function entries(lang: Locale): string[] {
  return pages.map(
    (page) =>
      `- [${pageTitle(lang, page)}](${absoluteUrl(markdownPath(lang, page))}): ${pageDescription(lang, page)}`,
  )
}

export function llmsIndex(lang: Locale): string {
  const other: Locale = lang === "de" ? "en" : "de"

  return [
    `# ${person.name}`,
    "",
    `> ${pageDescription(lang, "home")}`,
    "",
    lang === "de"
      ? "Deutsch ist die Standardsprache, englische Inhalte liegen unter /en/. Die verlinkten Markdown-Dateien spiegeln die kanonischen Seiten und nennen ihre HTML-URL."
      : "German is the default language; English content lives under /en/. The linked Markdown files mirror the canonical pages and declare their HTML URL.",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
    lang === "de" ? "## Deutsch" : "## English",
    "",
    ...entries(lang),
    "",
    lang === "de" ? "## English" : "## Deutsch",
    "",
    ...entries(other),
    "",
    "## Full text",
    "",
    `- [${person.name} — ${lang.toUpperCase()}](${absoluteUrl(lang === "de" ? "/llms-full.txt" : "/en/llms-full.txt")}): every page of this locale concatenated`,
    "",
    "## Optional",
    "",
    ...links
      .filter((link) => isProfile(link.href))
      .map((link) => `- [${link.label}](${link.href})`),
    "",
  ].join("\n")
}

export function assembleFull(
  header: string,
  documents: { url: string; markdown: string }[],
): string {
  const joined = documents
    .map(({ url, markdown }) => `Source: ${url}\n\n${stripFrontmatter(markdown)}`)
    .join("\n\n---\n\n")

  return `${header.trimEnd()}\n\n${joined}\n`
}
