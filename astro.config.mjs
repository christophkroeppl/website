import { defineConfig } from "astro/config"
import cloudflare from "@astrojs/cloudflare"
import localizedRoutes from "astro-localized-routes"
import tailwindcss from "@tailwindcss/vite"
import { defaultLocale, locales } from "./src/i18n/locales.ts"
import { localizedRoutes as routes } from "./src/i18n/routes.ts"
import { projectMedia } from "./integrations/project-media"
import { revealOutlines } from "./integrations/reveals"
import { links } from "./integrations/links"
import { ogImages } from "./integrations/og-images"
import { siteUrl } from "./src/lib/seo"

export default defineConfig({
  site: siteUrl,
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
    projectMedia(),
    revealOutlines(),
    links(),
    ogImages(),
  ],
  prefetch: {
    defaultStrategy: "viewport",
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
