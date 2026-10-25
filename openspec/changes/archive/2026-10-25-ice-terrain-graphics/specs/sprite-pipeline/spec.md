# Spec Delta

## MODIFIED Requirements

### Requirement: Odstranitev ozadja in napisov
Orodje SHALL odstraniti ozadje, ki je povezano z robom izreza, in ga narediti prosojnega. Podprte so tri vrste ozadja: enobarvno temno ozadje (živali, ovire, hrana), naslikana sivo-bela šahovnica (Snowy list, valovi) in prava prosojnost lista (ledeni list). Temne obrobe, beli sneg znotraj obrobe in podrobnosti znotraj lika (npr. zenice) MUST ostati. Napisi na listu MUST NOT biti v sličicah.

#### Scenario: Prosojno ozadje
- **WHEN** je sličica medveda narisana na modro nebo
- **THEN** okoli medveda ni črnega pravokotnika, obroba medveda pa je vidna

#### Scenario: Šahovnica
- **WHEN** je zasnežen kamnit kos s Snowy lista narisan na nebo
- **THEN** okoli njega ni sivo-belih kvadratkov, sneg na vrhu pa je cel

## ADDED Requirements

### Requirement: Razrez na ploščice
Orodje SHALL znati kos (npr. široka tla ali polico) pomanjšati na izbrano število ploščic v širino in ga razrezati na enako široke navpične trakove (levi rob, sredina, desni rob). Vsi trakovi istega kosa MUST biti enako veliki, tako da se sosednji trakovi ujemajo brez zamika, ko so narisani drug ob drugem.

#### Scenario: Tla iz trakov
- **WHEN** so levi rob, dva kosa sredine in desni rob narisani zaporedno
- **THEN** skupaj dajo izvirni kos brez vrzeli in zamika
