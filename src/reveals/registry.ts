import type { Locale } from "../i18n/locales"
import type { TranslationKey } from "../i18n/ui"
import { contactLines, type RevealEnv } from "./contact"

export type Revealable = {
  label: TranslationKey
  lines: (env: RevealEnv, lang: Locale) => string[]
}

export const reveals = {
  contact: {
    label: "contact.reveal",
    lines: contactLines,
  },
} as const satisfies Record<string, Revealable>

export type RevealId = keyof typeof reveals
