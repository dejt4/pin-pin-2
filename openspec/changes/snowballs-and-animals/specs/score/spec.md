# Spec Delta

## Purpose

Določa točke, ki jih igralec dobi za pregnane muhe in prilepljene komarje, ter njihov prikaz na zaslonu.

## ADDED Requirements

### Requirement: Točke
Igralec SHALL dobiti 3 točke za vsako pregnano muho in 1 točko za vsakega prilepljenega komarja. Za drugo (ribe, medved, volk) točk ni. Vrednosti MUST biti zapisane v nastavitvah. Ob ponovnem začetku sobe so točke nič; ob vrnitvi na varno mesto ostanejo.

#### Scenario: Muha
- **WHEN** igralec prežene muho
- **THEN** se točke povečajo za 3

#### Scenario: Komarji
- **WHEN** igralec prilepi vse tri komarje
- **THEN** se točke povečajo za 3, po 1 za vsakega

#### Scenario: Ponoven začetek
- **WHEN** se soba začne znova
- **THEN** so točke nič

### Requirement: Prikaz točk
Med igranjem SHALL biti točke vidne v zgornjem desnem kotu zaslona in se ne premikajo s kamero. Na zaslonu "Bravo!" MUST biti izpisane tudi dosežene točke.

#### Scenario: Prikaz med igro
- **WHEN** igralec dobi točke
- **THEN** se število v zgornjem desnem kotu takoj poveča

#### Scenario: Cilj
- **WHEN** pingvin doseže cilj s 7 točkami
- **THEN** zaslon "Bravo!" pokaže tudi 7 točk
