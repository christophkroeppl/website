import { getEntry } from "astro:content"
import { person } from "../content/site"
import { pathFor, type PageId } from "../i18n/routes"
import type { Locale } from "../i18n/locales"
import { useTranslations } from "../i18n/ui"
import { linkHref } from "../links/urls"
import { contactFor, descriptionFor, projectsFor } from "./content"
import { cvPageData, homePageData } from "./page-data"
import { cvSections } from "./page-sections"
import { RIS_MEDIA_LAW_LABEL, RIS_MEDIA_LAW_URL } from "./page-facts"
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
  const { entry, home, projects, skills, latest } = await homePageData(lang)
  const paragraphs = stripFrontmatter(entry.body ?? "").split(/\n\s*\n/)

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
      ...(await contactSection(lang)),
    ],
  })
}

async function contactLink(lang: Locale): Promise<string> {
  const contact = (await contactFor(lang)).data
  return `[${contact.cta}](${absoluteUrl(pathFor("contact", lang))})`
}

async function contactSection(lang: Locale): Promise<string[]> {
  const t = useTranslations(lang)
  const contact = (await contactFor(lang)).data
  return [
    `## ${t("nav.contact")}`,
    "",
    `${inline(contact.title)} ${inline(contact.body)}`,
    "",
    await contactLink(lang),
  ]
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

function cvSectionMarkdown(
  section: (typeof cvSections)[number],
  data: Awaited<ReturnType<typeof cvPageData>>,
  t: ReturnType<typeof useTranslations>,
): string[] {
  const { entry, orderedRoles, orderedSkills } = data

  switch (section.key) {
    case "profile":
      return [`## ${t(section.titleKey)}`, "", stripFrontmatter(entry.body ?? ""), ""]
    case "experience":
      return [
        `## ${t(section.titleKey)}`,
        "",
        ...orderedRoles.flatMap((role) => [
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
      ]
    case "skills":
      return [
        `## ${t(section.titleKey)}`,
        "",
        ...orderedSkills.map(
          (group) =>
            `- **${inline(group.data.label)}**: ${group.data.items.map((item) => inline(item)).join("; ")}`,
        ),
        "",
      ]
    case "education":
      return [
        `## ${t(section.titleKey)}`,
        "",
        ...entry.data.education.map(
          (item) => `- **${inline(item.org)}** (${item.period}): ${inline(item.detail)}`,
        ),
        "",
      ]
    case "certifications":
      return [
        `## ${t(section.titleKey)}`,
        "",
        ...entry.data.certifications.map(
          (item) => `- ${item.period ? `${item.period} — ` : ""}${inline(item.detail)}`,
        ),
        "",
      ]
    case "languages":
      return [
        `## ${t(section.titleKey)}`,
        "",
        ...entry.data.languages.map((item) => `- ${inline(item.name)}: ${inline(item.level)}`),
        "",
        `## ${t("cv.interests")}`,
        "",
        ...entry.data.interests.map((item) => `- ${inline(item)}`),
        "",
      ]
    case "bitcoin":
      return [
        `## ${t(section.titleKey)}`,
        "",
        ...entry.data.bitcoin.own.map((paragraph) => `- ${inline(paragraph)}`),
        "",
        ...entry.data.bitcoin.events.map((event) => `- ${inline(event)}`),
        "",
        inline(t("cv.note")),
        "",
      ]
  }
}

async function cvBody(lang: Locale): Promise<string> {
  const t = useTranslations(lang)
  const { entry, roles, skills, orderedRoles, orderedSkills } = await cvPageData(lang)
  const github = linkHref("github")
  const linkedin = linkHref("linkedin")

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
      ...cvSections.flatMap((section) =>
        cvSectionMarkdown(section, { entry, roles, skills, orderedRoles, orderedSkills }, t),
      ),
      ...(await contactSection(lang)),
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
      `[${RIS_MEDIA_LAW_LABEL}](${RIS_MEDIA_LAW_URL})`,
      "",
      ...(name ? [`## ${t("impressum.owner")}`, "", name, ""] : []),
    ],
  })
}

export function pageMarkdown(lang: Locale, page: PageId): Promise<string> {
  const bodies: Record<PageId, (lang: Locale) => Promise<string>> = {
    home: homeBody,
    projects: projectsBody,
    cv: cvBody,
    privacy: privacyBody,
    contact: contactBody,
  }

  return bodies[page](lang)
}
