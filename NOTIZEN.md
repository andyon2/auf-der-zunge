# Notizen zum Bau

## Textaenderungen gegenueber dem Skript

Quelle: `kern-minimal.md` Abschnitt 4 (Projekt kommunikation-spiel). Pflichtpunkte aus `blindtest-synthese.md`.
Umlaute und Auslassungspunkte (…) sind im Spiel typografisch gesetzt; das zaehlt nicht als Aenderung.

| Stelle | Alt | Neu | Grund |
|---|---|---|---|
| Lage | Deine Chefin. Freitag, 16:50. Du willst um fuenf gehen. | Deine Chefin. Freitag, 16:50. Du willst um fünf gehen. Schon oft bist du freitags länger geblieben. | Pflichtpunkt 1: "Wie immer" (D) und "jeden Freitag" (H) setzen Vorgeschichte voraus. Die Lage nennt sie jetzt. "freitags" seit M1b (Review K2), damit H ("jeden Freitag") anschliesst. |
| C | Geht es Ihnen darum, dass Kessler diesmal nichts findet? | Geht es Ihnen darum, dass Kessler keinen Fehler findet? | Pflichtpunkt 1: "diesmal" setzt das letzte Mal voraus. Ihre Antwort erzaehlt es jetzt erst. |
| E nach C (Antwort) | Passt mir nicht. Aber gut, Montag zehn Uhr. | Eigentlich wollte ich alles Montag früh. …Gut. Den Rest bis zehn, nicht später. | Pflichtpunkt 2: Ihre Forderung war "Montag frueh komplett". Die Antwort macht hoerbar, dass sie nachgibt. Forderung und E bleiben. |
| G (Antwort) | Die Preise. Der Text hat Zeit bis Montag zehn. Machen Sie die Preise, dann gehen Sie. | Die Preise. Der Text kann bis Montag zehn warten. Machen Sie die Preise, dann gehen Sie. | "Zeit" steht auf der Sperrliste (shots.js). Sinn gleich. |
| G (Antwort nach E, M1b) | Die Preise. Der Text hat Zeit bis Montag zehn. Machen Sie die Preise, dann gehen Sie. | …Die Preise. Wenn die stimmen, kann der Text bis Montag zehn warten. Dann gehen Sie. | Review S2: Nach "Nein. Montag früh heißt Montag früh." fehlte der Uebergang. Eigene Antwort mit after "E", die alte bleibt fuer A-F-G, B-F-G, C-F-G. Vom Dirigenten vorgegeben war "… Machen Sie die Preise, dann gehen Sie."; das ergab 4 Zeilen auch bei 390 px. "Machen Sie die Preise," ist gestrichen, die Aufforderung steckt in "Wenn die stimmen". |
| Innensatz | Wenn Kessler noch mal Fehler findet, bin ich dran. | Mein Chef hat gefragt, ob ich Kessler noch im Griff habe. Ich weiß es selbst nicht. | Pflichtpunkt 3: Der alte Satz wiederholte ihre Antwort nach C. Der neue zeigt Neues: die Angst vor dem eigenen Chef. "Mein Chef" (nicht Chefin) ist eine freie Wahl ohne Vorgabe im Skript (Review K1); es unterscheidet ihn im Lesen von ihr selbst, "Deine Chefin". |
| Kostenzeile Pfad H (M2) | Du gehst. Der Satz bleibt zwischen euch. | Du gehst. Aber sie hat es sich gemerkt. | Review M2: "Der Satz" war unklar (welcher Satz, deiner oder ihrer?). Die neue Zeile knuepft an ihr "Aber das merk ich mir." an und nennt den Preis direkt. 1 bis 2 Zeilen. EN: "You leave. But she won't forget it." |
| Rueckblick, Kostenzeile | Was es gekostet hat: | Es gibt kein Richtig. Das hat es gekostet: | Pflichtpunkt 5. Wortlaut aus der Synthese, Punkt durch Doppelpunkt ersetzt, weil der Preis darunter folgt. |

## Neue Texte (nicht im Skript)

| Stelle | Text | Herkunft |
|---|---|---|
| Start | Auf der Zunge / Jemand will etwas von dir, und du überlegst, was du sagst. / Los | Bildfolge Bild 1 |
| Start, Fusszeile | Bei Angst oder Gewalt: Hilfe in deinem Land | Bildfolge Bild 10, laut Pflichtpunkt 6 nur noch auf dem Start (ein Menue gibt es noch nicht) |
| Ende | Für heute ist das alles. / Noch mal, darunter die Hilfe-Fusszeile | neu, Auftrag Meilenstein 1 ("Ende mit Noch mal"); Fusszeile seit M1b, weil das Ende der Start des naechsten Durchlaufs ist |
| Nach D, vor "Das Gespräch ist zu Ende." | Sie dreht sich zum Bildschirm. | M1b: Tester fanden das Ende nach zwei Zuegen ueberraschend. Regieanweisung, abgeleitet aus "Gut. Bis Montag.", kursiv, kein neuer Mechanismus (Feld `note` am Ast D). |
| Beschriftungen (Review K4) | Was sagst du? / Du: / Sie: / Was sie gedacht und nicht gesagt hat: / Weiter | "Was sagst du?" aus kern-minimal Abschnitt 3; "Du:" aus Abschnitt 3 Bild 4; "Sie:" und das Innensatz-Label aus der Bildfolge Bild 10; "Weiter" aus der Bildfolge. |
| Ende Gespraech | Das Gespräch ist zu Ende. / Weiter | kern-minimal Abschnitt 3, Bild 8 |

## Weitere Entscheidungen

- Pflichtpunkt 4 (Gesichtswechsel deutlicher): Gesichter in `src/engine/faces.ts` mit groesserem Abstand.
  "offener" hebt die Brauen, oeffnet die Augen weiter (lid negativ), nimmt die Kieferstriche weg, neigt den Kopf und beugt sie vor.
  "zu" verschraenkt die Arme und wendet den Blick ab. Wechsel als Ueberblendung, 300 ms (wie STIL.md; in M1 waren es 450 ms).
  Seit M1b (Review S4) liegen die verschraenkten Arme hoch vor der Brust, ueber der Tischkante; vorher verschwanden sie hinter dem Tisch.
- Gesicht bei E nach C (Review S1, M1b): eigenes Preset `yielding` statt `open`. Ihr Satz ist widerwilliges Nachgeben
  ("Eigentlich wollte ich alles Montag früh. …Gut."). Ein Laecheln (mouth 0.5) widersprach dem Text und hatte nach STIL
  den Beigeschmack eines Gewinns. Jetzt: offene Brauen, keine Kieferstriche, neutraler Mund, Blick nach unten.
  Das Preset `open` wird nicht mehr gebraucht und ist entfernt.
  Nach B bleibt das Gesicht "angespannt" wie vorher, so steht es im Skript. Dort ist also kein Wechsel zu sehen.
- Skriptbegriffe zu Gesichtern: angespannt = tense, zu = closed, offener = opening, offen = open,
  "offen" (nur E nach C) = yielding, "angespannt, wendet sich ab" = tenseAway (Blick zur Seite und nach unten), "Pause, Gesicht hart" = hard (Arme verschraenkt, Blick direkt).
  Die Pause vor H steckt im Bildschirm "Gesicht wechselt", der vor jeder Antwort kommt.
- Pflichtpunkt 6: Hilfe-Fusszeile auf Start und Ende, nicht im Rueckblick und nie im Gespraech.
- Takt (M1b, Erste-Minute-Test): Lage und ihr erster Satz erscheinen zusammen, die Karten 0,6 s danach.
  Nach dem Antippen: dein Satz 0,4 s, dann Gesichtswechsel 0,6 s, dann ihre Antwort zusammen mit der naechsten Hand
  (oder dem Ende). Kein Zustand ohne Karte oder Knopf dauert ueber 1 s; shots.js misst das auf Playwrights Uhr.
- Kleine Handys (M1b, Review M1/M2): Die Buehne ist `clamp(140px, 100dvh - 500px, 300px)` hoch und zeigt die ganze
  Szene verkleinert (meet statt slice). Die Lage-Zeile verschwindet ab der ersten Antwort. Ihre Zeile hat 18 px statt 20 px
  (bei 20 px brach der Eroeffnungssatz bei 360 und 375 px auf 4 Zeilen). Das Rueckblick-Gesicht schrumpft bei niedriger
  Hoehe bis 64 px. Nach jedem Anhaengen scrollt die Seite Karten bzw. "Weiter" ins Bild.
- Stil-Abweichungen von STIL.md (Review K5): Buehne 300 px statt 380 px (Vorlage ist die Bildfolge, dort 300),
  auf kleinen Handys weniger; Figurzeile 18 px statt 22 px (Platz fuer drei Karten).
  Blend-Dauer: Ueberblendung der Gesichter 300 ms (in M1 450 ms); das alte Gesicht wird erst nach 350 ms aus dem DOM
  genommen, 50 ms Puffer, damit kein leerer Rahmen aufblitzt. Erscheinen von Zeilen und Karten ebenfalls 300 ms.
  Rueckblick-Gesicht seit M2 `clamp(64px, 100dvh - 750px, 113px)` (vorher - 730px): mit der Eroeffnung als erstem
  Eintrag (K3) ragte der englische Rueckblick A-E-G bei 390x844 13 px nach unten raus.
- Innensatz: nur im Rueckblick (kern-minimal: im Gespraech erst Tag 2). Der Rueckblick zeigt Zeile fuer Zeile: Gesicht und Gesagtes, dann Innensatz, dann Preis.
- "Noch mal" (seit M2, Review K7) startet mit neuem Seed: Seed des Tages (oder `?seed=`) plus Zaehler. Der Zaehler
  steht in localStorage (`adz.round` = "Tagesseed:n") und beginnt an jedem neuen Tag bei 1. Ohne localStorage bleibt es bei n = 1.
- Rueckblick (seit M2, Review K3): erster Eintrag ist ihre Eroeffnung ("Sie: …"), dann Zug fuer Zug. Das macht `review()` in der Engine.
- Ihre Antworten stehen in `#lines` mit `aria-live="polite"` (Review K6); Screenreader lesen neue Saetze vor, ohne zu unterbrechen.
- Die Hilfe-Fusszeile hat 14 px (Regel >= 17 px gilt fuer die Saetze des Spiels).

## Englisch (M2)

`content/en/tag1.json` ist eigens geschrieben, nicht Wort fuer Wort uebersetzt; IDs und Struktur wie DE.
Sperrliste EN: `content/blocklist-en.json` (time, pressure, trust, points, score, echo, history, take back, swallow,
needs, feeling, please, observation, sharp, typing), sinngemaess zur deutschen. "need" als Verb ("I need the proposal")
ist erlaubt, gesperrt ist das Nomen "needs" (Beduerfnis).

| Entscheidung | Wahl | Grund |
|---|---|---|
| Name | Ms Brandt | Brandt ist auch im Englischen ein glaubwuerdiger Nachname, Kessler bleibt ebenfalls. Ein englischer Ersatzname haette nichts gewonnen und die Figur in zwei Sprachen getrennt. "Ms" ohne Punkt (britisch), steht nur in den Bildbeschreibungen fuer Screenreader. |
| Titel | Tip of the Tongue | Die Wendung "es liegt mir auf der Zunge" heisst "on the tip of my tongue". Kurz genug fuer zwei Zeilen bei 360 px. |
| Uhrzeit | 4:50 p.m. | Englische Uhr; Zifferpruefung erlaubt in EN "4:50" statt "16:50". |
| Anrede | you (ohne Sie/du) | Englisch kennt den Unterschied nicht; die Distanz traegt der Ton ("Get it finished today."). |
| "Sie:" im Rueckblick | She: | "Her:" klingt falsch vor einem Satz. |
| B-Antwort | I know it's ten to five. Kessler doesn't. | Woertlich waere "I know what time it is", "time" ist gesperrt. |
| C-Antwort | …Yes. He found two mistakes in the last one. | "Last time" ist gesperrt ("time"). |
| Noch mal | Again | "One more time" ist gesperrt. |
| Hilfe-Fusszeile | Fear or violence: there is help in your country | Wie DE ohne Link. |
| Anfuehrungszeichen | “…” | `:lang(en) q` in style.css; DE bleibt „…“. |

Sprachwahl: beim ersten Start aus `navigator.languages[0]` (de* -> DE, sonst EN), danach aus localStorage (`adz.lang`).
Umschalter "DE | EN" klein oben rechts nur auf dem Startbildschirm. `?reset=1` leert localStorage und laedt ohne den Parameter neu.
Beide Sprachdateien sind im JS-Bundle (statischer Import); der Service Worker cacht damit beide.

Service Worker: `src/sw.js` ist eine Vorlage; das Vite-Plugin in `vite.config.ts` schreibt beim Build `dist/sw.js` mit
der Liste aller gebauten Dateien und einem Cache-Namen aus dem Inhalts-Hash (`adz-<12 Zeichen>`). Alte `adz-*`-Caches
loescht `activate`. Seiten: erst Netz, offline aus dem Cache; Dateien: erst Cache. `ignoreVary`, weil der Vite-Server
`Vary: Origin` sendet und Skripte sonst offline nicht aus dem Cache kamen. Im Dev-Server ist kein Service Worker aktiv.

## Offen

- Die Hilfe-Fusszeile verlinkt noch nichts. Nummern und Links nach Land brauchen offizielle Quellen (Spielkonzept 8, `content/help.json`).
- Gesichtswechsel nur im Bild geprueft, nicht auf einem echten Geraet.
- Auf 360x640 ist die Buehne nur 140 px hoch, das Gesicht dort klein, der Tisch endet sichtbar vor dem Rand. Geprueft sind 390x844, 360x640, 375x667, nur in Chromium.
- Englischer Text ist nicht von einer Muttersprachlerin gegengelesen.
- Offline nur in Chromium (Playwright) auf localhost geprueft; Safari auf iOS und GitHub Pages ungeprueft.
