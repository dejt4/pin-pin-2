# sprite-pipeline Specification

## Purpose
Določa pripravo sličic iz izvornih listov, da jih igra v realnem času samo nariše: izrez, odstranitev ozadja, velikost in poravnava se naredijo vnaprej z orodjem.

## Requirements

### Requirement: Orodje za sličice
Ukaz `npm run sprites` SHALL iz izvornih listov v `src/graphic/source/` po nastavitvah v `tools/sprites.json` izdelati sličice v `src/graphic/` in datoteko `src/js/config/sprite-info.js` z velikostmi. Orodje MUST teči samo z Node.js in razvojnimi odvisnostmi; igra ga ne potrebuje. Ponovni zagon na istih izvornih listih MUST dati enake datoteke.

#### Scenario: Ponovna priprava
- **WHEN** avtor zamenja izvorni list in zažene `npm run sprites`
- **THEN** so sličice in `sprite-info.js` posodobljeni brez ročnega dela

### Requirement: Odstranitev ozadja in napisov
Orodje SHALL odstraniti enobarvno temno ozadje, ki je povezano z robom izreza, in ga narediti prosojnega. Temne obrobe in podrobnosti znotraj lika (npr. zenice) MUST ostati. Napisi na listu MUST NOT biti v sličicah.

#### Scenario: Prosojno ozadje
- **WHEN** je sličica medveda narisana na modro nebo
- **THEN** okoli medveda ni črnega pravokotnika, obroba medveda pa je vidna

### Requirement: Poravnana velikost
Vse sličice iste skupine (npr. vse sličice volka) SHALL imeti enako velikost in lik na enakem mestu: dno lika na dnu sličice, sredina telesa na sredini sličice. Velikost v igri MUST biti zapisana v `sprite-info.js`, tako da igra sličico nariše samo na položaj (sredina, dno) brez zamikov za posamezne sličice. Sličice so shranjene v dvakratni velikosti za igro, da so ostre tudi na velikih zaslonih.

#### Scenario: Hoja brez tresenja
- **WHEN** se volk med hojo izmenjuje med tremi sličicami
- **THEN** stopala ostanejo na tleh in telo se ne premika levo-desno

#### Scenario: Zrcaljenje
- **WHEN** volk hodi v levo
- **THEN** se ista sličica zrcali okoli sredine in volk ostane na istem mestu
