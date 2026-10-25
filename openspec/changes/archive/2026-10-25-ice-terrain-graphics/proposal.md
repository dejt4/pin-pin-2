# Proposal

## Why

Tla, lestve in ozadje so še vedno narisani s kodo (barvni pravokotniki, gore iz mnogokotnikov), ledena kocka, plošča in konice pa so stare sličice v drugačnem slogu. Avtor je pripravil nove liste: ledeni teren, zasneženi teren z okraski in gorami ter valove. Po dogovorjenem osnutku naj prva soba dobi videz v slogu Prehistorika: trdna tla iz zasneženih kamnov, lebdeče ledene police z visečimi svečami, valovanje vode v prepadih ter gore, drevesa in grme v ozadju.

## What Changes

- **Tla (`#`)**:
  - Tla, debela dve ploščici, so iz zasneženih kamnov s Snowy lista. Sestavljena so iz levega roba, sredine (dva kosa, ki se izmenjujeta) in desnega roba, zato so lahko poljubno dolga.
  - Lebdeči trdni deli, debeli eno ploščico (npr. streha nad ledeno svečo, stranski nivo), so iz ledu, enako kot ledene police.
- **Lebdeče plošče (`=`)**: ledene police z visečimi svečami z ledenega lista (levi rob, sredina, desni rob). Sveče visijo pod ploščico in niso ovira.
- **Ledena kocka (`B`)**: nov majhen zasnežen ledeni blok namesto stare kocke.
- **Ledene konice (`^`)**: ledeni kristali s Snowy lista namesto starih konic. Ostanejo nevarne enako kot prej.
- **Lestev (`H`)**: lesena lestev s Snowy lista namesto narisane.
- **Voda**: v prepadih valuje voda z lista valov (dve sličici, ki se izmenjujeta). Gladina je pod robom tal. Obnašanje prepada ostane enako.
- **Ozadje**: dve plasti gorskih panoram s Snowy lista, ki se ponavljata izmenično zrcaljeni (brez šivov), daljna se pomika počasneje od bližnje. Nebo ostane barvni prehod.
- **Okraski**: novi znaki v sobi za drevo (`t`), grm (`g`) in kamen (`k`). Narisani so za pingvinom, ne ovirajo in stojijo na tleh pod znakom.
- **Odstranitev starih sličic**: `src/graphic/ice/` (stara kocka, plošča, konice) in izris tal in lestev s kodo.
- **Orodje za sličice**: `npm run sprites` zna odstraniti naslikano sivo-belo šahovnico (Snowy list, valovi), uporabiti pravo prosojnost (ledeni list) in kos razrezati na ploščice (rob, sredina, rob).
- **Prva soba**: dobi okraske; razporeditev ploščic ostane.

Izven obsega: zeleni, rjavi, kameniti in leseni deli listov (mostovi, trava, jame) za poznejše sobe; poševnine; zvok.

## Capabilities

### New Capabilities
- `terrain-graphics`: izris ploščic sobe s sličicami (tla, police, blok, kristali, lestev), voda v prepadih, ozadje v dveh plasteh in okraski.

### Modified Capabilities
- `room-map`: novi znaki za okraske (`t`, `g`, `k`) z napako, če pod njimi ni tal; opisi znakov `#`, `B`, `=`, `^` po novem videzu.
- `camera-view`: ozadje v dveh plasteh z različno hitrostjo.
- `sprite-pipeline`: odstranitev naslikane šahovnice, uporaba prave prosojnosti in razrez kosa na ploščice.

## Impact

- `tools/sprite-lib.js`, `tools/sprites.js`, `tools/sprites.json`; nove sličice v `src/graphic/terrain/` in `src/graphic/background/`; posodobljen `src/js/config/sprite-info.js`.
- `render/tiles.js` (prepisan), `render/background.js` (prepisan), nov izris okraskov in vode, `config/sprites.js`, `config/settings.js` (paralaksa, hitrost valov).
- `core/room.js` (okraski), `config/rooms/room-1.js` (okraski).
- Odstranjena mapa `src/graphic/ice/`.
- Testi za orodje (šahovnica, razrez), za sobo (okraski) in za izbiro kosov tal (rob, sredina).
