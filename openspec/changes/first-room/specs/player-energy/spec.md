# Spec Delta

## Purpose

Določa energijo pingvina: kako s časom upada, koliko jo dajo ribe, koliko je vzamejo prepadi in konice ter kdaj se pingvin utrudi.

## ADDED Requirements

### Requirement: Začetna energija
Ob začetku sobe SHALL imeti pingvin polno energijo. Energija MUST biti med nič in največjo vrednostjo.

#### Scenario: Začetek sobe
- **WHEN** se soba začne
- **THEN** je energija polna

### Requirement: Upad energije
Energija SHALL med igranjem enakomerno upadati, od polne do nič v približno dveh minutah. Med začetnim zaslonom, na cilju in med utrujenostjo energija MUST NOT upadati.

#### Scenario: Čakanje
- **WHEN** pingvin minuto stoji pri miru s polno energijo
- **THEN** ima približno pol energije

### Requirement: Energija iz rib
Vsaka riba SHALL dati enako energije, približno četrtino polne. Energija MUST NOT preseči največje vrednosti.

#### Scenario: Riba pri polovični energiji
- **WHEN** ima pingvin pol energije in pobere ribo
- **THEN** ima približno tri četrtine energije

#### Scenario: Riba pri polni energiji
- **WHEN** ima pingvin polno energijo in pobere ribo
- **THEN** ostane polna energija

### Requirement: Izguba energije
Padec v prepad SHALL vzeti približno 15 % polne energije, dotik konic približno 10 %. Vrednosti MUST biti zapisane v nastavitvah.

#### Scenario: Padec v prepad
- **WHEN** ima pingvin polno energijo in pade v prepad
- **THEN** ima po vrnitvi približno 85 % energije

### Requirement: Utrujenost
Ko energija pade na nič, SHALL se pingvin utruditi: obstane, se ne odziva na smerne akcije in skok, kaže animacijo joka in igra pokaže napis "Utrujen sem ...". Potem se soba začne znova (glej `game-flow`).

#### Scenario: Energija pade na nič
- **WHEN** energija med igranjem doseže nič
- **THEN** pingvin zajoka, napis "Utrujen sem ..." se pokaže in pingvin se ne premika več

#### Scenario: Konice vzamejo zadnjo energijo
- **WHEN** ima pingvin manj energije, kot jo vzamejo konice, in se jih dotakne
- **THEN** energija je nič in pingvin se utrudi
