export const languages = {
  de: "Deutsch",
  en: "English",
}

export const defaultLang = "de"
export const showDefaultLang = false

export const routes = {
  en: {
    impressum: "contact",
    datenschutz: "privacy",
  },
}

export const ui = {
  de: {
    "nav.home": "Start",
    "nav.impressum": "Impressum",
    "nav.privacy": "Datenschutz",
    "home.title": "Willkommen",
    "home.body":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
    "contact.sending": "Wird gesendet...",
    "contact.success": "Nachricht gesendet. Danke!",
    "contact.error": "Fehler beim Senden. Bitte erneut versuchen.",
    "contact.turnstile": "Bitte bestätige, dass du ein Mensch bist.",
    "contact.reveal": "Kontaktdaten anzeigen",
    "reveal.unavailable": "Kontaktdaten konnten nicht geladen werden.",
    "privacy.title": "Datenschutz",
  },
  en: {
    "nav.home": "Home",
    "nav.impressum": "Contact",
    "nav.privacy": "Privacy",
    "home.title": "Welcome",
    "home.body":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
    "contact.sending": "Sending...",
    "contact.success": "Message sent. Thank you!",
    "contact.error": "Failed to send. Please try again.",
    "contact.turnstile": "Please confirm you are human.",
    "contact.reveal": "Show contact details",
    "reveal.unavailable": "Contact details could not be loaded.",
    "privacy.title": "Privacy",
  },
} as const

export type Locale = keyof typeof ui
export type TranslationKey = keyof (typeof ui)[typeof defaultLang]

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/")
  if (lang in ui) return lang as Locale
  return defaultLang
}

export function useTranslations(lang: Locale) {
  return function t(key: TranslationKey) {
    const localizedUI = ui[lang] as Record<string, string>
    return key in localizedUI ? localizedUI[key] : ui[defaultLang][key]
  }
}

export function useTranslatedPath(lang: Locale) {
  return function translatePath(path: string, l: string = lang) {
    const pathName = path.replaceAll("/", "")
    const routeMap = l !== defaultLang && l in routes ? routes[l as keyof typeof routes] : undefined
    const translatedPath =
      routeMap && pathName in routeMap ? "/" + (routeMap as Record<string, string>)[pathName] : path
    return !showDefaultLang && l === defaultLang ? translatedPath : `/${l}${translatedPath}`
  }
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname
  const parts = pathname?.split("/")
  const path = parts.pop() || parts.pop()
  if (path === undefined) return undefined
  const currentLang = getLangFromUrl(url)
  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0] as Record<string, string>
    return route[path]
  }
  const getKeyByValue = (obj: Record<string, string>, value: string) =>
    Object.keys(obj).find((key) => obj[key] === value)
  const reversedKey = getKeyByValue(routes[currentLang], path)
  if (reversedKey !== undefined) return reversedKey
  return undefined
}
