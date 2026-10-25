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

**Pin-Pin** je 2D platformer za brskalnik v slogu Amigine igre **Prehistorik**: stranski pogled, pingvin hodi levo in desno, skače čez prepade, pleza po lestvah, mapa se vodoravno pomika za njim. Zgodbe in liki izhajajo iz domišljijskih prigod avtorjeve hčerke (2 leti), ki bo igro tudi igrala, zato je igra prijazna in ima malo kontrol.

Bistvo igre (podrobno v `idea/init.md`):
- **Soba**: ena mapa, nekaj zaslonov široka, cilj na koncu.
- **Energija** s časom upada, ribe jo napolnijo. Pri nič se pingvin utrudi in soba se začne znova.
- **Kepe**: ob kupu snega jih mečeš neomejeno, eno lahko neseš s sabo.
- **Živali**: medveda in volka preskočiš ali s kepo obrneš; muho preženeš s 5 kepami; komarje (3) kepe zalepijo na tla.
- **Kazni**: padec v prepad ali ulov živali te vrne na varno mesto en zaslon nazaj in vzame nekaj energije.
- **Točke** za pregnane muhe in komarje.

Igra mora delovati tudi v vgrajenem brskalniku **PlayStationa 4 Slim**, s tipkovnico in s kontrolerjem.

## Dokumenti

- `idea/init.md`: začetna ideja in vse dogovorjene odločitve o igri. Je vir resnice za pravila igre, dokler niso zapisana v `openspec/specs/`. Ne spreminjaj brez dovoljenja uporabnika.
- `openspec/`: specifikacije (`specs/`) in spremembe (`changes/`).

## Struktura

Trenutno obstajajo samo `idea/`, `openspec/` in grafike v `src/graphic/`. Ostale mape so načrtovane in nastanejo z implementacijo.

```
AGENTS.md           ta navodila (skupna za vse AI agente)
CLAUDE.md           vstopna točka za Claude Code, uvozi AGENTS.md
idea/               ideje in odločitve o igri
openspec/           OpenSpec: specifikacije in spremembe
src/                vsa koda in grafika aplikacije (koren spletne strani, ki se objavi)
  graphic/          sličice, ki jih igra naloži
    penguin/        animacije pingvina (hoja, skok, obrat, odboj, jok)
    fish/           ribe
    ice/            ledene ovire (kocka, plošča, konice)
    source/         izvorne slike (velike, se ne naložijo v igro)
  index.html, style.css   (načrtovano)
  js/               koda igre po slojih (načrtovano, glej spodaj)
test/               testi; struktura zrcali src/js (načrtovano)
```

V `src/` gre samo to, kar potrebuje igra v brskalniku. Dokumenti, ideje in orodja so v korenu.

### Grafika
- Sobe se sestavljajo iz **ploščic** (tla, ploščadi, lestve, kupi snega ...) in **ozadja**, ki se ponavlja in pomika počasneje (paralaksa). Mapa sobe je zapisana kot podatki v `src/js/config/`, ne kot ena velika slika.
- Dokler grafike za ploščice ali živali ni, se rišejo kot preprosti barvni pravokotniki.
- Orodja za pripravo sličic iz `src/graphic/source/` še ni. Obstoječe sličice v `penguin/`, `fish/` in `ice/` so že pripravljene; ne prepisuj jih ročno.

## Sloji

Sloj sme uporabljati samo sloje pod sabo:

```
app        src/js/app/       zagon, zanka, zasloni (začetek, utrujenost, cilj)
render     src/js/render/    izris stanja: kamera, ozadje, ploščice, liki, vrstica energije (samo bere stanje)
platform   src/js/platform/  brskalnik: vhod (tipkovnica, kontroler), zaslon, nalaganje slik
core       src/js/core/      čista pravila igre: gravitacija, trki s ploščicami, lestve, energija, kepe, živali
config     src/js/config/    samo podatki: nastavitve, tipke, animacije, mape sob
```

- Platform sme iz core uporabljati samo čiste pomožne funkcije (npr. `core/math.js`), ne pravil igre.
- Naprave se prevedejo v **akcije** (levo, desno, gor, dol, skok, kepa) v `core/actions.js` po razporeditvi iz `config/controls.js`. Pravila igre ne poznajo tipk.
- Vsak modul se registrira v `window.PinPin` z `PinPin.register('sloj.modul', ...)`. Odvisnosti pridobi s `PinPin.get('sloj.modul', 'sloj/datoteka.js')`, ki ob napačnem vrstnem redu skript sproži jasno napako.
- Moduli v `config/` in `core/` imajo dvojni izvoz (`module.exports` v Node.js, `PinPin.register` v brskalniku), da jih je mogoče testirati.
- Nov modul je treba dodati tudi v `src/index.html` na pravo mesto v vrstnem redu: `pinpin.js` → config → core → platform → render → app.
- Pravila igre tečejo s **fiksnim časovnim korakom**, da se igra enako obnaša ne glede na hitrost naprave (PS4).

## Kontrole

| Akcija          | Tipkovnica (`keyCode`) | Kontroler PS4 |
|-----------------|------------------------|---------------|
| levo / desno    | ← → (37, 39)           | križec ali leva palčka |
| gor / dol (lestev) | ↑ ↓ (38, 40)        | križec ali leva palčka |
| skok            | Y (89)                 | × |
| met kepe        | X (88)                 | □ |

## Delovni tok (OpenSpec)

Vsaka nova funkcionalnost gre skozi OpenSpec change v `openspec/changes/<ime>/`:
`proposal.md` → `specs/` + `design.md` → `tasks.md` → implementacija → arhiviranje.

- Implementacija sledi `tasks.md`. Opravljeno nalogo agent označi z `- [x]` šele, ko je preverjanje iz opisa naloge uspešno.
- Če se med implementacijo izkaže, da je treba spremeniti obnašanje, agent najprej posodobi specifikacije oziroma design in o tem obvesti uporabnika.
- Uporabne slash komande: `/opsx:new`, `/opsx:continue`, `/opsx:apply`, `/opsx:verify`, `/opsx:archive`.

## Tehnične omejitve

- **ES5 JavaScript brez gradbenega koraka** zaradi brskalnika PS4: brez `let`/`const`, puščičnih funkcij, razredov, predlog nizov in ES modulov. Datoteke se naložijo z navadnimi oznakami `<script>` in si delijo imenski prostor `window.PinPin`.
- Tipke se prepoznajo po `keyCode`, ne po `event.key` ali `event.code`.
- Brez zunanjih knjižnic za izvajanje. Razvojna orodja (ESLint, Node.js) so dovoljena.
- Pravila igre (`src/js/core/`) ne smejo uporabljati API-jev brskalnika, da jih je mogoče testirati v Node.js.

## Ukazi

`package.json` še ne obstaja. Ko bo pripravljen, veljata:

```
npm run lint    # ESLint: ES5 in meje slojev
npm test        # testi v test/ z node:test
```

Pred zaključkom naloge, ki spreminja kodo, morata oba ukaza uspeti.

Lokalni zagon: statični strežnik nad mapo `src/`.
