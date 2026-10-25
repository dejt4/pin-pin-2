# Design

## Context

Gradi na spremembi `first-room` (glej njen design.md): soba iz ploščic (`core/room.js`), fizika AABB (`core/physics.js`), pingvin s stanji (`core/player.js`), celotno stanje in korak v `core/game.js`, fiksni korak 1/60 s, ploščica 40 px, zaslon 640 × 360. Varno mesto en zaslon nazaj že obstaja (`room.safePoint`). Zahteve so v `specs/`, točke in kazni je potrdil avtor (muha 3, komar 1, ulov 15 %).

## Goals / Non-Goals

**Goals:**
- Vsa nova pravila (kepe, živali, zapiranje poti, točke) so v `core/` in testirana v Node.js.
- Živali so podatki v sobi in nastavitvah; nova žival istega tipa ne zahteva kode.
- Izris živali je ločen od pravil, da prave sličice pozneje zamenjajo samo `render/`.

**Non-Goals:**
- Splošen sistem za poljubne vrste živali ali umetna inteligenca (živali samo hodijo ali lebdijo).
- Fizika kepe (padanje, odboj): kepa leti naravnost.

## Decisions

### Novi moduli
```
core/snowballs.js  kupi, nošena kepa, met, let kep, zadetki ploščic
core/animals.js    ustvarjanje živali iz sobe, hoja, odziv na kepe, zapiranje poti
render/animals.js  nadomestni liki živali in vrstica napredka muhe
render/snowballs.js kupi snega, leteče kepe, nošena kepa
```
`core/game.js` jih poveže v vrstnem redu: pingvin → kepe → živali → zadetki kep v živali → ulov → ribe/konice/prepad → energija. Točke so polje v stanju igre (`game.score`) in jih poveča `core/animals.js` prek vrnjenih dogodkov, prikaže pa `render/hud.js`.

### Oznake v sobi
`room.parse` prepozna `*`, `M`, `V`, `u`, `k`. Kup snega ostane ploščica (`*`, ni trdna, ni enosmerna). Živali se kot `S`, `f`, `G` izločijo v seznam `room.animals` (`{ type, col, row }`) in na njihovem mestu ostane prazno. Za `M` in `V` mora biti ploščica pod znakom trdna, sicer napaka.

### Kepe
- Stanje pingvina dobi `snowball` (ali nosi kepo), `atPile` in `throwCooldown`. Prehod `atPile` iz `true` v `false` nastavi `snowball = true`.
- Met: ob `pressed.throw`, če `throwCooldown <= 0`, pingvin ni v stanju `climb`, `tired` ali `hurt` in je ob kupu ali nosi kepo. Ob kupu se nošena kepa ne porabi.
- Kepa je pravokotnik 10 × 10, začne pred pingvinom na višini prsi (12 px pod vrhom), hitrost 360 px/s v smer pogleda. V vsakem koraku se premakne; izgine, če prekriva trdno ploščico ali je izven `[cameraX, cameraX + 640]`. Ker je hitrost 6 px na korak in kepa 10 px, ne preskoči ploščice ali živali.
- Alternativa: kepa kot del pingvina. Zavrnjeno, ker lahko leti več kep hkrati (ob kupu) in ker jih zadevajo živali.

### Medved in volk
- Telo: medved 56 × 52 (nižji od skoka 106 px), volk 60 × 30; hitrost medved 50 px/s, volk 80 px/s; največja razdalja od začetka 4 ploščice. Vse v `config/settings.js` (`animals.bear`, `animals.wolf`).
- Postavitev: spodnji rob na vrhu ploščice pod znakom, sredina na sredini stolpca.
- Hoja: pred premikom preveri ploščico pred sprednjim spodnjim kotom (ali so tla) in pred sprednjim robom v višini telesa (trdno ali konice). Če ni tal, je zid/konice ali bi presegla razdaljo, se obrne. Ne uporablja gravitacije, ker nikoli ne zapusti tal.
- Zadetek kepe: `dir = -dir`, kepa izgine, kratek časovnik `hitTime` za izris (sličica "zadet").
- Ulov: prekrivanje s pingvinom, ko pingvin ni neranljiv → `room.safePoint` od položaja pingvina, kazen energije, neranljivost 1,5 s. Uporabi isti postopek kot prepad (skupna funkcija v `core/game.js`).

### Muha in komarji: zapiranje poti
- Muha in skupina komarjev imata trkovni pravokotnik ene ploščice (lebdenje je samo izris). Zadetki se štejejo na tem pravokotniku.
- Zapora je navidezna trdna stena v stolpcu živali od vrstice 0 do zadnje vrstice nad prvo podlago pod živaljo (trdno ali enosmerno). Tako muha na stranskem nivoju ne zapre glavne poti pod ploščadjo.
- Izvedba: `physics.moveX` dobi neobvezen seznam dodatnih trdnih pravokotnikov (`blockers`). `core/game.js` ga sestavi iz nepregnanih muh in komarjev in poda pingvinu (`player.step` ga preda naprej). Kepe zapore ne vidijo (kepa zadene žival, ne zapore).
- Alternativa: začasno spremeni ploščice v sobi v trdne. Zavrnjeno, ker bi pravila spreminjala podatke sobe in ker bi kepa zadela steno namesto živali.
- Muha: `hits` 0–5; ob petem zadetku `gone = true`, točke +3, za izris `leaveTime` (odlet navzgor).
- Komarji: `stuck` 0–3; vsak zadetek `stuck++`, točka +1; pri 3 je pot prosta. Prilepljeni komarji se rišejo na tleh pod skupino.

### Ponovni začetek
`core/game.js` ob `reset` ponovno ustvari živali iz `room.animals`, točke 0, kepe prazne. Ob vrnitvi na varno mesto se ohranijo stanje živali, točke in nošena kepa; leteče kepe se odstranijo.

### Prva soba
`config/rooms/room-1.js` se dopolni: kup pred muho in komarji na glavni poti (največ 6 ploščic stran, da je cilj na zaslonu), medved in volk na ravnih delih tal (vsak s prostorom za preskok), stranski nivo na ploščadi nad konicami (obstoječa lestev) z muho in kupom snega. Test s samodejnim igralcem iz `first-room` se razširi: ob kupu meče kepe, dokler pot ni prosta, in preskakuje živali; preveri, da pride do cilja.

### Izris do prihoda sličic
- Medved: rjav zaobljen pravokotnik z ušesi in gobcem; volk: siv podolgovat lik z ušesi in repom; muha: temen krog z belimi krili, ki migajo; komarji: trije majhni sivi liki s tankimi nogami. Smer se pokaže z očmi/gobcem na sprednji strani.
- Vrstica napredka muhe: 5 delov nad muho.
- Nošena kepa: bel krog ob pingvinu na sprednji strani v višini krilca; met: kratek premik krilca ni mogoč brez sličice, zato se 0,25 s kaže `jump-takeoff` (stegnjeno krilo) kot nadomestek.
- Točke: zgoraj desno z ikono muhe, npr. "★ 7".

### Grafika, ki jo pripravi avtor
Medved (hoja 3, zadet 1), volk (hoja 3, zadet 1), muha (letenje 2, odlet 1), komar (letenje 2, prilepljen 1), kepa (1, razpad 2), kup snega (1), pingvin (met 2, hoja s kepo 3). Vse v enem slogu s pingvinom, prozorno ozadje. Ko pridejo, se dodajo v `config/sprites.js` in `render/animals.js`; pravila ostanejo.

## Risks / Trade-offs

- [Preskok medveda je za otroka pretežak] → Velikost in hitrost v nastavitvah; test preveri, da je preskok mogoč; avtor preizkusi na telefonu.
- [Kepa ob kupu, pri muhi daleč stran, ne doseže muhe, ker izgine na robu zaslona] → Kup največ 6 ploščic od muhe; test prve sobe to preveri.
- [`physics.moveX` z zaporami spremeni obstoječo funkcijo] → Parameter je neobvezen, obstoječi testi ostanejo; novi testi za zapore.
- [Ta sprememba spreminja zahteve iz `first-room`, ki še ni arhivirana] → `first-room` se arhivira prej (čaka na preizkus s tipkovnico in na PS4); do takrat `openspec validate` javlja samo opozorilo za MODIFIED/REMOVED.
