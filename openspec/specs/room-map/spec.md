# room-map Specification

## Purpose
Opisuje sobo, sestavljeno iz ploščic: vrste ploščic, ribe, začetek, cilj, prepade, ledene konice in vrnitev na varno mesto en zaslon nazaj.

## Requirements

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

### Requirement: Prva soba
Igra SHALL vsebovati prvo sobo, široko vsaj 600 stolpcev, z vsaj: tremi prepadi, tremi lestvami do višjih ploščadi, tremi skupinami ledenih konic, ledenimi ploščami, 30 kosi hrane, ciljem na desnem koncu, šestimi kupi snega, rjavim medvedom, belim medvedom in volkom, tremi ledenimi zidovi in tremi ledenimi svečami na glavni poti ter vsaj eno oviro na stranskem nivoju (višja ploščad, ki ni na poti do cilja). Pred vsako oviro na glavni poti MUST biti kup snega na isti višini največ 6 ploščic pred njo. Sobo MUST biti mogoče prehoditi od začetka do cilja.

#### Scenario: Pot do cilja
- **WHEN** igralec od začetka hodi desno, preskakuje prepade in živali, pleza po lestvah ter s kupov snega razbije ovire na poti
- **THEN** pride do cilja, preden mu zmanjka energije, tudi če pobere samo hrano na poti

#### Scenario: Stranski nivo
- **WHEN** igralec spleza na stranski nivo
- **THEN** tam najde oviro in kup snega, s katerim jo lahko razbije za točke

### Requirement: Prepad
Prepad je stolpec brez tal do spodnjega roba sobe. Ko pingvin pade pod spodnji rob sobe, ga igra SHALL vrniti na varno mesto (glej spodaj) in mu vzeti energijo za padec.

#### Scenario: Padec v prepad
- **WHEN** pingvin pade pod spodnji rob sobe
- **THEN** se pojavi na varnem mestu približno en zaslon nazaj, stoji in ima manj energije

### Requirement: Varno mesto
Varno mesto SHALL biti ploščica tal, ki je najmanj širino enega zaslona levo od mesta, kjer je pingvin padel, in najbližje temu mestu. Pingvin na njem MUST stati na trdni podlagi, ki ni ledena plošča, nad njim ne sme biti trdne ploščice, na mestu in sosednjih ploščicah levo in desno ne sme biti konic, prepada ali ledene ovire (zid ali sveča, tudi razbita). Če takega mesta ni, je varno mesto začetek sobe. Vrnitev MUST NOT pingvina postaviti v novo poškodbo ali v oviro.

#### Scenario: Vrnitev en zaslon nazaj
- **WHEN** pingvin pade v prepad na sredini sobe
- **THEN** stoji na tleh približno en zaslon levo od prepada, ne ob robu prepada in ne ob konicah

#### Scenario: Padec blizu začetka
- **WHEN** pingvin pade v prepad manj kot en zaslon od začetka
- **THEN** se pojavi na začetku sobe

#### Scenario: Ne ob ledeni oviri
- **WHEN** bi bilo najbližje varno mesto tik ob ledenem zidu
- **THEN** se pingvin pojavi na prvem primernem mestu levo od zidu

### Requirement: Ledene konice
Ko se pingvin dotakne ledenih konic, mu igra SHALL vzeti energijo za konice in ga odriniti nazaj in navzgor (stran od konic). Nato je pingvin za kratek čas (približno 1,5 s) neranljiv in utripa; v tem času ga konice MUST NOT ponovno poškodovati. Konice niso trdne: pingvin jih lahko preskoči.

#### Scenario: Dotik konic
- **WHEN** pingvin stopi na konice
- **THEN** izgubi energijo, je odrinjen nazaj, pokaže sličico odboja in nekaj časa utripa

#### Scenario: Neranljivost
- **WHEN** pingvin utripa in se ponovno dotakne konic
- **THEN** ne izgubi energije

### Requirement: Cilj
Ko pingvin doseže ploščico cilja, SHALL soba biti opravljena (glej `game-flow`).

#### Scenario: Prihod do cilja
- **WHEN** pingvin stopi na ploščico cilja
- **THEN** igra preide v stanje "cilj dosežen"
