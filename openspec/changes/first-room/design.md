# Design

## Context

Projekt ima samo sličice v `src/graphic/` (pingvin 308 × 340, ribe 166 × 86, led 336 × 208) in dokumente. Kode, `package.json` in testov še ni. Omejitve so v `AGENTS.md`: ES5 brez gradbenega koraka, `keyCode`, brez knjižnic za izvajanje, sloji config → core → platform → render → app, `core` brez API-jev brskalnika. Igra mora teči v brskalniku PS4. Zahteve so v `specs/`.

## Goals / Non-Goals

**Goals:**
- Pravila igre (gibanje, trki, lestve, energija, soba, kamera, stanja) so v celoti v `core/` in testirana v Node.js.
- Gibanje je odvisno samo od akcij in fiksnega časovnega koraka, zato je ponovljivo v testih.
- Soba je podatek, ki ga lahko avtor ureja brez programiranja.
- Ploščice brez grafike so barvni pravokotniki, tako da prihod grafike pozneje zamenja samo izris.

**Non-Goals:**
- Splošen pogon za igre, urejevalnik sob, več sob, shranjevanje, zvok.
- Navpično pomikanje kamere (soba je visoka en zaslon).
- Orodje za pripravo sličic (obstoječe so že pripravljene).

## Decisions

### Logična velikost in ploščice
Logična slika je **640 × 360** (16 : 9), ploščica je **40 × 40**, torej 16 stolpcev × 9 vrstic na zaslon. Prva soba je široka 96 stolpcev (6 zaslonov).
- Pingvin se riše približno 44 × 48 (malo več kot ploščica), trkovni pravokotnik je ožji, približno 26 × 40, da se lepo prileze skozi odprtine in med ploščicami.
- Alternativa 32 px ploščice (20 × 11,25) ne da celega števila vrstic; 48 px (13,3 × 7,5) pa ne celega števila stolpcev.
- Platno ima notranjo velikost 640 × 360, CSS ga raztegne na okno ob ohranjenem razmerju (`camera-view`).

### Fiksni časovni korak
`app/` teče z `requestAnimationFrame` in akumulatorjem: pravila se izvajajo v korakih po 1/60 s, največ 5 korakov na sličico (da se igra po zatiku ne "ujame" predolgo). Vse hitrosti v nastavitvah so v enotah na sekundo, korak jih pomnoži z `dt`.
- Alternativa: spremenljiv `dt`. Zavrnjeno, ker so skoki in trki pri spremenljivem koraku nedeterministični in težje testirani.

### Fizika in trki
Pingvin je pravokotnik (AABB). Vsak korak: najprej premik po X in razrešitev trkov s trdnimi ploščicami, nato premik po Y in razrešitev. Ledena plošča (`=`) in vrh lestve sta **enosmerni**: trk samo, če je pingvin v prejšnjem koraku bil v celoti nad njima in pada. Največja hitrost padanja je manjša od ene ploščice na korak, zato ni prehajanja skozi tla.
- Začetne vrednosti (v `config/settings.js`, uglašijo se ob preizkusu): hoja 160 px/s, hitrost skoka 460 px/s, gravitacija 1000 px/s², največja hitrost padanja 600 px/s, plezanje 100 px/s. S temi je skok visok približno 106 px (2,6 ploščice) in pri hoji dolg približno 147 px. Za prepad širine 3 ploščic ima igralec za odskok okno približno 50 px (0,3 s) pred robom. Prvotne vrednosti (hoja 150, skok 450, gravitacija 1100) so dale okno samo približno 26 px, kar je samodejni igralec v testu prve sobe pokazal kot pretežko za otroka. Test v `test/core/` preveri zahteve iz `player-movement` (preskok 3 ploščic, ploščad 2 višje); če ne gre, se popravita hitrosti.
- Alternativa: fizikalni pogon. Zavrnjeno (brez knjižnic, ES5).

### Stanja pingvina
Pingvin ima stanje `ground`, `air`, `climb`, `hurt` (kratko po konicah, nadzor izklopljen do pristanka) in `tired`. Animacija se izbere iz stanja, smeri in hitrosti; tabela animacij je v `config/animations.js` (imena sličic in trajanje). Zrcaljenje za levo določi animacija (`mirror: true`), izris ga izvede s `scale(-1, 1)`.

### Lestve
Lestev je stolpec ploščic `H`. Plezanje se začne z `up`, če središče pingvina leži v stolpcu lestve, ali z `down`, če stoji na vrhu lestve. Ob začetku se pingvin vodoravno poravna na sredino stolpca. Na vrhu (ko spodnji rob pingvina pride nad vrh lestve) preide v `ground` na vrhu lestve, na dnu ob dotiku tal prav tako.

### Varno mesto
Varno mesto se ne beleži med igro, ampak se **izračuna iz mape**: od stolpca `padec − 16` proti levi se poišče prvi stolpec, kjer je na najnižji pohodni površini izpolnjen pogoj iz `room-map`. Pingvin se postavi na sredino tega stolpca. Izračun je čista funkcija mape in stolpca, zato je testiran.
- Alternativa: beleženje zadnjih položajev na tleh. Zavrnjeno, ker je odvisno od poti in ga je težje testirati; pri sobi brez premikajočih se ovir je izračun iz mape enako dober.

### Soba kot podatek
`config/rooms/room-1.js` vsebuje polje nizov (en niz na vrstico) in ime sobe. `core/room.js` ga razčleni v mrežo in seznam objektov (ribe, začetek, cilj) in preveri napake. Riba dobi barvo po `(stolpec + vrstica) % 4`.

### Kamera
`core/camera.js` je čista funkcija: `x = clamp(pingvin.x − 320, 0, širinaSobe − 640)`. Ozadje se pomika s faktorjem 0,3. Ozadje je zaenkrat narisano s kodo (nebo z gradientom, gore iz mnogokotnikov), dokler ni slike.

### Moduli
```
config/  settings.js, controls.js, animations.js, sprites.js, rooms/room-1.js
core/    math.js, actions.js, room.js, physics.js, player.js, energy.js, camera.js, game.js
platform/ keyboard.js, gamepad.js, input.js, screen.js, images.js
render/  background.js, tiles.js, sprites.js, hud.js, overlay.js, renderer.js
app/     main.js
```
`core/game.js` drži celotno stanje (`state`, soba, pingvin, energija, pobrane ribe, časovnik stanja) in izvaja `step(game, actions, dt)`. `render/` stanje samo bere.

### Vhod
`platform/keyboard.js` beleži pritisnjene `keyCode` in prepreči privzeto dejanje za puščice. `platform/gamepad.js` vsak korak prebere `navigator.getGamepads()` (če obstaja) po standardni razporeditvi: gumb 0 (×), 2 (□), 12–15 križec, osi 0/1 z mrtvo cono 0,5. `core/actions.js` iz obeh naborov in `config/controls.js` naredi akcije s stanjem `down` in `pressed` (na novo pritisnjeno v tem koraku).

### Gumbi na dotik
Dodano med implementacijo, da je igro mogoče preizkusiti na telefonu.
- `platform/touch.js` ustvari gumbe kot elemente HTML (ne riše jih na platno), ker brskalnik sam pove, kateri element je pod prstom (`document.elementFromPoint`), in ker gumbi pri pokončnem telefonu ležijo izven platna. Za vsak prst (`touch.identifier`) se ob `touchstart` in `touchmove` poišče gumb pod njim; aktivne akcije so unija gumbov pod vsemi prsti. Tako drsenje po križcu zamenja smer in več prstov deluje hkrati.
- `core/actions.read` dobi tretji vir: nabor akcij z dotika (`{ right: true }`), ki se združi s tipkovnico in kontrolerjem. Pritisk in držanje se ločita enako kot pri drugih napravah.
- Gumbi se pokažejo, ko ima naprava zaslon na dotik (`'ontouchstart' in window` ali `navigator.maxTouchPoints > 0`) ali ob prvem dotiku. Na PS4 in namiznem brskalniku jih ni.
- Postavitev v CSS: `body.touch` ima pod igro ploščo z gumbi, kadar je okno pokončno (`@media (orientation: portrait)`); ležeče so gumbi prosojni v spodnjih kotih čez igro. `platform/screen.js` platno prilagodi elementu `#stage` (prostor nad ploščo) namesto celemu oknu, pri pokončnem oknu pa ga postavi na vrh.
- `touch-action: none`, `user-select: none` in `user-scalable=no` preprečijo pomikanje, povečavo in izbiro besedila med igro.
- Alternativa: gumbi, narisani na platno. Zavrnjeno, ker bi morali sami računati zadetke in ker pri pokončnem telefonu pod igro ni platna.

### Sličice
`platform/images.js` naloži vse sličice iz `config/sprites.js` in jih ob nalaganju enkrat pomanjša na velikost izrisa v ločena platna. Risanje velikih slik s pomanjšanjem vsako sličico je na PS4 lahko počasno.

### Orodja
`package.json` z razvojnima odvisnostma `eslint` in `globals`, ukaza `lint` in `test` (`node --test test/`). `eslint.config.js` nastavi `ecmaVersion: 5`, `sourceType: "script"` za `src/js/**`, prepove brskalniške globale v `config/` in `core/` in dovoli `module`/`PinPin`. Sam konfiguracijski file in testi tečejo v Node.js in niso omejeni na ES5.

## Risks / Trade-offs

- [Brskalnik PS4 morda ne podpira Gamepad API ali ima drugačno razporeditev] → Tipkovnica deluje neodvisno; razporeditev je v `config/controls.js`, popravi se brez kode. Preizkus na PS4 je ročni korak v nalogah.
- [Vrednosti fizike niso prijetne za otroka] → Vse v `config/settings.js`; zahteve iz specifikacij (preskok, višina) preverja test, občutek preveri avtor ročno.
- [Pomanjšane sličice so na velikih televizorjih zamegljene] → Sprejemljivo za prvo različico; pozneje se lahko pomanjšajo na velikost glede na dejansko povečavo platna.
- [Varno mesto iz mape je lahko nedosegljivo ali na višji ploščadi] → Išče se samo najnižja pohodna površina v stolpcu; test preveri vse prepade v prvi sobi.
- [Akumulator pri zelo počasni napravi upočasni igro] → Omejitev 5 korakov na sličico je namerna: igra se raje upočasni kot "preskoči" čez ovire.
