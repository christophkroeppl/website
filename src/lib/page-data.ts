import type { Locale } from "../i18n/locales"
import { contactFor, cvFor, homeFor, pickById, projectsFor, rolesFor, skillsFor } from "./content"

export async function cvPageData(lang: Locale) {
  const entry = await cvFor(lang)
  const roles = await rolesFor(lang)
  const skills = await skillsFor(lang)

  return {
    entry,
    roles,
    skills,
    orderedRoles: pickById(roles, entry.data.roles, "cv.roles"),
    orderedSkills: pickById(skills, entry.data.skills, "cv.skills"),
  }
}

export async function homePageData(lang: Locale) {
  const entry = await homeFor(lang)
  const projects = await projectsFor(lang)
  const roles = await rolesFor(lang)
  const skills = await skillsFor(lang)
  const contact = (await contactFor(lang)).data
  const latest = roles[0]

  if (!latest) throw new Error("No roles to render")

  return { entry, home: entry.data, projects, roles, skills, contact, latest }
}
