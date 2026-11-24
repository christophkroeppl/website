import type { APIRoute } from "astro"
import { locales, type Locale } from "../i18n/locales"
import { pagePaths, type PageId } from "../i18n/routes"
import { pageMarkdown } from "../lib/markdown"
import { tokenCount } from "../lib/text"
import { absoluteUrl, markdownPath } from "../lib/urls"

export const prerender = false

const ids = Object.keys(pagePaths) as PageId[]

const entries = (locales as readonly Locale[]).flatMap((lang) =>
  ids.map((page) => ({
    lang,
    page,
    slug: markdownPath(lang, page).replace(/^\//, "").replace(/\.md$/, ""),
    canonical: absoluteUrl(pagePaths[page][lang]),
  })),
)

export const GET: APIRoute = async ({ params }) => {
  const entry = entries.find((candidate) => candidate.slug === params.slug)

  if (!entry) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    })
  }

  const markdown = await pageMarkdown(entry.lang, entry.page)

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
      "Cache-Control": "public, max-age=3600",
      Link: `<${entry.canonical}>; rel="canonical"`,
      "X-Markdown-Tokens": String(tokenCount(markdown)),
    },
  })
}
