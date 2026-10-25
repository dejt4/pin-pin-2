# Pin-Pin

2D platformer za brskalnik v slogu Amigine igre Prehistorik. Pingvin hodi, skače čez prepade in pleza po lestvah do cilja, energijo pa mu dajejo ribe. Igra deluje tudi v brskalniku PlayStationa 4.

Ideja in odločitve o igri: [`idea/init.md`](idea/init.md). Navodila za razvoj z AI agenti: [`AGENTS.md`](AGENTS.md).

## Kontrole

| Akcija            | Tipkovnica | Kontroler PS4          |
|-------------------|------------|------------------------|
| levo / desno      | ← →        | križec ali leva palčka |
| gor / dol (lestev)| ↑ ↓        | križec ali leva palčka |
| skok              | Y          | ×                      |
| met kepe          | X          | □                      |

Kepe mečeš ob kupu snega (neomejeno); ko odideš od kupa, imaš eno kepo s sabo.

Na telefonu ali tablici se pokažejo gumbi na zaslonu: križec na desni, Skok in Kepa na levi. Pokončno so pod igro, ležeče prosojno čez igro.

Za preizkus na telefonu v istem omrežju: `npm start`, nato na telefonu odpri `http://<IP računalnika>:8080/` (Windows ob prvem zagonu vpraša za dovoljenje v požarnem zidu).

## Razvoj

Potrebuješ Node.js (22 ali novejši).

```
npm install     # enkrat: ESLint
npm start       # lokalni strežnik nad src/ na http://localhost:8080/
npm run lint    # ESLint: ES5 in meje slojev
npm test        # testi v test/ z node:test
```

Namesto `npm start` deluje katerikoli statični strežnik nad mapo `src/`, npr. `py -m http.server 8080 -d src`.

Igra nima gradbenega koraka: `src/` je cela spletna stran in se objavi tako, kot je.

## Soba

Soba je zapisana z znaki v `src/js/config/rooms/room-1.js` (ena vrstica besedila na vrstico ploščic):

| Znak | Pomen |
|------|-------|
| `.`  | prazno |
| `#`  | snežna tla |
| `B`  | ledena kocka |
| `=`  | ledena plošča (od spodaj se gre skozi) |
| `H`  | lestev |
| `^`  | ledene konice |
| `f`  | riba |
| `S`  | začetek |
| `G`  | cilj |
| `*`  | kup snega |
| `M`  | medved (stoji na tleh pod znakom) |
| `V`  | volk (stoji na tleh pod znakom) |
| `u`  | muha (zapira pot, 5 kep) |
| `k`  | trije komarji (zapirajo pot, vsaka kepa enega) |

Nastavitve (hitrost hoje, višina skoka, energija, kepe, živali, točke ...) so v `src/js/config/settings.js`.
