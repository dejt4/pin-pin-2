# snowballs Specification

## Purpose
Določa kupe snega in kepe: kje pingvin dobi kepe, koliko jih ima, kako jih vrže in kaj kepa zadene.

## Requirements

### Requirement: Kup snega
Kup snega je ploščica, ki MUST NOT biti ovira: pingvin gre skozenj in lahko ob njem stoji. Pingvin je "ob kupu", kadar se njegov trkovni pravokotnik prekriva s ploščico kupa.

#### Scenario: Hoja skozi kup
- **WHEN** pingvin hodi proti kupu snega
- **THEN** gre skozenj brez ustavljanja

### Requirement: Met ob kupu
Ko je pingvin ob kupu, SHALL ob novem pritisku akcije `throw` vreči kepo. Ob kupu je kep neomejeno. Med dvema metoma MUST preteči najmanj približno 0,3 s, da držanje ali hitro pritiskanje ne izstreli toka kep.

#### Scenario: Več metov ob kupu
- **WHEN** pingvin stoji ob kupu in igralec petkrat pritisne `throw` z vmesnimi premori
- **THEN** pingvin vrže pet kep

#### Scenario: Prehitro pritiskanje
- **WHEN** igralec dvakrat pritisne `throw` v manj kot 0,3 s
- **THEN** pingvin vrže samo eno kepo

### Requirement: Nošena kepa
Ko pingvin odide od kupa, SHALL samodejno imeti eno kepo v krilcu, brez dodatne akcije. Nošena kepa MUST biti vidna. Ko jo vrže, kepe nima več, dokler spet ne pride do kupa. Pingvin MUST NOT nositi več kot ene kepe. Nošena kepa ostane, ko pingvin pade v prepad, ga ujame žival ali se dotakne konic; ob ponovnem začetku sobe je nima.

#### Scenario: Odhod od kupa
- **WHEN** pingvin odide od kupa
- **THEN** ima v krilcu eno kepo

#### Scenario: Met nošene kepe
- **WHEN** pingvin z nošeno kepo daleč od kupa pritisne `throw`
- **THEN** vrže kepo in nato nima nobene

#### Scenario: Brez kepe
- **WHEN** pingvin nima kepe in ni ob kupu ter pritisne `throw`
- **THEN** se nič ne zgodi

#### Scenario: Začetek sobe
- **WHEN** se soba začne
- **THEN** pingvin nima kepe

### Requirement: Let kepe
Kepa SHALL leteti vodoravno naravnost v smer, kamor gleda pingvin, s stalno hitrostjo, z višine prsi pingvina. Pingvin lahko vrže kepo na tleh in v zraku, ne pa med plezanjem po lestvi. Kepa MUST izginiti, ko zadene trdno ploščico (tla, ledeno kocko), žival ali ko zapusti vidni del sobe. Skozi ledene plošče, lestve, konice in kupe snega leti naprej.

#### Scenario: Met v smer pogleda
- **WHEN** pingvin gleda levo in vrže kepo
- **THEN** kepa leti levo

#### Scenario: Kepa zadene zid
- **WHEN** kepa prileti do ledene kocke
- **THEN** kepa izgine

#### Scenario: Kepa izven zaslona
- **WHEN** kepa ne zadene ničesar
- **THEN** izgine, ko zapusti vidni del sobe

#### Scenario: Med plezanjem
- **WHEN** pingvin pleza po lestvi in igralec pritisne `throw`
- **THEN** se nič ne zgodi

### Requirement: Animacija meta
Ob metu SHALL pingvin za kratek čas (približno 0,25 s) pokazati sličico meta. Dokler ni sličic za met in hojo s kepo, se kepa nariše čez obstoječe sličice pingvina.

#### Scenario: Met
- **WHEN** pingvin vrže kepo
- **THEN** za kratek čas pokaže met, nato nadaljuje s prejšnjo animacijo
