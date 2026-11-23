export const languages = {
  de: "Deutsch",
  en: "English",
}

export const defaultLang = "de"

export const ui = {
  de: {
    "nav.home": "Start",
    "nav.impressum": "Impressum",
    "nav.privacy": "Datenschutz",
    "nav.switchLang": "Auf Englisch wechseln",
    "home.title": "Christoph Kröppl",
    "home.experience":
      "IT-Projektmanager und Team Lead mit über sechs Jahren in Softwareentwicklung, ERP und Infrastruktur. Als Geschäftsführer der georgischen Tochter eines deutschen mittelständischen Softwarehauses führte ich bis zu sieben Entwickler und lieferte eine Odoo-Migration über 500.000 € für einen österreichischen Telekom-Anbieter — bis heute in Produktion.",
    "home.approach":
      "Ich arbeite technisch: Linux, Docker, Windows Server und Odoo, vom Entwurf bis zum Betrieb. Zuletzt baute ich Tagesdosis.at allein mit Bun und Nuxt — und stellte es ein, als die Zahlen nicht aufgingen.",
    "impressum.title": "Impressum",
    "impressum.notice":
      "Nicht-kommerzielle persönliche Website. Kleine Website im Sinne des § 25 Mediengesetz.",
    "contact.open": "Kontakt aufnehmen",
    "contact.title": "Kontakt",
    "contact.name": "Name",
    "contact.email": "E-Mail",
    "contact.phone": "Telefon",
    "contact.message": "Nachricht",
    "contact.send": "Senden",
    "contact.close": "Schließen",
    "contact.sending": "Wird gesendet...",
    "contact.messageHint": "Mindestens 30 Zeichen",
    "contact.success": "Nachricht gesendet. Danke!",
    "contact.error": "Fehler beim Senden. Bitte erneut versuchen.",
    "contact.turnstile": "Bitte bestätige, dass du ein Mensch bist.",
    "contact.reveal": "Kontaktdaten anzeigen",
    "privacy.title": "Datenschutz",
  },
  en: {
    "nav.home": "Home",
    "nav.impressum": "Contact",
    "nav.privacy": "Privacy",
    "nav.switchLang": "Switch to German",
    "home.title": "Christoph Kröppl",
    "home.experience":
      "IT project manager and team lead with 6+ years in software delivery, ERP and infrastructure. As managing director of the Georgian subsidiary or a German medium-sized software company I led up to seven developers and delivered a €500,000 Odoo migration for an Austrian telecom — still in production today.",
    "home.approach":
      "I work from a technical base: Linux, Docker, Windows Server and Odoo, from design to operations. Most recently I built Tagesdosis.at solo on Bun and Nuxt — and shut it down when the numbers didn't add up.",
    "impressum.title": "Legal notice",
    "impressum.notice":
      "Non-commercial personal website. Small-site disclosure under § 25 Mediengesetz (Austrian Media Act).",
    "contact.open": "Get in touch",
    "contact.title": "Contact",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.message": "Message",
    "contact.send": "Send",
    "contact.close": "Close",
    "contact.sending": "Sending...",
    "contact.messageHint": "At least 30 characters",
    "contact.success": "Message sent. Thank you!",
    "contact.error": "Failed to send. Please try again.",
    "contact.turnstile": "Please confirm you are human.",
    "contact.reveal": "Show contact details",
    "privacy.title": "Privacy",
  },
} as const

export type Locale = keyof typeof ui
export type TranslationKey = keyof (typeof ui)[typeof defaultLang]

export function useTranslations(lang: Locale) {
  return function t(key: TranslationKey) {
    const localizedUI = ui[lang] as Record<string, string>
    return key in localizedUI ? localizedUI[key] : ui[defaultLang][key]
  }
}
