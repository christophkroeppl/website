import { defineConfig } from "astro/config"
import cloudflare from "@astrojs/cloudflare"
import tailwindcss from "@tailwindcss/vite"
import { revealOutlines } from "./integrations/reveals"

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [revealOutlines()],
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  prefetch: {
    defaultStrategy: "viewport",
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
