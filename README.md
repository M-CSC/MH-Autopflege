# MH Autopflege – Webseite

Statische One-Page-Webseite für MH Autopflege (Fahrzeugaufbereitung / Detailing): Leistungen mit Preisen und Bildern, Komplettpakete, Video, Kontakt sowie Impressum und Datenschutz. Reines HTML/CSS/JS ohne Build-Schritt, ohne Drittanbieter-Einbindungen; Deployment über GitHub Pages.

## Setup

```bash
git clone https://github.com/M-CSC/MH-Autopflege.git
cd MH-Autopflege
python3 -m http.server 8080
```

Danach http://localhost:8080 öffnen. Ein lokaler Server ist nötig, weil Videos/Schriften über `file://` teils nicht laden.

## Dokumentation

- [CODEINFO.md](./CODEINFO.md) — Code-Struktur und Aufbau
- [DOKU.md](./DOKU.md) — Admin- und Wartungsdoku (Deployment, Inhalte pflegen, Bilder/Videos, offene Punkte)
