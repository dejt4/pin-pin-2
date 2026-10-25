# Design

## Context

Igra je napisana v ES5 brez gradbenega koraka, tipke se berejo po `keyCode`, kontroler prek Gamepad API s standardno razporeditvijo (gor skok, □ kepa). Vse to je bilo izbrano zaradi brskalnika PS4, a na PS4 še ni preizkušeno. Glej proposal.md.

## Goals / Non-Goals

**Goals:**
- Potrditi, da igra na PS4 deluje po obstoječih zahtevah.

**Non-Goals:**
- Nove funkcionalnosti ali spremembe obnašanja.

## Decisions

- **Dostop s PS4**: `npm start` na računalniku v istem omrežju (`http://<IP računalnika>:8080/`) ali objava `src/` na spletu. Izbere avtor ob preizkusu.
- **Kontroler**: če Gamepad API na PS4 ne deluje ali ima drugačno razporeditev gumbov, se popravi razporeditev v `config/controls.js` (podatki, brez spremembe pravil). Če ga brskalnik sploh ne podpira, se to zapiše in igra ostane na tipkovnici.

## Risks / Trade-offs

- [Brskalnik PS4 ne podpira kakšnega API-ja, npr. `requestAnimationFrame` ali `devicePixelRatio`] → `app/main.js` ima nadomestek za `requestAnimationFrame`, `screen.js` privzeto vzame `devicePixelRatio` 1; morebitne druge napake se popravijo v tej spremembi.
- [Igra je na PS4 prepočasna] → Preveri se najprej z manjšo notranjo ločljivostjo platna (`screen.js`).
