# Spec Delta

## ADDED Requirements

### Requirement: Energija iz hrane
Vsak kos hrane (jabolko, korenček, banana) SHALL dati enako energije, približno četrtino polne. Energija MUST NOT preseči največje vrednosti.

#### Scenario: Hrana pri polovični energiji
- **WHEN** ima pingvin pol energije in pobere banano
- **THEN** ima približno tri četrtine energije

#### Scenario: Hrana pri polni energiji
- **WHEN** ima pingvin polno energijo in pobere jabolko
- **THEN** ostane polna energija

## REMOVED Requirements

### Requirement: Energija iz rib
**Reason**: Ribe zamenja hrana.
**Migration**: Glej zahtevo "Energija iz hrane".
