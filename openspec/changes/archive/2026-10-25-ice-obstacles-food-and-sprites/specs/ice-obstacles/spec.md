# Spec Delta

## Purpose

Določa ledene ovire, ki zapirajo pot, dokler jih pingvin ne razbije s kepami: ledeni zid na tleh in ledeno svečo, ki visi z višje ploščadi.

## ADDED Requirements

### Requirement: Ledeni zid zapira pot
Ledeni zid SHALL stati na tleh in zapirati pot: pingvin MUST NOT iti mimo stolpca zidu od vrha sobe do tal pod zidom, tudi s skokom ne, dokler zid ni razbit. Dotik zidu pingvinu ne škodi.

#### Scenario: Zid ustavi pingvina
- **WHEN** pingvin hodi ali skače proti celemu ledenemu zidu
- **THEN** se ustavi pred njim

### Requirement: Lomljenje ledenega zidu
Vsaka kepa, ki zadene zid, SHALL zid poškodovati; kepa izgine. Zid MUST se razbiti po 5 zadetkih in med tem vidno kazati stopnje: cel (0–1 zadetek), počen (2–3 zadetki), močno počen (4 zadetki). Ob petem zadetku SHALL pokazati razpad in nato ostanejo razdrobljeni kosi na tleh, ki ne zapirajo poti. Zadetki MUST ostati, tudi če pingvin vmes odide.

#### Scenario: Pet kep
- **WHEN** zid zadene pet kep
- **THEN** zid razpade, na tleh ostanejo kosi in pingvin gre lahko naprej

#### Scenario: Stopnje poškodbe
- **WHEN** zid zadeneta dve kepi
- **THEN** je zid viden kot počen in še vedno zapira pot

#### Scenario: Zadetki ostanejo
- **WHEN** zid zadeneta dve kepi, pingvin odide in se pozneje vrne ter ga zadene še trikrat
- **THEN** zid razpade

### Requirement: Ledena sveča zapira pot
Ledena sveča SHALL viseti s trdne ploščice nad sabo in segati skoraj do tal pod sabo. Zapira pot pod ploščico: pingvin MUST NOT iti mimo stolpca sveče med ploščico zgoraj in tlemi spodaj, dokler sveča ni razbita. Nad ploščico pot ni zaprta. Dotik sveče pingvinu ne škodi.

#### Scenario: Sveča ustavi pingvina
- **WHEN** pingvin hodi pod ploščico proti sveči
- **THEN** se ustavi pred njo

### Requirement: Lomljenje ledene sveče
Vsaka kepa, ki zadene svečo, SHALL svečo poškodovati; kepa izgine. Po prvem zadetku je sveča počena. Ob tretjem zadetku SHALL sveča pasti, se razbiti in na tleh pustiti drobce, ki ne zapirajo poti. Zadetki MUST ostati, tudi če pingvin vmes odide.

#### Scenario: Tri kepe
- **WHEN** svečo zadenejo tri kepe
- **THEN** sveča pade, se razbije in pingvin gre lahko naprej

#### Scenario: Ena kepa
- **WHEN** svečo zadene ena kepa
- **THEN** je sveča počena in še vedno zapira pot

### Requirement: Ovire ob vrnitvi in ponovnem začetku
Ob vrnitvi na varno mesto (prepad, ulov) SHALL razbite ovire ostati razbite in poškodbe ostati. Ob ponovnem začetku sobe MUST biti vse ovire spet cele.

#### Scenario: Ponoven začetek
- **WHEN** se soba po utrujenosti začne znova
- **THEN** so vsi ledeni zidovi in sveče spet celi
