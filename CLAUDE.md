# CLAUDE.md — MH Autopflege

Statische One-Page-Webseite (HTML/CSS/JS, kein Build) für MH Autopflege. Deployment per GitHub Actions auf GitHub Pages bei jedem Push auf `main`.

## Befehle

- Lokale Vorschau: `python3 -m http.server 8080` → http://localhost:8080
- Deploy: Push auf `main` (Workflow `.github/workflows/pages.yml`), manuell über „Run workflow“.

## Konventionen (verbindlich)

- **Footer-Credit auf jeder Seite:** `Built by <a href="https://m-csc.de" target="_blank" rel="noopener noreferrer">M-CSC</a>` im Footer (`.site-footer__bottom`, Klasse `built-by`). Neue Seiten bekommen ihn ebenfalls.
- **CSP `'self'`** (Meta-Tag in allen HTML-Dateien): keine Inline-Styles/-Scripts, keine externen Ressourcen (Fonts, Embeds, Analytics). Externe Dienste nur als normale Links.
- **Cache-Busting:** CSS/JS immer als `style.css?v=dev` / `main.js?v=dev` einbinden; der Workflow ersetzt `dev` durch den Commit-Hash.
- **Medien:** Bilder als WebP, Videos als H.264-MP4 (`+faststart`), Metadaten entfernen (`-map_metadata -1`). Befehle in `DOKU.md`.
- **Handy zuerst:** Die meisten Besucher kommen über Instagram. Änderungen immer bei 375 px prüfen; Handy-Aktionsleiste (`.mobilebar`) und Touch-Ziele ≥ 44 px beibehalten.
- Texte auf Deutsch; Kundendaten/Kontaktdaten nur so, wie vom Kunden freigegeben.

## Doku

`README.md` (Einstieg), `CODEINFO.md` (Aufbau), `DOKU.md` (Pflege, Deployment, offene Punkte) – bei strukturellen Änderungen mitziehen.
