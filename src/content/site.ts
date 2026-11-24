import type { Bilingual } from "./types"

export const person = {
  name: "Christoph Kröppl",
  jobTitle: {
    de: "IT-Projektmanager und Team Lead",
    en: "IT project manager and team lead",
  } satisfies Bilingual,
  addressLocality: {
    de: "Wien",
    en: "Vienna",
  } satisfies Bilingual,
}

export const og = {
  subtitle: {
    de: "IT-Projektmanager & Odoo ERP · Wien",
    en: "IT project manager & Odoo ERP · Vienna",
  } satisfies Bilingual,
}
export const homeSections = {
  workEyebrow: { de: "01 · Arbeit", en: "01 · Work" } satisfies Bilingual,
  experienceEyebrow: { de: "02 · Werdegang", en: "02 · Track record" } satisfies Bilingual,
  skillsEyebrow: { de: "03 · Kenntnisse", en: "03 · Skills" } satisfies Bilingual,
  skillsTitle: { de: "Technische Kenntnisse", en: "Technical skills" } satisfies Bilingual,
  skillsIntro: {
    de: "Breite mit Tiefe an den Stellen, die zählen.",
    en: "Breadth, with depth where it matters.",
  } satisfies Bilingual,
}

export const about = {
  eyebrow: {
    de: "04 · Über mich",
    en: "04 · About",
  } satisfies Bilingual,
}
