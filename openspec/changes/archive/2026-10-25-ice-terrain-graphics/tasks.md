# Tasks

## 1. Orodje za sličice

- [x] 1.1 Dodaj v `tools/sprite-lib.js` odstranitev ozadja `checker` in `alpha` ter poravnavi `slices` in `strip`, s testi na majhnih umetnih slikah (šahovnica ob belem snegu z obrobo, trakovi enako veliki in brez zamika); preveri z `npm test`
- [x] 1.2 Dopolni `tools/sprites.js` (možnost `background` na skupini) in `tools/sprites.json` s tlemi, polico, blokom, kristali, lestvijo, okraski, panoramama in valovi; zaženi `npm run sprites` in preveri ponovljivost ter kontaktni list vseh novih kosov (cel sneg, brez šahovnice, trakovi se ujemajo)

## 2. Soba in izbira kosov

- [x] 2.1 Dodaj v `core/room.js` okraske (`t`, `g`, `k` → `room.decor`, napaka brez tal) s testi; preveri z `npm test`
- [x] 2.2 Napiši `core/terrain.js` (kosi tal, police, lestve, stolpci vode) s testi za robove, izmenjavo sredine, debela in tanka tla ter lestev; preveri z `npm test`

## 3. Izris

- [x] 3.1 Prepiši `render/background.js` (nebo, dve plasti panoram, zrcaljeno ponavljanje) in nastavitve paralakse; preveri v brskalniku, da ni šivov in da se plasti premikata različno
- [x] 3.2 Prepiši `render/tiles.js` (tla, police, blok, kristali, lestev, voda z animacijo, okraski) in vrstni red v `render/renderer.js`; odstrani `src/graphic/ice/` in stare vnose v `config/sprites.js`; preveri v brskalniku prepade z vodo, police, lestev, blok, kristale in okraske ter da ni barvnih pravokotnikov

## 4. Prva soba in dokumentacija

- [x] 4.1 Dodaj okraske v prvo sobo (ravni deli, ne na poti ovir) in preveri, da test prve sobe in samodejni igralec še uspeta; preveri z `npm test`
- [x] 4.2 Posodobi `README.md` (znaki sobe, sličice) in `AGENTS.md` (grafika, generirane mape) ter preveri, da `npm run lint` in `npm test` uspeta
- [x] 4.3 Uporabnik preigra sobo in potrdi videz; nalogo označi šele po potrditvi uporabnika
