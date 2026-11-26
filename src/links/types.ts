export type LinkIcon =
  | { kind: "svg"; viewBox: string; paths: string[]; fillRule?: "evenodd" | "nonzero" }
  | { kind: "file"; src: string }

export type Link = {
  key: string
  href: string
  label: string
  slug: string
  icon: LinkIcon
}
