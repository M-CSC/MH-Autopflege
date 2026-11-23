# CODEINFO — MH Autopflege

Code-Struktur und Aufbau. Bei strukturellen Änderungen aktualisieren.

## Überblick

Statische Webseite ohne Build-Schritt und ohne Abhängigkeiten: drei HTML-Seiten, ein Stylesheet, ein Script. Alle Assets (Schrift, Bilder, Videos) liegen lokal im Repo – keine externen Requests (DSGVO, CSP `'self'`). Deployment per GitHub Actions auf GitHub Pages.

## Verzeichnislayout

```
index.html                 Startseite (One-Page: Hero mit Hintergrundvideo, Über uns, Leistungen, Pakete, Kontakt)
impressum.html             Impressum (Entwurf mit Platzhaltern)
datenschutz.html           Datenschutzerklärung (Entwurf mit Platzhaltern)
robots.txt
assets/
  css/style.css            Komplettes Styling inkl. Design-Tokens und Breakpoints
  js/main.js               Interaktionen (Navigation, Medien-Fallbacks, Hero-Video)
  fonts/                   Archivo Variable (wght + wdth), lokal, inkl. OFL-Lizenz
  img/                     about.webp, hero.webp (Kontaktbild), leistungen/*.webp, favicon.svg, README.txt
  videos/                  hero.mp4 (Hintergrund, stumm) + hero-poster.webp, README.txt
.github/workflows/pages.yml  Build & Deploy nach GitHub Pages
```

## Module & Zuständigkeiten

**index.html** – Inhalte und Preise stehen direkt im Markup. Sektionen per `id` adressierbar: `#top` (Hero), `#ueber`, `#leistungen` (`#aussen`, `#innen`, `#zusatz`), `#pakete`, `#kontakt`. Jeder Leistungsbereich ist ein `.svc`-Block (Bildmosaik | Preisliste `li.price-item`), Pakete sind `article.plan`.

**assets/css/style.css**
- `:root`-Tokens: Farben (`--color-*`, Akzent `--color-accent`), Abstände (`--space-*`), Schriftbreite Überschriften (`--stretch-head`), Dauern.
- Typografie: Überschriften in Satzschreibung (`--stretch-head` 92 %), Zahlen/Wortmarke schmaler (`--stretch-num` 78 %), Versalien nur für Labels.
- Bausteine: `.btn`, `.label`, `.h-lg/.h-md`, `.section-head` (Label + Titel + Lead), `.media` (Bildrahmen mit neutralem Fallback bei fehlender Datei).
- Sektionen: `.hero` (Vollbild-Video + `.hero__bar`), `.about`, `.tabs`, `.svc`/`.mosaic`/`.price-list`, `.plans`/`.plan`, `.contact`, `.legal`.
- Breakpoints: 960 px (Navigation, Leistungsblöcke einspaltig), 860 px (Hero/Über uns/Kontakt), 560 px (Mobil).

**assets/js/main.js** (läuft nach `DOMContentLoaded`, `defer`):
- Header bekommt `is-scrolled` beim Scrollen; Mobile-Menü (`aria-expanded`, Esc schließt).
- Fehlende Bilder → Klasse `is-missing` am Elternelement → CSS blendet das Bild aus.
- Optionale Video-Sektion `[data-video-section]` (derzeit nicht im Markup): erscheint nur, wenn mind. ein Video lädt.
- Hero-Video: `data-src` wird erst per JS gesetzt; nicht bei `prefers-reduced-motion` oder Data-Saver. Pausiert außerhalb des Viewports.
- Aktiver Navigationspunkt per IntersectionObserver, Jahreszahl im Footer.

## Zusammenspiel / Datenfluss

Kein Build: Browser lädt HTML → `style.css` + `main.js` (defer) → Bilder lazy, Hero-Bild sofort, Hero-Video nachgelagert. Der Pages-Workflow kopiert nur die auslieferbaren Dateien (`index.html`, `impressum.html`, `datenschutz.html`, `robots.txt`, `assets/` ohne `README.txt`) nach `_site` und deployt dieses Artefakt.

## Wichtige Einstiegspunkte

- `index.html` – Inhalte, Preise, Kontaktdaten
- `assets/css/style.css` – `:root`-Tokens am Dateianfang
- `.github/workflows/pages.yml` – Deployment
