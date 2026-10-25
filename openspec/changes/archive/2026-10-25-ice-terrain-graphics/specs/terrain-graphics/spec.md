# Spec Delta

## Purpose

Določa videz sobe s sličicami: tla iz zasneženih kamnov, ledene police in bloke, kristale, leseno lestev, valovanje vode v prepadih, ozadje z gorami in okraske, ki ne ovirajo.

## ADDED Requirements

### Requirement: Tla iz zasneženih kamnov
Navpični stolpec dveh ali več trdnih ploščic tal (`#`) SHALL biti narisan z zasneženimi kamni: zgornja ploščica s snegom, spodnje kot kamnita podlaga. Vodoravno SHALL imeti levi rob, kjer levo ni tal v isti vrstici, desni rob, kjer desno ni tal, vmes pa dva kosa sredine, ki se izmenjujeta po stolpcih. Videz MUST NOT vplivati na trke.

#### Scenario: Tla ob prepadu
- **WHEN** se tla končajo ob prepadu
- **THEN** ima zadnja ploščica pred prepadom desni rob, prva za prepadom pa levi rob

#### Scenario: Dolga tla
- **WHEN** so tla dolga deset ploščic
- **THEN** se kosa sredine izmenjujeta in ni dveh enakih kosov sredine drug ob drugem

### Requirement: Ledeni deli
Trdne ploščice tal, ki so debele samo eno ploščico (lebdeči deli, streha nad ledeno svečo), in ledene plošče (`=`) SHALL biti narisane kot ledena polica z visečimi svečami (levi rob, sredina, desni rob). Sveče visijo pod ploščico in MUST NOT biti ovira ali nevarnost. Ledena kocka (`B`) SHALL biti narisana kot majhen zasnežen ledeni blok, ki stoji na dnu svoje ploščice.

#### Scenario: Hoja pod polico
- **WHEN** pingvin hodi pod ledeno polico, iz katere visijo sveče
- **THEN** gre mimo brez trka in brez izgube energije

### Requirement: Kristali in lestev
Ledene konice (`^`) SHALL biti narisane kot ledeni kristali na tleh; nevarnost ostane enaka kot prej. Lestev (`H`) SHALL biti narisana kot lesena lestev, ki se ponavlja po ploščicah lestve brez vrzeli.

#### Scenario: Dolga lestev
- **WHEN** je lestev visoka štiri ploščice
- **THEN** je narisana kot ena neprekinjena lesena lestev

### Requirement: Voda v prepadu
V stolpcih prepada (brez tal v spodnji vrstici) SHALL biti narisana voda z valovi, katere gladina je pod zgornjim robom sosednjih tal. Valovi se SHALL izmenjevati med dvema sličicama (približno dvakrat na sekundo) in se nadaljevati čez sosednje stolpce prepada brez vrzeli. Voda MUST NOT spremeniti obnašanja prepada.

#### Scenario: Prepad z vodo
- **WHEN** je na zaslonu prepad širine treh ploščic
- **THEN** je v njem valovita voda, ki se rahlo premika

### Requirement: Okraski
Okraski (drevo, grm, kamen) SHALL biti narisani za pingvinom, živalmi in hrano, s spodnjim robom na tleh pod znakom. Okraski MUST NOT biti ovira, nevarnost ali podlaga.

#### Scenario: Pingvin pred drevesom
- **WHEN** pingvin hodi mimo drevesa
- **THEN** gre mimo brez ustavljanja, drevo je za njim

### Requirement: Brez risanja ploščic s kodo
Vse vrste ploščic (tla, police, blok, kristali, lestev, voda) SHALL biti narisane s pripravljenimi sličicami; barvni pravokotniki in stare sličice ledu (kocka, plošča, konice) MUST NOT biti več v igri.

#### Scenario: Pregled sobe
- **WHEN** igralec prehodi prvo sobo
- **THEN** ne vidi nobene ploščice, narisane kot enobarven pravokotnik
