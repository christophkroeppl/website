---
order: 1
name: oc-go-usage-display
tagline: Your Go usage, where you already look.
summary: "TypeScript plugin for OpenCode and Kilo. Reading the host's own auth store it renders Opencode Go subscription_usage stats and time to reset as a TUI sidebar and a statusline."
stack:
  - TypeScript
  - Node ≥22
  - OpenCode plugin API
  - npm
status: Public · npm 2.1.0
license: MIT
links:
  - label: GitHub
    href: https://github.com/christophkroeppl/oc-go-usage-display
  - label: npm
    href: https://www.npmjs.com/package/oc-go-usage-display
highlights:
  - Works as a server tool and as a TUI surface.
  - "One npm package; the build fails if a bundle is missing."
  - The install script registers both hosts.
  - Reads each host's own auth store.
artifact:
  kind: compare
  before: /generated/projects/oc-go/opencode.webp
  after: /generated/projects/oc-go/kilo.webp
  beforeLabel: OpenCode
  afterLabel: Kilo
  caption: "OpenCode and Kilo compared: the same plugin, two hosts."
  aspect: "16/10"
  orientation: vertical
---

The plugin reads the host's own auth store and puts the same number in three places: as a tool for the agent, as a sidebar for the human and as a statusline that stays visible while typing. There is no second source of truth and no configuration that can drift.

The build fails if a bundle is missing. That sounds pedantic, but it is why installation works on both hosts without anyone copying a file by hand. Version 2.1.0 is published on npm.
