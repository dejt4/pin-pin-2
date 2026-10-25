# Pin-Pin: začetna ideja

## Izvirna ideja (avtor)

- Za igro je pripravljenih nekaj grafik (pingvin, ribe, led).
- Igra naj bo narejena podobno kot Amigina igra **Prehistorik**: 2D, premikanje in odvijanje mape na enak način.
- Glavni junak je **pingvin**. Zgodbe in figure slonijo na domišljijskih prigodah hčerke (2 leti), sestavljenih iz njenih igrač, pravljic in risank. Idejne figure in dogajanje bodo še dodani.
- **Hrana** so (za zdaj) ribe, ki pingvinu dajejo energijo.
- **Energija** s časom upada. Ko pade na nič, pingvin pove, da je utrujen in ne more naprej. Igra se začne znova.
- Izogibati se je treba raznim živalim: medvedi, lame, volkovi, pujsi, muhe, komarji ...
- Nekatere živali pomagajo, druge je treba pregnati.
- Za zdaj je igra omejena na eno "sobo".

## Dogovorjeno

### Igralec
Igra tudi hčerka (2 leti), zato:
- prijazna težavnost: brez smrti in krvi, veliko rib, kratka soba,
- čim manj kontrol: **naprej, nazaj, skok, gor/dol po lestvi, met kepe**.

### Kontrole
| Akcija             | Tipkovnica        | Kontroler                 |
|--------------------|-------------------|---------------------------|
| naprej / nazaj     | puščici ← →       | križec ali leva palčka    |
| gor / dol po lestvi| puščici ↑ ↓       | križec ali leva palčka    |
| skok               | **Y**             | **×**                     |
| met kepe           | **X**             | **□**                     |

### Pogled in premikanje
**Stranski pogled s skakanjem** (platformer), kot Prehistorik: lik hodi levo in desno, skače, gravitacija ga vleče navzdol, mapa se pomika vodoravno za likom (kamera ga drži približno na sredini, rob mape ustavi kamero).

- hoja levo/desno (`walk-left-*`, `walk-right-*`),
- skok, tudi čez prepad (`jump-takeoff`, `jump-rising`, `jump-apex`, `jump-landing`),
- plezanje po lestvi gor in dol: tipki gor/dol delujeta samo ob lestvi; za plezanje se lahko uporabijo sličice od zadaj (`walk-up-*`),
- sličice od spredaj (`stand-down`, `cry-*`) za pozdrav na začetku in jok ob utrujenosti; od zadaj za vstop v cilj.

### Soba
- Ena mapa, nekaj zaslonov široka, lahko tudi v več nadstropjih (povezanih z lestvami).
- Začetek na levi, **cilj na koncu** sobe (npr. iglu). Ko ga dosežeš, je soba končana. V nadgradnji sledi naslednja soba.
- Ledene kocke in plošče (`ice-cube`, `ice-floe`) so ploščadi, ledene konice (`ice-spikes`) vzamejo del energije.
- **Prepad**: padec te vrne en zaslon nazaj in vzame nekaj energije.

### Energija
- Prikaz kot vrstica v kotu zaslona.
- Upada počasi in enakomerno.
- **Vse ribe dajo enako energije** (barve so samo za videz).
- Pri nič energije: pingvin se usede in zajoka (`cry-1..3`), napis "Utrujen sem ..." in ponovni začetek sobe.

### Živali
| Žival   | Vloga                    | Kaj se zgodi |
|---------|--------------------------|--------------|
| medved  | hodi sem in tja, izogibaš se mu | preskočiš ga ali ga s kepo prej obrneš; če te ujame, te odbije en zaslon nazaj in vzame nekaj energije |
| volk    | hodi sem in tja, izogibaš se mu | preskočiš ga ali ga s kepo prej obrneš; če te ujame, te odbije en zaslon nazaj in vzame nekaj energije |
| muha    | zapira pot, preženeš jo  | vanjo vržeš **5 kep**; vrstica napredka se polni (zadetki ostanejo, tudi če vmes odideš), ko je polna, muha odleti |
| komarji | zapirajo pot (3 skupaj)  | vsaka kepa enega komarja zalepi na tla; ko so vsi trije, je pot prosta |

- Mimo muhe ali komarjev ne moreš, dokler jih ne preženeš.
- **Medved in volk** hodita sem in tja po svojem delu tal. Če ju zadeneš s kepo, se takoj obrneta in gresta v drugo smer. Tako si narediš čas, da npr. splezaš po lestvi na višjo ploščad, preden se vrneta.
- **"En zaslon nazaj"** pomeni zadnje varno mesto približno en zaslon nazaj (ne v prepadu in ne pri živali). Enako velja za padec v prepad.

### Kupi snega in kepe
- Vse je ledeno, sneg je samo v **kupih snega**. Kupi niso ovira, pingvin se lahko ustavi ob njih.
- Ko stojiš ob kupu, lahko z **X** mečeš kepe **neomejeno**.
- Ko odideš od kupa, imaš **samodejno eno kepo v krilcu** (brez dodatne tipke). Ko jo vržeš, moraš po novo nazaj h kupu.
- Nošena kepa se vidi (pingvin jo drži v krilcu).
- Nošena kepa deluje enako kot kepa od kupa: obrne medveda ali volka, šteje pri muhi in zalepi komarja.
- Kupi so postavljeni pred muhami in komarji, tako da jih z mesta ob kupu doseže kepa. Pri medvedu in volku je kup lahko dlje, ker kepo prineseš s sabo.
- Ostale živali (lama, pujs ...) in pomočniki pridejo v nadgradnji.
- Živali niso vedno na glavni poti: lahko so tudi na **stranskem nivoju** (npr. po lestvi gor), kamor greš samo po točke.

### Točke
- Točke dobiš za **pregnane muhe** in **prilepljene komarje**.

## Izris sobe: predlog

Priporočam **sestavljanje iz delov (ploščic)** in ne ene velike slike cele sobe:

- Igra mora vedeti, kje so tla, ploščadi, lestve in prepadi. Pri ploščicah to izhaja iz same mape; pri eni sliki bi morali vse to še enkrat ročno vrisati posebej.
- Sobo spremenimo ali dodamo novo brez risanja: zamenjamo samo mapo.
- PS4 brskalnik lažje dela z več majhnimi slikami kot z eno zelo široko.

Kako bi šlo:
1. **Ozadje**: ena slika v širini enega zaslona (nebo, gore, sneg), ki se ponavlja in premika počasneje od ospredja (občutek globine, kot v Prehistoriku). Lahko sta dve plasti: daljna (gore) in bližnja (hribčki).
2. **Ploščice ospredja**, vse enake kvadratne velikosti (npr. 128 × 128 v izvirniku, v igri pomanjšane):
   - snežna tla: zgornji rob, levi rob, desni rob, notranjost,
   - tanka ploščad (led),
   - lestev: vrh, sredina, dno,
   - prepad / voda (lahko tudi samo prazno),
   - obstoječe ledene ovire (kocka, konice, plošča),
   - kup snega,
3. **Predmeti in liki** posebej: ribe, cilj (iglu), medved, volk, muha, komar, kepa.
4. Mapo sobe napišem jaz kot podatke v `src/js/config/` (mreža znakov, npr. `=` tla, `H` lestev, `F` riba), da jo lahko pozneje urejaš tudi sam.

Za začetek lahko naredim sobo iz preprostih barvnih kvadratov, dokler ploščice niso pripravljene.

### Grafike, ki še manjkajo
- ozadje in ploščice (zgoraj, vključno s kupom snega),
- cilj (iglu),
- medved, volk (hoja levo/desno),
- muha in komar (letenje, za komarja še "prilepljen na tleh"),
- kepa,
- pingvin: met kepe (levo/desno), hoja in skok s kepo v krilcu, plezanje po lestvi (lahko `walk-up-*`).
  Hojo s kepo lahko za začetek naredim tako, da kepo narišem čez obstoječe sličice.

## Odprta vprašanja

1. ~~Pogled~~: **odločeno**, stranski pogled s skakanjem. Opis projekta v `AGENTS.md` bo treba popraviti.
2. ~~Met kepe~~: **odločeno**, neomejeno ob kupu snega.
3. ~~Muha~~: **odločeno**, 5 kep; zadetki ostanejo, vrstica se ne prazni.
4. ~~Medved in volk~~: **odločeno**, odboj vzame nekaj energije.
5. ~~En zaslon nazaj~~: **odločeno**, zadnje varno mesto.
6. ~~Tipke~~: **odločeno**, puščice, Y/× skok, X/□ kepa.
7. ~~Lokacija dokumenta~~: **odločeno**, `idea/init.md`.
8. ~~Pobiranje kepe~~: **odločeno**, samodejno ob odhodu od kupa.
9. ~~Število nošenih kep~~: **odločeno**, ena.
10. ~~Nošena kepa in muhe/komarji~~: **odločeno**, deluje enako kot kepa od kupa.
