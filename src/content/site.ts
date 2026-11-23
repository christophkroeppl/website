import type { Bilingual } from "./types"

const tagesdosisLink =
  '<a class="link link-hover" href="https://tagesdosis.at/" target="_blank" rel="noopener noreferrer">Tagesdosis.at</a>'

export const person = {
  name: "Christoph Kröppl",
}

export const home = {
  eyebrow: {
    de: "Remote, Wien, Österreich · IT-Projektmanagement, Web, ERP & Infrastruktur",
    en: "Remote, Vienna, Austria · IT project management, Web, ERP & infrastructure",
  } satisfies Bilingual,
  title: {
    de: "Resiliente Software, nach Maß.",
    en: "Software that stays in production.",
  } satisfies Bilingual,
  lead: {
    de: "IT-Projektmanager und Team Lead mit über sechs Jahren in Softwareentwicklung, ERP und Infrastruktur. Ich habe eine Odoo-Migration über 500.000 € für einen regionalen österreichischen Telekom-Anbieter verantwortet — sie läuft heute noch.",
    en: "IT project manager and team lead with 6+ years in software delivery, ERP and infrastructure. I owned a €500,000 Odoo migration for a regional telco provider in Austria — it is still in production.",
  } satisfies Bilingual,
  secondary: {
    de: `Ich arbeite technisch: TypeScript, Linux, Docker/Podman und Odoo, vom Entwurf bis zum Betrieb. Und ich baue selbst — zuletzt ${tagesdosisLink} mit Bun und Nuxt.`,
    en: `I work from a technical base: TypeScript, Linux, Docker/Podman and Odoo, from design to operations. And I build: most recently ${tagesdosisLink} on Bun and Nuxt.`,
  } satisfies Bilingual,
}

export const proof = [
  {
    value: "€500k",
    label: {
      de: "Odoo-Migration 13→15, architekturiert und geliefert — heute noch in Produktion.",
      en: "Odoo 13→15 migration, architected and delivered — still in production.",
    } satisfies Bilingual,
  },
  {
    value: "7",
    label: {
      de: "Entwickler eingestellt, auf Odoo ausgebildet und geführt.",
      en: "developers recruited, trained on Odoo and line-managed.",
    } satisfies Bilingual,
  },
  {
    value: "15",
    label: {
      de: "ERP-Migrationen und Features aus historischen Daten kalkuliert.",
      en: "ERP migrations and features estimated from historical data.",
    } satisfies Bilingual,
  },
  {
    value: "9",
    label: {
      de: "Odoo-Projekte persönlich verkauft, 5.000–500.000 €.",
      en: "Odoo projects sold personally, €5,000–€500,000.",
    } satisfies Bilingual,
  },
]

export const about = {
  eyebrow: {
    de: "Über mich",
    en: "About",
  } satisfies Bilingual,
  title: {
    de: "Wie ich arbeite",
    en: "How I work",
  } satisfies Bilingual,
  quote: {
    de: "Ich baue Dinge, die einfach laufen müssen.",
    en: "I build things that have to keep running.",
  } satisfies Bilingual,
  paragraphs: [
    {
      de: `Ich habe als Geschäftsführer eine georgische Softwarefirma für ihre deutsche Mutterfirma aufgebaut und geführt — Gründung, Büro, Infrastruktur und ein Team von bis zu sieben Entwicklern. In dieser Zeit habe ich eine Odoo-Migration über 500.000 € architekturiert, kalkuliert und bis zum Go-Live begleitet. Danach habe ich mich KI gewidmet und ${tagesdosisLink} gebaut.`,
      en: `As managing director I set up and ran a Georgian software company for its German parent — company formation, office, infrastructure and a team of up to seven developers. In that time I architected, estimated and delivered a €500,000 Odoo migration. Afterwards I dove head-first into AI and built ${tagesdosisLink} solo.`,
    },
    {
      de: "Ich arbeite am liebsten dort, wo Software nicht nur demonstriert, sondern betrieben wird: Anforderungen, Prozessdesign, Schätzung, Architektur, Abnahme und Betrieb. Kurze Meetings, kein BS.",
      en: "I work best where software is operated, not just demonstrated: requirements, process design, estimation, architecture, acceptance and operations. Short meetings, no BS.",
    },
  ] satisfies Bilingual[],
}

export const contact = {
  title: {
    de: "Bereit für den nächsten Auftrag.",
    en: "Open to the next project.",
  } satisfies Bilingual,
  body: {
    de: "Projektmanagement, ERP-Beratung und Infrastruktur — oder eine Kombination davon. Am schnellsten geht es über das Kontaktformular.",
    en: "Project management, ERP consulting and infrastructure — or a combination of them. The contact form is the fastest way in.",
  } satisfies Bilingual,
  cta: {
    de: "Kontakt aufnehmen",
    en: "Get in touch",
  } satisfies Bilingual,
}
