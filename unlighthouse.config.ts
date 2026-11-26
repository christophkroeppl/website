import { siteUrl } from "./src/content/site.ts"

export default {
  site: siteUrl,
  scanner: {
    device: "mobile",
    sitemap: [new URL("/sitemap.xml", siteUrl).href],
    maxRoutes: 100,
    samples: 1,
  },
}
