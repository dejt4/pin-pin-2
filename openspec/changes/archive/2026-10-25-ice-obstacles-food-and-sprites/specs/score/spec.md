# Spec Delta

## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Točke
**Reason**: Muhe in komarje zamenjajo ledene ovire, zato se točke štejejo zanje.
**Migration**: Glej zahtevo "Točke za ledene ovire".
