---
locale: de
id: guarden
order: 3
name: guarden
tagline: Ein Deployment-Host, den man lesen kann.
summary: "Ein VPS, ein paar Projekte, kein Kubernetes. guarden macht aus einer frischen Ubuntu-Maschine einen ehrlichen Deployment-Host: jede Anwendung als eigener Dienst mit eigenem Benutzer, eigenen Containern und eigenem Zustand, ein Edge davor, geteiltes Postgres, Snapshots für den Rückweg. Keine Web-UI — nur Kommandos und Dateien."
stack:
  - Python
  - systemd/quadlet
  - Podman
  - Traefik
  - btrfs
  - ferm
status: Öffentlich · Apache-2.0
license: Apache-2.0
links:
  - label: GitHub
    href: https://github.com/christophkroeppl/guarden
highlights:
  - Ein Befehl installiert den Host und übersteht zwei Reboots.
  - "btrfs und snapper: Rollback ist ein Kommando, keine Restore-Übung."
  - "ferm-Firewall, rootless Podman/quadlet, kein privilegierter Edge."
  - Module für Edge und Dashboard — lässt man sie weg, funktioniert der Rest.
artifact:
  kind: html
  src: /generated/projects/guarden.html
  title: guarden architecture
  aspect: "1210 / 1004"
---

Die Installation ist ein Befehl, der den Host konvergiert und zwei Reboots für die btrfs-Umstellung selbst übersteht. Danach gibt es keine Konfigurationsdatei, die niemand versteht: soil bereitet den Host vor, weedr ist der einzige Mutator, loom übersetzt Manifeste in Units, roots schreibt die Routen, furrow baut und deployt, stakes merkt sich die Snapshots.

Der Rand ist ein gewöhnlicher Dienst ohne Capabilities, die Firewall ist ferm statt ufw, und Produktion ist gated: ein fehlender Schlüssel stoppt den Start, bevor der laufende Container angefasst wird. Das ist die Sorte Infrastruktur, die ich auch für Kunden baue — nur ohne Dashboard, das man erst lernen muss.
