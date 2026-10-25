# Spec Delta

## MODIFIED Requirements

### Requirement: Soba iz ploščic
Soba SHALL biti mreža kvadratnih ploščic, zapisana kot besedilni podatki (ena vrstica besedila na vrstico ploščic, en znak na ploščico), ločeno od kode. Soba je zapisana v enem ali več zaporednih odsekih; igra odseke zloži od leve proti desni v eno sobo. Vsi odseki MUST imeti enako število vrstic. Soba MUST biti visoka en zaslon in široka vsaj 5 zaslonov. Znaki in njihov pomen:

| Znak | Pomen |
|------|-------|
| `.`  | prazno |
| `#`  | tla (trdna); debela vsaj dve ploščici so zasneženi kamni, debela eno ploščico led |
| `B`  | ledeni blok (trden) |
| `=`  | ledena polica (stoji se na njej, od spodaj se gre skozi) |
| `H`  | lestev |
| `^`  | ledeni kristali (nevarni) |
| `f`  | hrana (jabolko, korenček ali banana) |
| `S`  | začetek pingvina |
| `G`  | cilj |
| `*`  | kup snega |
| `M`  | rjavi medved (začetni položaj, stoji na tleh pod znakom) |
| `P`  | beli medved (začetni položaj, stoji na tleh pod znakom) |
| `V`  | volk (začetni položaj, stoji na tleh pod znakom) |
| `W`  | ledeni zid (stoji na tleh pod znakom) |
| `i`  | ledena sveča (visi s trdne ploščice nad znakom; pod znakom je še ena prazna vrstica, nato tla) |
| `t`  | okrasek: zasneženo drevo (stoji na tleh pod znakom) |
| `g`  | okrasek: zasnežen grm (stoji na tleh pod znakom) |
| `k`  | okrasek: zasnežen kamen (stoji na tleh pod znakom) |

Okraski niso ploščice: na njihovem mestu je prazno. Napačna soba (odseki ali vrstice neenakih dolžin oziroma višin, neznan znak, brez `S` ali `G`, več kot en `S`, žival, ledeni zid ali okrasek brez trdnih tal neposredno pod znakom, ledena sveča brez trdne ploščice nad sabo ali brez tal dve vrstici niže) MUST sprožiti jasno napako ob nalaganju, z odsekom, vrstico in stolpcem.

#### Scenario: Branje sobe
- **WHEN** igra naloži sobo iz več odsekov
- **THEN** pozna vrsto vsake ploščice, položaj vse hrane, kupov snega, živali, ovir, okraskov, začetek in cilj, odseki pa si sledijo brez vrzeli

#### Scenario: Neznan znak
- **WHEN** soba vsebuje znak, ki ni v tabeli
- **THEN** nalaganje sproži napako z odsekom, vrstico in stolpcem znaka

#### Scenario: Medved v zraku
- **WHEN** pod znakom `M` ni trdnih tal
- **THEN** nalaganje sproži napako z odsekom, vrstico in stolpcem znaka

#### Scenario: Sveča brez stropa
- **WHEN** nad znakom `i` ni trdne ploščice
- **THEN** nalaganje sproži napako z odsekom, vrstico in stolpcem znaka

#### Scenario: Drevo v zraku
- **WHEN** pod znakom `t` ni trdnih tal
- **THEN** nalaganje sproži napako z odsekom, vrstico in stolpcem znaka
