import type { PageId } from "../i18n/routes"

export type PageMeta = {
  type: "WebPage" | "ContactPage" | "ProfilePage" | "CollectionPage"
  about: "person" | "website"
  mainEntity?: "person" | "projects"
  breadcrumb: boolean
  ogType: "profile" | "website"
  profileName: boolean
  personMainEntityOfPage: boolean
}

export const pageMeta = {
  home: {
    type: "WebPage",
    about: "person",
    mainEntity: "person",
    breadcrumb: false,
    ogType: "profile",
    profileName: true,
    personMainEntityOfPage: false,
  },
  contact: {
    type: "ContactPage",
    about: "person",
    breadcrumb: true,
    ogType: "website",
    profileName: false,
    personMainEntityOfPage: false,
  },
  cv: {
    type: "ProfilePage",
    about: "person",
    mainEntity: "person",
    breadcrumb: true,
    ogType: "website",
    profileName: false,
    personMainEntityOfPage: true,
  },
  projects: {
    type: "CollectionPage",
    about: "person",
    mainEntity: "projects",
    breadcrumb: true,
    ogType: "website",
    profileName: false,
    personMainEntityOfPage: false,
  },
  privacy: {
    type: "WebPage",
    about: "website",
    breadcrumb: true,
    ogType: "website",
    profileName: false,
    personMainEntityOfPage: false,
  },
} satisfies Record<PageId, PageMeta>
