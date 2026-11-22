import { ui, type Locale } from "../i18n/ui"

export type RevealEnv = Readonly<Record<string, string | undefined>>

export function splitAddress(address: string): string[] {
  return address
    .split(/,\s*/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function contactLines(env: RevealEnv, lang: Locale): string[] {
  const lines = splitAddress(env.CONTACT_ADDRESS ?? "")
  const email = env.CONTACT_EMAIL?.trim()
  const phone = env.CONTACT_PHONE?.trim()
  if (email) lines.push(`${ui[lang]["contact.email"]}: ${email}`)
  if (phone) lines.push(`${ui[lang]["contact.phone"]}: ${phone}`)
  return lines
}
