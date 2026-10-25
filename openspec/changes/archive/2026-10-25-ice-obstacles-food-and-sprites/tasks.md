# Tasks

## 1. Priprava sličic

- [x] 1.1 Dodaj razvojno odvisnost `pngjs` in ukaz `npm run sprites` v `package.json`; preveri, da `npm install` uspe
- [x] 1.2 Napiši `tools/sprites.js` (izrez, odstranitev ozadja z zapolnjevanjem od roba, brisanje `clear`, telo kot največja skupina točk, poravnava `bottom` in `cell`, pomanjšanje s povprečenjem, dvakratna velikost, zapis `config/sprite-info.js` z dvojnim izvozom) in test za čiste funkcije (ozadje, telo, poravnava) na majhnih umetnih slikah; preveri z `npm test`
- [x] 1.3 Napiši `tools/sprites.json` za rjavega medveda, belega medveda, volka (hoja 3, udarec 2), hrano (jabolko, korenček, banana), ledeni zid (5) in ledeno svečo (7), zaženi `npm run sprites` in preveri, da je izid ponovljiv (drugi zagon ne spremeni datotek) ter da so v `src/graphic/` prosojne sličice brez napisov
- [x] 1.4 Dodaj sličice iz `sprite-info.js` v `config/sprites.js`, odstrani ribe (`config/sprites.js`, `src/graphic/fish/`) in test, da vse datoteke obstajajo; preveri z `npm test` in z ogledom vseh novih sličic v brskalniku na modrem ozadju

## 2. Kontrole

- [x] 2.1 Posodobi `config/controls.js` (presledek → `throw`, brez Y, X in ×) in `core/actions.js` (brez akcije `jump`) s testi iz `game-controls`; preveri z `npm test`
- [x] 2.2 Posodobi `core/player.js`: `pressed.up` skoči, `down.up` pri lestvi pleza, brez skoka z lestve; prepiši teste skoka in lestev ter dodaj test, da držanje gor na vrhu lestve ne skoči; preveri z `npm test`
- [x] 2.3 Odstrani gumb Skok iz `index.html` in `style.css` in preveri v brskalniku z mobilno velikostjo (pokončno in ležeče), da gor na križcu skoči in Kepa meče

## 3. Soba in hrana

- [x] 3.1 Razširi `core/room.js`: odseki (`sections`), napake z odsekom, vrstico in stolpcem, znaki `P`, `W`, `i`, odstranjena `u` in `k`, preverjanje tal in stropa, `room.food` z vrsto hrane; testi za vse scenarije iz `room-map`; preveri z `npm test`
- [x] 3.2 Preimenuj ribe v hrano v `config/settings.js`, `core/energy.js`, `core/game.js` in izrisu (`render/tiles.js`, ikona v `render/hud.js`) s testi iz `food` in `player-energy`; preveri z `npm test`

## 4. Ledene ovire

- [x] 4.1 Napiši `core/obstacles.js`: zid in sveča iz sobe, zapore, zadetki (zid 5, sveča 3), stopnje, časovnik animacije, dogodki za točke; testi za scenarije iz `ice-obstacles`; preveri z `npm test`
- [x] 4.2 Poveži ovire v `core/game.js` (zapore za pingvina, zadetki kep, točke zid 3 in sveča 1, ohranjanje ob vrnitvi, ponastavitev ob ponovnem začetku) in v `core/snowballs.js` ne spreminjaj ničesar razen, če je treba; testi iz `ice-obstacles`, `score` in `snowballs`; preveri z `npm test`

## 5. Živali

- [x] 5.1 Posodobi `core/animals.js`: odstrani muho in komarje, dodaj belega medveda, obrat pred zaporami ovir, `pushTime` ob ulovu, `walkTime` za animacijo, nove trkovne velikosti; prepiši teste živali; preveri z `npm test`

## 6. Prva soba

- [x] 6.1 Napiši novo prvo sobo v 12 odsekih po 50 stolpcev po zahtevi "Prva soba" in posodobi samodejnega igralca (`test/bot.js`: gor za skok, razbijanje ovir s kupa); test preveri zahteve sobe in da igralec pride do cilja z razbitimi vsemi ovirami; preveri z `npm test`

## 7. Izris

- [x] 7.1 Napiši izris živali s sličicami v `render/animals.js` (hoja, udarec, zrcaljenje, stopala na tleh) in preveri v brskalniku
- [x] 7.2 Napiši `render/obstacles.js` (stopnje zidu, stanja sveče, drobci) in ga vključi v `render/renderer.js` in `index.html`; preveri v brskalniku vse stopnje
- [x] 7.3 Preveri v brskalniku hrano, točke za ovire in zaslon "Bravo!"

## 8. Dokumentacija in končno preverjanje

- [x] 8.1 Posodobi `README.md` (kontrole, znaki sobe, `npm run sprites`) in `AGENTS.md` (kontrole, orodje za sličice, generirane datoteke se ne urejajo ročno); preveri, da opisani ukazi delujejo
- [x] 8.2 Preveri, da `npm run lint` in `npm test` uspeta
- [x] 8.3 Uporabnik preigra novo sobo (telefon ali računalnik) in sporoči rezultat; nalogo označi šele po potrditvi uporabnika
