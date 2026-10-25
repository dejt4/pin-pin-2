# Design

## Context

Ploščice so 40 × 40 točk, soba je visoka 9 vrstic, tla so v prvi sobi vrstici 7 in 8. `render/tiles.js` riše tla in lestve s pravokotniki, kocko, ploščo in konice pa s starimi sličicami iz `src/graphic/ice/`; `render/background.js` riše gore z mnogokotniki. Orodje `npm run sprites` zna odstraniti samo temno ozadje in poravnati like na dno ali celico. Videz je dogovorjen z osnutkom (tla iz zasneženih kamnov, ledene police, voda, gore).

Novi listi:
- `Snowy Pixel Platformer Tileset.png` (1536 × 1024, RGB): naslikana sivo-bela šahovnica namesto prosojnosti. Uporabljeni kosi: široka zasnežena kamnita tla (x 20, y 141, 161 × 82), majhen ledeni blok (x 896, y 293, 46 × 56), ledeni kristali (x 579, y 650, 120 × 109), lesena lestev (x 1459, y 12, 50 × 102), smreka (x 490, y 648, 93 × 146), grm (x 125, y 640, 86 × 64), kamen (x 336, y 668, 80 × 56), panorami gor (x 992–1532, y 448–568 in x 1010–1532, y 676–816).
- `Pixel-Art Terrain and Ice Sprite Sheet.png` (1536 × 1024, RGBA s pravo prosojnostjo): ledena polica s svečami (x 698, y 583, 208 × 90).
- `Pixel Art Ocean Wave Sprite Sheet.png` (1983 × 793, RGB s šahovnico): dve sličici valov (x 38–1945, y ~140–372 in ~495–727).

## Goals / Non-Goals

**Goals:**
- Vse ploščice, voda, ozadje in okraski so sličice iz orodja; igra jih samo nariše na mesto ploščice.
- Izbira kosa (rob, sredina, kamni ali led) je čista funkcija sobe in je testirana.

**Non-Goals:**
- Poševnine, mostovi, zeleni in rjavi teren (poznejše sobe).
- Trki ostanejo enaki (videz ne spreminja pravil).

## Decisions

### Orodje: nove možnosti
- `background` na skupini: `dark` (dosedanje), `checker` (svetle sive točke z razliko kanalov < 12 in svetlostjo > 185, povezane z robom izreza) ali `alpha` (prosojnost lista: alfa ≤ 128 → prosojno). Izrezi imajo vsaj 6 točk roba, da zapolnjevanje začne v ozadju in se ustavi ob temni obrobi; tako ostane bel sneg na vrhu cel (osnutek je pokazal, da brez roba zapolnjevanje poje sneg).
- `align: "slices"`: kos se pomanjša na `cols` ploščic v širino (višina sorazmerno, ali `rows` ploščic, če je podano) in razreže na `cols` navpičnih trakov enake širine (ena ploščica). Imena: `<ime>-1` … `<ime>-N`. Trakovi so enako visoki, zato se zložijo brez zamika.
- `align: "strip"` (panorame, valovi): brez obrezovanja, pomanjšanje na dano višino; širina sorazmerno.

### Izbira kosov (`core/terrain.js`, čista funkcija)
- `groundPiece(room, col, row)` vrne ime sličice za ploščico `#`:
  - debelina stolpca tal (zaporedne `#` navzgor in navzdol) ≥ 2 → kamni: zgornja ploščica `ground-top-*`, ostale `ground-fill-*`;
  - debelina 1 → led: `ice-ledge-*`;
  - vodoravno: `-1` levi rob (levo ni `#` v isti vrstici), `-4` desni rob, sicer `-2` ali `-3` po parnosti stolpca; ploščica brez sosedov na obeh straneh uporabi `-1`.
- `ledgePiece(room, col, row)` za `=` po istem pravilu robov.
- `isWaterColumn(room, col)`: v spodnji vrstici ni trdne ploščice.
- Modul je v `core/`, ker je čist in testiran v Node.js; pravil igre ne spreminja.

### Kosi in velikosti
- Tla: zasnežen kamnit kos → `slices`, 4 ploščice široko × 2 visoko → `ground-top-1..4` (zgornja polovica) in `ground-fill-1..4` (spodnja polovica). Pri tleh, debelejših od dveh ploščic, se `ground-fill` ponovi.
- Ledena polica: `slices`, 4 ploščice široko, višina sorazmerno (~69 točk); riše se od vrha ploščice navzdol, sveče segajo pod ploščico.
- Ledeni blok: poravnava na dno, širina ena ploščica.
- Kristali: poravnava na dno, širina ~1,2 ploščice (kot stare konice), na sredini ploščice.
- Lestev: `slices` 1 × 2 → zgornji del za najvišjo ploščico lestve, spodnji del za ostale.
- Okraski: poravnava na dno; smreka ~2,3 ploščice visoka, grm ~0,6, kamen ~0,5.
- Panorami: `strip`, višina daljne 130, bližnje 150 logičnih točk.
- Valovi: `strip`, dve sličici (`water-1`, `water-2`), višina ~60 točk.

### Izris
- `render/background.js`: nebo (barvni prehod), daljna panorama s faktorjem 0,15, bližnja s faktorjem 0,35; vsaka se ponavlja tako, da je vsaka druga ponovitev zrcaljena (konec ene se ujema z začetkom naslednje). Faktorja v `config/settings.js` (`camera.parallaxFar`, `camera.parallaxNear`), dosedanji `parallax` se odstrani.
- `render/tiles.js`: za vsako vidno ploščico izbere sličico prek `core/terrain.js`; okraski se rišejo pred ploščicami; voda v stolpcih prepada pred tlemi (gladina 16 točk pod vrhom tal), sličica `water-1/2` se menja vsakih 0,5 s, vodoravni zamik je odvisen od položaja v sobi, da so sosednji stolpci zvezni.
- Vrstni red: ozadje → okraski → voda → ploščice → hrana → kupi → ovire → živali → pingvin → kepe → vrstica energije.

### Okraski v sobi
`room.parse` prepozna `t`, `g`, `k` → `room.decor` (`{ type: 'tree' | 'bush' | 'rock', col, row }`), na mestu znaka je prazno; pod znakom mora biti trdna ploščica (napaka kot pri živalih). Prva soba dobi okraske na ravnih delih, ne na poti ovir.

### Odstranitev
`src/graphic/ice/` in vnosi `ice-cube`, `ice-floe`, `ice-spikes` v `config/sprites.js` se odstranijo; v `render/tiles.js` ni več barvnih pravokotnikov.

## Risks / Trade-offs

- [Šahovnica in sneg sta si podobna] → Rob izreza in ustavitev ob temni obrobi; vizualni pregled vseh kosov na kontaktnem listu.
- [Šivi med trakovi tal in polic] → Dva različna kosa sredine se izmenjujeta (vzorec se ponovi na dve ploščici); robovi zaključijo vsak del tal.
- [Panorami nista narejeni za ponavljanje] → Izmenično zrcaljenje odpravi šiv; gore so simetrične dovolj, da ni moteče.
- [Večje sličice ozadja na PS4] → Panorame se pomanjšajo že v orodju in enkrat predpomnijo; riše se največ 3 kosi na plast.
