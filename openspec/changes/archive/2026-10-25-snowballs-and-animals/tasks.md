# Tasks

## 0. Predpogoj

- [x] 0.1 Sprememba `first-room` je arhivirana (po uporabnikovem preizkusu s tipkovnico in na PS4), tako da `openspec validate snowballs-and-animals --strict` ne javlja več opozoril za MODIFIED/REMOVED; preveri z ukazom. Implementacija se lahko začne prej, arhiviranje te spremembe pa ne

## 1. Soba in nastavitve

- [x] 1.1 Dodaj v `config/settings.js` nastavitve za kepe (hitrost, velikost, premor med meti, čas animacije meta), živali (velikost, hitrost, razdalja medveda in volka, zadetki muhe, število komarjev), točke (muha 3, komar 1) in kazen za ulov (15); preveri z `npm test`
- [x] 1.2 Razširi `core/room.js`: znaki `*`, `M`, `V`, `u`, `k`, seznam `room.animals`, kup snega kot ploščica, napaka za medveda/volka brez tal; testi za branje in napake; preveri z `npm test`

## 2. Kepe

- [x] 2.1 Napiši `core/snowballs.js`: ob kupu, samodejna nošena kepa ob odhodu od kupa, met (ob kupu neomejeno, nošena se porabi, premor med meti, ne med plezanjem, utrujenostjo ali odrivom), let kepe in izginotje ob trdni ploščici ali izven zaslona; testi za vse scenarije iz `snowballs`; preveri z `npm test`
- [x] 2.2 Dodaj animacijo meta v `config/animations.js` in izbiro v `core/player.js` (nadomestna sličica, približno 0,25 s) s testom; preveri z `npm test`

## 3. Živali

- [x] 3.1 Dodaj v `core/physics.js` neobvezne zapore (`blockers`) za `moveX` in jih predaj skozi `core/player.js`; testi, da zapora ustavi pingvina in da brez zapor vse deluje kot prej; preveri z `npm test`
- [x] 3.2 Napiši `core/animals.js` za medveda in volka: postavitev iz sobe, hoja, obrat na robu, ob zidu, konicah in na meji razdalje, obrat ob zadetku kepe; testi za scenarije iz `animals`; preveri z `npm test`
- [x] 3.3 Dodaj v `core/animals.js` muho in komarje: zapora poti do prve podlage pod živaljo, zadetki (muha 5, vrstica se ne prazni, odlet; komarji po eden na tla), dogodki za točke; testi za scenarije iz `animals`; preveri z `npm test`

## 4. Povezava v igro

- [x] 4.1 Poveži kepe in živali v `core/game.js`: zadetki kep v živali, ulov medveda/volka (varno mesto, kazen 15 %, neranljivost), zapore za pingvina, točke v `game.score`, ohranjanje stanja ob vrnitvi in ponastavitev ob ponovnem začetku; testi za scenarije iz `animals`, `score` in `player-energy`; preveri z `npm test`
- [x] 4.2 Dopolni prvo sobo `config/rooms/room-1.js` (vsaj dva kupa, medved, volk, muha in komarji na glavni poti s kupom največ 6 ploščic pred njimi, stranski nivo z muho ali komarji in kupom) in razširi test s samodejnim igralcem (meče kepe ob kupu, dokler pot ni prosta, preskakuje živali, pride do cilja); preveri z `npm test`

## 5. Izris

- [x] 5.1 Napiši `render/snowballs.js` (kupi snega, leteče kepe, nošena kepa ob pingvinu) in ga vključi v `render/renderer.js` in `index.html`; preveri v brskalniku
- [x] 5.2 Napiši `render/animals.js` z nadomestnimi liki (medved, volk, muha z vrstico napredka, lebdeči in prilepljeni komarji, odlet muhe, smer pogleda) in ga vključi; preveri v brskalniku, da se živali ločijo med sabo
- [x] 5.3 Dodaj točke v `render/hud.js` (zgoraj desno) in v napis "Bravo!" v `render/overlay.js`; preveri v brskalniku

## 6. Končno preverjanje

- [x] 6.1 Preveri, da `npm run lint` in `npm test` uspeta in da je `README.md` (znaki sobe, kontrole) posodobljen
- [x] 6.2 Uporabnik preigra prvo sobo na telefonu ali računalniku (kepe ob kupu in nošena kepa, preskok in obrat medveda in volka, ulov, muha, komarji, stranski nivo, točke) in sporoči rezultat; nalogo označi šele po potrditvi uporabnika
