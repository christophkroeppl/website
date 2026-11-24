import type { Bilingual } from "./types"

export type SkillGroup = {
  id: string
  label: Bilingual
  items: Bilingual[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: "erp",
    label: { de: "ERP & Unternehmenssoftware", en: "ERP & business software" },
    items: [
      {
        de: "Odoo (Experte) — Architektur, Migrationen 13→15, OCA-Module, Prozessdesign",
        en: "Odoo (expert) — architecture, 13→15 migrations, OCA modules, process design",
      },
      {
        de: "Microsoft Dynamics NAV / Navision — SLA-, Akquisitions- und Inventarverwaltung",
        en: "Microsoft Dynamics NAV / Navision — SLA, acquisition and inventory administration",
      },
      {
        de: "ConSol CM (BPM-Plattform) — Anforderungen und Anpassung",
        en: "ConSol CM (BPM platform) — requirements and customisation",
      },
      {
        de: "ERP-Änderungskalkulation aus historischen Daten und Heuristiken",
        en: "ERP change estimation from historical data and heuristics",
      },
    ],
  },
  {
    id: "languages",
    label: { de: "Sprachen & Laufzeiten", en: "Languages & runtimes" },
    items: [
      {
        de: "Bun / Node / Deno · Python · Rust · TypeScript / JavaScript · Kotlin · Groovy · C",
        en: "Bun / Node / Deno · Python · Rust · TypeScript / JavaScript · Kotlin · Groovy · C",
      },
      {
        de: "Bash · SQL · PostgreSQL",
        en: "Bash · SQL · PostgreSQL",
      },
    ],
  },
  {
    id: "frontend",
    label: { de: "Frontend & Produkt", en: "Frontend & product" },
    items: [
      {
        de: "Astro · Nuxt 4 · Vue · Tailwind CSS · Nuxt UI",
        en: "Astro · Nuxt 4 · Vue · Tailwind CSS · Nuxt UI",
      },
      {
        de: "Drizzle ORM · tRPC · BetterAuth · i18n · REST-API-Design",
        en: "Drizzle ORM · tRPC · BetterAuth · i18n · REST API design",
      },
    ],
  },
  {
    id: "infrastructure",
    label: { de: "Infrastruktur & Betrieb", en: "Infrastructure & operations" },
    items: [
      {
        de: "Docker · Podman · Ubuntu / Debian / Arch / pop!_OS · BTRFS · LUKS",
        en: "Docker · Podman · Ubuntu / Debian / Arch / pop!_OS · BTRFS · LUKS",
      },
      {
        de: "Server-Administration — Active Directory, DNS, DHCP, Gruppenrichtlinien, Exchange",
        en: "Server administration — Active Directory, DNS, DHCP, Group Policies, Exchange",
      },
      {
        de: "Cloudflare Workers · Cloudflare Zero Trust",
        en: "Cloudflare Workers · Cloudflare Zero Trust",
      },
      {
        de: "Cisco Switching und Telefonie · Apache · OS-Deployment · CMDB",
        en: "Cisco switching and telephony · Apache · OS deployment · CMDB",
      },
    ],
  },
  {
    id: "ai",
    label: { de: "Agentic Engineering & KI", en: "Agentic engineering & AI" },
    items: [
      {
        de: "LLM-Anwendungen — Tool-Calling, Agent-Workflows und Evaluations-Harnesses",
        en: "LLM applications — tool calling, agent workflows and evaluation harnesses",
      },
      {
        de: "KI-Integration und Transformation bestehender Systeme und Prozesse",
        en: "AI integration and transformation of existing systems and processes",
      },
      {
        de: "AI-gestützte Entwicklung als Lieferpraxis — von der Idee bis zum Betrieb",
        en: "AI-assisted delivery as a practice — from idea to operations",
      },
    ],
  },
  {
    id: "delivery",
    label: { de: "Delivery & Methodik", en: "Delivery & practice" },
    items: [
      {
        de: "Anforderungsanalyse · Geschäftsprozessmodellierung · agiles Scheduling und Monitoring",
        en: "Requirements analysis · business process modelling · agile scheduling and monitoring",
      },
      {
        de: "Kostenkontrolle · technische und funktionale Abnahme · Eskalationsmanagement",
        en: "Cost control · technical and functional acceptance · escalation management",
      },
      {
        de: "Git / Git-Flow · GitHub · Bitbucket · Pull-Request-Review · Jira · OpenProject",
        en: "Git / Git-Flow · GitHub · Bitbucket · pull-request review · Jira · OpenProject",
      },
      {
        de: "SLA- und Service-Management · B2B- und B2C-Lieferung",
        en: "SLA and service management · B2B and B2C delivery",
      },
    ],
  },
]

export const programmingLanguages: Set<string> = new Set([
  "Bash",
  "C",
  "Go",
  "Groovy",
  "JavaScript",
  "Kotlin",
  "Python",
  "Rust",
  "SQL",
  "TypeScript",
])

export const education: { period: string; org: string; detail: Bilingual }[] = [
  {
    period: "09/2019 – 04/2021",
    org: "FH Technikum Wien",
    detail: {
      de: "Informations- und Kommunikationstechnologien (berufsbegleitend) — studiert, kein Abschluss",
      en: "Information & Communication Technologies (part-time) — studied, no degree awarded",
    },
  },
  {
    period: "03/2017",
    org: "WKO Wien",
    detail: {
      de: "Lehrabschlussprüfung „Informationstechnologie-Technik“ — mit gutem Erfolg bestanden",
      en: "Apprenticeship final exam “Information Technology Engineering” — passed with good success",
    },
  },
  {
    period: "10/2013 – 10/2016",
    org: "TU Wien",
    detail: {
      de: "Maschinenbau — studiert, kein Abschluss",
      en: "Mechanical Engineering — studied, no degree awarded",
    },
  },
  {
    period: "09/2005 – 10/2013",
    org: "AHS Maroltingergasse",
    detail: {
      de: "Sprachzweig, Matura",
      en: "Language branch, school-leaving certificate (Matura)",
    },
  },
]

export const certifications: { period: string; detail: Bilingual }[] = [
  {
    period: "01/2019",
    detail: {
      de: "Apache-Webserver-Workshop — tecTrain, Wien",
      en: "Apache Web Server workshop — tecTrain, Vienna",
    },
  },
  {
    period: "09/2017",
    detail: {
      de: "Grundlagen der Linux-Administration — Wifi Wien",
      en: "Linux Administration fundamentals — Wifi Wien",
    },
  },
  {
    period: "",
    detail: {
      de: "Projektmanagement-Methodik (IPMA-Standard) — TU Wien",
      en: "Project management methodology (IPMA standard) — TU Wien",
    },
  },
]

export const languages: { code: "de" | "en" | "fr"; name: Bilingual; level: Bilingual }[] = [
  {
    code: "de",
    name: { de: "Deutsch", en: "German" },
    level: { de: "Muttersprache", en: "Native" },
  },
  {
    code: "en",
    name: { de: "Englisch", en: "English" },
    level: { de: "Fließend — C1, verhandlungssicher", en: "Fluent — C1, negotiation-fluent" },
  },
  {
    code: "fr",
    name: { de: "Französisch", en: "French" },
    level: { de: "Grundkenntnisse", en: "Basic" },
  },
]

export const interests: Bilingual[] = [
  { de: "3D-Druck (FFF/FDM)", en: "3D printing (FFF/FDM)" },
  { de: "Gitarre", en: "Guitar" },
  { de: "Lateinamerikanische Tänze", en: "Latin dance" },
  {
    de: "Österreichische Schule der Nationalökonomie",
    en: "Austrian School of Economics",
  },
]

export const bitcoin = {
  own: [
    {
      de: "Ich betreibe meinen eigenen Bitcoin-Knots-Knoten und verwahre meine Coins selbst — keine fremde Partei hält die Schlüssel.",
      en: "I run my own Bitcoin Knots node and self-custody my own coins — no third party holds the keys.",
    },
    {
      de: "Praktisches Wissen über den EU-Kryptorahmen: MiCA, CASP-Abgrenzung, Travel Rule, AML und DORA — einschließlich Erwägungsgrund 83, der nicht-verwahrende Wallet-Software aus MiCA heraushält.",
      en: "Working knowledge of the EU crypto framework: MiCA, the CASP boundary, the Travel Rule, AML and DORA — including recital 83, which keeps non-custodial wallet software outside MiCA.",
    },
  ] satisfies Bilingual[],
  events: [
    {
      de: "BTC Prague 2023, 2024 und 2025 — Europas größte Bitcoin-only-Konferenz.",
      en: "BTC Prague 2023, 2024 and 2025 — Europe's largest Bitcoin-only conference.",
    },
    {
      de: "BTC22 Bitcoin Conference, Innsbruck — September 2022.",
      en: "BTC22 Bitcoin Conference, Innsbruck — September 2022.",
    },
  ] satisfies Bilingual[],
}
