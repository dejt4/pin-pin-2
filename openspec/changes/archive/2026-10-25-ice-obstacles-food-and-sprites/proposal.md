# Proposal

## Why

Po preizkusu prve sobe je avtor želel več sprememb: preprostejše kontrole (gor za skok, presledek za kepo), občutno daljšo sobo, hrano namesto rib in ledene ovire namesto muh in komarjev. Pripravil je tudi slike za medveda (rjavega in belega), volka, hrano, ledeni zid in ledene sveče. Te je treba razrezati in pripraviti tako, da jih igra v realnem času samo nariše, brez računanja zamikov.

## What Changes

- **Kontrole**:
  - Skok je puščica gor. Pred lestvijo ali na njej pa gor pomeni plezanje.
  - Met kepe je presledek (`keyCode` 32).
  - Y in X nista več tipki igre.
  - Na kontrolerju in na zaslonu na dotik ni posebnega gumba za skok: gor na križcu (ali palčki) skoči ali pleza enako kot puščica gor. Gumb × ni več skok, □ ostane kepa.
  - Na zaslonu na dotik ostane na levi samo gumb Kepa; gumb Skok se odstrani.
- **Daljša soba**: prva soba je vsaj 5-krat daljša, torej vsaj 600 stolpcev (37,5 zaslona). Da jo je mogoče urejati, je zapisana v delih (odsekih), ki jih igra zloži zaporedno.
- **Hrana namesto rib**: jabolko, korenček in banana. Vsaka da enako energije kot prej riba. Kozarec vode s slike se ne uporabi.
- **Odstranjeni**: muha in komarji.
- **Ledeni zid**:
  - Zapira pot od tal do vrha in ga ni mogoče preskočiti.
  - Potrebnih je 5 kep: cel, počen, močno počen, nato razpade.
  - Ko razpade, ostanejo razdrobljeni kosi, čez katere lahko greš.
- **Ledena sveča**:
  - Visi z višje ploščadi in zapira pot pod njo.
  - Potrebne so 3 kepe: prva jo načne, tretja jo odlomi. Pade, se razbije in ostanejo drobci.
  - Nato je pot prosta.
- **Točke**: 3 za razbit ledeni zid, 1 za razbito ledeno svečo (namesto točk za muhe in komarje).
- **Živali s slikami**:
  - Rjavi medved, beli medved in volk dobijo prave sličice: hoja (3 sličice) in udarec (2 sličici).
  - Beli medved je nova žival, ki se obnaša kot rjavi.
  - Ko žival ujame pingvina, za kratek čas pokaže udarec.
- **Priprava sličic**:
  - Novo orodje `npm run sprites` (Node.js) iz izvornih listov v `src/graphic/source/` izreže sličice, odstrani črno ozadje in jih pomanjša na velikost za igro.
  - Vse sličice ene živali ali ovire so enako velike in poravnane na dno in sredino.
  - Igra jih zato samo nariše na položaj stopal, brez zamikov za posamezne sličice.
  - Velikosti zapiše orodje v `config/sprite-info.js`.

Izven obsega: novi liki pomočniki, več sob, zvok, kozarec vode.

## Capabilities

### New Capabilities
- `ice-obstacles`: ledeni zid in ledena sveča: zapiranje poti, lomljenje s kepami, animacije, razdrobljeni ostanki.
- `food`: hrana (jabolko, korenček, banana) namesto rib.
- `sprite-pipeline`: priprava sličic iz izvornih listov (izrez, ozadje, velikost, poravnava) in podatki o velikostih za igro.

### Modified Capabilities
- `game-controls`: tipke (gor je skok, presledek je kepa), odstranitev Y in X.
- `player-movement`: gor sproži skok, razen pri lestvi, kjer sproži plezanje.
- `room-map`: zapis v odsekih, nove oznake (ledeni zid, ledena sveča, beli medved), hrana namesto rib, odstranjeni muha in komarji, prva soba vsaj 600 stolpcev.
- `animals`: odstranjeni muha in komarji, dodan beli medved, sličice hoje in udarca namesto nadomestnih likov.
- `score`: točke za ledeni zid in ledeno svečo namesto za muhe in komarje.
- `player-energy`: hrana namesto rib.
- `snowballs`: kepa zadene tudi ledeni zid in ledeno svečo.

## Impact

- `config/controls.js`, `core/player.js`, `core/room.js`, `core/animals.js`, `core/game.js`, nov `core/obstacles.js`, `render/` (živali, ovire, hrana), `config/rooms/room-1.js`, `config/settings.js`, `config/sprites.js`.
- Novo orodje `tools/sprites.js` in `tools/sprites.json`, nova razvojna odvisnost `pngjs` (samo za orodje, ne za igro).
- Nove sličice v `src/graphic/` (hrana, živali, ovire) in generirana `src/js/config/sprite-info.js`.
- Testi se posodobijo (muha in komarji gredo ven, ovire, hrana in kontrole noter); samodejni igralec mora prehoditi daljšo sobo.
- `README.md` in `AGENTS.md` (kontrole, znaki sobe, orodje za sličice).
