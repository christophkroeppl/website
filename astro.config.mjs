import { defineConfig } from "astro/config"
import cloudflare from "@astrojs/cloudflare"
import localizedRoutes from "astro-localized-routes"
import tailwindcss from "@tailwindcss/vite"
import { defaultLocale, locales } from "./src/i18n/locales.ts"
import { localizedRoutes as routes } from "./src/i18n/routes.ts"
import { revealOutlines } from "./integrations/reveals"

export default defineConfig({
  output: "server",
  trailingSlash: "always",
  adapter: cloudflare(),
  integrations: [
    localizedRoutes({
      locales,
      defaultLocale,
      routes,
      removeOriginalPageRoutes: true,
    }),
    revealOutlines(),
  ],
  prefetch: {
    defaultStrategy: "viewport",
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
