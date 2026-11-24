import { getEntry } from "astro:content"
import { roles } from "../content/experience"
import {
  bitcoin,
  certifications,
  education,
  interests,
  languages,
  skillGroups,
} from "../content/skills"
import { about, contact, home, homeSections, person, proof } from "../content/site"
import { pick } from "../content/types"
import { pathFor, type PageId } from "../i18n/routes"
import type { Locale } from "../i18n/locales"
import { useTranslations } from "../i18n/ui"
import { linkHref } from "../links/urls"
import { pickById, projectsFor } from "./content"
import { inLanguage, pageDescription } from "./seo"
import { inline, renderFrontmatter, stripFrontmatter } from "./text"
import { absoluteUrl } from "./urls"

const extras = {
  de: { stats: "Kennzahlen", stack: "Stack", status: "Status", links: "Links" },
  en: { stats: "Key facts", stack: "Stack", status: "Status", links: "Links" },
} as const

function bullets(items: string[]): string {
  return items.map((item) => `- ${inline(item)}`).join("\n")
}

function pageTitle(title: string, personName: string): string {
  return title === personName ? title : `${title} — ${personName}`
}

function document({
  lang,
  page,
  title,
  headingText,
  sections,
}: {
  lang: Locale
  page: PageId
  title: string
  headingText: string
  sections: string[]
}): string {
  return [
    renderFrontmatter({
      title,
      canonical: absoluteUrl(pathFor(page, lang)),
      lang: inLanguage(lang),
      summary: pageDescription(lang, page),
    }),
    "",
    `# ${inline(headingText)}`,
    "",
    ...sections,
    "",
  ].join("\n")
}

async function homeBody(lang: Locale): Promise<string> {
  const t = useTranslations(lang)
  const label = extras[lang]
  const projects = await projectsFor(lang)
  const latest = roles[0]
  if (!latest) throw new Error("No roles to render")

  return document({
    lang,
    page: "home",
    title: person.name,
    headingText: pick(lang, home.title),
    sections: [
      `> ${inline(pick(lang, home.lead))}`,
      "",
      inline(pick(lang, home.secondary)),
      "",
      `## ${label.stats}`,
      "",
      ...proof.map((item) => `- **${item.value}** — ${inline(pick(lang, item.label))}`),
      "",
      `## ${pick(lang, homeSections.workTitle)}`,
      "",
      ...projects.map(
        (project) =>
          `- [${inline(project.data.name)}](${absoluteUrl(pathFor("projects", lang))}#${project.data.id}): ${inline(project.data.tagline)}`,
      ),
      "",
      `## ${t("cv.experience")}`,
      "",
      `- **${inline(pick(lang, latest.title))}**, ${inline(latest.org)} (${latest.period}): ${inline(pick(lang, latest.summary))}`,
      "",
      `## ${t("cv.skills")}`,
      "",
      ...skillGroups.map(
        (group) =>
          `- **${inline(pick(lang, group.label))}**: ${group.items.map((item) => inline(pick(lang, item))).join("; ")}`,
      ),
      "",
      `## ${pick(lang, about.title)}`,
      "",
      ...about.paragraphs.flatMap((paragraph) => [inline(pick(lang, paragraph)), ""]),
      `> ${inline(pick(lang, about.quote))}`,
      "",
      `## ${t("nav.contact")}`,
      "",
      `${inline(pick(lang, contact.title))} ${inline(pick(lang, contact.body))}`,
      "",
      contactLink(lang),
    ],
  })
}

function contactLink(lang: Locale): string {
  return `[${pick(lang, contact.cta)}](${absoluteUrl(pathFor("contact", lang))})`
}

async function projectsBody(lang: Locale): Promise<string> {
  const t = useTranslations(lang)
  const label = extras[lang]
  const projects = await projectsFor(lang)

  return document({
    lang,
    page: "projects",
    title: pageTitle(t("projects.title"), person.name),
    headingText: t("projects.title"),
    sections: [
      inline(t("projects.intro")),
      "",
      ...projects.flatMap(({ data, body: source }) => [
        `## ${inline(data.name)}`,
        "",
        inline(data.tagline),
        "",
        inline(data.summary),
        "",
        ...(stripFrontmatter(source ?? "") ? [stripFrontmatter(source ?? "")] : []),
        bullets(data.highlights),
        "",
        `**${label.stack}:** ${data.stack.map(inline).join(", ")}`,
        "",
        `**${label.status}:** ${inline(data.status)}`,
        "",
        `**${label.links}:** ${data.links.map((link) => `[${link.label}](${link.href})`).join(", ")}`,
        "",
      ]),
    ],
  })
}

async function cvBody(lang: Locale): Promise<string> {
  const t = useTranslations(lang)
  const entry = await getEntry("cv", lang)
  if (!entry) throw new Error(`Missing CV content for ${lang}`)
  const label = extras[lang]
  const github = linkHref("github")
  const linkedin = linkHref("linkedin")

  return document({
    lang,
    page: "cv",
    title: pageTitle(t("cv.title"), person.name),
    headingText: t("cv.title"),
    sections: [
      `> ${inline(entry.data.headline)}`,
      "",
      inline(entry.data.location),
      "",
      [github && `GitHub: ${github}`, linkedin && `LinkedIn: ${linkedin}`]
        .filter(Boolean)
        .join(" · "),
      "",
      `## ${t("cv.profile")}`,
      "",
      stripFrontmatter(entry.body ?? ""),
      "",
      `## ${t("cv.experience")}`,
      "",
      ...pickById(roles, entry.data.roles, "cv.roles").flatMap((role) => [
        `### ${inline(pick(lang, role.title))} — ${inline(role.org)}`,
        "",
        ...(role.orgNote ? [inline(pick(lang, role.orgNote)), ""] : []),
        `${role.period} · ${inline(pick(lang, role.location))}`,
        "",
        inline(pick(lang, role.summary)),
        "",
        bullets(role.bullets.map((bullet) => pick(lang, bullet))),
        "",
      ]),
      `## ${t("cv.skills")}`,
      "",
      ...pickById(skillGroups, entry.data.skills, "cv.skills").map(
        (group) =>
          `- **${inline(pick(lang, group.label))}**: ${group.items.map((item) => inline(pick(lang, item))).join("; ")}`,
      ),
      "",
      `## ${t("cv.education")}`,
      "",
      ...education.map(
        (item) => `- **${inline(item.org)}** (${item.period}): ${inline(pick(lang, item.detail))}`,
      ),
      "",
      `## ${t("cv.certifications")}`,
      "",
      ...certifications.map(
        (item) => `- ${item.period ? `${item.period} — ` : ""}${inline(pick(lang, item.detail))}`,
      ),
      "",
      `## ${t("cv.languages")}`,
      "",
      ...languages.map(
        (item) => `- ${inline(pick(lang, item.name))}: ${inline(pick(lang, item.level))}`,
      ),
      "",
      `## ${t("cv.interests")}`,
      "",
      ...interests.map((item) => `- ${inline(pick(lang, item))}`),
      "",
      `## ${t("cv.bitcoin")}`,
      "",
      ...bitcoin.own.map((paragraph) => `- ${inline(pick(lang, paragraph))}`),
      "",
      ...bitcoin.events.map((event) => `- ${inline(pick(lang, event))}`),
      "",
      inline(t("cv.note")),
      "",
      `## ${t("nav.contact")}`,
      "",
      `${inline(pick(lang, contact.title))} ${inline(pick(lang, contact.body))}`,
      "",
      contactLink(lang),
    ],
  })
}

async function privacyBody(lang: Locale): Promise<string> {
  const entry = await getEntry("privacy", lang)
  if (!entry) throw new Error(`Missing privacy content for ${lang}`)

  return document({
    lang,
    page: "privacy",
    title: pageTitle(entry.data.title, person.name),
    headingText: entry.data.title,
    sections: [stripFrontmatter(entry.body ?? ""), "", entry.data.updated],
  })
}

function contactBody(lang: Locale): string {
  const t = useTranslations(lang)
  const name = import.meta.env.PUBLIC_CONTACT_NAME

  return document({
    lang,
    page: "contact",
    title: pageTitle(t("impressum.title"), person.name),
    headingText: t("impressum.title"),
    sections: [
      inline(t("impressum.notice")),
      "",
      `[§ 25 Mediengesetz (RIS)](https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000719&Paragraf=25)`,
      "",
      ...(name ? [`## ${t("impressum.owner")}`, "", name, ""] : []),
      contactLink(lang),
    ],
  })
}

export async function pageMarkdown(lang: Locale, page: PageId): Promise<string> {
  switch (page) {
    case "home":
      return homeBody(lang)
    case "projects":
      return projectsBody(lang)
    case "cv":
      return cvBody(lang)
    case "privacy":
      return privacyBody(lang)
    case "contact":
      return contactBody(lang)
    default:
      throw new Error(`No markdown twin for page "${page}"`)
  }
}
