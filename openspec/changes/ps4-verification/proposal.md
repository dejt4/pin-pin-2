# Proposal

## Why

Igra mora delovati v vgrajenem brskalniku PlayStationa 4 Slim (glej `AGENTS.md`). Preizkus na PS4 je bil del spremembe `first-room` (naloga 8.3), a ga avtor trenutno ne more izvesti. Da `first-room` in `snowballs-and-animals` lahko arhiviramo, je preizkus premaknjen v to ločeno spremembo in se potrdi pozneje.

## What Changes

- Ročni preizkus igre v brskalniku PS4 s tipkovnico in kontrolerjem: nalaganje, prikaz na televizorju, kontrole, gibanje, lestve, kepe, živali, energija, točke, cilj in utrujenost.
- Če preizkus odkrije napake, se popravijo v tej spremembi (ali v novi, če so večje) in se zahteve po potrebi posodobijo.

Brez sprememb obnašanja: zahteve iz `game-controls`, `player-movement`, `room-map`, `camera-view`, `player-energy`, `game-flow`, `snowballs`, `animals` in `score` ostanejo enake. Zato ta sprememba nima delta specifikacij (`skip_specs: true`).

## Capabilities

### New Capabilities
- (ni)

### Modified Capabilities
- (ni; samo preverjanje obstoječih zahtev na PS4)

## Impact

- Brez sprememb kode, dokler preizkus ne odkrije napake.
- Za preizkus mora biti mapa `src/` dostopna s PS4 (strežnik v domačem omrežju ali objava, npr. GitHub Pages).
