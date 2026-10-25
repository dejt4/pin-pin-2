# score Specification

## Purpose
Določa točke, ki jih igralec dobi za pregnane muhe in prilepljene komarje, ter njihov prikaz na zaslonu.

## Requirements

### Requirement: Prikaz točk
Med igranjem SHALL biti točke vidne v zgornjem desnem kotu zaslona in se ne premikajo s kamero. Na zaslonu "Bravo!" MUST biti izpisane tudi dosežene točke.

#### Scenario: Prikaz med igro
- **WHEN** igralec dobi točke
- **THEN** se število v zgornjem desnem kotu takoj poveča

#### Scenario: Cilj
- **WHEN** pingvin doseže cilj s 7 točkami
- **THEN** zaslon "Bravo!" pokaže tudi 7 točk

### Requirement: Točke za ledene ovire
Igralec SHALL dobiti 3 točke za vsak razbit ledeni zid in 1 točko za vsako razbito ledeno svečo. Za drugo (hrana, medved, volk) točk ni. Vrednosti MUST biti zapisane v nastavitvah. Ob ponovnem začetku sobe so točke nič; ob vrnitvi na varno mesto ostanejo.

#### Scenario: Ledeni zid
- **WHEN** igralec razbije ledeni zid
- **THEN** se točke povečajo za 3

#### Scenario: Ledena sveča
- **WHEN** igralec razbije ledeno svečo
- **THEN** se točke povečajo za 1

#### Scenario: Ponoven začetek
- **WHEN** se soba začne znova
- **THEN** so točke nič
