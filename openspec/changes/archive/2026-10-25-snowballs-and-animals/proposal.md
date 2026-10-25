# Proposal

## Why

Prva soba (`first-room`) ima gibanje, energijo, ribe in cilj, nima pa še bistva igre iz `idea/init.md`: kep in živali. Ta sprememba doda kupe snega, metanje kep, medveda, volka, muho in komarje ter točke. Grafike živali še ni, zato se zaenkrat rišejo kot preprosti barvni liki, pravila pa se lahko razvijejo in preizkusijo že zdaj.

## What Changes

- **Kupi snega**: nova ploščica v sobi. Niso ovira. Ob kupu pingvin meče kepe neomejeno.
- **Kepe**: tipka X / □ / gumb Kepa vrže kepo naravnost v smer, kamor gleda pingvin. Ko pingvin odide od kupa, ima samodejno eno kepo v krilcu (vidno). Ko jo vrže, mora po novo h kupu. Nošena kepa deluje enako kot kepa od kupa. Kepa izgine ob trdni ploščici ali živali in na robu zaslona.
- **Medved in volk**: hodita sem in tja po svojem delu tal. Pingvin ju lahko preskoči. Zadetek s kepo ju takoj obrne v drugo smer. Če pingvina ujameta, ga odbijeta na varno mesto en zaslon nazaj in mu vzameta nekaj energije.
- **Muha**: zapira pot (mimo ne moreš). Potrebnih je 5 zadetkov s kepo. Vrstica napredka nad muho se polni in se ne prazni. Ko je polna, muha odleti in pot je prosta.
- **Komarji**: skupina treh zapira pot. Vsaka kepa enega komarja zalepi na tla. Ko so vsi trije prilepljeni, je pot prosta.
- **Točke**: za pregnano muho in vsakega prilepljenega komarja. Prikaz točk na zaslonu.
- **Prva soba**: dopolnjena s kupi snega, medvedom, volkom, muho in skupino komarjev, tudi na stranskem nivoju (višja ploščad po lestvi), kamor greš samo po točke.
- **Pingvin**: animacija meta kepe in hoje s kepo; dokler ni sličic, se kepa nariše čez obstoječe sličice.

Izven obsega: lame, pujsi, živali pomočniki, več sob, zvok, prave grafike živali (pridejo pozneje, zamenja se samo izris).

## Capabilities

### New Capabilities
- `snowballs`: kupi snega, nošena kepa, met, let kepe in zadetki.
- `animals`: medved, volk, muha in komarji: gibanje, odziv na kepe, ulov pingvina, zapiranje poti.
- `score`: točke za pregnane muhe in prilepljene komarje ter njihov prikaz.

### Modified Capabilities
- `game-controls`: akcija `throw` ni več brez učinka, ampak vrže kepo.
- `room-map`: nove oznake v zapisu sobe (kup snega, medved, volk, muha, komarji) in dopolnjena prva soba.
- `player-energy`: ulov medveda ali volka vzame energijo.

Te zmožnosti so še v spremembi `first-room`, ki ni arhivirana. `first-room` je treba arhivirati pred to spremembo.

## Impact

- Novi moduli v `src/js/core/` (kepe, živali, točke) in `src/js/render/` (izris živali, kep, točk), dopolnjeni `core/game.js`, `core/room.js`, `core/player.js`, `config/settings.js`, `config/animations.js`, `config/rooms/room-1.js`.
- Novi testi v `test/core/`.
- Nove grafike niso potrebne; ko jih avtor pripravi (glej seznam v design.md), se doda samo izris.
