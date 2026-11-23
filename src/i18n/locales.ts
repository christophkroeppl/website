export const locales = ["de", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale = "de" satisfies Locale

export const languages = {
  de: "Deutsch",
  en: "English",
} satisfies Record<Locale, string>

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
