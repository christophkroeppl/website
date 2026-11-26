import { bindings, defineConfig } from "cf/config"
import { siteHost } from "./src/content/site.ts"

export default defineConfig({
  worker: {
    name: "website",
    compatibilityDate: "2026-11-22",
    domains: [siteHost, `www.${siteHost}`, `links.${siteHost}`],
    previewUrls: true,
    env: {
      TURNSTILE_SECRET_KEY: bindings.secret(),
      TELEGRAM_BOT_TOKEN: bindings.secret(),
      TELEGRAM_CHAT_ID: bindings.secret(),
    },
  },
})
