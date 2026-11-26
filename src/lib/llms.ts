import { pagePaths, pageTitleKey, type PageId } from "../i18n/routes"
import { languages, localeMeta, type Locale } from "../i18n/locales"
import { useTranslations } from "../i18n/ui"
import { person } from "../content/site"
import { links } from "../generated/links"
import { isProfile } from "./schema"
import { otherLocale } from "./seo"
import { stripFrontmatter } from "./text"
import { absoluteUrl, markdownPath } from "./urls"

const pages = Object.keys(pagePaths) as PageId[]

export function pageTitle(lang: Locale, page: PageId): string {
  return useTranslations(lang)(pageTitleKey[page])
}

function entries(lang: Locale, descriptions: Record<PageId, string>): string[] {
  return pages.map(
    (page) =>
      `- [${pageTitle(lang, page)}](${absoluteUrl(markdownPath(lang, page))}): ${descriptions[page]}`,
  )
}

function headerLines(lang: Locale, home: string, note: boolean): string[] {
  const t = useTranslations(lang)
  return [
    `# ${person.name}`,
    "",
    `> ${home}`,
    "",
    ...(note ? [t("llms.languageNote"), ""] : []),
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
  ]
}

export function llmsIndex(
  lang: Locale,
  descriptions: Record<PageId, string>,
  otherDescriptions: Record<PageId, string>,
): string {
  const other = otherLocale(lang)
  const t = useTranslations(lang)

  return [
    ...headerLines(lang, descriptions.home, true),
    `## ${languages[lang]}`,
    "",
    ...entries(lang, descriptions),
    "",
    `## ${languages[other]}`,
    "",
    ...entries(other, otherDescriptions),
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

export async function llmsFull(lang: Locale): Promise<string> {
  const { descriptionsFor } = await import("./content")
  const { pageMarkdown } = await import("./markdown")
  const descriptions = await descriptionsFor(lang)
  const header = headerLines(lang, descriptions.home, false).join("\n")
  const documents = await Promise.all(
    pages.map(async (page) => ({
      url: absoluteUrl(pagePaths[page][lang]),
      markdown: await pageMarkdown(lang, page),
    })),
  )

  return assembleFull(header, documents)
}
