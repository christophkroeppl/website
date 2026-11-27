---
order: 4
name: kroeppl.ch
tagline: "Astro auf Edge-Server – optimiert für SEO & AEO."
summary: "On-Demand-Cloudflare-Worker, gebaut mit dem cf-CLI; Formatierung, Checks und Tests laufen über vite-plus. de/en-Zod-Collections speisen Routen, JSON-LD, Sitemap, Markdown-Spiegel und llms.txt. Integrationen erzeugen Social-Cards, Konturen und Diagramme aus gepinnten Commit-SHAs. Middleware hält das einzige mailto auf einer noindexierten links-Subdomain; das Kontaktformular prüft Turnstile vor dem Versand an Telegram."
stack:
  - Astro
  - TypeScript
  - Cloudflare Workers
  - Tailwind CSS
  - Markdown + Zod
  - cf cli & vite+
status: Öffentlich
license: MIT
links:
  - label: GitHub
    href: https://github.com/christophkroeppl/website
  - label: Website
    href: https://kroeppl.ch
highlights:
  - Deployment über Cloudflares neues cf-CLI, während vite-plus Formatierung, Tests und Linting vereinheitlicht.
  - Zweisprachige Zod-Kollektionen versorgen Routen, JSON-LD-Graphen, llms.txt und Markdown-Spiegel mit makellosem 100%-Lighthouse-Score.
  - Integrations erzeugen Social-Cards, Konturen und Architekturdiagramme aus gepinnten Commit-SHAs direkt beim Build.
  - Middleware isoliert Mailto-Links unter noindex, während Kontaktformulare nach Turnstile-Prüfung an Telegram senden.
artifact:
  kind: html
  src: /generated/projects/kroeppl-ch.html
  title: kroeppl.ch architecture
  aspect: "1160 / 972"
---

Die Site ist ein On-Demand-Worker, gebaut und deployt mit cf; Formatierung, Checks und Tests laufen über vite-plus. Inhalte sind in de/en-Zod-Collections strukturiert, Bilder und Diagramme entstehen zur Buildzeit aus gepinnten Commits statt zur Laufzeit.

SEO-Ausgaben — kanonische URLs, JSON-LD, Sitemap, Markdown und llms.txt — kommen aus denselben Collections. Kontaktdaten sind bewusst schwer crawlbar: das einzige mailto liegt auf einer noindexierten links-Subdomain, und das indexierte Formular prüft Turnstile, bevor es an Telegram sendet.
