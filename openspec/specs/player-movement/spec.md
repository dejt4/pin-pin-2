# player-movement Specification

## Purpose
Določa, kako se pingvin giblje v stranskem pogledu: hoja, skok, gravitacija, trki s ploščicami, plezanje po lestvah in izbira animacije.

## Requirements

### Requirement: Hoja
Pingvin SHALL ob akciji `left` oziroma `right` hoditi s stalno hitrostjo v to smer in se obrniti v smer hoje. Brez smerne akcije MUST obstati. Ob hkratnih `left` in `right` MUST stati.

#### Scenario: Hoja desno
- **WHEN** igralec drži `right` in pingvin stoji na tleh
- **THEN** se pingvin premika desno, gleda desno in kaže animacijo hoje desno

#### Scenario: Ustavitev
- **WHEN** igralec spusti smerno akcijo
- **THEN** pingvin obstane in kaže sličico stoje v smeri, kamor je nazadnje gledal

#### Scenario: Obe smeri hkrati
- **WHEN** igralec drži `left` in `right` hkrati
- **THEN** pingvin stoji

### Requirement: Gravitacija in pristanek
Pingvina SHALL vleči gravitacija, ko ne stoji na podlagi in ne pleza. Hitrost padanja MUST imeti zgornjo mejo. Ko pade na trdno podlago, MUST na njej obstati.

#### Scenario: Hoja čez rob
- **WHEN** pingvin prehodi rob ploščadi
- **THEN** začne padati in pristane na prvi podlagi pod sabo

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

### Requirement: Trki s ploščicami
Pingvin MUST NOT iti skozi trdne ploščice (tla, ledena kocka) z nobene strani. Skozi ledeno ploščo SHALL iti od spodaj in s strani, stati pa MUST na njej, ko pade nanjo od zgoraj. Pingvin MUST NOT zapustiti sobe skozi levi ali desni rob.

#### Scenario: Zid
- **WHEN** pingvin hodi proti ledeni kocki
- **THEN** se ustavi ob njej

#### Scenario: Skok skozi ploščo od spodaj
- **WHEN** pingvin skoči pod ledeno ploščo
- **THEN** gre skozi njo in pristane na njej

#### Scenario: Rob sobe
- **WHEN** pingvin hodi proti levemu robu sobe
- **THEN** se ustavi na robu

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

### Requirement: Animacije
Igra SHALL za vsako stanje pingvina pokazati ustrezne obstoječe sličice: stoja levo/desno, hoja levo/desno (3 sličice v zanki), skok (odriv, dviganje, vrh, pristanek), plezanje (hoja od zadaj), odboj ob poškodbi, jok ob utrujenosti. Sličice, ki obstajajo samo za desno, MUST biti za levo zrcaljene.

#### Scenario: Skok levo
- **WHEN** pingvin skoči, medtem ko gleda levo
- **THEN** so sličice skoka zrcaljene in pingvin gleda levo

### Requirement: Neodvisnost od hitrosti naprave
Gibanje SHALL biti enako hitro ne glede na število sličic na sekundo, ki jih zmore naprava.

#### Scenario: Počasna naprava
- **WHEN** igra teče s 30 sličicami na sekundo namesto 60
- **THEN** pingvin v eni sekundi prehodi enako razdaljo
