# Auf der Zunge

Ein kleines Spiel, das Kommunikation in Konflikten übt. Dir gegenüber steht ein Mensch, er sagt einen Satz,
du wählst eine von drei Antworten, sein Gesicht verändert sich, er antwortet. Danach siehst du in Ruhe,
was du gesagt hast, was er gedacht und nicht gesagt hat und was es dich gekostet hat. Kein Richtig, keine Punkte.

Stand: Meilenstein 3, Tag 1 (Frau Brandt, Freitag 16:50) und Tag 2 (Jule im Chat, mit Echo), Deutsch und Englisch, läuft nach einmaligem Laden offline.

## Befehle

| Befehl | Zweck |
|---|---|
| `npm install` | einmalig |
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Typprüfung und Build nach `dist/` |
| `npm run preview -- --host` | Build im Heimnetz ansehen (Handy: Adresse aus der Ausgabe) |
| `npm test` | Vitest: Engine (alle 27 Pfade Tag 1, alle 21 Pfade Tag 2, Echo) und Textregeln für beide Tage in DE und EN (alle IDs, Sperrliste, Zahlen) |
| `npm run shots [-- <ordner>]` | Build, dann Playwright in DE und EN, je in 390x844, 360x640 und 375x667, alle Pfade Tag 1 (weiter bis Start Tag 2) und die fünf Testpfade Tag 2 (mit Echo, Erklärsatz, Gesicht, Kostenzeile je Schritt): Bilder nach `shots/<sprache>/<pfad>/`, dazu `shots/reset/` (Sprache aus dem Browser) und `shots/offline/` (ohne Netz gespielt), Prüfung von Sperrliste, Zahlen, Zeilen, Schrift, Tippflächen, Karten und Knopf im Bild, Takt (nie über 1 s ohne Karte oder Knopf), Konsolenfehlern |

Debug: `?seed=123` legt die Reihenfolge der Karten fest (sonst Seed aus dem Datum).
`?tag=2` beginnt direkt bei Tag 2.
`?reset=1` vergisst gespeicherte Sprache, Rundenzähler und Ende von Tag 1 (nur diese drei Einträge) und lädt die Seite ohne den Parameter neu.

Sprache: beim ersten Start aus der Browsersprache (de* → Deutsch, sonst Englisch), umschaltbar auf dem Startbildschirm („DE | EN“).

## Aufbau

- `src/engine/` reines TypeScript ohne DOM: Zustand, Züge, Zufall (mulberry32), Gesichtsparameter.
- `src/ui/` DOM und SVG-Figur.
- `content/tag1.json`, `content/tag2.json` Struktur der Szenen (IDs, Äste, Gesichter, Echo), sprachunabhängig.
- `content/de/tagN.json`, `content/en/tagN.json` Text zu den IDs, je Sprache.
- `content/blocklist.json`, `content/blocklist-en.json` Wörter, die im Spiel nicht vorkommen dürfen.
- `src/sw.js` Service Worker (Vorlage); `vite.config.ts` setzt beim Build Dateiliste und Cache-Namen ein.
- `.github/workflows/pages.yml` baut und veröffentlicht auf GitHub Pages bei Push auf `main`.

## Veröffentlichen (GitHub Pages)

**Pages-Quelle auf GitHub Actions stellen.** Einmalig nach dem Anlegen des GitHub-Repos: **Settings → Pages → Build and deployment → Source: „GitHub Actions“**.
Ohne diese Einstellung schlägt der Schritt `deploy-pages` fehl. Danach veröffentlicht jeder Push auf `main`.

Textänderungen gegenüber dem Skript: `NOTIZEN.md`.
