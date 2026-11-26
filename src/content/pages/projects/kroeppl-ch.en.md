---
order: 4
name: kroeppl.ch
tagline: "Personal web presence deployed as a hardened edge service."
summary: "The vite-plus (`vp`) toolchain drives package scripts, formatting, checks and tests, while deployment through Cloudflare's brand-new `cf` CLI (`cf build`, `cf deploy`, `cf previews deploy`) achieves a perfect 100% Google Lighthouse score. SEO/AEO-first output delivers canonical URLs, structured data, sitemap, Markdown and llms.txt/llms-full.txt variants, keeping contact details hard to crawl: the only mailto lives on the noindexed links subdomain, while the crawlable site uses a Turnstile-verified form forwarded through a Telegram bot."
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

An on-demand Astro Worker powers the site using vite-plus scripts and the new cf CLI. All content is structured in de/en Zod collections, while external assets and diagrams are baked at build time from pinned commits instead of being fetched at runtime.

Dedicated SEO/AEO outputs pair with the 100% Lighthouse score across all pages. A separate noindexed links subdomain keeps mailto hard to crawl, while the Turnstile-verified form forwards incoming inquiries directly to Telegram.
