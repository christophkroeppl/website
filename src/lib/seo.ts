import type { Locale } from "../i18n/locales"
import type { PageId } from "../i18n/routes"

export const siteUrl = "https://kroeppl.ch"

const descriptions: Record<PageId, Record<Locale, string>> = {
  home: {
    de: "Christoph Kröppl — IT-Projektmanager und Team Lead für Web, ERP und Infrastruktur. Odoo-Migrationen, resiliente Software und Betrieb.",
    en: "Christoph Kröppl — IT project manager and team lead for web, ERP and infrastructure. Odoo migrations, resilient software and operations.",
  },
  contact: {
    de: "Impressum und Kontaktdaten von Christoph Kröppl. Rechtliche Angaben, Inhaber und Kontaktformular auf kroeppl.ch.",
    en: "Legal notice and contact details for Christoph Kröppl. Legal information, proprietor and contact form on kroeppl.ch.",
  },
  cv: {
    de: "Lebenslauf von Christoph Kröppl: IT-Projektmanagement, Odoo ERP, Infrastruktur und Softwareentwicklung im Überblick.",
    en: "Christoph Kröppl's CV: IT project management, Odoo ERP, infrastructure and software delivery at a glance.",
  },
  projects: {
    de: "Open-Source-Projekte und ausgewählte Arbeiten von Christoph Kröppl: bases-mcp, guarden und oc-go-usage-display.",
    en: "Open-source projects and selected work by Christoph Kröppl: bases-mcp, guarden and oc-go-usage-display.",
  },
  privacy: {
    de: "Datenschutzerklärung von kroeppl.ch: Hosting, Kontaktformular, Telegram und Ihre Rechte nach DSGVO.",
    en: "Privacy policy for kroeppl.ch: hosting, contact form, Telegram and your rights under the GDPR.",
  },
}

export function pageDescription(lang: Locale, page: PageId): string {
  return descriptions[page][lang]
}

export function inLanguage(lang: Locale): string {
  return lang === "de" ? "de-AT" : "en"
}
