import { getEntry } from "astro:content"
import { person } from "../content/site"
import { pathFor, type PageId } from "../i18n/routes"
import type { Locale } from "../i18n/locales"
import { useTranslations } from "../i18n/ui"
import { linkHref } from "../links/urls"
import {
  contactFor,
  descriptionFor,
  homeFor,
  pickById,
  projectsFor,
  rolesFor,
  skillsFor,
} from "./content"
import { formatPageTitle, inLanguage } from "./seo"
import { inline, renderFrontmatter, stripFrontmatter } from "./text"
import { absoluteUrl } from "./urls"

function bullets(items: string[]): string {
  return items.map((item) => `- ${inline(item)}`).join("\n")
}

async function document({
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
}): Promise<string> {
  return [
    renderFrontmatter({
      title,
      canonical: absoluteUrl(pathFor(page, lang)),
      lang: inLanguage(lang),
      summary: await descriptionFor(lang, page),
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
  const projects = await projectsFor(lang)
  const roles = await rolesFor(lang)
  const skills = await skillsFor(lang)
  const entry = await homeFor(lang)
  const home = entry.data
  const contact = (await contactFor(lang)).data
  const paragraphs = stripFrontmatter(entry.body ?? "").split(/\n\s*\n/)
  const latest = roles[0]
  if (!latest) throw new Error("No roles to render")

  return document({
    lang,
    page: "home",
    title: person.name,
    headingText: home.title,
    sections: [
      `> ${inline(home.lead)}`,
      "",
      inline(home.secondary),
      "",
      `## ${t("md.stats")}`,
      "",
      ...home.proof.map((item) => `- **${item.value}** — ${inline(item.label)}`),
      "",
      `## ${home.workTitle}`,
      "",
      ...projects.map(
        (project) =>
          `- [${inline(project.data.name)}](${absoluteUrl(pathFor("projects", lang))}#${project.data.id}): ${inline(project.data.tagline)}`,
      ),
      "",
      `## ${t("cv.experience")}`,
      "",
      `- **${inline(latest.data.title)}**, ${inline(latest.data.org)} (${latest.data.period}): ${inline(latest.data.summary)}`,
      "",
      `## ${t("cv.skills")}`,
      "",
      ...skills.map(
        (group) =>
          `- **${inline(group.data.label)}**: ${group.data.items.map((item) => inline(item)).join("; ")}`,
      ),
      "",
      `## ${home.aboutTitle}`,
      "",
      ...paragraphs.flatMap((paragraph) => [inline(paragraph), ""]),
      `> ${inline(home.aboutQuote)}`,
      "",
      `## ${t("nav.contact")}`,
      "",
      `${inline(contact.title)} ${inline(contact.body)}`,
      "",
      await contactLink(lang),
    ],
  })
}

async function contactLink(lang: Locale): Promise<string> {
  const contact = (await contactFor(lang)).data
  return `[${contact.cta}](${absoluteUrl(pathFor("contact", lang))})`
}

async function projectsBody(lang: Locale): Promise<string> {
  const t = useTranslations(lang)
  const projects = await projectsFor(lang)

  return document({
    lang,
    page: "projects",
    title: formatPageTitle(t("projects.title")),
    headingText: t("projects.title"),
    sections: [
      inline(t("projects.intro")),
      "",
      ...projects.flatMap(({ data, body: source }) => {
        const body = stripFrontmatter(source ?? "")
        return [
          `## ${inline(data.name)}`,
          "",
          inline(data.tagline),
          "",
          inline(data.summary),
          "",
          ...(body ? [body] : []),
          bullets(data.highlights),
          "",
          `**${t("md.stack")}:** ${data.stack.map(inline).join(", ")}`,
          "",
          `**${t("md.status")}:** ${inline(data.status)}`,
          "",
          `**${t("md.links")}:** ${data.links.map((link) => `[${link.label}](${link.href})`).join(", ")}`,
          "",
        ]
      }),
    ],
  })
}

async function cvBody(lang: Locale): Promise<string> {
  const t = useTranslations(lang)
  const entry = await getEntry("cv", lang)
  if (!entry) throw new Error(`Missing CV content for ${lang}`)
  const roles = await rolesFor(lang)
  const skills = await skillsFor(lang)
  const github = linkHref("github")
  const linkedin = linkHref("linkedin")
  const contact = (await contactFor(lang)).data

  return document({
    lang,
    page: "cv",
    title: formatPageTitle(t("cv.title")),
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
        `### ${inline(role.data.title)} — ${inline(role.data.org)}`,
        "",
        ...(role.data.orgNote ? [inline(role.data.orgNote), ""] : []),
        `${role.data.period} · ${inline(role.data.location)}`,
        "",
        inline(role.data.summary),
        "",
        bullets(role.data.bullets),
        "",
      ]),
      `## ${t("cv.skills")}`,
      "",
      ...pickById(skills, entry.data.skills, "cv.skills").map(
        (group) =>
          `- **${inline(group.data.label)}**: ${group.data.items.map((item) => inline(item)).join("; ")}`,
      ),
      "",
      `## ${t("cv.education")}`,
      "",
      ...entry.data.education.map(
        (item) => `- **${inline(item.org)}** (${item.period}): ${inline(item.detail)}`,
      ),
      "",
      `## ${t("cv.certifications")}`,
      "",
      ...entry.data.certifications.map(
        (item) => `- ${item.period ? `${item.period} — ` : ""}${inline(item.detail)}`,
      ),
      "",
      `## ${t("cv.languages")}`,
      "",
      ...entry.data.languages.map((item) => `- ${inline(item.name)}: ${inline(item.level)}`),
      "",
      `## ${t("cv.interests")}`,
      "",
      ...entry.data.interests.map((item) => `- ${inline(item)}`),
      "",
      `## ${t("cv.bitcoin")}`,
      "",
      ...entry.data.bitcoin.own.map((paragraph) => `- ${inline(paragraph)}`),
      "",
      ...entry.data.bitcoin.events.map((event) => `- ${inline(event)}`),
      "",
      inline(t("cv.note")),
      "",
      `## ${t("nav.contact")}`,
      "",
      `${inline(contact.title)} ${inline(contact.body)}`,
      "",
      await contactLink(lang),
    ],
  })
}

async function privacyBody(lang: Locale): Promise<string> {
  const entry = await getEntry("privacy", lang)
  if (!entry) throw new Error(`Missing privacy content for ${lang}`)

  return document({
    lang,
    page: "privacy",
    title: formatPageTitle(entry.data.title),
    headingText: entry.data.title,
    sections: [stripFrontmatter(entry.body ?? ""), "", entry.data.updated],
  })
}

async function contactBody(lang: Locale): Promise<string> {
  const t = useTranslations(lang)
  const name = import.meta.env.PUBLIC_CONTACT_NAME

  return document({
    lang,
    page: "contact",
    title: formatPageTitle(t("impressum.title")),
    headingText: t("impressum.title"),
    sections: [
      inline(t("impressum.notice")),
      "",
      `[§ 25 Mediengesetz (RIS)](https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000719&Paragraf=25)`,
      "",
      ...(name ? [`## ${t("impressum.owner")}`, "", name, ""] : []),
      await contactLink(lang),
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
