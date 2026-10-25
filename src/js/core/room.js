// Soba iz ploščic: razčlenitev zapisa, poizvedbe po ploščicah in varno mesto.
(function (root) {
  'use strict';

  var EMPTY = '.';
  var GROUND = '#';
  var CUBE = 'B';
  var FLOE = '=';
  var LADDER = 'H';
  var SPIKES = '^';
  var FOOD = 'f';
  var START = 'S';
  var GOAL = 'G';
  var PILE = '*';

  // znak → vrsta živali
  var ANIMALS = {
    M: 'bear',
    P: 'polar',
    V: 'wolf'
  };

  // znak → vrsta ledene ovire
  var OBSTACLES = {
    W: 'wall',
    i: 'icicle'
  };

  // znak → okrasek (ne ovira, nariše se za pingvinom)
  var DECOR = {
    t: 'tree',
    g: 'bush',
    k: 'rock'
  };

  var KNOWN = EMPTY + GROUND + CUBE + FLOE + LADDER + SPIKES + FOOD + START + GOAL + PILE + 'MPVWi' + 'tgk';
  var FOOD_KINDS = 3;

  function fail(message) {
    throw new Error('Soba: ' + message);
  }

  // Vrstice sobe iz odsekov (zloženi od leve proti desni) in položaj za sporočila o napakah.
  // source: { name, sections: [[niz, ...], ...] } ali { name, rows: [niz, ...] } (en odsek)
  function joinSections(source) {
    var sections = source.sections || (source.rows ? [source.rows] : null);
    if (!sections || sections.length === 0 || !sections[0].length) {
      fail('ni vrstic.');
    }
    var height = sections[0].length;
    var rows = [];
    // za vsak stolpec sobe: [odsek, stolpec v odseku]
    var where = [];
    for (var r = 0; r < height; r++) {
      rows.push('');
    }
    for (var s = 0; s < sections.length; s++) {
      var section = sections[s];
      if (section.length !== height) {
        fail('odsek ' + (s + 1) + ' ima ' + section.length + ' vrstic, prvi pa ' + height + '.');
      }
      var width = section[0].length;
      for (r = 0; r < height; r++) {
        if (section[r].length !== width) {
          fail('odsek ' + (s + 1) + ', vrstica ' + (r + 1) + ' ima ' + section[r].length +
            ' znakov, prva vrstica odseka pa ' + width + '.');
        }
        rows[r] += section[r];
      }
      for (var c = 0; c < width; c++) {
        where.push([s + 1, c + 1]);
      }
    }
    return { rows: rows, where: where };
  }

  function parse(source, tileSize) {
    var joined = joinSections(source);
    var rows = joined.rows;
    var cols = rows[0].length;
    var tiles = [];
    var food = [];
    var start = null;
    var goals = [];
    var animals = [];
    var obstacles = [];
    var decor = [];

    function at(c, r) {
      var w = joined.where[c];
      return 'odsek ' + w[0] + ', vrstica ' + (r + 1) + ', stolpec ' + w[1];
    }

    for (var r = 0; r < rows.length; r++) {
      var line = rows[r];
      var row = [];
      for (var c = 0; c < cols; c++) {
        var ch = line.charAt(c);
        if (KNOWN.indexOf(ch) === -1) {
          fail('neznan znak "' + ch + '" (' + at(c, r) + ').');
        }
        if (ch === FOOD) {
          food.push({
            id: food.length,
            col: c,
            row: r,
            x: c * tileSize,
            y: r * tileSize,
            width: tileSize,
            height: tileSize,
            kind: (c + r) % FOOD_KINDS
          });
          ch = EMPTY;
        } else if (ch === START) {
          if (start) {
            fail('več kot en začetek S (' + at(c, r) + ').');
          }
          start = { col: c, row: r };
          ch = EMPTY;
        } else if (ch === GOAL) {
          goals.push({ col: c, row: r, x: c * tileSize, y: r * tileSize, width: tileSize, height: tileSize });
          ch = EMPTY;
        } else if (Object.prototype.hasOwnProperty.call(ANIMALS, ch)) {
          animals.push({ type: ANIMALS[ch], col: c, row: r });
          ch = EMPTY;
        } else if (Object.prototype.hasOwnProperty.call(OBSTACLES, ch)) {
          obstacles.push({ type: OBSTACLES[ch], col: c, row: r });
          ch = EMPTY;
        } else if (Object.prototype.hasOwnProperty.call(DECOR, ch)) {
          decor.push({ type: DECOR[ch], col: c, row: r });
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

    function tile(c, r) {
      return r >= 0 && r < tiles.length ? tiles[r][c] : EMPTY;
    }
    var i;
    for (i = 0; i < animals.length; i++) {
      if (!isSolid(tile(animals[i].col, animals[i].row + 1))) {
        fail('pod živaljo ni trdnih tal (' + at(animals[i].col, animals[i].row) + ').');
      }
    }
    for (i = 0; i < decor.length; i++) {
      if (!isSolid(tile(decor[i].col, decor[i].row + 1))) {
        fail('pod okraskom ni trdnih tal (' + at(decor[i].col, decor[i].row) + ').');
      }
    }
    for (i = 0; i < obstacles.length; i++) {
      var o = obstacles[i];
      if (o.type === 'wall' && !isSolid(tile(o.col, o.row + 1))) {
        fail('pod ledenim zidom ni trdnih tal (' + at(o.col, o.row) + ').');
      }
      if (o.type === 'icicle') {
        if (!isSolid(tile(o.col, o.row - 1))) {
          fail('nad ledeno svečo ni trdne ploščice (' + at(o.col, o.row) + ').');
        }
        if (isSolid(tile(o.col, o.row + 1)) || !isSolid(tile(o.col, o.row + 2))) {
          fail('pod ledeno svečo mora biti ena prazna vrstica in nato tla (' + at(o.col, o.row) + ').');
        }
      }
    }

    return {
      name: source.name,
      cols: cols,
      rows: rows.length,
      tileSize: tileSize,
      width: cols * tileSize,
      height: rows.length * tileSize,
      tiles: tiles,
      food: food,
      start: start,
      goals: goals,
      animals: animals,
      obstacles: obstacles,
      decor: decor
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

  function isPile(tile) {
    return tile === PILE;
  }

  // Zgornji rob prve podlage (trdne ali enosmerne) pod vrstico row v stolpcu col;
  // če je ni, spodnji rob sobe.
  function surfaceBelow(room, col, row) {
    for (var r = row + 1; r < room.rows; r++) {
      var tile = tileAt(room, col, r);
      if (isSolid(tile) || isOneWay(tile)) {
        return r * room.tileSize;
      }
    }
    return room.height;
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
  // Ali je v stolpcu col ali sosednjih stolpcih ledena ovira (ta stolpec ni varen, tudi ko je ovira razbita).
  function nearObstacle(room, col) {
    var list = room.obstacles || [];
    for (var i = 0; i < list.length; i++) {
      if (Math.abs(list[i].col - col) <= 1) {
        return true;
      }
    }
    return false;
  }

  function safeRowInColumn(room, col) {
    if (nearObstacle(room, col)) {
      return -1;
    }
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
      SPIKES: SPIKES,
      PILE: PILE
    },
    FOOD_KINDS: FOOD_KINDS,
    parse: parse,
    tileAt: tileAt,
    isSolid: isSolid,
    isOneWay: isOneWay,
    isLadder: isLadder,
    isSpikes: isSpikes,
    isPile: isPile,
    surfaceBelow: surfaceBelow,
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
