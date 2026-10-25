# Spec Delta

## Purpose

Prevede tipkovnico, kontroler PS4 in gumbe na zaslonu na dotik v akcije igre (levo, desno, gor, dol, skok, kepa), da pravila igre ne poznajo naprav in tipk.

## ADDED Requirements

### Requirement: Akcije igre
Igra SHALL prepoznati natanko te akcije: `left`, `right`, `up`, `down`, `jump`, `throw`. Pravila igre MUST prejemati samo akcije, nikoli tipk ali gumbov.

#### Scenario: Pravila ne vidijo tipk
- **WHEN** igralec pritisne katerokoli tipko ali gumb
- **THEN** pravila igre dobijo samo nabor trenutno aktivnih akcij

### Requirement: Tipkovnica
Igra SHALL tipke prepoznati po `keyCode` in jih prevesti po tej razporeditvi: puščica levo (37) → `left`, puščica gor (38) → `up`, puščica desno (39) → `right`, puščica dol (40) → `down`, Y (89) → `jump`, X (88) → `throw`. Razporeditev MUST biti zapisana kot podatki, ločeno od kode.

#### Scenario: Hoja s puščico
- **WHEN** igralec drži puščico desno
- **THEN** je akcija `right` aktivna, dokler tipke ne spusti

#### Scenario: Skok s tipko Y
- **WHEN** igralec pritisne Y
- **THEN** je akcija `jump` aktivna

#### Scenario: Puščice ne premikajo strani
- **WHEN** igralec pritisne puščico med igro
- **THEN** se stran v brskalniku ne pomakne

### Requirement: Kontroler
Igra SHALL podpirati kontroler s standardno razporeditvijo (PS4): križec in leva palčka → `left`/`right`/`up`/`down`, gumb × → `jump`, gumb □ → `throw`. Majhni odkloni palčke (mrtva cona) MUST NOT sprožiti akcije.

#### Scenario: Skok z gumbom ×
- **WHEN** igralec pritisne × na kontrolerju
- **THEN** je akcija `jump` aktivna

#### Scenario: Mrtva cona palčke
- **WHEN** je leva palčka rahlo odklonjena (manj kot polovica hoda)
- **THEN** nobena smerna akcija ni aktivna

#### Scenario: Ni kontrolerja
- **WHEN** kontroler ni priključen
- **THEN** igra deluje samo s tipkovnico, brez napake

### Requirement: Gumbi na zaslonu za naprave na dotik
Na napravi z zaslonom na dotik (telefon, tablica) SHALL igra pokazati gumbe na zaslonu: na desni križec s smermi gor, dol, levo in desno, na levi gumba "Skok" in "Kepa". Gumb SHALL sprožiti svojo akcijo (`up`, `down`, `left`, `right`, `jump`, `throw`), dokler se ga prst dotika. Drsenje prsta z ene smeri križca na drugo MUST zamenjati akcijo brez dviga prsta. Več prstov hkrati MUST sprožiti več akcij hkrati. Dotik gumbov MUST NOT premikati ali povečevati strani. Na napravi brez zaslona na dotik gumbi MUST NOT biti vidni.

#### Scenario: Pokončen telefon
- **WHEN** igra teče na telefonu, ki ga igralec drži pokončno
- **THEN** je igra na vrhu zaslona v polni širini, pod njo pa so gumbi: križec na desni, skok in kepa na levi

#### Scenario: Ležeč telefon
- **WHEN** igralec telefon obrne ležeče
- **THEN** igra zapolni zaslon, gumbi pa so prosojni v spodnjih kotih čez igro (križec desno, skok in kepa levo)

#### Scenario: Hoja in skok z dvema prstoma
- **WHEN** igralec z enim prstom drži desno na križcu in z drugim pritisne Skok
- **THEN** sta aktivni akciji `right` in `jump` in pingvin skoči med hojo

#### Scenario: Drsenje po križcu
- **WHEN** igralec drži levo na križcu in prst brez dviga povleče na desno
- **THEN** akcija `left` ni več aktivna, aktivna je `right`

#### Scenario: Računalnik brez zaslona na dotik
- **WHEN** igra teče v namiznem brskalniku ali na PS4
- **THEN** gumbov na zaslonu ni

### Requirement: Sočasna uporaba naprav
Akcija SHALL biti aktivna, če jo sproži katerakoli naprava.

#### Scenario: Tipkovnica in kontroler hkrati
- **WHEN** igralec drži puščico desno in hkrati pritisne × na kontrolerju
- **THEN** sta aktivni akciji `right` in `jump`

### Requirement: Pritisk in držanje
Igra SHALL za vsako akcijo ločiti, ali je bila v tem koraku na novo pritisnjena ali se samo drži.

#### Scenario: Držanje skoka ne skače ponovno
- **WHEN** igralec drži skok tudi po pristanku
- **THEN** pingvin ne skoči znova, dokler skoka ne spusti in ponovno pritisne

### Requirement: Akcija kepe je rezervirana
Akcija `throw` SHALL biti prepoznana, vendar v tej različici igre MUST NOT imeti učinka.

#### Scenario: Pritisk X
- **WHEN** igralec pritisne X med igro
- **THEN** se v igri nič ne zgodi
