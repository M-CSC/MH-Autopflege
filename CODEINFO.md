# CODEINFO — MH Autopflege

Code-Struktur und Aufbau. Bei strukturellen Änderungen aktualisieren.

## Überblick

Statische Webseite ohne Build-Schritt und ohne Abhängigkeiten: drei HTML-Seiten, ein Stylesheet, ein Script. Alle Assets (Schrift, Bilder, Videos) liegen lokal im Repo – keine externen Requests (DSGVO, CSP `'self'`). Deployment per GitHub Actions auf GitHub Pages.

## Verzeichnislayout

```
index.html                 Startseite (One-Page): Hero mit Hintergrundvideo, Laufband, Über uns,
                           Leistungen (Tabs), Komplettpakete, Galerie, Kontakt, Handy-Aktionsleiste
impressum.html             Impressum
datenschutz.html           Datenschutzerklärung
danke.html                 Bestätigungsseite nach dem Formularversand (FormSubmit `_next`)
robots.txt
assets/
  css/style.css            Komplettes Styling inkl. Design-Tokens und Breakpoints
  js/main.js               Interaktionen (Navigation, Tabs, Galerie, Hero-Video, Handy-Leiste)
  fonts/                   Archivo Variable (wght + wdth), lokal, inkl. OFL-Lizenz
  img/brand/               logo.webp, logo-schrift.webp (aus Foto freigestellt), hex.svg (Leuchtraster)
  img/                     about.webp, favicon.svg, leistungen/*.webp, galerie/01–09.webp, reels/*.webp
  videos/                  hero.mp4 (Desktop), hero-mobile.mp4 (Handy), hero-poster.webp
.github/workflows/pages.yml  Build & Deploy nach GitHub Pages
```

## Module & Zuständigkeiten

**index.html** – Inhalte und Preise stehen direkt im Markup. Sektionen: `#top` (Hero), `#ueber`, `#leistungen` mit Tab-Panels `#aussen`, `#innen`, `#zusatz`, `#pakete`, `#galerie`, `#kontakt`. Icons als SVG-`<symbol>` am Seitenanfang, eingebunden per `<use href="#i-…">`.

**assets/css/style.css**
- `:root`-Tokens: Farben (`--color-*`, Akzent `--color-accent` = LED-Blau), Abstände (`--space-*`, `--section-y`), `--stretch-display` (68 % für Display-Versalien).
- Typografie: `.display` (schmal, Versalien) für H1/H2, Fließtext normal. `.idx` = Abschnittsindex „01 Über uns“.
- Bausteine: `.btn`, `.media` (Bildrahmen mit Fallback), `.head` (zweispaltiger Abschnittskopf).
- Sektionen: `.hero`/`.hero__big`, `.marquee`, `.about`, `.tabs`/`.panel`/`.mosaic`/`.price-list`, `.pkgs`/`.pkg`, `.gallery`, `.reels`/`.reel` (Instagram-Links), `.contact-section` (Hex-Raster als `::before`), `.mobilebar`, `.legal`.
- Anker-Offset: `.section[id]` hat negatives `scroll-margin-top`, damit die Überschrift direkt unter dem fixen Header landet.
- Breakpoints: 1000 px (Navigation), 900 px (einspaltig), 760 px (Handy-Leiste), 560 px (Handy).

**assets/js/main.js** (läuft nach `DOMContentLoaded`, `defer`):
- Header-Hintergrund beim Scrollen, Mobile-Menü (`aria-expanded`, Esc).
- Bild-Fallback nur bei echtem Ladefehler (`is-missing`).
- Hero-Video: wählt `data-src-mobile` bis 760 px, sonst `data-src`; nicht bei `prefers-reduced-motion`/Datensparmodus; pausiert außerhalb des Viewports.
- Tabs (ARIA-Tabs mit Pfeiltasten); ohne JS bleiben alle Panels sichtbar. Links auf `#aussen/#innen/#zusatz` öffnen den passenden Tab.
- Anfrage-Popup (`<dialog id="anfrage">`): öffnet über `[data-open-form]` (optional `data-service` zur Vorauswahl), Validierung, Versand per Formular-POST an FormSubmit, `_next` → `danke.html`.
- Galerie-Pfeile (scrollen um 80 % der Breite), Handy-Aktionsleiste (sichtbar nach dem Hero, ausgeblendet im Kontaktbereich), aktiver Nav-Punkt, Jahreszahl.

## Zusammenspiel / Datenfluss

Kein Build: Browser lädt HTML → `style.css` + `main.js` (defer) → Bilder lazy, Hero-Standbild sofort, Hero-Video nachgelagert. Der Pages-Workflow kopiert nur die auslieferbaren Dateien (`index.html`, `impressum.html`, `datenschutz.html`, `robots.txt`, `assets/` ohne `README.txt`) nach `_site` und deployt dieses Artefakt.

## Wichtige Einstiegspunkte

- `index.html` – Inhalte, Preise, Kontaktdaten
- `assets/css/style.css` – `:root`-Tokens am Dateianfang
- `.github/workflows/pages.yml` – Deployment
