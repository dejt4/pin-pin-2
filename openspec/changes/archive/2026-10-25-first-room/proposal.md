# Proposal

## Why

Projekt ima zaenkrat samo grafike in idejo (`idea/init.md`), igre pa še ni. Prva sprememba postavi projekt in osnovo igre: eno sobo, po kateri pingvin hodi, skače in pleza do cilja, medtem ko mu upada energija. Kepe in živali pridejo v naslednji spremembi, da lahko hčerka čim prej preizkusi gibanje.

## What Changes

- **Postavitev projekta**: `package.json` z `npm run lint` (ESLint za ES5 in meje slojev) in `npm test` (`node:test`), `src/index.html`, `src/style.css`, imenski prostor `window.PinPin` s `register`/`get`.
- **Kontrole**: tipkovnica (puščice, Y skok), kontroler PS4 (križec/leva palčka, × skok) in gumbi na zaslonu na dotik (križec desno, Skok in Kepa levo; pri pokončnem telefonu pod igro) se prevedejo v akcije. Tipka za kepo (X/□/Kepa) se rezervira, a še nima učinka.
- **Gibanje pingvina** v stranskem pogledu: hoja levo/desno, skok z gravitacijo, pristajanje na tla in ploščadi, plezanje po lestvi gor in dol, animacije iz obstoječih sličic.
- **Soba**: mapa iz ploščic, zapisana kot podatki v `config/`, nekaj zaslonov široka, z ledenimi ploščadmi, lestvami, prepadi, ledenimi konicami, ribami in ciljem na koncu. Dokler ni grafike za ploščice, se rišejo kot barvni pravokotniki.
- **Prepadi in konice**: padec v prepad vrne pingvina na zadnje varno mesto približno en zaslon nazaj in mu vzame nekaj energije; dotik konic vzame nekaj energije in ga odrine.
- **Kamera**: vodoravno sledi pingvinu in se ustavi na robovih sobe; ozadje se pomika počasneje (paralaksa).
- **Energija**: s časom počasi upada, vsaka riba jo enako napolni; vrstica energije na zaslonu. Pri nič se pingvin utrudi (jok), napis "Utrujen sem ..." in soba se začne znova.
- **Potek igre**: začetni zaslon, igranje, utrujenost, cilj dosežen ("Bravo!") in ponovni začetek.

Izven obsega: kupi snega, kepe, medved, volk, muha, komarji, točke, več sob, zvok.

## Capabilities

### New Capabilities
- `game-controls`: prevod tipkovnice, kontrolerja in gumbov na dotik v akcije igre (levo, desno, gor, dol, skok, kepa).
- `player-movement`: hoja, skok, gravitacija, trki s ploščicami, plezanje po lestvah in animacije pingvina.
- `room-map`: zapis sobe iz ploščic, vrste ploščic (tla, ploščad, lestev, prepad, konice), ribe, cilj, varna mesta in vrnitev en zaslon nazaj.
- `camera-view`: sledenje kamere, robovi sobe, paralaksa ozadja in prilagoditev velikosti zaslonu.
- `player-energy`: upad energije, ribe, izguba energije ob prepadu in konicah, utrujenost.
- `game-flow`: zasloni in prehodi (začetek, igranje, utrujenost, cilj, ponovni začetek).

### Modified Capabilities
- (ni; to je prva sprememba)

## Impact

- Nove datoteke v `src/` (`index.html`, `style.css`, `js/pinpin.js`, `js/config/`, `js/core/`, `js/platform/`, `js/render/`, `js/app/`) in v `test/`.
- Nov `package.json` in konfiguracija ESLint v korenu; razvojni odvisnosti samo ESLint (brez knjižnic za izvajanje).
- Uporabljene obstoječe sličice iz `src/graphic/penguin/`, `fish/` in `ice/`; nove grafike niso potrebne.
- Igra mora teči v brskalniku PS4 (ES5, `keyCode`, Gamepad API).
