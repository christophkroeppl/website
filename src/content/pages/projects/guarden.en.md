---
locale: en
id: guarden
order: 3
name: guarden
tagline: A deployment host you can read.
summary: "One VPS. A handful of projects. No Kubernetes. guarden turns a fresh Ubuntu box into an honest deployment host: every project its own service with its own user, containers and state, one edge in front, shared Postgres, snapshots for the way back. No web UI — commands and files."
stack:
  - Python
  - systemd/quadlet
  - Podman
  - Traefik
  - btrfs
  - ferm
status: Public · Apache-2.0
license: Apache-2.0
links:
  - label: GitHub
    href: https://github.com/christophkroeppl/guarden
highlights:
  - One command installs the host and survives two reboots.
  - "btrfs and snapper: rollback is a command, not a restore drill."
  - "ferm firewall, rootless Podman/quadlet, no privileged edge."
  - Modules for edge and dashboard — leave them off and the rest still works.
artifact:
  kind: html
  src: /generated/projects/guarden.html
  title: guarden architecture
  aspect: "1210 / 1004"
---

Installation is one command that converges the host and survives two reboots for the btrfs conversion. After that there is no config file nobody understands: soil prepares the host, weedr is the only mutator, loom turns manifests into units, roots writes the routes, furrow builds and deploys, stakes remembers the snapshots.

The edge is an ordinary service with no capabilities, the firewall is ferm rather than ufw, and production is gated: a missing key stops the start before the running container is touched. This is the kind of infrastructure I build for clients too — just without a dashboard you have to learn first.
