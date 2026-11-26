const site = process.env.UNLIGHTHOUSE_SITE

if (!site) throw new Error("Set UNLIGHTHOUSE_SITE to the preview Worker URL")

export default {
  site,
  scanner: {
    device: "mobile",
    sitemap: false,
    ignoreI18nPages: false,
    maxRoutes: 100,
    samples: 1,
  },
  lighthouseOptions: {
    onlyCategories: ["performance", "accessibility", "best-practices"],
  },
}
