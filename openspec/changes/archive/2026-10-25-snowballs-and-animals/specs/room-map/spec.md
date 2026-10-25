# Spec Delta

## MODIFIED Requirements

### Requirement: Soba iz ploščic
Soba SHALL biti mreža kvadratnih ploščic, zapisana kot besedilni podatki (ena vrstica besedila na vrstico ploščic, en znak na ploščico), ločeno od kode. Soba MUST biti visoka en zaslon in široka vsaj 5 zaslonov. Znaki in njihov pomen:

| Znak | Pomen |
|------|-------|
| `.`  | prazno |
| `#`  | snežna tla (trdna) |
| `B`  | ledena kocka (trdna) |
| `=`  | ledena plošča (stoji se na njej, od spodaj se gre skozi) |
| `H`  | lestev |
| `^`  | ledene konice |
| `f`  | riba |
| `S`  | začetek pingvina |
| `G`  | cilj |
| `*`  | kup snega |
| `M`  | medved (začetni položaj, stoji na tleh pod znakom) |
| `V`  | volk (začetni položaj, stoji na tleh pod znakom) |
| `u`  | muha (lebdi na tem mestu) |
| `k`  | skupina treh komarjev (lebdi na tem mestu) |

Napačna soba (neenake dolžine vrstic, neznan znak, brez `S` ali `G`, več kot en `S`, medved ali volk brez tal neposredno pod znakom) MUST sprožiti jasno napako ob nalaganju.

#### Scenario: Branje sobe
- **WHEN** igra naloži sobo
- **THEN** pozna vrsto vsake ploščice, položaj vseh rib, kupov snega, živali, začetek in cilj

#### Scenario: Neznan znak
- **WHEN** soba vsebuje znak, ki ni v tabeli
- **THEN** nalaganje sproži napako z vrstico in stolpcem znaka

#### Scenario: Medved v zraku
- **WHEN** pod znakom `M` ni trdnih tal
- **THEN** nalaganje sproži napako z vrstico in stolpcem znaka

### Requirement: Prva soba
Igra SHALL vsebovati prvo sobo z vsaj: enim prepadom, ki ga je treba preskočiti, eno lestvijo do višje ploščadi, eno skupino ledenih konic, ledenimi ploščami, vsaj 8 ribami, ciljem na desnem koncu, vsaj dvema kupoma snega, enim medvedom, enim volkom, eno muho in eno skupino komarjev na glavni poti ter vsaj eno muho ali skupino komarjev na stranskem nivoju (višja ploščad, ki ni na poti do cilja). Pred vsako muho in skupino komarjev na glavni poti MUST biti kup snega, s katerega kepa doseže žival. Sobo MUST biti mogoče prehoditi od začetka do cilja.

#### Scenario: Pot do cilja
- **WHEN** igralec od začetka hodi desno, preskakuje prepade, medveda in volka, pleza po lestvah ter s kupov snega prežene muho in komarje na poti
- **THEN** pride do cilja, preden mu zmanjka energije, tudi če pobere samo ribe na poti

#### Scenario: Stranski nivo
- **WHEN** igralec spleza na stranski nivo
- **THEN** tam najde muho ali komarje in kup snega, s katerim jih lahko prežene za točke
