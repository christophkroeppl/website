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
    description: z.string().min(1),
    updated: z.string().min(1),
  }),
})

const cv = defineCollection({
  loader: glob({
    pattern: "cv/*.md",
    base: "./src/content/pages",
    generateId: pageId,
  }),
  schema: z.object({
    locale,
    description: z.string().min(1),
    headline: z.string().min(1),
    location: z.string().min(1),
    roles: z.array(z.string().min(1)).min(1),
    skills: z.array(z.string().min(1)).min(1),
    education: z
      .array(
        z.object({
          period: z.string().min(1),
          org: z.string().min(1),
          detail: z.string().min(1),
        }),
      )
      .min(1),
    certifications: z
      .array(
        z.object({
          period: z.string(),
          detail: z.string().min(1),
        }),
      )
      .min(1),
    languages: z
      .array(
        z.object({
          code: z.enum(["de", "en", "fr"]),
          name: z.string().min(1),
          level: z.string().min(1),
        }),
      )
      .min(1),
    interests: z.array(z.string().min(1)).min(1),
    bitcoin: z.object({
      own: z.array(z.string().min(1)).min(1),
      events: z.array(z.string().min(1)).min(1),
    }),
  }),
})

const skills = defineCollection({
  loader: glob({
    pattern: "skills/*.md",
    base: "./src/content/pages",
    generateId: pageId,
  }),
  schema: z.object({
    locale,
    label: z.string().min(1),
    items: z.array(z.string().min(1)).min(1),
    order: z.number().int().positive(),
  }),
})

const experience = defineCollection({
  loader: glob({
    pattern: "experience/*.md",
    base: "./src/content/pages",
    generateId: pageId,
  }),
  schema: z.object({
    locale,
    org: z.string().min(1),
    title: z.string().min(1),
    location: z.string().min(1),
    period: z.string().min(1),
    order: z.number().int().positive(),
    summary: z.string().min(1),
    bullets: z.array(z.string().min(1)).min(1),
    orgNote: z.string().min(1).optional(),
  }),
})

const projectArtifact = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("html"),
    src: z.string().min(1),
    title: z.string().min(1),
    aspect: z.string().default("16/10"),
  }),
  z.object({
    kind: z.literal("compare"),
    before: z.string().min(1),
    after: z.string().min(1),
    beforeLabel: z.string().min(1),
    afterLabel: z.string().min(1),
    caption: z.string().min(1),
    aspect: z.string().default("16/10"),
    orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
  }),
])

const projectSchema = z.object({
  locale,
  id: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().positive(),
  name: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  status: z.string().min(1),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.url(),
      }),
    )
    .min(1),
  highlights: z.array(z.string().min(1)).min(1),
  artifact: projectArtifact,
})

const projects = defineCollection({
  loader: glob({
    pattern: "projects/*.md",
    base: "./src/content/pages",
    generateId: pageId,
  }),
  schema: projectSchema,
})

export type ProjectData = z.infer<typeof projectSchema>

const pageMeta = defineCollection({
  loader: glob({
    pattern: "meta/*.md",
    base: "./src/content/pages",
    generateId: pageId,
  }),
  schema: z.object({
    locale,
    page: z.literal("projects"),
    description: z.string().min(1),
  }),
})

const home = defineCollection({
  loader: glob({
    pattern: "home/*.md",
    base: "./src/content/pages",
    generateId: pageId,
  }),
  schema: z.object({
    locale,
    description: z.string().min(1),
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    lead: z.string().min(1),
    secondary: z.string().min(1),
    projectsCta: z.string().min(1),
    cvCta: z.string().min(1),
    philosophyCta: z.string().min(1),
    workTitle: z.string().min(1),
    workIntro: z.string().min(1),
    aboutTitle: z.string().min(1),
    aboutQuote: z.string().min(1),
    proof: z
      .array(
        z.object({
          value: z.string().min(1),
          label: z.string().min(1),
        }),
      )
      .min(1),
  }),
})

const contact = defineCollection({
  loader: glob({
    pattern: "contact/*.md",
    base: "./src/content/pages",
    generateId: pageId,
  }),
  schema: z.object({
    locale,
    title: z.string().min(1),
    description: z.string().min(1),
    body: z.string().min(1),
    cta: z.string().min(1),
  }),
})

export const collections = { privacy, cv, experience, projects, pageMeta, skills, home, contact }
