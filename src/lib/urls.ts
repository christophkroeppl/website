import { siteUrl } from "./seo"

export function absoluteUrl(path: string, origin: URL | string = siteUrl): string {
  return new URL(path, origin).href
}
