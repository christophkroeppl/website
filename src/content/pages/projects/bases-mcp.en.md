---
order: 2
name: bases-mcp
tagline: "Obsidian Bases, readable by agents."
summary: "An MCP server that resolves .base files to markdown — one process, one vault, six tools, stdio or Streamable HTTP. Behaviour is pinned against the local Obsidian CLI; every deliberate divergence is documented."
stack:
  - Rust
  - MCP
  - stdio
  - Streamable HTTP
status: Public · Apache-2.0
license: Apache-2.0
links:
  - label: GitHub
    href: https://github.com/christophkroeppl/bases-mcp
highlights:
  - "Six tools: list, resolve, read, write, add, backlinks."
  - Base regions are matched by path, not by position.
  - Parity tests against the Obsidian CLI.
  - An audit trail for every tool call.
artifact:
  kind: html
  src: /generated/projects/bases-mcp.html
  title: bases-mcp architecture
  aspect: "1435 / 700"
---

A base is a query, not a document. The server turns it into rows an agent can read without opening the Obsidian UI. One process serves exactly one vault, because a server that quietly falls back to another vault answers questions from the wrong context.

Write tools match base regions by path, not by position. Six tools, an audit trail for every call, and a test suite that compares against the Obsidian CLI rather than its own opinion.
