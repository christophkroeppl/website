import { pagePaths, type PageId } from "../i18n/routes"
import type { Locale } from "../i18n/locales"
import { person } from "../content/site"
import { descriptionsFor } from "./content"
import { assembleFull } from "./llms"
import { pageMarkdown } from "./markdown"
import { absoluteUrl } from "./urls"

const pages = Object.keys(pagePaths) as PageId[]

export async function llmsFull(lang: Locale): Promise<string> {
  const descriptions = await descriptionsFor(lang)
  const header = `# ${person.name}\n\n> ${descriptions.home}\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`
  const documents = await Promise.all(
    pages.map(async (page) => ({
      url: absoluteUrl(pagePaths[page][lang]),
      markdown: await pageMarkdown(lang, page),
    })),
  )

  return assembleFull(header, documents)
}
