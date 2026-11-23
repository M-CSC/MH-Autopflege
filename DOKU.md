# DOKU — MH Autopflege

Admin- und Wartungsdoku.

## Voraussetzungen

- Lokale Vorschau: Python 3 (`python3 -m http.server 8080`) oder ein beliebiger statischer Webserver.
- Bilder/Videos umwandeln: `ffmpeg` (mit `libx264` und `libwebp`).
- Deployment: Schreibrechte auf `M-CSC/MH-Autopflege`, GitHub Pages im Repo aktiviert.

## Konfiguration

Keine Env-Variablen, keine Secrets. Alles steht im Markup bzw. in den CSS-Tokens.

**Platzhalter, die vor dem Livegang ersetzt werden müssen** (`grep -rn "000000\|example.com\|Musterstra" *.html`):

| Was | Wo |
|---|---|
| Telefonnummer (`tel:+490000000000`, Anzeige `+49 000 000000`) | `index.html`, Abschnitt `#kontakt` (3 Stellen) |
| WhatsApp (`https://wa.me/490000000000`) | `index.html`, `#kontakt` |
| E-Mail (`info@example.com`) | `index.html`, `#kontakt` (2 Stellen) |
| Adresse (`Musterstraße 1, 00000 Musterstadt`) | `index.html`, `#kontakt` |
| Alle markierten Angaben (`<span class="todo">`) | `impressum.html`, `datenschutz.html` – danach rechtlich prüfen lassen |

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

- **Texte & Preise:** direkt in `index.html`. Pro Leistung ein `<li class="service">`; Preis in `<p class="service__price"><small>ab</small>25&nbsp;€</p>`. Die Zeile „x Leistungen ab y €“ in `.category__intro` bei Änderungen mitziehen.
- **Neue Leistung:** vorhandenes `<li class="service">` kopieren, Bildpfad/Alt-Text/Titel/Text/Preis anpassen.

### Bilder

Format WebP, Hochformat 4:5. Dateinamen und Status: `assets/img/README.txt`. Fehlt eine Datei, erscheint automatisch ein Hex-Platzhalter – kein Code-Eingriff nötig.

```bash
ffmpeg -i foto.jpg -vf "scale=600:750:force_original_aspect_ratio=increase,crop=600:750" -c:v libwebp -quality 78 -map_metadata -1 assets/img/leistungen/polster.webp
```

`-map_metadata -1` entfernt EXIF-Daten (u. a. GPS-Position aus Handyfotos). Großformate: `hero.webp` 1120×1400, `about.webp` 1040×1300, `pakete.webp` 1050×1400.

### Videos

iPhone-Videos (`.MOV`, HEVC) laufen nicht in allen Browsern → immer nach H.264-MP4 umwandeln:

```bash
# Galerie-Video mit Ton
ffmpeg -i IMG_XXXX.MOV -vf "scale=1080:1920:flags=lanczos,format=yuv420p" -c:v libx264 -profile:v high -preset slow -crf 25 -r 30 -c:a aac -b:a 128k -movflags +faststart -map_metadata -1 assets/videos/video-2.mp4
```

```bash
# Hero-Hintergrund (stumm, klein)
ffmpeg -i IMG_XXXX.MOV -an -vf "scale=720:1280:flags=lanczos,format=yuv420p" -c:v libx264 -profile:v high -preset slow -crf 27 -r 30 -movflags +faststart -map_metadata -1 assets/videos/hero.mp4
```

```bash
# Poster (Standbild bei Sekunde 6)
ffmpeg -ss 6 -i IMG_XXXX.MOV -frames:v 1 -vf "scale=720:1280" -c:v libwebp -quality 78 assets/videos/video-2-poster.webp
```

Weiteres Video einbinden: in `index.html` im Block `#videos` die `<figure class="video">` kopieren und Dateinamen/Beschriftung anpassen. Größe pro Datei möglichst < 10 MB halten (Repo-Größe, Ladezeit).

## Betrieb & Wartung

- Keine Laufzeit-Abhängigkeiten, keine Updates nötig. Schrift (Archivo, OFL) liegt lokal.
- Nach Inhaltsänderungen: lokal prüfen (`python3 -m http.server 8080`), dann auf `main` pushen → Pages deployt in ca. 1–2 Minuten.

### Offene Punkte

- Kontaktdaten eintragen (siehe Tabelle oben).
- Impressum und Datenschutz vervollständigen und rechtlich prüfen lassen.
- Logo als Datei (SVG oder PNG mit transparentem Hintergrund) – aktuell Text-Wortmarke im Header.
- Fehlende Fotos: Basis-Innenreinigung, Polsterreinigung, Geruchsentfernung, Motorreinigung, Felgenversiegelung, Cabrio-Verdeck.
- Domain festlegen.

## Troubleshooting

| Problem | Ursache → Lösung |
|---|---|
| Bild zeigt Hex-Muster | Datei fehlt oder Name falsch → mit `assets/img/README.txt` abgleichen (Groß-/Kleinschreibung beachten). |
| Video-Sektion fehlt | Keines der Videos ladbar → Pfad/Format prüfen (H.264-MP4, siehe oben). |
| Video läuft in Chrome/Firefox nicht, in Safari schon | HEVC-Datei → mit `ffmpeg` nach H.264 umwandeln. |
| Hero-Video startet nicht | Gewollt bei „Bewegung reduzieren“ (Betriebssystem) oder Datensparmodus – dann bleibt das Hero-Bild. |
| Pages liefert 404 | Settings → Pages → Source muss „GitHub Actions“ sein; Workflow-Lauf unter „Actions“ prüfen. |
| Änderung online nicht sichtbar | Workflow noch nicht fertig oder Browser-Cache → Actions-Status prüfen, Seite neu laden (Strg+F5). |
| Externe Einbindung lädt nicht | CSP blockiert absichtlich → `meta`-CSP in den HTML-Dateien erweitern und Datenschutz anpassen. |
