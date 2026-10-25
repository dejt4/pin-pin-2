# Pin-Pin

2D platformer za brskalnik v slogu Amigine igre Prehistorik. Pingvin hodi, skače čez prepade in pleza po lestvah do cilja, energijo mu daje hrana, s kepami pa razbija ledene zidove in sveče. Igra deluje tudi v brskalniku PlayStationa 4.

Ideja in odločitve o igri: [`idea/init.md`](idea/init.md). Navodila za razvoj z AI agenti: [`AGENTS.md`](AGENTS.md).

## Kontrole

| Akcija            | Tipkovnica | Kontroler PS4          |
|-------------------|------------|------------------------|
| levo / desno      | ← →        | križec ali leva palčka |
| skok, pred lestvijo plezanje gor | ↑ | križec ali palčka gor |
| dol po lestvi     | ↓          | križec ali palčka dol  |
| met kepe          | presledek  | □                      |

Kepe mečeš ob kupu snega (neomejeno); ko odideš od kupa, imaš eno kepo s sabo.

Na telefonu ali tablici se pokažejo gumbi na zaslonu: križec na desni (gor je skok), Kepa na levi. Pokončno so pod igro, ležeče prosojno čez igro.

Za preizkus na telefonu v istem omrežju: `npm start`, nato na telefonu odpri `http://<IP računalnika>:8080/` (Windows ob prvem zagonu vpraša za dovoljenje v požarnem zidu).

## Razvoj

Potrebuješ Node.js (22 ali novejši).

```
npm install     # enkrat: ESLint in pngjs (za orodje za sličice)
npm start       # lokalni strežnik nad src/ na http://localhost:8080/
npm run lint    # ESLint: ES5 in meje slojev
npm test        # testi v test/ z node:test
npm run sprites # sličice živali, ovir in hrane iz src/graphic/source/ (glej spodaj)
```

Namesto `npm start` deluje katerikoli statični strežnik nad mapo `src/`, npr. `py -m http.server 8080 -d src`.

Igra nima gradbenega koraka: `src/` je cela spletna stran in se objavi tako, kot je.

## Sličice

Sličice živali, ledenih ovir, hrane, terena, okraskov in ozadja pripravi `npm run sprites` iz izvornih listov v `src/graphic/source/` po nastavitvah v `tools/sprites.json` (izrez, odstranitev ozadja: črno, naslikana šahovnica ali prava prosojnost, pomanjšanje, poravnava ali razrez na ploščice). Izid so sličice v `src/graphic/animals/`, `obstacles/`, `food/`, `terrain/`, `decor/` in `background/` ter `src/js/config/sprite-info.js` z velikostmi. Teh datotek ne urejaj ročno: zamenjaj izvorni list ali popravi `tools/sprites.json` in ukaz zaženi znova.

## Soba

Soba je zapisana z znaki v `src/js/config/rooms/room-1.js`, razdeljena na odseke po 50 stolpcev (vsak odsek ima 9 vrstic enake dolžine; igra jih zloži od leve proti desni):

| Znak | Pomen |
|------|-------|
| `.`  | prazno |
| `#`  | tla: debela dve ploščici ali več so zasneženi kamni, debela eno ploščico led |
| `B`  | ledeni blok |
| `=`  | ledena polica s svečami (od spodaj se gre skozi) |
| `H`  | lestev |
| `^`  | ledeni kristali (nevarni) |
| `f`  | hrana (jabolko, korenček ali banana) |
| `S`  | začetek |
| `G`  | cilj |
| `*`  | kup snega |
| `M`  | rjavi medved (stoji na tleh pod znakom) |
| `P`  | beli medved (stoji na tleh pod znakom) |
| `V`  | volk (stoji na tleh pod znakom) |
| `W`  | ledeni zid (stoji na tleh, 5 kep) |
| `i`  | ledena sveča (visi s trdne ploščice, pod njo prazna vrstica in tla, 3 kepe) |
| `t`  | okrasek: drevo (stoji na tleh, ne ovira) |
| `g`  | okrasek: grm |
| `k`  | okrasek: kamen |

V prepadih (stolpci brez tal v spodnji vrstici) se samodejno nariše voda.

Nastavitve (hitrost hoje, višina skoka, energija, kepe, živali, ovire, točke ...) so v `src/js/config/settings.js`.
