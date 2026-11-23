# DOKU — MH Autopflege

Admin- und Wartungsdoku.

## Voraussetzungen

- Lokale Vorschau: Python 3 (`python3 -m http.server 8080`) oder ein beliebiger statischer Webserver.
- Bilder/Videos umwandeln: `ffmpeg` (mit `libx264` und `libwebp`).
- Deployment: Schreibrechte auf `M-CSC/MH-Autopflege`, GitHub Pages im Repo aktiviert.

## Konfiguration

Keine Env-Variablen, keine Secrets. Alles steht im Markup bzw. in den CSS-Tokens.

**Kontaktdaten** (in `index.html`: `#kontakt`, Footer, Handy-Aktionsleiste `.mobilebar`; außerdem Impressum/Datenschutz). WhatsApp-Links öffnen mit vorausgefülltem Text (`?text=…`).

| Was | Wert / Status |
|---|---|
| Telefon | `0157 81280442` (`tel:+4915781280442`) |
| WhatsApp | `https://wa.me/4915781280442` |
| Instagram | `https://www.instagram.com/mh_autopflege` |
| E-Mail | **fehlt** – bei Bedarf im Kontaktbereich (`.contact__facts`) und Footer ergänzen |
| Adresse | **fehlt** – Pflicht im Impressum, optional im Kontaktbereich |
| Impressum/Datenschutz | markierte Angaben (`<span class="todo">`) ersetzen und rechtlich prüfen lassen |

**Design anpassen:** Farben/Abstände in `assets/css/style.css` unter `:root`. Akzentfarbe = `--color-accent` (aktuell Studio-Blau `#6b84ff`, 6:1 Kontrast auf Schwarz – bei Änderung mind. 4.5:1 einhalten).

**Sicherheit:** CSP per `<meta http-equiv="Content-Security-Policy">` in allen drei HTML-Dateien (`'self'` für alles, keine Inline-Scripts/-Styles). Neue externe Einbindungen (Maps, Fonts, Analytics) brechen die CSP bewusst und erfordern zusätzlich eine Anpassung der Datenschutzerklärung. GitHub Pages erlaubt keine eigenen HTTP-Header (z. B. `X-Frame-Options`); dafür wäre ein Proxy/CDN (z. B. Cloudflare) nötig.

## Deployment (GitHub Pages)

Workflow: `.github/workflows/pages.yml` – läuft bei jedem Push auf `main` und manuell (`Actions → Deploy GitHub Pages → Run workflow`).

Einmalig einrichten:
1. GitHub → Repo `M-CSC/MH-Autopflege` → **Settings → Pages → Build and deployment → Source: „GitHub Actions“**.
2. Stand auf `main` bringen (Merge/Push). Der Workflow deployt automatisch.
3. URL ohne eigene Domain: `https://m-csc.github.io/MH-Autopflege/` (alle Pfade sind relativ, funktioniert im Unterordner).

Eigene Domain (optional): in Settings → Pages eintragen, beim DNS-Anbieter `CNAME` auf `m-csc.github.io` (Subdomain) bzw. die GitHub-Pages-A-Records (Apex) setzen, „Enforce HTTPS“ aktivieren.

## Inhalte pflegen

- **Texte & Preise:** direkt in `index.html`. Pro Leistung ein `<li class="price-item">`; Preis in `<p class="price-item__price"><small>ab</small>25&nbsp;€</p>`. Die Angabe „x Leistungen“ in `.svc__meta` bei Änderungen mitziehen.
- **Neue Leistung:** vorhandenes `<li class="price-item">` kopieren und Name/Text/Preis anpassen. Pakete: `<article class="plan">`.

### Bilder

Format WebP. Dateinamen und Formate: `assets/img/README.txt`. Fehlt eine Datei, erscheint automatisch eine Icon-Kachel (`<span class="media__icon">` im jeweiligen `.media`) – sobald das Foto da ist, wird es statt der Kachel angezeigt, kein Code-Eingriff nötig.

```bash
ffmpeg -i foto.jpg -vf "scale=640:640:force_original_aspect_ratio=increase,crop=640:640" -c:v libwebp -quality 78 -map_metadata -1 assets/img/leistungen/aussen-1.webp
```

`-map_metadata -1` entfernt EXIF-Daten (u. a. GPS-Position aus Handyfotos). Formate: Außen quadratisch 640×640, Innen 640×800, Zusatz 800×1000, `about.webp` 1040×1300.

### Video (Hero-Hintergrund)

Das Video läuft stumm und in Dauerschleife vollflächig hinter dem Startbereich. Bis 760 px Breite lädt die kleinere Datei `hero-mobile.mp4` (Handy, wichtig für Besucher aus Instagram), sonst `hero.mp4`. Bei „Bewegung reduzieren“ oder Datensparmodus bleibt das Standbild `hero-poster.webp`. iPhone-Videos (`.MOV`, HEVC) laufen nicht in allen Browsern → nach H.264-MP4 umwandeln:

```bash
ffmpeg -i IMG_XXXX.MOV -an -vf "scale=1080:1920:flags=lanczos,format=yuv420p" -c:v libx264 -profile:v high -preset slow -crf 28 -r 30 -movflags +faststart -map_metadata -1 assets/videos/hero.mp4
```

```bash
ffmpeg -i IMG_XXXX.MOV -an -vf "scale=540:960:flags=lanczos,format=yuv420p" -c:v libx264 -profile:v main -preset slow -crf 29 -r 30 -movflags +faststart -map_metadata -1 assets/videos/hero-mobile.mp4
```

```bash
ffmpeg -ss 0.8 -i IMG_XXXX.MOV -frames:v 1 -vf "scale=1080:1920:flags=lanczos" -c:v libwebp -quality 72 -map_metadata -1 assets/videos/hero-poster.webp
```

Ziel: Desktop < 5 MB, Handy ≈ 1 MB, 10–20 Sekunden.

### Galerie

Bilder `assets/img/galerie/01.webp` … (4:5, 720×900). Neues Bild: Datei ablegen und in `index.html` im Block `.gallery` eine weitere `<div class="media"><img …></div>` mit Alt-Text ergänzen.

```bash
ffmpeg -i foto.jpg -vf "scale=720:900:force_original_aspect_ratio=increase,crop=720:900" -c:v libwebp -quality 78 -map_metadata -1 assets/img/galerie/10.webp
```

### Reels (Instagram-Links)

In der Galerie gibt es eine Reihe „Reels“: Kacheln, die direkt auf den jeweiligen Instagram-Beitrag verlinken (auf dem Handy öffnet sich die Instagram-App). Es wird nichts von Instagram eingebettet – keine Meta-Skripte, kein Cookie-Banner nötig. Aktuell verlinkt: BMW M4, GLC 63 S AMG, BMW M2, Piaggio, SQ5 sowie „Alle Reels“.

Ohne Vorschaubild zeigt die Kachel den Modellnamen auf dem Hex-Muster (`reel--text`). Neues Reel:
1. Link holen: in Instagram beim Beitrag auf „Teilen“ → „Link kopieren“.
2. In `index.html` im Block `.reels` ein `<li>` kopieren, `href`, `aria-label` und Namen anpassen. „Alle Reels“ bleibt die letzte Kachel.
3. Optional Vorschaubild 9:16 (540×960) aus Video oder Screenshot erzeugen, als erstes Element im `<a>` einfügen und `reel--text` entfernen:
   ```bash
   ffmpeg -i screenshot.jpg -vf "scale=540:960:force_original_aspect_ratio=increase,crop=540:960" -c:v libwebp -quality 76 -map_metadata -1 assets/img/reels/bmw-m4.webp
   ```
   ```html
   <img src="assets/img/reels/bmw-m4.webp" width="540" height="960" loading="lazy" decoding="async" alt="">
   ```

### Logo

`assets/img/brand/logo.webp` (mit Icons) und `logo-schrift.webp` (nur Schriftzug) sind aus dem Foto des Leuchtschilds freigestellt (transparenter Hintergrund). Liegt eine Original-Logodatei vor (SVG/PNG), diese Dateien damit ersetzen.

## Cache

GitHub Pages lässt Dateien ca. 10 Minuten im Browser-Cache. Damit nach einem Deploy nie neues HTML mit altem CSS/JS kombiniert wird, binden die HTML-Dateien `style.css?v=dev` und `main.js?v=dev` ein; der Workflow ersetzt `dev` beim Deploy durch den Commit-Hash. Neue HTML-Seiten müssen CSS/JS ebenfalls mit `?v=dev` einbinden.

## Betrieb & Wartung

- Keine Laufzeit-Abhängigkeiten, keine Updates nötig. Schrift (Archivo, OFL) liegt lokal.
- Nach Inhaltsänderungen: lokal prüfen (`python3 -m http.server 8080`), dann auf `main` pushen → Pages deployt in ca. 1–2 Minuten.

### Offene Punkte

- E-Mail und Adresse ergänzen (siehe Tabelle oben).
- Impressum und Datenschutz vervollständigen und rechtlich prüfen lassen.
- Original-Logodatei (SVG/PNG) – aktuell aus Foto freigestellt.
- Weitere Fotos (z. B. Innenraum, Motorraum, Felgen) können die Bildblöcke der Leistungen ergänzen/ersetzen.
- Domain festlegen.

## Troubleshooting

| Problem | Ursache → Lösung |
|---|---|
| Statt Foto erscheint Icon-Kachel | Datei fehlt oder Name falsch → mit `assets/img/README.txt` abgleichen (Groß-/Kleinschreibung beachten). |
| Video läuft in Chrome/Firefox nicht, in Safari schon | HEVC-Datei → mit `ffmpeg` nach H.264 umwandeln. |
| Hero-Video startet nicht | Gewollt bei „Bewegung reduzieren“ (Betriebssystem) oder Datensparmodus – dann bleibt das Hero-Bild. |
| Pages liefert 404 | Settings → Pages → Source muss „GitHub Actions“ sein; Workflow-Lauf unter „Actions“ prüfen. |
| Änderung online nicht sichtbar | Workflow noch nicht fertig oder Browser-Cache → Actions-Status prüfen, Seite neu laden (Strg+F5). |
| Externe Einbindung lädt nicht | CSP blockiert absichtlich → `meta`-CSP in den HTML-Dateien erweitern und Datenschutz anpassen. |
