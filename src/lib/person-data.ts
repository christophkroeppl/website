import type { Locale } from "../i18n/locales"
import { cvFor, descriptionFor, rolesFor, skillsFor } from "./content"

export type PersonData = {
  knowsAbout: string[]
  knowsLanguage: string[]
  description: string
  employers: string[]
}

const cache = new Map<Locale, Promise<PersonData>>()

export function personData(lang: Locale): Promise<PersonData> {
  let pending = cache.get(lang)
  if (!pending) {
    pending = (async () => {
      const [skills, cv, roles, description] = await Promise.all([
        skillsFor(lang),
        cvFor(lang),
        rolesFor(lang),
        descriptionFor(lang, "home"),
      ])

      return {
        knowsAbout: skills.map((group) => group.data.label),
        knowsLanguage: cv.data.languages.map((language) => language.code),
        description,
        employers: [...new Set(roles.map((role) => role.data.org))],
      }
    })()
    cache.set(lang, pending)
  }

  return pending
}
