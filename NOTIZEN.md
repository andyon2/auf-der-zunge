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
| Kostenzeile Pfad G (M2b) | Heute noch die Preise. | Du bleibst heute noch für die Preise. | Tester 8 (V10 M2): unklar, was wen gekostet hat. Der Satz nennt jetzt dich und den Preis (du bleibst). 1 Zeile bei 390, 1 bei 360. EN: "Staying late today for the prices." |
| Kostenzeile Pfad E (M3) | Heute bis sechs das Grobe. | Du bleibst heute bis sechs für das Grobe. | Auftrag M3, Nebenpunkt aus M2: gleiche Du-Form wie G und H. EN: "You stay until six for the rough version.", dazu EN G angeglichen: "You stay late today for the prices." (vorher "Staying ..."). |
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
  Seit M2b reine Funktion `nextRound()` in `src/engine/rng.ts` mit Unit-Test.
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
| Noch mal | Play again (M2b, vorher "Again") | Review M2 K1. "One more time" ist gesperrt. |
| Hilfe-Fusszeile | Afraid, or facing violence? There is help in your country. (M2b) | Review M2 S1, vorher "Fear or violence: there is help in your country". Wie DE ohne Link. |
| I-Antwort (M2b) | Good for you. I still want the proposal on my desk first thing Monday. | Review M2 M1: "The proposal is still on my desk" klang, als laege es schon dort. |
| C-Antwort (M2b) | …Yes. He found two mistakes in the last proposal. | Review M2 S1: "the last one" war unklar. |
| Kostenzeile E (M2b, M3) | You stay until six for the rough version. | Review M2 S1: vorher "The rough version, today until six."; M2b "Staying ...", seit M3 Du-Form wie DE. G ebenso: "You stay late today for the prices." |
| Anfuehrungszeichen | “…” | `:lang(en) q` in style.css; DE bleibt „…“. |

Umschalter (M2b, Tester 7 und Review K4): aktive Sprache dunkel, fett und unterstrichen, die andere gedaempft (--ink-3);
Tippflaechen 48 x 48 px wie STIL.md (vorher 44). shots.js prueft 48 px und welche Sprache als aktiv markiert ist.

Sprache vor dem ersten Bild (M2b, Review K6): ein kleines Inline-Skript in `index.html` setzt `<html lang>` und den
Seitentitel aus `adz.lang` bzw. `navigator.languages[0]`, bevor das Hauptskript laedt; `src/main.ts` liest nur noch
`<html lang>`. Die beiden Titel stehen dort ein zweites Mal (Inline-Skript kann kein JSON importieren).

`?reset=1` (M2b, Review S2) entfernt nur `adz.lang` und `adz.round`, kein `localStorage.clear()`: auf GitHub Pages
teilen sich alle Projektseiten eines Kontos die Origin.

Gespraechszeilen (M2b, Review S4): werden nur angehaengt, aeltere entfernt; `aria-live` liest so nur die neue Zeile.
Sichtbar bleiben wie vorher zwei Zeilen. Mit echtem Screenreader nicht geprueft.

Sprachwahl: beim ersten Start aus `navigator.languages[0]` (de* -> DE, sonst EN), danach aus localStorage (`adz.lang`).
Umschalter "DE | EN" klein oben rechts nur auf dem Startbildschirm. `?reset=1` leert localStorage und laedt ohne den Parameter neu.
Beide Sprachdateien sind im JS-Bundle (statischer Import); der Service Worker cacht damit beide.

Service Worker: `src/sw.js` ist eine Vorlage; das Vite-Plugin in `vite.config.ts` schreibt beim Build `dist/sw.js` mit
der Liste aller gebauten Dateien und einem Cache-Namen aus dem Inhalts-Hash (`adz-<12 Zeichen>`). Alte `adz-*`-Caches
loescht `activate`. Install laedt mit `cache: 'reload'` am HTTP-Cache vorbei (M2b, Review S3: Pages liefert HTML mit max-age=600,
sonst konnte ein altes index.html mit alten Asset-Namen im neuen Cache landen). Seiten: erst Netz, offline aus dem Cache; Dateien: erst Cache. `ignoreVary`, weil der Vite-Server
`Vary: Origin` sendet und Skripte sonst offline nicht aus dem Cache kamen. Im Dev-Server ist kein Service Worker aktiv.

## Tag 2 (M3)

Vorlage: `arbeit/08-bau/m3/skript-tag2.md` (Projekt kommunikation-spiel). Alle deutschen Saetze woertlich aus dem Skript,
auch Lage, Echo-Zitate, Innensatz, Kostenzeilen, Start-Saetze, Einmal-Saetze und "Was schreibst du?".

- Struktur `content/tag2.json`: fuenf Haende, `after`-Reihenfolge wie "Hinweise fuer den Bau". Antworten, die im Skript
  wortgleich mehrfach vorkommen, haben eine ID: I nach R1 und nach B/C = `I.reply.warm`, I nach A und nach F = `I.reply.cool`.
- Engine: `echo` an der Antwort setzt das Echo (Text-ID), `unecho: true` nimmt es weg, sonst bleibt es bis zum Ende.
  Nie mehr als eins (Feld, keine Liste). Tests in `src/engine/tag2.test.ts`: alle 21 Pfade, fuenf Enden, die Echo-Tabelle des Skripts, die fuenf Testpfade.
- Texte: Tag 2 nutzt die `ui.*`-Beschriftungen von Tag 1 und ueberschreibt mit `content/<lang>/tag2.json`.
- Neue Texte ohne Vorlage im Skript (nur fuer Screenreader): `ui.stage` "Jule mit dem Handy" / "Jule with her phone",
  `ui.face` "Jule" (Bildbeschreibung Rueckblick). Chat-Nachrichten haben ein unsichtbares "Sie:" / "Du:" fuer Screenreader.
- Figur Jule (`src/ui/figure.ts`): lange dunkle Haare, Hoodie, keine Brille, Farben `--skin-b/--hair-b/--cloth-b` aus STIL.md.
  Handy in beiden Haenden wie in der Bildfolge. Bei verschraenkten Armen (zu, hart) haelt sie es in der rechten Hand, es ragt
  ueber die Hand; in der Bildfolge lag es dann mitten auf den Armen (weisses Rechteck ueber dem Arm, im gebauten Bild unlesbar).
- Buehne Tag 2: Zimmer mit Fenster, kein Tisch, gleiche Hoehe wie Tag 1 (`clamp(140px, 100dvh - 500px, 300px)`), nicht 256 px
  wie STIL.md fuer die Chat-Szene (dort mit Druck-Hebel, den es nicht gibt).
- Echo: fester Platz links oben in der Buehne, Zitat in `--ink-3`, Ziegelwort in `--brick` fett, auf einem kleinen Feld in
  `--paper-2`. Das Feld ist eine Abweichung von STIL.md: ohne Feld liegt das graue Zitat auf Raumfarbe und dunklen Haaren.
  Es erscheint im Takt des Gesichtswechsels. Am Ende bleibt es stehen, im Rueckblick steht es ueber Jules Gesicht im selben Kasten
  (nicht darueber gelegt: bei 360 px haette es das Gesicht verdeckt).
- Einmal-Saetze: "Hier siehst du, was du im Chat nie siehst." steht beim ersten Bild unten in der Buehne (Antwort auf Autorfrage 2,
  siehe bericht M3), die Lage darunter wie an Tag 1. "Manches, was du sagst …" erscheint beim ersten Echo des Gespraechs unter der
  Buehne. Beide verschwinden mit der naechsten Antwort, ebenso die Lage.
- Chat: Jules Nachrichten als Blasen links (`--paper-2`, Rand), deine rechts (`--paper-3`); Karten unveraendert.
  Takt wie Tag 1. Nur zwei Zeilen sichtbar wie Tag 1.
- Lage Tag 2 hat 131 Zeichen und braucht bei 17 px vier Zeilen (bei 390, 375 und 360 px). Woertlich aus dem Skript, darum nicht gekuerzt;
  shots.js laesst fuer `#lage` ueber 120 Zeichen vier Zeilen zu. Entscheidung beim Autor.
- Ablauf: Rueckblick Tag 1 → "Weiter" → Start Tag 2 (ein Satz, "Weiter", Hilfe-Fusszeile) → Gespraech → Rueckblick → Ende
  ("Für heute ist das alles.", "Noch mal" startet Tag 1 mit neuem Seed). Das Ende von Tag 1 steht in `adz.day1end`
  (Buchstabe des Endes); bei E oder G nennt der Start Tag 2 Kessler, fehlt der Wert, der Standardsatz.
  `?tag=2` startet direkt beim Start Tag 2; `?reset=1` loescht auch `adz.day1end`.

### Nachbesserung 3b

- Erklaersatz beim ersten Echo (V10: nur einer von drei Testern verstand das Echo sofort, "Oben steht, was." wurde als
  Satzbruch gelesen): DE "Was oben steht, bleibt im Raum hängen." (Vorgabe Synthese M3), EN "What's up top still hangs in the air."
  ("hangs in the air" ist die gelaeufige Wendung fuer etwas Gesagtes, das nachwirkt). Weiterhin nur einmal, weg mit der naechsten Antwort.
- Screenreader (Review M3 Pflicht 1): eigene unsichtbare Zeile `#echo-say` (aria-live polite). Kommt ein Echo, liest sie das
  Echo-Zitat, beim ersten Echo mit dem Erklaersatz davor in derselben Ansage. Geht es (R1, R2), liest sie neuen Text `ui.echoGone`
  DE "Oben steht nichts mehr." / EN "Nothing up top any more." (ohne Vorlage, nur fuer Screenreader). `#hints` ist dafuer keine
  live-Region mehr, so wird der Erklaersatz nicht doppelt gelesen. Mit echtem Screenreader nicht geprueft.
- Tests (Review Pflicht 2): `day2Line()` in `src/ui/app.ts` waehlt den Startsatz, Vitest `src/ui/app.test.ts` (E, G, D, H, I,
  leer, unbekannt). shots.js prueft nach jedem Tag-1-Lauf `adz.day1end`, im Reset-Lauf dass `?reset=1` ein gesetztes
  `adz.day1end` loescht und `?tag=2` danach den Standardsatz zeigt, und je Echo-Wechsel den Text von `#echo-say`.
  Gegenprobe: mit absichtlich entfernter Ansage bzw. ohne Loeschen beim Reset meldet shots.js 12 bzw. 4 Befunde.

### Ergaenzung M4: Erklaersatz Echo

- Ein Tester hielt den Satz oben fuer Jules Aussage. Erklaersatz neu: DE "Dein Satz oben bleibt im Raum hängen.",
  EN "Your line up top stays hanging in the air." (beide Vorgabe Koordinator). Ersetzt den Satz aus 3b.
- EN einheitlich "anymore": `ui.echoGone` jetzt "Nothing up top anymore." (vorher "any more"), wie in C.reply.
- shots.js liest beide Saetze aus `content/*/tag2.json`, prueft also ohne Aenderung den neuen Text.

### Englisch Tag 2

Eigener Text, gleicher Ton. Jule schreibt klein, ohne Smileys; Namen Jule, Leo, Tom bleiben.

| Stelle | Wahl | Grund |
|---|---|---|
| A / Echo | You know full well my brother's moving on Sunday. / “You know full well …”, Ziegel "know full well" | "du weißt doch" ist ein Vorwurf; "you know full well" traegt ihn, "you know" allein nicht. |
| F / Echo | Why not ask Tom? He's Leo's dad too. / “Why not ask Tom?”, Ziegel "Tom" | wie DE: der Name ist der Stich. |
| R1 | Sorry, that was snippy. I could take Leo from two. | "sharp" steht auf der Sperrliste. |
| Kostenzeile G | You have Leo from two, and she won't be asking you again soon. | "any time soon" ginge nicht ("time"). |
| Start Tag 2 | Day two. Jule sent you a message. / … Kessler has his proposal, and Jule sent you a message. | "has written" klingt nach Brief. |
| Einmal-Saetze | Here you see what you never see in a chat. / Your line up top stays hanging in the air. (M4) | kein "echo" (Sperrliste). |
| E (3b) | I'm helping with the move till two. Then I'll take Leo. | Review M3: "I'm at the move" unidiomatisch. Vorschlag "I'm helping with the move in the morning. I'll take Leo from two." hat 66 Zeichen (Skript-Marke 61); "till two" sagt dasselbe kuerzer, Jules Antworten "from two" passen weiter. |
| C.reply (3b) | …yeah. i've been doing everything alone for weeks. i can't do this anymore. | Review M3, Vorschlag uebernommen. |
| R2.reply (3b) | it's fine. from two helps. i'll get the morning sorted. | Review M3, Vorschlag uebernommen (DE "krieg ich hin"). |
| E.reply.afterC (3b) | from two would already help. it's just the morning i can't manage. | Review M3: "would be a lot" klang nach "zu viel". Vorschlag "would already be something" sinngemaess, "already help" kuerzer und gelaeufiger. |
| G (3b) | You can still manage the morning, can't you? | Review M3, Vorschlag uebernommen (weniger gestelzt als "Surely ..."). |
| ui.write (3b) | What do you write back? | Review M3, Vorschlag uebernommen; Jule hat immer zuletzt geschrieben. |
| R2 | Sorry, that thing about Tom was dumb. I'll take Leo from two. | Review-Vorschlag "that Tom remark" nicht uebernommen: klingt foermlicher, der Satz ist umgangssprachlich. |
| D, H | ... cancel on my brother ... | bleibt (Synthese M3, Tester 12: idiomatisch). |

## Hilfeseite (M4)

Grundlage: Spielkonzept 8, `arbeit/08-bau/m4/help.json` und `hilfe-quellen.md` (Projekt-Repo), Auftrag M4.

- `content/help.json`: Entwurf uebernommen, Felder unveraendert, keine Nummer geaendert. Gestrichen: intl-Eintrag
  "116 Nummern (116 123 u.a.)" (schwache Quelle, Empfehlung hilfe-quellen.md). Sonst wortgleich.
- Land (`src/engine/help.ts`): Region der ersten Browsersprache (DE, AT, CH, GB, US, IE), ohne Region die Zeitzone
  (Berlin, Wien, Zuerich, London, Dublin, Zonen der USA → USA, siehe 4b), sonst intl. Eine Region ausserhalb der Liste (fr-FR) ergibt intl,
  nicht die Zeitzone. `?land=xx` ueberschreibt (nur bekannte Laender).
- Ansicht: der vorhandene Hinweis `ui.help` ist ein Link-Knopf (17 px, unterstrichen, 44 px hoch, vorher 14 px Text) am Start,
  am Start Tag 2, am Ende und neu unter dem Weiter-Knopf im Rueckblick. Er oeffnet die Hilfeseite im Spiel: das Spiel wird
  nur versteckt, "Zurück" setzt dieselben Knoten wieder ein (Zustand, Schritt, Scrollstelle bleiben, Fokus zurueck auf den Link).
  `?hilfe=1` oeffnet sie direkt.
- Je Eintrag: Name (`name_de` / `name_en`), jede Nummer als `tel:`-Link (mehrere in `number` mit " / " getrennt, nur Ziffern
  im Link: "1-800-799-SAFE (7233)" → tel:18007997233), Zeiten (`hours`), Link auf `url` im neuen Tab, Linktext = Domain.
  Find A Helpline hat keine Nummer, nur den Link.
- Datum: das aelteste `checked` der angezeigten Eintraege, ausgeschrieben ("7. Oktober 2026" / "7 October 2026").
- Umschalter: zeigt die Seite das erkannte Land, fuehrt ein Knopf zu "Weitere Länder" (intl) und von dort zurueck. Wurde kein
  Land erkannt, gibt es keinen Knopf.
- Rueckblick 390x844: mit dem Hilfe-Link ist der Rueckblick in Schritt 3 bis 69 px hoeher als der Schirm. Der Link steht
  unter "Weiter" und ist dort per Scrollen erreichbar; shots.js zaehlt fuer "ragt unten raus" im Rueckblick nur, was ueber
  dem Link steht. Gesicht und Abstaende des Rueckblicks nicht geaendert (Auftrag: nur der Link).

Neue Texte (`content/<sprache>/tag1.json`, gelten fuer beide Tage):

| ID | DE | EN | Grund |
|---|---|---|---|
| ui.helpSafe | Bei Angst oder Gewalt schuldest du niemandem Verständnis. Sicherheit geht vor. | Afraid, or facing violence? You owe no one understanding. Safety comes first. | DE Vorgabe (Konzept 8, Auftrag M4). EN sinngemaess, Anfang wie `ui.help` EN. Erste Fassung "If you're afraid or facing violence, you don't owe anyone understanding. Your safety comes first." brauchte vier Zeilen. |
| ui.helpLand | Land: | Country: | ohne Vorlage |
| ui.land.* | Deutschland, Österreich, Schweiz, Vereinigtes Königreich, USA, Irland | Germany, Austria, Switzerland, United Kingdom, United States, Ireland | Laendernamen |
| ui.land.intl | Weitere Länder | Other countries | DE Vorgabe Auftrag |
| ui.helpChecked | Quellen geprüft am | Sources checked on | DE Vorgabe Auftrag, Datum dahinter |
| ui.back | Zurück | Back | DE Vorgabe Auftrag |

### Nachbesserung 4b

- Neues Feld `hours_en` je Eintrag in `content/help.json`: woertliche Uebersetzung von `hours`, keine neuen Angaben
  (Vorgabe Koordinator). Uhrzeiten als "Mon-Fri 10:00-17:00" statt "10-17 Uhr", "kostenlos" als "free of charge".
  Die EN-Seite zeigt `hours_en`, ohne `lang="de"`.
- Echte Umlaute in `hours`: "möglich", "175+ Länder", "EU-Ländern" (vorher ae/oe), auch in der Kopie im Projekt-Repo
  `arbeit/08-bau/m4/help.json`. `name_de` hatte keine Ersatzschreibung. Nummern, URLs, `source`, `name` unveraendert.
- Zeitzone ohne Region (Regel umgedreht, Vorgabe Koordinator): nur Zonen der USA ergeben us (New_York, Chicago, Denver, Phoenix, Los_Angeles, Anchorage, Adak, Pacific/Honolulu, Detroit, Indiana/*, Kentucky/*, Boise, Juneau, Sitka, Nome, Metlakatla, Menominee, North_Dakota/*), jede andere America/*-Zone intl.

Regeln auf der Hilfeseite (shots.js, eng begrenzt auf Schritt `help`): Ziffern nur in Nummern, Links, Zeiten und Datumszeile;
Sperrliste fuer alles ausser Nummern, Namen der Stellen und Links. Vitest prueft die Sperrliste DE auch fuer alle `hours`.

## Offen

- `hours_en` ist uebersetzt, nicht aus englischen Quellen uebernommen; nicht von einer Muttersprachlerin gegengelesen.
- Die Nummern sind nicht angerufen, die Links nicht im Lauf geoeffnet (nur Ziel und neuer Tab geprueft).
- Hilfeseite nur in Chromium geprueft; `tel:` auf einem echten Telefon ungeprueft. Rueckblick: Hilfe-Link bei 390x844 erst nach Scrollen sichtbar.
- Gesichtswechsel nur im Bild geprueft, nicht auf einem echten Geraet.
- Tag 2: Jules Gesichter und das Echo nur im Bild geprueft (Chromium, drei Groessen), nicht auf einem Geraet.
- Auf 360x640 ist die Buehne nur 140 px hoch, das Gesicht dort klein, der Tisch endet sichtbar vor dem Rand. Geprueft sind 390x844, 360x640, 375x667, nur in Chromium.
- Englischer Text ist nicht von einer Muttersprachlerin gegengelesen.
- Offline nur in Chromium (Playwright) auf localhost geprueft; Safari auf iOS und GitHub Pages ungeprueft.

## 2026-10-07 Nachtrag E12

- Deutsch ist Standard: `index.html` nimmt ohne gespeicherte Wahl `adz.lang` immer `de`; die Browsersprache zaehlt nur noch fuer die Hilfe-Seite (`detectLand`). `?reset=1` fuehrt damit zu Deutsch. `scripts/shots.js` speichert fuer die englischen Laeufe `adz.lang=en` vorab und erwartet nach `?reset=1` auf beiden Locales Deutsch.
- Zurueck-Geste: ein Verlaufseintrag je Oberflaeche ausser dem Startbild (Gespraech, Rueckblick-Schritte, Tag 2, Ende, Hilfe), gleiche URL. Hilfe und Rueckblick-Schritte folgen der Geste; Gespraech, `review-1`, Tag 2 und Ende holen sie mit `history.go()` zurueck (kein neues `pushState`, das braucht keine Nutzergeste). `#back` ruft `history.back()`.
- Kein Test fuer `popstate` in `app.test.ts`: die Testumgebung ist `node`, jsdom ist nicht installiert (keine neue Abhaengigkeit dafuer). Abgedeckt ist es durch den Playwright-Durchlauf (Hilfe, Gespraech, Rueckblick, Tag 2, `?hilfe=1`). Die Sprachwahl ist in `app.test.ts` getestet (Inline-Script aus `index.html` mit Stubs ausgefuehrt).
- Offen: Verhalten nur in Chromium (Desktop-Emulation) geprueft, nicht auf Chrome Android oder iOS Safari mit echter Zurueck-Geste. Nach Reload auf einem Rueckblick-Eintrag zeigt Zurueck frueher gespielte Eintraege als neue Seite (Startbild); gewollt, da kein Spielstand gespeichert wird.

## Staffel 1

- Szenen `content/{dachboden,samstag,gans}.json` und `content/de/<name>.json`, 1:1 aus Szenenbauer Lauf 4. Gans hat zusaetzlich `"frame": "phone"`. Die de-Dateien tragen je vier eigene `ui.*`-Schluessel: `lastQuestion` ("Eine Frage hast du noch."), `observe` ("Was ist da passiert?"), `stage` und `face` (Figurenname). Alle anderen UI-Texte kommen aus `de/day1.json`.
- `?szene=dachboden|samstag|gans` startet die Szene direkt: Lage, Gespraech, letzter Zug, Rueckblick, Ende. Unbekannter Name: normales Spiel. Ohne `?szene` laufen Tag 1 und Tag 2 wie vorher. Die Szenen spielen immer deutsch (Englisch faellt ohne Fehler auf Deutsch zurueck). `adz.day1end` wird in einer Szene nicht gespeichert. "Noch mal" spielt dieselbe Szene neu.
- Neue Felder in `Scene` (`src/engine/game.ts`):
  - `who`: zusaetzlich `mira`, `albers`, `mutter` (Figuren in `src/ui/figure.ts`, Farben `--*-c/d/e` in `style.css`). Die Mutter haelt das Telefon (`phone: true`, wie Jule).
  - `frame?: 'chat' | 'phone'`: `phone` rendert wie von Angesicht.
  - `review.inner` ist optional; fehlt es, entfaellt der Schritt.
  - `guess`: vier Ratekarten `{ id, weight, text, reply, face, alt?, short? }`, mit dem Seed gemischt (nach den Haenden, Tag 1 und Tag 2 bleiben gleich). `weight` wird nie gezeigt.
  - `guessShortAfter`: Enden, nach denen sie mit `short` antwortet. Die Karten zeigen immer `text` (siehe unten).
  - `observe`: Satz je Pfad (`"A-E-H"`), im Rueckblick hinter dem Link "Was ist da passiert?". Fehlt der Schluessel, fehlt der Link.
- Letzter Zug nach dem Ende: Buehnenzeile, vier Karten, ihre Antwort mit Gesicht, dann Kosten und Rueckblick. Die Wahl aendert weder Ende noch Kosten. Karte und Antwort stehen im Rueckblick-Verlauf.
- Schalter `TREPPE: 'stufe' | 'eigene'` in `game.ts`, Standard `'stufe'` (immer `reply`); `'eigene'` nimmt `alt`, wo vorhanden.
- `short` ist ihre Antwort, nicht der Kartentext: `dachboden.md` Spalte "nach E (kurz, von der Leiter)". Der Auftrag sagte "short statt text fuer die Karten"; umgesetzt ist die Lesart der Daten, Spieltext unveraendert.
- `scripts/shots.js` spielt jede Szene bis zu jedem Ende (390 und 360, dazu 375, dunkel und mit gespeichertem `en`). Port per `SHOTS_PORT` aenderbar (Standard 4179).
- Offen: Lage, einige Antworten und Kostenzeilen sind laenger als die Zeilengrenze; bei 390/360 ragen Hand und Rueckblick unten raus (Befunde aus dem Text, nicht gekuerzt).
- Lauf 5: Texte auf Shots-Laenge gekuerzt, Befund-Vorschlaege eingearbeitet
- Lauf 6: sechs schwaechere Zeilen nach Ausbilder Lauf 5 gesetzt (Dachboden lage, D, R2, K4; Gans K2, I; Samstag Anrede Herr Kraus), Shots 0 Befunde
