# game-flow Specification

## Purpose
Določa zaslone igre in prehode med njimi: začetek, igranje, utrujenost, cilj in ponovni začetek, tako da jih zmore tudi dveletni otrok.

## Requirements

### Requirement: Stanja igre
Igra SHALL biti vedno v natanko enem od stanj: `start` (začetni zaslon), `playing` (igranje), `tired` (utrujenost), `goal` (cilj dosežen). Ob odprtju strani MUST biti v stanju `start`.

#### Scenario: Odprtje igre
- **WHEN** se stran z igro naloži
- **THEN** igra pokaže začetni zaslon

### Requirement: Začetni zaslon
Začetni zaslon SHALL pokazati ime igre "Pin-Pin", pingvina od spredaj in navodilo za začetek. Nov pritisk katerekoli akcije MUST začeti igranje.

#### Scenario: Začetek igranja
- **WHEN** je igra na začetnem zaslonu in igralec pritisne katerokoli tipko ali gumb, ki je akcija
- **THEN** se soba začne: pingvin na začetku, polna energija, vse ribe na mestu

### Requirement: Nalaganje
Igra MUST NOT začeti igranja, dokler niso naložene vse sličice. Med nalaganjem SHALL pokazati napis o nalaganju. Če se sličica ne naloži, SHALL pokazati napako z imenom datoteke.

#### Scenario: Manjkajoča sličica
- **WHEN** ena od sličic ne obstaja
- **THEN** igra pokaže napako z imenom te sličice

### Requirement: Utrujenost in ponovni začetek
V stanju `tired` igra SHALL najprej vsaj 2 sekundi kazati jok in napis "Utrujen sem ...", nato navodilo za ponovni začetek. Nov pritisk katerekoli akcije po tem času MUST začeti sobo znova od začetka (pingvin na začetku, polna energija, vse ribe na mestu).

#### Scenario: Ponovni začetek po utrujenosti
- **WHEN** je igra v stanju `tired` že več kot 2 sekundi in igralec pritisne skok
- **THEN** se soba začne znova od začetka

#### Scenario: Prezgodnji pritisk
- **WHEN** igralec pritisne skok takoj, ko se pingvin utrudi
- **THEN** se soba še ne začne znova

### Requirement: Cilj dosežen
V stanju `goal` SHALL pingvin pokazati sličico od zadaj (vstopa v cilj), energija se ustavi in igra pokaže napis "Bravo!". Po vsaj 2 sekundah nov pritisk katerekoli akcije MUST začeti sobo znova od začetka.

#### Scenario: Prihod do cilja
- **WHEN** pingvin doseže cilj
- **THEN** igra pokaže "Bravo!", pingvin se ne premika več in energija ne upada

#### Scenario: Ponovno igranje
- **WHEN** je igra v stanju `goal` več kot 2 sekundi in igralec pritisne katerokoli akcijo
- **THEN** se soba začne znova od začetka

### Requirement: Napisi v slovenščini
Vsi napisi na zaslonu SHALL biti v slovenščini, veliki in kratki, da jih starš lahko hitro prebere otroku.

#### Scenario: Napis na začetnem zaslonu
- **WHEN** je igra na začetnem zaslonu
- **THEN** piše "Pin-Pin" in "Pritisni tipko za začetek"
