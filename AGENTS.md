# AGENTS.md

Navodila za AI agente (Claude Code in druge), ki delajo na tem projektu.

## Pravila, ki veljajo vedno

### Git: nikoli
Agent **nikoli**:
- ne ustvari git repozitorija (`git init`, ustvarjanje repozitorija na GitHubu ali drugje),
- ne commita (`git commit`),
- ne pusha (`git push`) v noben repozitorij.

Vse to vedno naredi uporabnik sam. To velja tudi, kadar naloga v `tasks.md` ali drug dokument predvideva commit, push ali objavo. Agent v takem primeru pripravi datoteke in uporabniku napiše, kaj naj naredi. Nalogo označi kot opravljeno šele, ko uporabnik potrdi, da je korak naredil.

Branje stanja je dovoljeno (`git status`, `git diff`, `git log`).

### Jezik
- Pogovor z uporabnikom poteka v **slovenščini**.
- Dokumentacija projekta in OpenSpec artefakti so v slovenščini. Ključne besede, ki jih zahteva OpenSpec (`## ADDED Requirements`, `### Requirement:`, `#### Scenario:`, **WHEN**/**THEN**, SHALL/MUST), ostanejo v angleščini.
- Imena datotek, map in zmožnosti (capability) ter identifikatorji v kodi so v angleščini in v kebab-case oziroma camelCase.

## O projektu

**Pin-Pin** (prej Kvadratek) je preprosta 2D igra za brskalnik: igralec premika lik gor, dol, levo in desno s tipkovnico ali kontrolerjem. Lik bo pingvin z animacijami hoje, obrata in skoka. Igra mora delovati tudi v vgrajenem brskalniku PlayStationa 4 Slim. Izvirna ideja je v `idea/base.md`, arhitektura v `idea/architecture.md`.

## Struktura

```
AGENTS.md           ta navodila (skupna za vse AI agente)
CLAUDE.md           vstopna točka za Claude Code, uvozi AGENTS.md
idea/               izvirne ideje in predlogi (ne spreminjaj brez dovoljenja)
openspec/           OpenSpec: specifikacije (specs/) in spremembe (changes/)
src/                vsa koda in grafika aplikacije (koren spletne strani)
  index.html, style.css
  graphic/          sličice; graphic/source/ so izvorne slike, ki se ne objavijo
  js/               koda igre po slojih (glej spodaj)
test/               testi; struktura zrcali src/js (npr. test/core/)
tools/              razvojni skripti (Node.js, niso del igre): priprava sličic
.github/workflows/  objava src/ na GitHub Pages
```

Generirane datoteke se ne urejajo ročno, ampak s `npm run sprites` iz `tools/sprites.json` (listi `penguin`, `ice`, `fish`) in izvirnikov v `src/graphic/source/`: sličice v `src/graphic/penguin/`, `src/graphic/ice/` in `src/graphic/fish/` ter `src/js/config/sprite-info.js` (ključ za vsak list).

Vse nove datoteke aplikacije gredo v `src/`. V korenu so samo orodja in dokumentacija.

## Sloji

Podrobno v `idea/architecture.md`. Sloj sme uporabljati samo sloje pod sabo:

```
app        src/js/app/       zagon, zanka, zasloni
render     src/js/render/    izris stanja (samo bere stanje)
platform   src/js/platform/  brskalnik: vhod, zaslon, nalaganje slik
core       src/js/core/      čista pravila igre, brez API-jev brskalnika
config     src/js/config/    samo podatki (nastavitve, tipke, animacije)
```

- Platform sme iz core uporabljati samo čiste pomožne funkcije (npr. `core/math.js`), ne pravil igre.
- Naprave se prevedejo v **akcije** v `core/actions.js` po razporeditvi iz `config/controls.js`. Pravila igre ne poznajo tipk.
- Vsak modul se registrira v `window.PinPin` z `PinPin.register('sloj.modul', ...)`. Odvisnosti pridobi s `PinPin.get('sloj.modul', 'sloj/datoteka.js')`, ki ob napačnem vrstnem redu skript sproži jasno napako.
- Moduli v `config/` in `core/` imajo dvojni izvoz (`module.exports` v Node.js, `PinPin.register` v brskalniku), da jih je mogoče testirati.
- Nov modul je treba dodati tudi v `src/index.html` na pravo mesto v vrstnem redu: `pinpin.js` → config → core → platform → render → app.
- ESLint v `config/` in `core/` prepove API-je brskalnika. Ostala pravila med sloji preveri agent sam.

## Delovni tok (OpenSpec)

Vsaka nova funkcionalnost gre skozi OpenSpec change v `openspec/changes/<ime>/`:
`proposal.md` → `specs/` + `design.md` → `tasks.md` → implementacija → arhiviranje.

- Implementacija sledi `tasks.md`. Opravljeno nalogo agent označi z `- [x]` šele, ko je preverjanje iz opisa naloge uspešno.
- Če se med implementacijo izkaže, da je treba spremeniti obnašanje, agent najprej posodobi specifikacije oziroma design in o tem obvesti uporabnika.
- Uporabne slash komande: `/opsx:new`, `/opsx:continue`, `/opsx:apply`, `/opsx:verify`, `/opsx:archive`.

## Tehnične omejitve

- **ES5 JavaScript brez gradbenega koraka** zaradi brskalnika PS4: brez `let`/`const`, puščičnih funkcij, razredov, predlog nizov in ES modulov. Datoteke se naložijo z navadnimi oznakami `<script>` in si delijo imenski prostor `window.PinPin`.
- Tipke se prepoznajo po `keyCode`, ne po `event.key` ali `event.code`.
- Brez zunanjih knjižnic za izvajanje. Razvojna orodja (ESLint) so dovoljena.
- Pravila igre (`src/js/core/`) ne smejo uporabljati API-jev brskalnika, da jih je mogoče testirati v Node.js.

## Ukazi

```
npm run lint    # ESLint: ES5 in meje slojev
npm test        # testi v test/ z node:test
```

Lokalni zagon: statični strežnik nad mapo `src/` (glej `README.md`).

Pred zaključkom naloge, ki spreminja kodo, morata oba ukaza uspeti.
