# CODEINFO — MH Autopflege

Code-Struktur und Aufbau. Bei strukturellen Änderungen aktualisieren.

## Überblick

Statische Webseite ohne Build-Schritt und ohne Abhängigkeiten: drei HTML-Seiten, ein Stylesheet, ein Script. Alle Assets (Schrift, Bilder, Videos) liegen lokal im Repo – keine externen Requests (DSGVO, CSP `'self'`). Deployment per GitHub Actions auf GitHub Pages.

## Verzeichnislayout

```
index.html                 Startseite (One-Page: Hero, Über uns, Leistungen, Pakete, Zusatzleistungen, Videos, Kontakt)
impressum.html             Impressum (Entwurf mit Platzhaltern)
datenschutz.html           Datenschutzerklärung (Entwurf mit Platzhaltern)
robots.txt
assets/
  css/style.css            Komplettes Styling inkl. Design-Tokens und Breakpoints
  js/main.js               Interaktionen (Navigation, Medien-Fallbacks, Hero-Video)
  fonts/                   Archivo Variable (wght + wdth), lokal, inkl. OFL-Lizenz
  img/                     hero/about/pakete.webp, leistungen/*.webp, favicon.svg, README.txt (Dateiliste)
  videos/                  hero.mp4 (stumm), video-1.mp4 (+ Poster), README.txt
.github/workflows/pages.yml  Build & Deploy nach GitHub Pages
```

## Module & Zuständigkeiten

**index.html** – Inhalte und Preise stehen direkt im Markup. Sektionen per `id` adressierbar: `#top` (Hero), `#ueber`, `#leistungen` (`#aussen`, `#innen`), `#pakete`, `#zusatz`, `#videos`, `#kontakt`. Jede Leistung ist ein `li.service` (Bild | Text | Preis).

**assets/css/style.css**
- `:root`-Tokens: Farben (`--color-*`, Akzent `--color-accent`), Abstände (`--space-*`), Schriftbreite Überschriften (`--stretch-head`), Dauern.
- Typografie: Überschriften in Satzschreibung (`--stretch-head` 90 %), Preise/Zahlen/Wortmarke schmal (`--stretch-display` 72 %), Versalien nur für Labels, Navigation und Buttons.
- Bausteine: `.btn`, `.label`, `.h-xl/.h-lg/.h-md`, `.media` (Bildrahmen; bei fehlender Datei Icon-Kachel `.media__icon`).
- Sektionen: `.hero`, `.about`, `.jump`, `.category`/`.service`, `.packages-wrap`/`.package`, `.video-wrap`, `.contact`, `.legal`.
- Breakpoints: 960 px (Navigation/Raster), 860 px (einspaltig), 560 px (Mobil).

**assets/js/main.js** (läuft nach `DOMContentLoaded`, `defer`):
- Header bekommt `is-scrolled` beim Scrollen; Mobile-Menü (`aria-expanded`, Esc schließt).
- Fehlende Bilder → Klasse `is-missing` am Elternelement → CSS blendet das Bild aus und zeigt die Icon-Kachel.
- Videos in `[data-video-section]`: nicht ladbare werden entfernt; Sektion + Nav-Link `[data-video-link]` erscheinen nur, wenn mind. ein Video lädt. Es läuft immer nur ein Video gleichzeitig.
- Hero-Video: `data-src` wird erst per JS gesetzt; nicht bei `prefers-reduced-motion` oder Data-Saver. Pausiert außerhalb des Viewports.
- Aktiver Navigationspunkt per IntersectionObserver, Jahreszahl im Footer.

## Zusammenspiel / Datenfluss

Kein Build: Browser lädt HTML → `style.css` + `main.js` (defer) → Bilder lazy, Hero-Bild sofort, Hero-Video nachgelagert. Der Pages-Workflow kopiert nur die auslieferbaren Dateien (`index.html`, `impressum.html`, `datenschutz.html`, `robots.txt`, `assets/` ohne `README.txt`) nach `_site` und deployt dieses Artefakt.

## Wichtige Einstiegspunkte

- `index.html` – Inhalte, Preise, Kontaktdaten
- `assets/css/style.css` – `:root`-Tokens am Dateianfang
- `.github/workflows/pages.yml` – Deployment
