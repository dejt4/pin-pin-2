# Spec Delta

## MODIFIED Requirements

### Requirement: Hoja medveda in volka
Rjavi medved, beli medved in volk SHALL hoditi sem in tja po tleh, na katerih stojijo, s stalno hitrostjo (volk hitreje od medvedov). Obrnejo se, ko pred njimi ni tal, ko pridejo do trdne ploščice, konic ali nerazbite ledene ovire in ko se oddaljijo od začetnega položaja za največjo razdaljo iz nastavitev. Ne skačejo, ne plezajo in ne padejo s ploščadi. Beli medved se obnaša enako kot rjavi.

#### Scenario: Obrat na robu
- **WHEN** medved hodi proti robu prepada
- **THEN** se na robu obrne in hodi nazaj

#### Scenario: Obrat na meji poti
- **WHEN** volk hodi po dolgih ravnih tleh
- **THEN** se obrne, ko je od začetnega položaja oddaljen za največjo razdaljo

#### Scenario: Obrat pred ledenim zidom
- **WHEN** beli medved hodi proti celemu ledenemu zidu
- **THEN** se pred zidom obrne

### Requirement: Preskok
Pingvin SHALL lahko preskočiti medveda in volka: dotik se šteje samo, kadar se trkovna pravokotnika prekrivata. Oba medveda MUST biti nižja od višine skoka pingvina.

#### Scenario: Preskok volka
- **WHEN** pingvin pravočasno skoči čez volka
- **THEN** se ga ne dotakne in nadaljuje pot

### Requirement: Ulov pingvina
Ko se medved ali volk dotakne pingvina, SHALL žival za kratek čas (približno 0,5 s) obstati in pokazati udarec, igra pa pingvina vrne na varno mesto približno en zaslon nazaj (enako kot pri padcu v prepad) in mu vzame energijo za ulov (glej `player-energy`). Pingvin MUST nato za kratek čas (približno 1,5 s) biti neranljiv.

#### Scenario: Prepozen skok
- **WHEN** medved ujame pingvina
- **THEN** medved pokaže udarec, pingvin pa se pojavi na varnem mestu en zaslon nazaj z manj energije

### Requirement: Kepa obrne medveda in volka
Ko kepa zadene medveda (rjavega ali belega) ali volka, SHALL se ta takoj obrniti in iti v drugo smer, kepa pa izgine. Živali se zaradi kepe MUST NOT ustaviti ali izginiti.

#### Scenario: Zadetek medveda
- **WHEN** medved hodi proti pingvinu in ga zadene kepa
- **THEN** se medved obrne in hodi stran od pingvina

### Requirement: Stanje živali ob vrnitvi in ponovnem začetku
Ob ponovnem začetku sobe MUST biti vse živali spet na začetnih položajih. Ob vrnitvi na varno mesto (prepad, ulov) živali hodijo naprej, kjer so.

#### Scenario: Ponoven začetek
- **WHEN** se soba po utrujenosti začne znova
- **THEN** so medveda in volk na začetnih položajih

## ADDED Requirements

### Requirement: Sličice živali
Igra SHALL rjavega medveda, belega medveda in volka risati s pripravljenimi sličicami: med hojo se v zanki menjajo tri sličice hoje, med udarcem dve sličici udarca. Sličice gledajo desno in se za hojo v levo zrcalijo. Stopala živali MUST biti na tleh, na katerih žival stoji.

#### Scenario: Hoja v levo
- **WHEN** volk hodi v levo
- **THEN** so sličice hoje zrcaljene in volk gleda levo

#### Scenario: Udarec
- **WHEN** beli medved ujame pingvina
- **THEN** se za kratek čas pokažeta sličici udarca

## REMOVED Requirements

### Requirement: Muha
**Reason**: Muho zamenja ledeni zid.
**Migration**: Glej zmožnost `ice-obstacles` (ledeni zid, 5 kep).

### Requirement: Komarji
**Reason**: Komarje zamenja ledena sveča.
**Migration**: Glej zmožnost `ice-obstacles` (ledena sveča, 3 kepe).

### Requirement: Nadomestni izris
**Reason**: Živali imajo zdaj prave sličice.
**Migration**: Glej zahtevo "Sličice živali" in zmožnost `sprite-pipeline`.
