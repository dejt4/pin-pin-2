# Spec Delta

## MODIFIED Requirements

### Requirement: Let kepe
Kepa SHALL leteti vodoravno naravnost v smer, kamor gleda pingvin, s stalno hitrostjo, z višine prsi pingvina. Pingvin lahko vrže kepo na tleh in v zraku, ne pa med plezanjem po lestvi. Kepa MUST izginiti, ko zadene trdno ploščico (tla, ledeno kocko), žival, nerazbit ledeni zid ali nerazbito ledeno svečo ali ko zapusti vidni del sobe. Skozi ledene plošče, lestve, konice, kupe snega in razbite ostanke ovir leti naprej.

#### Scenario: Met v smer pogleda
- **WHEN** pingvin gleda levo in vrže kepo
- **THEN** kepa leti levo

#### Scenario: Kepa zadene zid
- **WHEN** kepa prileti do ledene kocke
- **THEN** kepa izgine

#### Scenario: Kepa zadene ledeni zid
- **WHEN** kepa prileti do nerazbitega ledenega zidu
- **THEN** kepa izgine in zid je poškodovan

#### Scenario: Kepa izven zaslona
- **WHEN** kepa ne zadene ničesar
- **THEN** izgine, ko zapusti vidni del sobe

#### Scenario: Med plezanjem
- **WHEN** pingvin pleza po lestvi in igralec pritisne `throw`
- **THEN** se nič ne zgodi
