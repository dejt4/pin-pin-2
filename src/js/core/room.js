// Soba iz ploščic: razčlenitev zapisa, poizvedbe po ploščicah in varno mesto.
(function (root) {
  'use strict';

  var EMPTY = '.';
  var GROUND = '#';
  var CUBE = 'B';
  var FLOE = '=';
  var LADDER = 'H';
  var SPIKES = '^';
  var FISH = 'f';
  var START = 'S';
  var GOAL = 'G';

  var KNOWN = EMPTY + GROUND + CUBE + FLOE + LADDER + SPIKES + FISH + START + GOAL;
  var FISH_COLORS = 4;

  function fail(message) {
    throw new Error('Soba: ' + message);
  }

  // source: { name, rows: [niz, ...] }
  function parse(source, tileSize) {
    var rows = source.rows;
    if (!rows || rows.length === 0) {
      fail('ni vrstic.');
    }
    var cols = rows[0].length;
    var tiles = [];
    var fish = [];
    var start = null;
    var goals = [];

    for (var r = 0; r < rows.length; r++) {
      var line = rows[r];
      if (line.length !== cols) {
        fail('vrstica ' + (r + 1) + ' ima ' + line.length + ' znakov, prva pa ' + cols + '.');
      }
      var row = [];
      for (var c = 0; c < cols; c++) {
        var ch = line.charAt(c);
        if (KNOWN.indexOf(ch) === -1) {
          fail('neznan znak "' + ch + '" v vrstici ' + (r + 1) + ', stolpec ' + (c + 1) + '.');
        }
        if (ch === FISH) {
          fish.push({
            id: fish.length,
            col: c,
            row: r,
            x: c * tileSize,
            y: r * tileSize,
            width: tileSize,
            height: tileSize,
            color: (c + r) % FISH_COLORS
          });
          ch = EMPTY;
        } else if (ch === START) {
          if (start) {
            fail('več kot en začetek (S): vrstica ' + (r + 1) + ', stolpec ' + (c + 1) + '.');
          }
          start = { col: c, row: r };
          ch = EMPTY;
        } else if (ch === GOAL) {
          goals.push({ col: c, row: r, x: c * tileSize, y: r * tileSize, width: tileSize, height: tileSize });
          ch = EMPTY;
        }
        row.push(ch);
      }
      tiles.push(row);
    }

    if (!start) {
      fail('ni začetka (S).');
    }
    if (goals.length === 0) {
      fail('ni cilja (G).');
    }

    return {
      name: source.name,
      cols: cols,
      rows: rows.length,
      tileSize: tileSize,
      width: cols * tileSize,
      height: rows.length * tileSize,
      tiles: tiles,
      fish: fish,
      start: start,
      goals: goals
    };
  }

  // Ploščica na (stolpec, vrstica); izven sobe je prazno.
  function tileAt(room, col, row) {
    if (row < 0 || row >= room.rows || col < 0 || col >= room.cols) {
      return EMPTY;
    }
    return room.tiles[row][col];
  }

  function isSolid(tile) {
    return tile === GROUND || tile === CUBE;
  }

  // ploščica, na kateri se stoji, od spodaj in s strani pa se gre skoznjo
  function isOneWay(tile) {
    return tile === FLOE;
  }

  function isLadder(tile) {
    return tile === LADDER;
  }

  function isSpikes(tile) {
    return tile === SPIKES;
  }

  // Vrh lestve: najvišja ploščica lestve v stolpcu deluje kot enosmerna podlaga.
  function isLadderTop(room, col, row) {
    return isLadder(tileAt(room, col, row)) && !isLadder(tileAt(room, col, row - 1));
  }

  // Položaj, kjer pingvin stoji na ploščici (col, row): sredina stolpca, noge na vrhu ploščice row + 1.
  function standingPoint(room, col, row) {
    return {
      col: col,
      row: row,
      x: col * room.tileSize + room.tileSize / 2,
      y: (row + 1) * room.tileSize
    };
  }

  function startPoint(room) {
    return standingPoint(room, room.start.col, room.start.row);
  }

  // Ali je stolpec col varen: na najnižji pohodni površini stoji na trdnih tleh,
  // nad njim ni trdne ploščice, sosedje levo in desno imajo tla in ni konic.
  // Vrne vrstico, v kateri pingvin stoji, ali -1.
  function safeRowInColumn(room, col) {
    for (var r = room.rows - 1; r >= 1; r--) {
      var floor = tileAt(room, col, r);
      var space = tileAt(room, col, r - 1);
      if (!isSolid(floor) || isSolid(space) || isOneWay(space)) {
        continue;
      }
      // najnižja pohodna površina v stolpcu je r
      if (isSpikes(space) || isSolid(tileAt(room, col, r - 2))) {
        return -1;
      }
      for (var d = -1; d <= 1; d += 2) {
        if (!isSolid(tileAt(room, col + d, r)) || isSpikes(tileAt(room, col + d, r - 1))) {
          return -1;
        }
      }
      return r - 1;
    }
    return -1;
  }

  // Varno mesto vsaj en zaslon (screenCols stolpcev) levo od x, kjer je pingvin padel.
  function safePoint(room, fallX, screenCols) {
    var fallCol = Math.floor(fallX / room.tileSize);
    for (var col = fallCol - screenCols; col >= 0; col--) {
      var row = safeRowInColumn(room, col);
      if (row !== -1) {
        return standingPoint(room, col, row);
      }
    }
    return startPoint(room);
  }

  var room = {
    TILES: {
      EMPTY: EMPTY,
      GROUND: GROUND,
      CUBE: CUBE,
      FLOE: FLOE,
      LADDER: LADDER,
      SPIKES: SPIKES
    },
    FISH_COLORS: FISH_COLORS,
    parse: parse,
    tileAt: tileAt,
    isSolid: isSolid,
    isOneWay: isOneWay,
    isLadder: isLadder,
    isSpikes: isSpikes,
    isLadderTop: isLadderTop,
    startPoint: startPoint,
    safePoint: safePoint
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = room;
  } else {
    root.PinPin.register('core.room', room);
  }
})(this);
