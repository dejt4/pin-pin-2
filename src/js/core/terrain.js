// Izbira sličice za ploščico sobe (čista funkcija, brez API-jev brskalnika).
// Trki in pravila igre se ne spremenijo; tukaj se odloči samo, kateri kos se nariše.
//
// Kosi (glej config/sprite-info.js):
//   ground-1-N  zgornja ploščica tal iz zasneženih kamnov, ground-2-N  kamnita podlaga pod njo
//   ledge-N     ledena polica s svečami (tanka tla in ledene plošče)
//   ladder-1-1  vrh lestve, ladder-2-1  ostali deli lestve
//   N: 1 levi rob, 2 in 3 sredina (izmenično po stolpcih), 4 desni rob
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var room = isNode ? require('./room.js') : root.PinPin.get('core.room', 'core/room.js');

  var GROUND = room.TILES.GROUND;

  function isGround(r, col, row) {
    return room.tileAt(r, col, row) === GROUND;
  }

  // Debelina stolpca tal skozi (col, row): zaporedne ploščice tal navzgor in navzdol.
  function thickness(r, col, row) {
    var n = 1;
    var y;
    for (y = row - 1; isGround(r, col, y); y--) {
      n++;
    }
    for (y = row + 1; isGround(r, col, y); y++) {
      n++;
    }
    return n;
  }

  // Kosi polic: tanka tla in ledene plošče sodijo skupaj.
  function isLedgeLike(r, col, row) {
    var tile = room.tileAt(r, col, row);
    return room.isOneWay(tile) || (tile === GROUND && thickness(r, col, row) === 1);
  }

  function isStone(r, col, row) {
    return isGround(r, col, row) && thickness(r, col, row) >= 2;
  }

  // Številka kosa po sosedih v isti vrstici: 1 levi rob, 4 desni rob, sicer 2 ali 3.
  function piece(same, r, col, row) {
    if (!same(r, col - 1, row)) {
      return 1;
    }
    if (!same(r, col + 1, row)) {
      return 4;
    }
    return col % 2 === 0 ? 2 : 3;
  }

  // Ime sličice za ploščico tal (#) ali ledene plošče (=); null za druge ploščice.
  function groundPiece(r, col, row) {
    var tile = room.tileAt(r, col, row);
    if (tile !== GROUND && !room.isOneWay(tile)) {
      return null;
    }
    if (isLedgeLike(r, col, row)) {
      return 'ledge-' + piece(isLedgeLike, r, col, row);
    }
    var layer = isGround(r, col, row - 1) ? 2 : 1;
    return 'ground-' + layer + '-' + piece(isStone, r, col, row);
  }

  function ladderPiece(r, col, row) {
    return room.isLadderTop(r, col, row) ? 'ladder-1-1' : 'ladder-2-1';
  }

  // Stolpec prepada z vodo: v spodnji vrstici ni trdne ploščice.
  function isWaterColumn(r, col) {
    return col >= 0 && col < r.cols && !room.isSolid(room.tileAt(r, col, r.rows - 1));
  }

  var terrain = {
    groundPiece: groundPiece,
    ladderPiece: ladderPiece,
    isWaterColumn: isWaterColumn,
    thickness: thickness
  };

  if (isNode) {
    module.exports = terrain;
  } else {
    root.PinPin.register('core.terrain', terrain);
  }
})(this);
