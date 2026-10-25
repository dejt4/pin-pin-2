# Spec Delta

## MODIFIED Requirements

### Requirement: Skok
Pingvin SHALL ob novem pritisku `up` skočiti, če stoji na podlagi in ni pri lestvi (pri lestvi `up` pomeni plezanje, glej Plezanje po lestvi). Med skokom MUST ga igralec lahko usmerja levo in desno. Skok MUST biti dovolj dolg, da pingvin preskoči prepad, širok 3 ploščice, in dovolj visok, da doseže ploščad 2 ploščici višje. Pingvin MUST NOT skočiti v zraku.

#### Scenario: Skok s tal
- **WHEN** pingvin stoji na tleh daleč od lestve in igralec pritisne `up`
- **THEN** pingvin poskoči, se dvigne, doseže vrh in pade nazaj

#### Scenario: Preskok prepada
- **WHEN** pingvin teče proti prepadu širine 3 ploščice in skoči tik pred robom
- **THEN** pristane na drugi strani

#### Scenario: Ni dvojnega skoka
- **WHEN** je pingvin v zraku in igralec pritisne `up`
- **THEN** se skok ne ponovi

#### Scenario: Udarec z glavo
- **WHEN** pingvin med skokom zadene trdno ploščico nad sabo
- **THEN** se dviganje ustavi in pingvin začne padati

### Requirement: Plezanje po lestvi
Ko pingvin stoji pred lestvijo, SHALL ob akciji `up` začeti plezati namesto skočiti; ko stoji na vrhu lestve, SHALL ob akciji `down` začeti plezati navzdol. Med plezanjem gravitacija MUST NOT delovati, pingvin se poravna na sredino lestve in se premika gor ali dol s stalno hitrostjo; brez akcije obvisi na mestu. Vrh lestve SHALL delovati kot podlaga, na kateri lahko stoji. Lestev SHALL zapustiti, ko spleza na vrh, ko na dnu doseže tla, ali z akcijo `left`/`right`.

#### Scenario: Plezanje gor
- **WHEN** pingvin stoji pred lestvijo in igralec drži `up`
- **THEN** pingvin ne skoči, ampak pleza gor in kaže animacijo plezanja (pogled od zadaj)

#### Scenario: Prihod na vrh
- **WHEN** pingvin spleza do vrha lestve
- **THEN** stopi na ploščad nad lestvijo in lahko hodi naprej, in ker `up` še drži, ne skoči

#### Scenario: Spust z vrha
- **WHEN** pingvin stoji na vrhu lestve in igralec drži `down`
- **THEN** pingvin začne plezati navzdol

#### Scenario: Obvisi na lestvi
- **WHEN** pingvin pleza in igralec spusti `up`
- **THEN** pingvin obvisi na mestu in ne pade

#### Scenario: Gor brez lestve
- **WHEN** pingvin stoji na tleh, ni pri lestvi in igralec pritisne `up`
- **THEN** pingvin skoči

#### Scenario: Stran z lestve
- **WHEN** pingvin pleza in igralec pritisne `left`
- **THEN** pingvin zapusti lestev in pade na podlago pod sabo
