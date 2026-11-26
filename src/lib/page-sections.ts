import type { TranslationKey } from "../i18n/ui"

export type CvSectionKey =
  | "profile"
  | "experience"
  | "skills"
  | "education"
  | "certifications"
  | "languages"
  | "bitcoin"

export const cvSections = [
  { key: "profile", titleKey: "cv.profile", tone: "default" },
  { key: "experience", titleKey: "cv.experience", tone: "default" },
  { key: "skills", titleKey: "cv.skills", tone: "primary" },
  { key: "education", titleKey: "cv.education", tone: "default" },
  { key: "certifications", titleKey: "cv.certifications", tone: "default" },
  { key: "languages", titleKey: "cv.languages", tone: "accent" },
  { key: "bitcoin", titleKey: "cv.bitcoin", tone: "default" },
] as const satisfies readonly {
  key: CvSectionKey
  titleKey: TranslationKey
  tone: "default" | "primary" | "accent"
}[]
