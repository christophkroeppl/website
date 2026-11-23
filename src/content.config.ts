import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { locales } from "./i18n/locales"

const locale = z.enum(locales)

const pageId = ({ entry }: { entry: string }) => entry.replace(/^.*\//, "").replace(/\.md$/, "")

const privacy = defineCollection({
  loader: glob({
    pattern: "privacy/*.md",
    base: "./src/content/pages",
    generateId: pageId,
  }),
  schema: z.object({
    locale,
    title: z.string().min(1),
    updated: z.string().min(1),
  }),
})

export const collections = { privacy }
