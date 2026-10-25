# Tasks

## 1. Postavitev projekta

- [x] 1.1 Ustvari `package.json` (razvojni odvisnosti `eslint` in `globals`, ukaza `lint` in `test` = `node --test test/`) in preveri, da `npm install` uspe
- [x] 1.2 Ustvari `eslint.config.js` po design.md (ES5 in `sourceType: "script"` za `src/js/**`, brez brskalniških globalov v `config/` in `core/`, Node.js za teste in konfiguracijo) in preveri, da `npm run lint` uspe ter da poskusna uporaba `let` ali `window` v `core/` sproži napako
- [x] 1.3 Napiši `src/js/pinpin.js` (`PinPin.register`, `PinPin.get` z jasno napako ob napačnem vrstnem redu, dvojni izvoz) in test `test/pinpin.test.js`, ki preveri registracijo in napako; preveri z `npm test`
- [x] 1.4 Ustvari `src/index.html` (platno, oznake `<script>` v vrstnem redu pinpin → config → core → platform → render → app) in `src/style.css` (črno ozadje, platno na sredini, brez drsnikov) in preveri, da se stran v brskalniku odpre brez napak v konzoli
- [x] 1.5 Dodaj `README.md` z opisom igre, ukazi `npm run lint`, `npm test` in lokalnim zagonom (statični strežnik nad `src/`) ter preveri, da opisani zagon deluje

## 2. Nastavitve in kontrole

- [x] 2.1 Napiši `config/settings.js` (logična velikost 640 × 360, ploščica 40, fizika, energija, kazni, časi stanj po design.md) in `core/math.js` (`clamp` ipd.) s testom; preveri z `npm test`
- [x] 2.2 Napiši `config/controls.js` (razporeditev `keyCode` in gumbov kontrolerja za akcije `left`, `right`, `up`, `down`, `jump`, `throw`) in `core/actions.js` (združi tipkovnico in kontroler, `down` in `pressed`, mrtva cona) s testi za vse scenarije iz `game-controls`; preveri z `npm test`
- [x] 2.3 Napiši `platform/keyboard.js`, `platform/gamepad.js` in `platform/input.js` (preprečitev pomika strani s puščicami, brez napake brez kontrolerja) in preveri ročno v brskalniku z začasnim izpisom akcij v konzolo, nato izpis odstrani

## 3. Soba

- [x] 3.1 Napiši `core/room.js`: razčlenitev sobe iz nizov, vrste ploščic, ribe z barvo po položaju, začetek, cilj, napake z vrstico in stolpcem; testi za veljavno sobo in vse vrste napak iz `room-map`; preveri z `npm test`
- [x] 3.2 Dodaj v `core/room.js` izračun varnega mesta po `room-map` in design.md s testi (sredina sobe, blizu začetka, ob konicah, ob robu prepada); preveri z `npm test`
- [x] 3.3 Nariši prvo sobo `config/rooms/room-1.js` (96 × 9, vsaj en prepad, lestev do višje ploščadi, konice, ledene plošče, vsaj 8 rib, cilj na desnem koncu) in test, ki jo naloži brez napake in preveri, da ima varno mesto za vsak prepad; preveri z `npm test`

## 4. Gibanje pingvina

- [x] 4.1 Napiši `core/physics.js`: premik po X in Y, trki s trdnimi ploščicami, enosmerne ploščice (ledena plošča, vrh lestve), robovi sobe; testi za zid, pristanek, udarec z glavo, skok skozi ploščo od spodaj, rob sobe; preveri z `npm test`
- [x] 4.2 Napiši `core/player.js`: stanja `ground`, `air`, `climb`, `hurt`, `tired`, hoja, skok samo s tal in samo ob novem pritisku, nadzor v zraku; testi za vse scenarije hoje in skoka iz `player-movement`, vključno s preskokom prepada širine 3 ploščic in skokom na ploščad 2 ploščici višje; preveri z `npm test`
- [x] 4.3 Dodaj plezanje po lestvah v `core/player.js` (začetek z `up`/`down`, poravnava, obvisi, izhod na vrhu, dnu, s skokom in s stranjo) s testi za scenarije iz `player-movement`; preveri z `npm test`
- [x] 4.4 Napiši `config/animations.js` (sličice, trajanje, zrcaljenje za levo) in izbiro animacije v `core/player.js` s testom za izbiro (stoja, hoja, skok levo zrcaljen, plezanje, odboj, jok); preveri z `npm test`
- [x] 4.5 Dodaj test, da je pot pingvina pri 30 in 60 korakih na sekundo z enakim fiksnim korakom enaka (neodvisnost od hitrosti naprave); preveri z `npm test`

## 5. Energija, nevarnosti in cilj

- [x] 5.1 Napiši `core/energy.js`: začetna polna energija, upad v približno 2 minutah, riba +¼, kazni, meje 0 in največ; testi za scenarije iz `player-energy`; preveri z `npm test`
- [x] 5.2 Poveži v pravila pobiranje rib (izginejo, ostanejo pobrane po padcu), padec v prepad (vrnitev na varno mesto, kazen), konice (kazen, odriv, neranljivost 1,5 s) in cilj; testi za scenarije iz `room-map`; preveri z `npm test`

## 6. Stanja igre in kamera

- [x] 6.1 Napiši `core/camera.js` (sledenje, robovi, faktor paralakse) s testi za začetek, sredino in konec sobe; preveri z `npm test`
- [x] 6.2 Napiši `core/game.js`: stanja `start`, `playing`, `tired`, `goal`, prehodi, zamik 2 s pred ponovnim začetkom, ponastavitev sobe, `step(game, actions, dt)`; testi za scenarije iz `game-flow` in za "energija ne upada" v `start`, `tired`, `goal`; preveri z `npm test`

## 7. Izris in zagon

- [x] 7.1 Napiši `config/sprites.js` (seznam sličic in velikosti izrisa) in `platform/images.js` (nalaganje, enkratno pomanjšanje, napaka z imenom datoteke) ter `platform/screen.js` (platno 640 × 360, prilagoditev oknu 16 : 9); preveri v brskalniku, da se sličice naložijo in da napačno ime pokaže napako
- [x] 7.2 Napiši `render/background.js` (nebo in gore s paralakso) in `render/tiles.js` (barvni pravokotniki za tla in lestve, obstoječe sličice za kocko, ploščo, konice, ribe, preprost cilj) ter preveri v brskalniku, da je soba vidna in se ozadje pomika počasneje
- [x] 7.3 Napiši `render/sprites.js` (pingvin z zrcaljenjem in utripanjem), `render/hud.js` (vrstica energije), `render/overlay.js` (napisi za začetek, nalaganje, utrujenost, "Bravo!") in `render/renderer.js`; preveri v brskalniku vse zaslone
- [ ] 7.4 Napiši `app/main.js` (nalaganje, zanka z akumulatorjem 1/60 s, največ 5 korakov na sličico) in preveri, da igra v brskalniku teče od začetnega zaslona do cilja in do utrujenosti

## 8. Končno preverjanje

- [x] 8.1 Preveri, da `npm run lint` in `npm test` uspeta
- [ ] 8.2 Ročno preigraj prvo sobo v namiznem brskalniku s tipkovnico in kontrolerjem (če je na voljo): skok čez prepad, lestev gor in dol, konice, padec v prepad in vrnitev, pobiranje rib, utrujenost, cilj
- [ ] 8.3 Uporabnik preizkusi igro v brskalniku PS4 (tipkovnica in kontroler) in sporoči rezultat; nalogo označi šele po potrditvi uporabnika
