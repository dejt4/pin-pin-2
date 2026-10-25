# camera-view Specification

## Purpose
Določa, kateri del sobe vidi igralec: kamera vodoravno sledi pingvinu, se ustavi na robovih sobe, ozadje se pomika počasneje, slika pa se prilagodi velikosti zaslona.

## Requirements

### Requirement: Sledenje pingvinu
Kamera SHALL pingvina držati vodoravno blizu sredine zaslona. Navpično se kamera MUST NOT premikati, ker je soba visoka en zaslon.

#### Scenario: Hoja po sredini sobe
- **WHEN** pingvin hodi desno po sredini sobe
- **THEN** ostane blizu sredine zaslona, soba pa se pomika levo

### Requirement: Robovi sobe
Kamera MUST NOT pokazati ničesar levo od levega ali desno od desnega roba sobe.

#### Scenario: Začetek sobe
- **WHEN** je pingvin na začetku sobe
- **THEN** se kamera ne premika, levi rob sobe je na levem robu zaslona, pingvin pa je levo od sredine

#### Scenario: Konec sobe
- **WHEN** je pingvin blizu desnega konca sobe
- **THEN** je desni rob sobe na desnem robu zaslona

### Requirement: Paralaksa ozadja
Ozadje SHALL biti za ploščicami in se pri premiku kamere pomakniti počasneje od ploščic. Ozadje MUST pokrivati ves zaslon na vsej širini sobe.

#### Scenario: Premik kamere
- **WHEN** se kamera pomakne za en zaslon desno
- **THEN** se ozadje pomakne za manj kot en zaslon

### Requirement: Prilagoditev zaslonu
Igra SHALL imeti stalno logično velikost in razmerje 16 : 9. Slika MUST biti povečana ali pomanjšana tako, da v celoti zapolni okno brskalnika po eni dimenziji in ostane na sredini, brez popačenja razmerja. Ob spremembi velikosti okna se MUST prilagoditi.

#### Scenario: Celozaslonski PS4 brskalnik
- **WHEN** igra teče v brskalniku PS4 na televizorju 16 : 9
- **THEN** igra pokriva cel zaslon brez drsnikov

#### Scenario: Ozko okno
- **WHEN** je okno ožje od razmerja 16 : 9
- **THEN** je igra na sredini okna, zgoraj in spodaj je prazen pas

### Requirement: Vrstica energije
Na zaslonu SHALL biti ves čas igranja vidna vrstica energije v zgornjem levem kotu, ki se ne premika s kamero.

#### Scenario: Prikaz energije
- **WHEN** se energija zmanjša
- **THEN** se vrstica skrajša sorazmerno z energijo
