# Spec Delta

## Purpose

Določa hrano v sobi (jabolko, korenček, banana), ki jo pingvin pobira za energijo, namesto rib.

## ADDED Requirements

### Requirement: Hrana
Ko se pingvin dotakne hrane, jo SHALL pobrati: hrana izgine in pingvin dobi energijo (glej `player-energy`). Hrana MUST biti narisana kot jabolko, korenček ali banana, izbrano po njenem položaju v sobi, da je izbira vedno enaka. Vse vrste dajo enako energije. Pobrana hrana se MUST NOT vrniti, dokler se soba ne začne znova.

#### Scenario: Pobiranje hrane
- **WHEN** pingvin hodi ali skače čez jabolko
- **THEN** jabolko izgine in pingvin ima več energije

#### Scenario: Hrana po padcu v prepad
- **WHEN** pingvin pobere korenček, nato pade v prepad in je vrnjen nazaj
- **THEN** pobrani korenček ostane pobran

#### Scenario: Ista izbira
- **WHEN** se ista soba naloži dvakrat
- **THEN** je na istem mestu vedno ista vrsta hrane
