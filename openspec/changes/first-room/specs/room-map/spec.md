# Spec Delta

## Purpose

Opisuje sobo, sestavljeno iz ploščic: vrste ploščic, ribe, začetek, cilj, prepade, ledene konice in vrnitev na varno mesto en zaslon nazaj.

## ADDED Requirements

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

Napačna soba (neenake dolžine vrstic, neznan znak, brez `S` ali `G`, več kot en `S`) MUST sprožiti jasno napako ob nalaganju.

#### Scenario: Branje sobe
- **WHEN** igra naloži sobo
- **THEN** pozna vrsto vsake ploščice, položaj vseh rib, začetek in cilj

#### Scenario: Neznan znak
- **WHEN** soba vsebuje znak, ki ni v tabeli
- **THEN** nalaganje sproži napako z vrstico in stolpcem znaka

### Requirement: Prva soba
Igra SHALL vsebovati prvo sobo z vsaj: enim prepadom, ki ga je treba preskočiti, eno lestvijo do višje ploščadi, eno skupino ledenih konic, ledenimi ploščami, vsaj 8 ribami in ciljem na desnem koncu. Sobo MUST biti mogoče prehoditi od začetka do cilja.

#### Scenario: Pot do cilja
- **WHEN** igralec od začetka hodi desno, preskakuje prepade in pleza po lestvah
- **THEN** pride do cilja, preden mu zmanjka energije, tudi če pobere samo ribe na poti

### Requirement: Ribe
Ko se pingvin dotakne ribe, jo SHALL pobrati: riba izgine in pingvin dobi energijo (glej `player-energy`). Ribe MUST biti narisane z eno od štirih barv, izbrano po njihovem položaju, da je izbira vedno enaka. Pobrana riba se MUST NOT vrniti, dokler se soba ne začne znova.

#### Scenario: Pobiranje ribe
- **WHEN** pingvin hodi ali skače čez ribo
- **THEN** riba izgine

#### Scenario: Riba po padcu v prepad
- **WHEN** pingvin pobere ribo, nato pade v prepad in je vrnjen nazaj
- **THEN** pobrana riba ostane pobrana

### Requirement: Prepad
Prepad je stolpec brez tal do spodnjega roba sobe. Ko pingvin pade pod spodnji rob sobe, ga igra SHALL vrniti na varno mesto (glej spodaj) in mu vzeti energijo za padec.

#### Scenario: Padec v prepad
- **WHEN** pingvin pade pod spodnji rob sobe
- **THEN** se pojavi na varnem mestu približno en zaslon nazaj, stoji in ima manj energije

### Requirement: Varno mesto
Varno mesto SHALL biti ploščica tal, ki je najmanj širino enega zaslona levo od mesta, kjer je pingvin padel, in najbližje temu mestu. Pingvin na njem MUST stati na trdni podlagi, ki ni ledena plošča, nad njim ne sme biti trdne ploščice, na mestu in sosednjih ploščicah levo in desno ne sme biti konic ali prepada. Če takega mesta ni, je varno mesto začetek sobe. Vrnitev MUST NOT pingvina postaviti v novo poškodbo.

#### Scenario: Vrnitev en zaslon nazaj
- **WHEN** pingvin pade v prepad na sredini sobe
- **THEN** stoji na tleh približno en zaslon levo od prepada, ne ob robu prepada in ne ob konicah

#### Scenario: Padec blizu začetka
- **WHEN** pingvin pade v prepad manj kot en zaslon od začetka
- **THEN** se pojavi na začetku sobe

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
