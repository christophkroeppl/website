import type { Locale } from "./locales"

const de = {
  "nav.home": "Start",
  "nav.impressum": "Impressum",
  "nav.privacy": "Datenschutz",
  "nav.contact": "Kontakt",
  "nav.language": "Sprache",
  "home.title": "Christoph Kröppl",
  "impressum.title": "Impressum",
  "impressum.owner": "Inhaber",
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
  "contact.privacyNote": "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben gemäß der",
  "contact.privacyLink": "Datenschutzerklärung",
  "a11y.skip": "Zum Inhalt springen",
} as const

export type TranslationKey = keyof typeof de

export const ui = {
  de,
  en: {
    "nav.home": "Home",
    "nav.impressum": "Contact",
    "nav.privacy": "Privacy",
    "nav.contact": "Contact",
    "nav.language": "Language",
    "home.title": "Christoph Kröppl",
    "impressum.title": "Contact",
    "impressum.owner": "Proprietor",
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
    "contact.privacyNote":
      "By submitting, you agree to the processing of your data as described in the",
    "contact.privacyLink": "Privacy Policy",
    "a11y.skip": "Skip to content",
  },
} as const satisfies Record<Locale, Record<TranslationKey, string>>

export function useTranslations(lang: Locale) {
  return function t(key: TranslationKey) {
    return ui[lang][key]
  }
}
