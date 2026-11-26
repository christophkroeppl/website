import { defineConfig, fontProviders } from "astro/config"
import cloudflare from "@astrojs/cloudflare"
import localizedRoutes from "astro-localized-routes"
import tailwindcss from "@tailwindcss/vite"
import { defaultLocale, locales } from "./src/i18n/config.ts"
import { localizedRoutes as routes } from "./src/i18n/routes.ts"
import { projectMedia } from "./integrations/project-media"
import { revealOutlines } from "./integrations/reveals"
import { links } from "./integrations/links"
import { ogImages } from "./integrations/og-images"
import { siteUrl } from "./src/content/site.ts"

export default defineConfig({
  site: siteUrl,
  output: "server",
  session: false,
  trailingSlash: "always",
  adapter: cloudflare(),
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/inter-latin-var.woff2"],
          },
        ],
      },
    },
  ],
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
  prefetch: false,
  vite: {
    define: { __BUILD_TIME__: JSON.stringify(new Date().toISOString()) },
    plugins: [tailwindcss()],
  },
})
