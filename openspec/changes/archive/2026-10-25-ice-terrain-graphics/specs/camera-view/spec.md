# Spec Delta

## MODIFIED Requirements

### Requirement: Paralaksa ozadja
Ozadje SHALL biti za ploščicami in se pri premiku kamere pomakniti počasneje od ploščic. Sestavljeno je iz neba in dveh plasti gorskih panoram: daljna plast se pomika počasneje od bližnje. Panorami se ponavljata izmenično zrcaljeni, tako da med ponovitvami ni vrzeli ali šiva. Ozadje MUST pokrivati ves zaslon na vsej širini sobe.

#### Scenario: Premik kamere
- **WHEN** se kamera pomakne za en zaslon desno
- **THEN** se ozadje pomakne za manj kot en zaslon

#### Scenario: Dve plasti
- **WHEN** se kamera pomakne desno
- **THEN** se daljne gore pomaknejo manj kot bližnje, obe pa manj kot ploščice

#### Scenario: Brez šivov
- **WHEN** pingvin prehodi celotno sobo
- **THEN** v ozadju ni vrzeli med ponovitvami panoram
