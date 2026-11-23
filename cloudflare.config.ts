import { bindings, defineConfig } from "cf/config"

export default defineConfig({
  worker: {
    name: "website",
    compatibilityDate: "2026-11-22",
    domains: ["kroeppl.ch", "www.kroeppl.ch", "links.kroeppl.ch"],
    previewUrls: true,
    env: {
      TURNSTILE_SECRET_KEY: bindings.secret(),
      TELEGRAM_BOT_TOKEN: bindings.secret(),
      TELEGRAM_CHAT_ID: bindings.secret(),
    },
  },
})
