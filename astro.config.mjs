import { defineConfig } from "astro/config"
import cloudflare from "@astrojs/cloudflare"
import localizedRoutes from "astro-localized-routes"
import tailwindcss from "@tailwindcss/vite"
import { localizedRoutes as routes } from "./src/i18n/routes.ts"
import { revealOutlines } from "./integrations/reveals"

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [
    localizedRoutes({
      locales: ["de", "en"],
      defaultLocale: "de",
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
