import { pick } from "../content/types"
import { about, homeSections } from "../content/site"
import type { Locale } from "../i18n/locales"
import { useTranslations } from "../i18n/ui"
import { renderEntry } from "./content"
import { homePageData } from "./page-data"
import { stripFrontmatter } from "./text"

export async function homeComposition(lang: Locale) {
  const { entry, home, projects, skills, contact, latest } = await homePageData(lang)
  const t = useTranslations(lang)

  return {
    home,
    projects,
    skills,
    contact,
    latest,
    paragraphs: stripFrontmatter(entry.body ?? "").split(/\n\s*\n/),
    Content: (await renderEntry(entry)).Content,
    titles: {
      work: home.workTitle,
      experience: `${latest.data.title} · ${latest.data.org}`,
      experienceHeading: t("cv.experience"),
      skills: pick(lang, homeSections.skillsTitle),
      about: home.aboutTitle,
      stats: t("md.stats"),
      eyebrowWork: pick(lang, homeSections.workEyebrow),
      eyebrowExperience: pick(lang, homeSections.experienceEyebrow),
      eyebrowSkills: pick(lang, homeSections.skillsIntro),
      skillsEyebrow: pick(lang, homeSections.skillsEyebrow),
      eyebrowAbout: pick(lang, about.eyebrow),
    },
  }
}
