# Notizen zum Bau

## Textaenderungen gegenueber dem Skript

Quelle: `kern-minimal.md` Abschnitt 4 (Projekt kommunikation-spiel). Pflichtpunkte aus `blindtest-synthese.md`.
Umlaute und Auslassungspunkte (…) sind im Spiel typografisch gesetzt; das zaehlt nicht als Aenderung.

| Stelle | Alt | Neu | Grund |
|---|---|---|---|
| Lage | Deine Chefin. Freitag, 16:50. Du willst um fuenf gehen. | Deine Chefin. Freitag, 16:50. Du willst um fünf gehen. Schon oft bist du länger geblieben. | Pflichtpunkt 1: "Wie immer" (D) und "jeden Freitag" (H) setzen Vorgeschichte voraus. Die Lage nennt sie jetzt. |
| C | Geht es Ihnen darum, dass Kessler diesmal nichts findet? | Geht es Ihnen darum, dass Kessler keinen Fehler findet? | Pflichtpunkt 1: "diesmal" setzt das letzte Mal voraus. Ihre Antwort erzaehlt es jetzt erst. |
| E nach C (Antwort) | Passt mir nicht. Aber gut, Montag zehn Uhr. | Eigentlich wollte ich alles Montag früh. …Gut. Den Rest bis zehn, nicht später. | Pflichtpunkt 2: Ihre Forderung war "Montag frueh komplett". Die Antwort macht hoerbar, dass sie nachgibt. Forderung und E bleiben. |
| G (Antwort) | Die Preise. Der Text hat Zeit bis Montag zehn. Machen Sie die Preise, dann gehen Sie. | Die Preise. Der Text kann bis Montag zehn warten. Machen Sie die Preise, dann gehen Sie. | "Zeit" steht auf der Sperrliste (shots.js). Sinn gleich. |
| Innensatz | Wenn Kessler noch mal Fehler findet, bin ich dran. | Mein Chef hat gefragt, ob ich Kessler noch im Griff habe. Ich weiß es selbst nicht. | Pflichtpunkt 3: Der alte Satz wiederholte ihre Antwort nach C. Der neue zeigt Neues: die Angst vor dem eigenen Chef. |
| Rueckblick, Kostenzeile | Was es gekostet hat: | Es gibt kein Richtig. Das hat es gekostet: | Pflichtpunkt 5. Wortlaut aus der Synthese, Punkt durch Doppelpunkt ersetzt, weil der Preis darunter folgt. |

## Neue Texte (nicht im Skript)

| Stelle | Text | Herkunft |
|---|---|---|
| Start | Auf der Zunge / Jemand will etwas von dir, und du überlegst, was du sagst. / Los | Bildfolge Bild 1 |
| Start, Fusszeile | Bei Angst oder Gewalt: Hilfe in deinem Land | Bildfolge Bild 10, laut Pflichtpunkt 6 nur noch auf dem Start (ein Menue gibt es noch nicht) |
| Ende | Für heute ist das alles. / Noch mal | neu, Auftrag Meilenstein 1 ("Ende mit Noch mal") |
| Ende Gespraech | Das Gespräch ist zu Ende. / Weiter | kern-minimal Abschnitt 3, Bild 8 |

## Weitere Entscheidungen

- Pflichtpunkt 4 (Gesichtswechsel deutlicher): Gesichter in `src/engine/faces.ts` mit groesserem Abstand.
  "offener" hebt die Brauen, oeffnet die Augen weiter (lid negativ), nimmt die Kieferstriche weg, neigt den Kopf und beugt sie vor.
  "zu" verschraenkt die Arme und wendet den Blick ab. Wechsel als Ueberblendung, 450 ms.
  Nach B bleibt das Gesicht "angespannt" wie vorher, so steht es im Skript. Dort ist also kein Wechsel zu sehen.
- Skriptbegriffe zu Gesichtern: angespannt = tense, zu = closed, offener = opening, offen = open,
  "angespannt, wendet sich ab" = tenseAway (Blick zur Seite und nach unten), "Pause, Gesicht hart" = hard (Arme verschraenkt, Blick direkt).
  Die Pause vor H steckt im Bildschirm "Gesicht wechselt", der vor jeder Antwort kommt.
- Pflichtpunkt 6: Hilfe-Fusszeile nur auf dem Start, nicht im Rueckblick.
- Innensatz: nur im Rueckblick (kern-minimal: im Gespraech erst Tag 2). Der Rueckblick zeigt Zeile fuer Zeile: Gesicht und Gesagtes, dann Innensatz, dann Preis.
- "Noch mal" startet das Gespraech mit demselben Seed, also gleicher Kartenreihenfolge.
- Die Hilfe-Fusszeile hat 14 px (Regel >= 17 px gilt fuer die Saetze des Spiels).

## Offen

- Die Hilfe-Fusszeile verlinkt noch nichts. Nummern und Links nach Land brauchen offizielle Quellen (Spielkonzept 8, `content/help.json`).
- Gesichtswechsel nur im Bild geprueft, nicht auf einem echten Geraet.
- Nur 390x844 geprueft. Auf kleineren Handys schrumpft die Buehne (38 % der Hoehe), bei langen Karten kann die Seite scrollen.
