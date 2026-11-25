---
locale: de
id: kroeppl-ch
order: 4
name: kroeppl.ch
tagline: "Persönlicher Edge-Dienst mit strikter Trennung von Build und Laufzeit."
summary: "Die vite-plus (`vp`)-Toolchain steuert Package-Skripte, Formatierung, Checks und Tests, während das Deployment über Cloudflares brandneues `cf`-CLI (`cf build`, `cf deploy`, `cf previews deploy`) einen perfekten 100%-Google-Lighthouse-Score erzielt. SEO/AEO-first-Ausgaben liefern kanonische URLs, strukturierte Daten, Sitemap, Markdown sowie llms.txt/llms-full.txt-Varianten, während Kontaktdaten schwer crawlbar bleiben: Das einzige mailto liegt auf der Noindex-Links-Subdomain, und die crawl-bare Seite nutzt ein Turnstile-verifiziertes Formular mit Weiterleitung über einen Telegram-Bot."
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

Ein On-Demand Astro Worker bedient die Site über vite-plus-Skripte und das neue cf CLI. Sämtliche Inhalte sind in de/en Zod-Collections strukturiert, während externe Assets und Diagramme zur Buildzeit aus gepinnten Commits erzeugt werden, anstatt sie zur Laufzeit abzurufen.

Strukturierte SEO- und AEO-Ausgaben untermauern den 100% Lighthouse-Score auf allen Routen. Die noindexierte links-Subdomain hält mailto schwer crawlbar, während das Turnstile-verifizierte Formular eingehende Nachrichten direkt an Telegram weiterleitet.
