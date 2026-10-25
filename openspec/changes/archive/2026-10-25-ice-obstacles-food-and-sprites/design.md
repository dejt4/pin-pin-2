# Design

## Context

Igra ima arhivirane zmožnosti iz `first-room` in `snowballs-and-animals` (glej `openspec/specs/`). Pravila so v `core/`, živali in muhe/komarji so v `core/animals.js`, zapore poti so pravokotniki za `physics.moveX`. Izvorni listi so RGB PNG brez prosojnosti na črnem ozadju, z napisi pod sličicami. Izmerjeni položaji likov (v točkah izvornika):

- `Pixel Bear and Wolf Animation Sheet.png` (1882 × 836): medved hoja pri x 20, 356, 697 (y 89–347), udarec pri x 1087 in 1492 z zamahi desno; volk hoja pri x 9, 364, 707 (y 480–740), udarec pri x 1071 in 1467.
- `Polar Bear and Ice Obstacle Sprite Sheet.png` (1536 × 1024): beli medved hoja pri x 25, 314, 586 (y 66–273), udarec pri x 926 in 1240; ledena sveča 7 sličic v vrsti y 375–566 (x 36 … 1000); ledeni zid 5 sličic v vrsti y 674–945 (x 23, 328, 628, 914, 1231).
- `Pixel Art Pantry and Wild Companions.png` (1536 × 1024): korenček x 127, jabolko x 467, banana x 778 (y 50–388).

## Goals / Non-Goals

**Goals:**
- Igra v realnem času nariše sličico samo z znanim položajem (sredina, dno) in velikostjo iz `sprite-info.js`.
- Ovire so podatki v sobi, pravila zanje v `core/` in testirana.
- Soba z 600+ stolpci ostane berljiva in urejana po odsekih.

**Non-Goals:**
- Ponovna priprava sličic pingvina (ostane obstoječi `footOffset`).
- Kozarec vode, novi liki, zvok.

## Decisions

### Kontrole
- `config/controls.js`: tipkovnica 37/38/39/40 → smeri, 32 → `throw`; kontroler: križec 12–15 in palčka → smeri, gumb 2 (□) → `throw`. Akcija `jump` se odstrani iz `core/actions.js`.
- `core/player.js`: na tleh `down.up` pri lestvi začne plezanje (kot prej); sicer `pressed.up` sproži skok. Ker plezanje uporablja `down` (držanje), skok pa `pressed` (nov pritisk), držanje gor na vrhu lestve ne skoči. Skok z lestve se odstrani (lestev se zapusti levo/desno, na vrhu ali dnu).
- Gumb Skok se odstrani iz `index.html`; gumb Kepa ostane na levi.

### Soba v odsekih
`config/rooms/room-1.js`: `{ name, sections: [[vrstica, ...], ...] }`. `room.parse` sprejme `sections` ali (za teste) `rows`; vrstice odsekov zlepi po vrsti. Napake povedo odsek (od 1), vrstico in stolpec znotraj odseka. Prva soba bo imela 12 odsekov po 50 stolpcev (600 stolpcev), vsak odsek s svojo temo (prepad, lestev, zid, sveča, žival, stranski nivo), da je urejanje pregledno.

### Hrana
Znak `f` ostane; `room.fish` se preimenuje v `room.food`, vrsta je `(stolpec + vrstica) % 3` → jabolko, korenček, banana. `settings.energy.fish` se preimenuje v `food`. Sličice rib in mapa `src/graphic/fish/` se odstranijo (izvornik `source/fish.png` ostane).

### Ledene ovire (`core/obstacles.js`)
- Iz sobe: `W` → `{ type: 'wall' }`, `i` → `{ type: 'icicle' }`; na mestu znaka ostane prazno.
- **Zid**: trkovni pravokotnik 1 ploščica široko × 2 ploščici visoko, stoji na tleh pod znakom. Zapora za pingvina in živali: stolpec od nad vrhom sobe do tal (kot prej muha). Zadetki 0–5; stopnja za izris: 0–1 cel, 2–3 počen, 4 močno počen; ob 5 `broken`, `breakTime` za animacijo razpada (~0,4 s), nato drobci.
- **Sveča**: visi od spodnjega roba stropne ploščice (vrstica znaka) skoraj do tal (dve ploščici niže, ~70 px), trkovni pravokotnik ~24 px širok na sredini stolpca. Zapora: stolpec od stropa do tal (nad stropom ni zapore). Zadetki 0–3: 0 cela, 1–2 počena, ob 3 `broken`, `breakTime` za padec in razbitje (~0,6 s), nato drobci na tleh.
- Varno mesto (`room.safePoint`) preskoči stolpce z oviro in sosednje stolpce, da pingvin ne pristane v zapori (dodano med implementacijo, zahteva "Varno mesto" je posodobljena).
- `obstacles.hitBy(list, balls)` vrne dogodke `'wall'`/`'icicle'` za točke; `obstacles.blockers(list)` vrne zapore. `core/animals.js` (medved, volk) se obrne, če bi njegov naslednji položaj prekrival zaporo ovire.
- Alternativa: ovire kot posebne ploščice v mreži. Zavrnjeno, ker imajo stanje (zadetki, animacija), ki ne sodi v podatke sobe.

### Živali
- Vrste `bear`, `polar`, `wolf`; muha in komarji se odstranijo iz kode in testov.
- Trkovna pravokotnika: medved/beli medved 58 × 48, volk 54 × 34 (malo manjša od sličice, da je preskok prizanesljiv). Hitrosti in razdalje kot zdaj, beli medved kot rjavi.
- Ulov: `a.pushTime = 0,5 s`, med tem žival stoji in kaže udarec; pingvin se takoj vrne na varno mesto (kot zdaj).
- Animacija hoje: `floor(walkTime * 8) % 4` v zaporedju 1, 2, 3, 2; `walkTime` teče samo med hojo.

### Priprava sličic (`tools/sprites.js`, `tools/sprites.json`)
- Razvojna odvisnost `pngjs` (čisti JavaScript, brez prevajanja), ukaz `npm run sprites`.
- `sprites.json` opiše skupine: izvorni list, izhodna mapa, sličice z izrezom `[x, y, w, h]`, neobveznimi pravokotniki za brisanje (`clear`, npr. zamah sosednje sličice), ciljno višino telesa v igri in način poravnave.
- Postopek za vsako sličico:
  1. Izrez.
  2. Ozadje: zapolnjevanje od roba izreza po točkah s svetlostjo ≤ prag (privzeto 30) → prosojno. Temne točke znotraj lika niso povezane z robom in ostanejo.
  3. Telo = največja povezana skupina točk; njegov spodnji rob in vodoravna sredina sta sidro.
- **Poravnava `bottom`** (živali, hrana, zid): merilo skupine iz višine telesa prve sličice; vse sličice se postavijo na skupno platno, simetrično okoli sidra (širina = 2 × največji odmik levo ali desno), dno telesa na dnu platna. Igra nariše platno s sredino na sredini lika in dnom na tleh; zrcaljenje okoli sredine ne premakne lika.
- **Poravnava `cell`** (ledena sveča): brez obrezovanja, vse sličice imajo enak izrez, ki obsega strop do tal, zato padec in drobci ostanejo na pravem mestu; igra nariše platno z vrhom na stropu.
- Pomanjšanje s povprečenjem točk (kakovostno), shranjeno v dvakratni logični velikosti. `src/js/config/sprite-info.js` (generiran, z dvojnim izvozom) vsebuje za vsako ime `file`, logično `width` in `height`. `config/sprites.js` ga združi z ročnimi vnosi (pingvin, led, kup).
- Ciljne višine telesa (logično): medved 56, beli medved 54, volk 44, hrana 26, zid 80 (2 ploščici), sveča 80 (celica strop–tla).
- Alternativa: Python s Pillow. Zavrnjeno, ker so orodja projekta v Node.js in `pngjs` zadošča.

### Izris
- `render/animals.js` nariše sličico iz `sprite-info` (hoja ali udarec, zrcaljeno pri `dir < 0`) na `(sredina, dno)` trkovnega pravokotnika; nadomestni liki se odstranijo.
- `render/obstacles.js`: zid po stopnji (`ice-wall-1` … `ice-wall-5`), sveča po stanju (`icicle-1` … `icicle-7`).
- `render/tiles.js`: hrana namesto rib.

## Risks / Trade-offs

- [Zapolnjevanje ozadja poje temne robove, ki se dotikajo roba izreza] → Izrezi z robom vsaj nekaj točk okoli lika; prag nastavljiv na skupino; vizualni pregled v brskalniku.
- [Gor za skok in plezanje: otrok pred lestvijo želi skočiti, a spleza] → Tako je zahteval avtor; lestev je vidna, plezanje je počasno in se ga zapusti levo/desno.
- [Soba 600+ stolpcev podaljša test samodejnega igralca] → Še vedno pod sekundo v Node.js; meja korakov se poveča.
- [Odstranitev muh in komarjev pokvari obstoječe teste] → Testi se prepišejo na ovire v istih nalogah.
- [Ovire pod ploščo z ledeno ploščo nad sabo bi pingvin obšel s skokom skozi ploščo] → Sveča mora viseti s trdne ploščice (preverjeno ob nalaganju).
