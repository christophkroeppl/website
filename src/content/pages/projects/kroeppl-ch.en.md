---
order: 4
name: kroeppl.ch
tagline: "Astro on edge server – fully SEO & AEO optimized."
summary: "On-demand Cloudflare worker built with the cf CLI; formatting, checks and tests run through vite-plus. de/en Zod collections feed routes, JSON-LD, sitemap, Markdown mirrors and llms.txt. Integrations generate social cards, reveal outlines and diagrams from pinned commit SHAs. Middleware keeps the only mailto on a noindexed links subdomain; the contact form verifies Turnstile before sending to Telegram."
stack:
  - Astro
  - TypeScript
  - Cloudflare Workers
  - Tailwind CSS
  - Markdown + Zod
  - cf cli & vite+
status: Public
license: MIT
links:
  - label: GitHub
    href: https://github.com/christophkroeppl/website
  - label: Website
    href: https://kroeppl.ch
highlights:
  - Built on vite-plus tooling and deployed as an on-demand Cloudflare Worker via the new cf CLI.
  - Bilingual Zod collections feed routes, JSON-LD graphs, full-text llms.txt, and markdown mirrors scoring 100% on Lighthouse.
  - Integrations bake social cards, reveal outlines, and diagrams from pinned commit SHAs during build.
  - Middleware isolates mailto links under noindex, and contact forms verify Turnstile before alerting Telegram.
artifact:
  kind: html
  src: /generated/projects/kroeppl-ch.html
  title: kroeppl.ch architecture
  aspect: "1160 / 972"
---

The site is an on-demand Worker, built and deployed with cf; formatting, checks and tests run through vite-plus. Content is structured in de/en Zod collections, and images and diagrams come from pinned commits at build time rather than a runtime fetch.

SEO output — canonical URLs, JSON-LD, sitemap, Markdown and llms.txt — is generated from the same collections. Contact details are deliberately hard to crawl: the only mailto lives on a noindexed links subdomain, and the indexed form checks Turnstile before sending to Telegram.
