import { pagePaths, pageTitleKey, type PageId } from "../i18n/routes"
import { localeMeta, locales, type Locale } from "../i18n/locales"
import { useTranslations } from "../i18n/ui"
import { person } from "../content/site"
import { links } from "../generated/links"
import { isProfile } from "./schema"
import { otherLocale, pageDescription } from "./seo"
import { stripFrontmatter } from "./text"
import { absoluteUrl, markdownPath } from "./urls"

const pages = Object.keys(pagePaths) as PageId[]

export function pageTitle(lang: Locale, page: PageId): string {
  return useTranslations(lang)(pageTitleKey[page])
}

function entries(lang: Locale): string[] {
  return pages.map(
    (page) =>
      `- [${pageTitle(lang, page)}](${absoluteUrl(markdownPath(lang, page))}): ${pageDescription(lang, page)}`,
  )
}

export function llmsIndex(lang: Locale): string {
  const other = otherLocale(lang)
  const t = useTranslations(lang)

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
    `## ${t("llms.fullText.heading")}`,
    "",
    `- [${person.name} — ${lang.toUpperCase()}](${absoluteUrl(`${localeMeta[lang].prefix}/llms-full.txt`)}): ${t("llms.fullText.description")}`,
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
