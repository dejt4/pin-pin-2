# Spec Delta

## Purpose

Določa živali v sobi: medveda in volka, ki se jima pingvin izogiba, ter muho in komarje, ki zapirajo pot, dokler jih ne preženeš s kepami.

## ADDED Requirements

### Requirement: Hoja medveda in volka
Medved in volk SHALL hoditi sem in tja po tleh, na katerih stojita, s stalno hitrostjo (volk hitreje od medveda). Obrneta se, ko pred njima ni tal, ko prideta do trdne ploščice ali konic in ko se oddaljita od začetnega položaja za največjo razdaljo iz nastavitev. Ne skačeta, ne plezata in ne padeta s ploščadi.

#### Scenario: Obrat na robu
- **WHEN** medved hodi proti robu prepada
- **THEN** se na robu obrne in hodi nazaj

#### Scenario: Obrat na meji poti
- **WHEN** volk hodi po dolgih ravnih tleh
- **THEN** se obrne, ko je od začetnega položaja oddaljen za največjo razdaljo

### Requirement: Preskok
Pingvin SHALL lahko preskočiti medveda in volka: dotik se šteje samo, kadar se trkovna pravokotnika prekrivata. Medved MUST biti nižji od višine skoka pingvina.

#### Scenario: Preskok volka
- **WHEN** pingvin pravočasno skoči čez volka
- **THEN** se ga ne dotakne in nadaljuje pot

### Requirement: Ulov pingvina
Ko se medved ali volk dotakne pingvina, SHALL igra pingvina vrniti na varno mesto približno en zaslon nazaj (enako kot pri padcu v prepad) in mu vzeti energijo za ulov (glej `player-energy`). Pingvin MUST nato za kratek čas (približno 1,5 s) biti neranljiv.

#### Scenario: Prepozen skok
- **WHEN** medved ujame pingvina
- **THEN** se pingvin pojavi na varnem mestu en zaslon nazaj z manj energije

### Requirement: Kepa obrne medveda in volka
Ko kepa zadene medveda ali volka, SHALL se ta takoj obrniti in iti v drugo smer, kepa pa izgine. Medved in volk se zaradi kepe MUST NOT ustaviti ali izginiti.

#### Scenario: Zadetek medveda
- **WHEN** medved hodi proti pingvinu in ga zadene kepa
- **THEN** se medved obrne in hodi stran od pingvina

### Requirement: Muha
Muha SHALL lebdeti na svojem mestu in zapirati pot: pingvin MUST NOT iti mimo stolpca muhe od vrha sobe do prve podlage pod muho, dokler muha ni pregnana. Dotik muhe pingvinu ne škodi. Vsaka kepa, ki zadene muho, SHALL napolniti petino vrstice napredka nad muho. Vrstica MUST NOT upadati. Po petem zadetku muha odleti z zaslona, pot je prosta in igralec dobi točke (glej `score`).

#### Scenario: Muha zapira pot
- **WHEN** pingvin hodi ali skače proti muhi, ki ni pregnana
- **THEN** se ustavi pred njo

#### Scenario: Pet zadetkov
- **WHEN** muho zadene pet kep
- **THEN** muha odleti in pingvin lahko gre naprej

#### Scenario: Zadetki ostanejo
- **WHEN** muho zadeneta dve kepi, pingvin odide in se pozneje vrne ter jo zadene še trikrat
- **THEN** muha odleti

### Requirement: Komarji
Skupina treh komarjev SHALL lebdeti na svojem mestu in zapirati pot enako kot muha. Vsaka kepa, ki zadene skupino, SHALL enega komarja zalepiti na tla pod skupino, kjer ostane do ponovnega začetka sobe, in dati točke. Ko so vsi trije prilepljeni, je pot prosta.

#### Scenario: Ena kepa, en komar
- **WHEN** kepa zadene skupino treh komarjev
- **THEN** en komar pade na tla in obleži, dva še lebdita in zapirata pot

#### Scenario: Vsi trije prilepljeni
- **WHEN** so prilepljeni vsi trije komarji
- **THEN** pingvin lahko gre naprej

### Requirement: Stanje živali ob vrnitvi in ponovnem začetku
Ob vrnitvi na varno mesto (prepad, ulov) SHALL pregnane muhe in prilepljeni komarji ostati pregnani. Ob ponovnem začetku sobe MUST biti vse živali spet na začetnih mestih.

#### Scenario: Ponoven začetek
- **WHEN** se soba po utrujenosti začne znova
- **THEN** so muha in komarji spet na mestu, medved in volk pa na začetnih položajih

### Requirement: Nadomestni izris
Dokler ni sličic živali, SHALL igra živali risati kot preproste barvne like, po katerih se jih da ločiti (medved rjav in velik, volk siv in podolgovat, muha temna z belimi krili, komarji majhni in sivi). Vrstica napredka muhe MUST biti vidna nad muho.

#### Scenario: Prepoznavnost
- **WHEN** so na zaslonu medved, volk, muha in komarji
- **THEN** se jih da ločiti po barvi in obliki
