---
order: 2
name: bases-mcp
tagline: "Obsidian Bases, lesbar für Agenten."
summary: "Ein MCP-Server, der .base-Dateien in Markdown auflöst — ein Prozess, ein Vault, sechs Tools, stdio oder Streamable HTTP. Das Verhalten ist gegen die lokale Obsidian-CLI gepinnt; jede bewusste Abweichung ist dokumentiert."
stack:
  - Rust
  - MCP
  - stdio
  - Streamable HTTP
status: Öffentlich · Apache-2.0
license: Apache-2.0
links:
  - label: GitHub
    href: https://github.com/christophkroeppl/bases-mcp
highlights:
  - "Sechs Tools: list, resolve, read, write, add, backlinks."
  - Base-Regionen werden über den Pfad gematcht, nicht über die Position.
  - Parity-Tests gegen die Obsidian-CLI.
artifact:
  kind: html
  src: /generated/projects/bases-mcp.html
  title: bases-mcp architecture
  aspect: "1435 / 700"
---

Ein Base ist eine Abfrage, kein Dokument. Der Server macht daraus Zeilen, die ein Agent lesen kann, ohne die Obsidian-Oberfläche zu öffnen. Ein Prozess bedient genau einen Vault, weil ein Server, der still auf einen anderen Vault ausweicht, Fragen aus dem falschen Kontext beantwortet.

Schreibende Tools matchen Base-Regionen über ihren Pfad, nicht über ihre Position. Sechs Tools, ein Audit-Trail für jeden Aufruf, und eine Testsuite, die gegen die Obsidian-CLI vergleicht statt gegen die eigene Meinung.
