# Aether

Evidensbaserad träningsapp som anpassar passen efter din dagsform och räknar fram kost och fasta utifrån din kropp och ditt mål. Ren HTML/JS, ingen server – all data sparas lokalt i webbläsaren.

Öppna `index.html` (behåll mapparna `css/`, `js/` och `images/`).

## Filstruktur
```
index.html            sidans struktur
css/style.css         grundutseende
css/tema.css          tema 2.0 (glasmeny, mätare, mjuka kort) – laddas sist
js/data/grund.js      övningar, mallar, måltider, muskelkarta
js/data/livsmedel.js  Livsmedelsverkets livsmedelsdatabas (laddas först vid sökning)
js/state.js           spara/ladda och träningsmotorn
js/navigering.js      flikar och menyer
js/traning.js         Idag, passloggning, vilotimer, framsteg
js/kost.js            kost- och fastemotor
js/mat.js             matdagbok, sök, streckkod, eget livsmedel
js/backup.js          automatiska kopior och backup-fil
js/tema.js            hemskärmens mätare
js/program.js, hem.js, profil.js, maltider.js, kunskap.js, hjalp.js, ikoner.js
js/app.js             startar appen
images/foto/          egna fotorealistiska huvudbilder (13 övningar)
images/ex/            två bilder per övning (start- och slutläge), visas som "rörelsen"
```
Vanliga `<script>`-taggar (inte moduler), så appen fungerar även när `index.html` öppnas direkt från datorn.

## Profil & personligt
- **Startguide i 6 steg**: namn och färg, om dig, mål och ditt varför, träning, hälsa & kost – och ett färdigt program byggt från dina svar
- **Profil** (cirkeln uppe till höger): om mig, kropp & mått (fettprocent, midja, hals, höft, bröst, arm, lår med historik), mål & motivation (målvikt, måldatum med tempo-kontroll), träning, hälsa & återhämtning, kost
- Profilens fullständighet visas i procent med tips om vad som saknas
- **Utseende**: mörkt, ljust eller följ telefonen, 7 accentfärger, större text
- **Hemskärm**: välj vilka kort som visas och i vilken ordning
- Kosthållning (allätare–vegan) styr måltidsförslag och inköpslista
- **Välj protein i varje måltid** (kyckling, kött, fisk, skaldjur, ägg, mejeri, vegetariskt) och filtrera förslagen
- **Allergier & intoleranser** (mjölk, laktos, ägg, fisk, skaldjur, nötter, jordnötter, gluten, soja, sesam) filtrerar eller byter ut ingredienser, t.ex. glutenfri pasta

## Hemskärm
Hälsning, tre mätare (dagsform, kost, veckans pass), veckoremsa med dagens markering, snabb incheckning av dagsform (5 knappar), stort passkort med tid och muskler, rutor för kost, fasta, vikt och träningssvit samt "Dagens fakta" från kunskapsbanken.

## Navigering
- **Idag** – dagsform, dagens pass, snabbrutor för kost, fasta och vikt
- **Träna** – Logga · Program · Övningar (51 övningar med bilder på start- och slutläge, filter för gym/hantlar/kroppsvikt) · Period (säsong, faser)
- **Kost** – Idag (mål & måltider) · Fasta · Kropp & mål · Råd
- **Framsteg** – vikt, rekord, beräknat max, historik
- **Kunskap** – 28 artiklar om fasta, kost, träning, återhämtning, tillskott och myter, med evidensnivå och källor
- **Kugghjulet** (uppe till höger) – profil, guide, ordlista, evidens & källor, data/backup

Alla `?`-knappar förklarar begrepp på enkel svenska.

## Träningsprogram
- **Programgenerator**: mål (muskler, styrka, fettminskning, kondition, hälsa), 2–7 dagar, tid per pass, utrustning, erfarenhet, konditionsform och dubbelpass – med förklaring och källor till varje val
- **Program över flera veckor** (1–16 veckor) med progression per mål: mer volym (muskler), linjär eller varierad belastning (styrka), mer kondition (kondition/fett/hälsa) och valfri lättare vecka
- **Eget veckoschema** för alla 7 dagar med upp till två pass per dag (dubbelpass), olika upplägg per vecka, kopiera vecka till alla
- Bygg egna styrkepass (välj övningar, set, reps, RPE) och konditionspass (Zon 2, 4×4, 15/15, återhämtning)
- Idag-vyn följer veckodagen: växla mellan pass 1 och 2, vilodagar och "träna ändå"
- Kontroll mot WHO:s rekommendationer och ≥10 set per muskel och vecka

## Matdagbok
- **Sök bland 2 600 livsmedel** från Livsmedelsverkets livsmedelsdatabas, med vardagsord (t.ex. "keso", "nötfärs", "knäckebröd")
- **Skanna streckkod** med kameran – produkten hämtas från Open Food Facts. Finns den inte kan du skriva av förpackningen en gång, sedan hittas den direkt
- **Eget livsmedel** med värden per 100 g och portionsstorlek
- Välj gram och måltid (frukost, lunch, middag, mellanmål)
- **Dagbok**: kcal kvar (mål − mat), protein/kolhydrater/fett mot målen, måltider grupperade, senaste 7 dagarna

## Säker data
- Automatisk kopia i webbläsaren varje dag (de senaste 14 dagarna), återställningsbar under Data & backup
- **Spara backup-fil** – på mobilen via dela-menyn (Filer, Drive, mejl), annars nedladdning
- Påminnelse på hemskärmen om backup-filen är äldre än 7 dagar
- Appen ber webbläsaren om beständig lagring

## Kost & fasta
- Fettprocent: ange själv eller mät med måttband (US Navy-metoden)
- BMR: Katch–McArdle om fettprocent finns, annars Mifflin–St Jeor
- Takt för fettminskning efter fettprocent (0,4–1 %/vecka), överskott efter träningserfarenhet
- Protein: 1,6–2,2 g/kg, 2,3–3,1 g/kg fettfri massa i underskott, räknat på FFM vid högre fettprocent
- Fasta: 12:12, 14:10, 16:8, 18:6, 20:4, OMAD, 5:2, varannandagsfasta – med evidensnivå, ätfönster, lågdagar och råd om fastande träning
- Varje råd har källhänvisning (se Inställningar → Evidens & källor). Källorna är kontrollerade mot publicerade sammanfattningar (PubMed m.fl.).

## Källor för data och bilder
- Livsmedel: Livsmedelsverkets livsmedelsdatabas (dataportal.livsmedelsverket.se)
- Streckkoder: Open Food Facts (ODbL)
- Övningsfoton i images/foto/: Aethers egna bildpaket
- Start/slut-bilder: Free Exercise DB (public domain, github.com/yuhonas/free-exercise-db)

Appen ersätter inte råd från vården.
