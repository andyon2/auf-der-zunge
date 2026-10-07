# Auf der Zunge

Ein kleines Spiel, das Kommunikation in Konflikten übt. Dir gegenüber steht ein Mensch, er sagt einen Satz,
du wählst eine von drei Antworten, sein Gesicht verändert sich, er antwortet. Danach siehst du in Ruhe,
was du gesagt hast, was er gedacht und nicht gesagt hat und was es dich gekostet hat. Kein Richtig, keine Punkte.

Stand: Meilenstein 1, Tag 1 (Frau Brandt, Freitag 16:50), nur Deutsch.

## Befehle

| Befehl | Zweck |
|---|---|
| `npm install` | einmalig |
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Typprüfung und Build nach `dist/` |
| `npm run preview -- --host` | Build im Heimnetz ansehen (Handy: Adresse aus der Ausgabe) |
| `npm test` | Vitest: Engine (alle 27 Pfade) und Textregeln |
| `npm run shots` | Build, dann Playwright in 390x844, 360x640 und 375x667: Bilder nach `shots/`, Prüfung von Sperrliste, Zahlen, Zeilen, Schrift, Tippflächen, Karten und Knopf im Bild, Takt (nie über 1 s ohne Karte oder Knopf), Konsolenfehlern |

Debug: `?seed=123` legt die Reihenfolge der Karten fest (sonst Seed aus dem Datum).

## Aufbau

- `src/engine/` reines TypeScript ohne DOM: Zustand, Züge, Zufall (mulberry32), Gesichtsparameter.
- `src/ui/` DOM und SVG-Figur.
- `content/tag1.json` Struktur der Szene (IDs, Äste, Gesichter), sprachunabhängig.
- `content/de/tag1.json` deutscher Text zu den IDs. Eine spätere `content/en/tag1.json` liefert nur Text.
- `content/blocklist.json` Wörter, die im Spiel nicht vorkommen dürfen.
- `.github/workflows/pages.yml` baut und veröffentlicht auf GitHub Pages bei Push auf `main`.

## Veröffentlichen (GitHub Pages)

Einmalig nach dem Anlegen des GitHub-Repos: **Settings → Pages → Build and deployment → Source: „GitHub Actions“**.
Ohne diese Einstellung schlägt der Schritt `deploy-pages` fehl. Danach veröffentlicht jeder Push auf `main`.

Textänderungen gegenüber dem Skript: `NOTIZEN.md`.
