---
locale: de
id: oc-go-usage-display
order: 1
name: oc-go-usage-display
tagline: Dein Go-Kontingent, dort wo du hinsiehst.
summary: "Ein Plugin für OpenCode und Kilo: das go_usage-Tool, eine Sidebar und die Statusline zeigen das 5-Stunden-, 7-Tage- und 30-Tage-Fenster inklusive Reset-Zeit. Ein npm-Paket, alle Bundles auf einem Versionsstand."
stack:
  - TypeScript
  - Node ≥22
  - OpenCode plugin API
  - npm
status: Öffentlich · MIT · npm 2.1.0
license: MIT
links:
  - label: GitHub
    href: https://github.com/christophkroeppl/oc-go-usage-display
  - label: npm
    href: https://www.npmjs.com/package/oc-go-usage-display
highlights:
  - Funktioniert als Server-Tool und als TUI-Oberfläche.
  - "Ein npm-Paket; der Build scheitert, wenn ein Bundle fehlt."
  - Das Installationsskript registriert beide Hosts.
  - Liest den Auth-Store des jeweiligen Hosts.
artifact:
  kind: compare
  before: /generated/projects/oc-go/opencode.webp
  after: /generated/projects/oc-go/kilo.webp
  beforeLabel: OpenCode
  afterLabel: Kilo
  caption: "OpenCode und Kilo im Vergleich: dasselbe Plugin, zwei Hosts."
  aspect: "16/10"
  orientation: vertical
---

Das Plugin liest den Auth-Store des jeweiligen Hosts und liefert dieselbe Zahl an drei Stellen: als Werkzeug für den Agenten, als Sidebar für den Menschen und als Statusline, die beim Tippen sichtbar bleibt. Es gibt keine zweite Quelle der Wahrheit und keine Konfiguration, die auseinanderlaufen kann.

Der Build scheitert, wenn ein Bundle fehlt. Das klingt kleinlich, ist aber der Grund, warum die Installation auf beiden Hosts funktioniert, ohne dass jemand eine Datei von Hand kopiert. Version 2.1.0 ist auf npm veröffentlicht.
