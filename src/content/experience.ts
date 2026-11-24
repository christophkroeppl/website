import type { Bilingual } from "./types"

export type Role = {
  id: string
  org: string
  orgNote?: Bilingual
  title: Bilingual
  location: Bilingual
  period: string
  summary: Bilingual
  bullets: Bilingual[]
}

export const roles: Role[] = [
  {
    id: "hmg",
    org: "HMG Software LLC",
    orgNote: {
      de: "Georgische Tochtergesellschaft der Hucke Media GmbH & Co. KG",
      en: "Georgian subsidiary of Hucke Media GmbH & Co. KG",
    },
    title: {
      de: "Geschäftsführer",
      en: "Managing Director",
    },
    location: { de: "Tiflis, Georgien", en: "Tbilisi, Georgia" },
    period: "01/2023 – 05/2025",
    summary: {
      de: "Die georgische Tochter der Hucke Media aufgebaut und geführt: Gründung, Büro, IT-Infrastruktur, Systemadministration und ein Team von bis zu sieben Entwicklern. Europäische Kundenprojekte der Mutterfirma übernommen, eine Odoo-Migration über 500.000 € für einen regionalen österreichischen Telekom-Anbieter geliefert — und die Firma geordnet abgewickelt, als die Mutterfirma restrukturierte.",
      en: "Set up and ran Hucke Media's Georgian subsidiary: company formation, office, IT infrastructure, systems administration and a team of up to seven developers. Took over the parent's European client projects, delivered a €500,000 Odoo migration for a regional telco provider in Austria — then wound the company down cleanly when the parent restructured.",
    },
    bullets: [
      {
        de: "Odoo 13→15 Migration und Re-Architektur mit 3 Entwicklern über 2,5 Jahre umgesetzt — Architektur, Kalkulation, Arbeitspakete, Tickets und kritische Teile selbst gebaut. Produktiv gegangen und heute noch im Einsatz.",
        en: "Delivered the Odoo 13→15 migration and re-architecture with 3 developers over 2.5 years — architected, estimated, scoped, ticketed and built the critical parts. Went live and is still in production.",
      },
      {
        de: "Kunde: ein führender regionaler österreichischer Telekom- und ISP-Anbieter — Video-Streaming, Internet, Festnetz, Fiber, Hosting und Server. Alle diese Systeme speisten Odoo.",
        en: "Client: a leading regional Austrian telecom and ISP — video streaming, internet, landline, fiber, hosting and servers. All of these systems fed into Odoo.",
      },
      {
        de: "Eine komplexe, aus mehreren externen Quellen gespeiste Abrechnung neu entworfen, die Oberfläche verschlankt und synchrone Prozesse aus Odoo in n8n verlagert.",
        en: "Redesigned a complex billing process fed by multiple external sources, streamlined the UI, and moved synchronous processes out of Odoo into n8n.",
      },
      {
        de: "9 Odoo-Features und -Migrationen persönlich verkauft (5.000–35.000 € pro Feature; zwei Migrationen für 50.000 € und 500.000 €).",
        en: "Sold 9 Odoo features and migrations personally (€5,000–€35,000 per feature; two migrations at €50,000 and €500,000).",
      },
      {
        de: "Rund 15 weitere Migrationen und Features kalkuliert; internes Kalkulations-Tool aus historischen Daten und Heuristiken gebaut.",
        en: "Estimated roughly 15 further migrations and features; built internal estimation tooling from historical data and heuristics.",
      },
      {
        de: "Mitarbeiter-Laptops mit pop!_OS über ein Provisioning-Script ausgerollt — LUKS-Vollverschlüsselung, BTRFS mit Snapshot-Rollback.",
        en: "Deployed employee pop!_OS laptops from a single provisioning script — LUKS full-disk encryption, BTRFS with snapshot rollback.",
      },
    ],
  },
  {
    id: "hm",
    org: "Hucke Media GmbH & Co. KG",
    orgNote: {
      de: "Oldenburg, Deutschland — remote aus Wien, ab 10/2022 in Georgien",
      en: "Oldenburg, Germany — remote from Vienna, from 10/2022 based in Georgia",
    },
    title: {
      de: "IT-Projektmanager & Key Account Manager — Odoo ERP",
      en: "IT Project Manager & Key Account Manager — Odoo ERP",
    },
    location: { de: "Remote / Oldenburg", en: "Remote / Oldenburg" },
    period: "04/2022 – 01/2023",
    summary: {
      de: "Odoo-Projekte für Hucke-Media-Kunden — von Presales und Anforderungen über Architektur und Arbeitspakete bis zu agiler Planung, Kostenkontrolle, Abnahme und Eskalation. Den Key Account bis zur 500.000-€-Migration begleitet.",
      en: "Odoo projects for Hucke Media's clients — from pre-sales and requirements through architecture and work packages to agile planning, cost control, acceptance and escalation. Owned the key account into the €500,000 migration.",
    },
    bullets: [
      {
        de: "Beratung, Anforderungsanalyse und Presales für Odoo ERP, inklusive Upselling bestehender Kunden.",
        en: "Consulting, requirements analysis and pre-sales for Odoo ERP, including upselling existing accounts.",
      },
      {
        de: "Kritische Softwarekomponenten selbst umgesetzt.",
        en: "Implemented critical software components hands-on.",
      },
    ],
  },
  {
    id: "consol",
    org: "ConSol Austria Software GmbH",
    title: {
      de: "Softwareentwickler & Berater",
      en: "Software Developer & Consultant",
    },
    location: { de: "Wien", en: "Vienna" },
    period: "10/2019 – 10/2021",
    summary: {
      de: "Anforderungsanalyse und Geschäftsprozessdesign für die ConSol-CM-Plattform; Second-Level-Support und Release-Management.",
      en: "Requirements analysis and business-process design for the ConSol CM platform; second-level support and release management.",
    },
    bullets: [
      {
        de: "ConSol CM (JEE / Groovy) an Kundenanforderungen angepasst; Erweiterungen in JavaScript, TypeScript und Kotlin gebaut.",
        en: "Adapted ConSol CM (JEE / Groovy) to customer requirements; built extensions in JavaScript, TypeScript and Kotlin.",
      },
    ],
  },
  {
    id: "vor",
    org: "Verkehrsverbund Ost-Region (VOR) GmbH",
    title: {
      de: "IT-Techniker, IKT-Infrastruktur",
      en: "IT Technician, ICT Infrastructure",
    },
    location: { de: "Wien", en: "Vienna" },
    period: "08/2018 – 07/2019",
    summary: {
      de: "Server-Infrastruktur im öffentlichen Verkehr: AD, DNS, DHCP, Gruppenrichtlinien, Exchange, Cisco-Switching und Mitel-Telefonie.",
      en: "Server infrastructure in a public-transport environment: AD, DNS, DHCP, Group Policies, Exchange, Cisco switching and Mitel telephony.",
    },
    bullets: [
      {
        de: "Landesk, ASG Remote Desktop, Canon UniFlow Druckverwaltung, Cisco Switching, Mitel-Aastra-Telefonanlage.",
        en: "Landesk, ASG remote desktop, Canon UniFlow print management, Cisco switching, Mitel Aastra telephony.",
      },
      {
        de: "Hardwareauswahl und -bewertung, OS-Deployment via LD Deployment und Portal Manager, physische Zutrittsverwaltung (CAK, Schlüssel).",
        en: "Hardware selection and evaluation, OS deployment via LD Deployment and Portal Manager, physical access control (CAK, keys).",
      },
    ],
  },
  {
    id: "kapsch",
    org: "Kapsch BusinessCom AG",
    title: {
      de: "Mitarbeiter Projektsupport",
      en: "Project Support",
    },
    location: { de: "Wien", en: "Vienna" },
    period: "10/2017 – 07/2018",
    summary: {
      de: "Budgetierung, Kosten- und Laufzeitkontrolle sowie Verrechnung von Projekten bis 400.000 €; SLAs in Dynamics NAV angelegt und gepflegt.",
      en: "Budgeting, cost and duration control, and billing of projects up to €400,000; created and maintained SLAs in Dynamics NAV.",
    },
    bullets: [
      {
        de: "Überwiegend zwischen Kapsch-Töchtern weltweit, im B2B- wie im B2C-Geschäft.",
        en: "Primarily between Kapsch subsidiaries worldwide, across both B2B and B2C business.",
      },
      {
        de: "An der Prozessoptimierung und ihrer Abbildung im ERP mitgewirkt; eigenen Nachfolger eingeschult.",
        en: "Contributed to process optimisation and its representation in the ERP; trained his own successor.",
      },
    ],
  },
  {
    id: "henkel",
    org: "Henkel CEE",
    title: {
      de: "IT-Techniker",
      en: "IT Technician",
    },
    location: { de: "Wien", en: "Vienna" },
    period: "03/2014 – 09/2017",
    summary: {
      de: "First- und Second-Level-Support, Patch-Management, Cisco-Switchports, Alcatel-Telefonie und große Hardware-Übersiedelungen.",
      en: "First and second level support, patch management, Cisco switchports, Alcatel telephony and large hardware relocations.",
    },
    bullets: [
      {
        de: "Analoge und IP-Telefonanlagen (Alcatel), OS-Deployment sowie Inventar- und Lagerverwaltung.",
        en: "Analogue and IP telephony (Alcatel), OS deployment, inventory and warehouse administration.",
      },
    ],
  },
]
