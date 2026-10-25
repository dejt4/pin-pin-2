// Premik pravokotnika {x, y, width, height} po sobi s trki s ploščicami.
// Najprej se premakne po X, nato po Y. x, y je zgornji levi kot.
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var room = isNode ? require('./room.js') : root.PinPin.get('core.room', 'core/room.js');

  var EPS = 1e-6;

  function firstRow(body, T) {
    return Math.floor(body.y / T);
  }

  function lastRow(body, T) {
    return Math.floor((body.y + body.height - EPS) / T);
  }

  function firstCol(body, T) {
    return Math.floor(body.x / T);
  }

  function lastCol(body, T) {
    return Math.floor((body.x + body.width - EPS) / T);
  }

  function columnHasSolid(r, col, body) {
    var T = r.tileSize;
    for (var row = firstRow(body, T); row <= lastRow(body, T); row++) {
      if (room.isSolid(room.tileAt(r, col, row))) {
        return true;
      }
    }
    return false;
  }

  // Vodoravni premik. Vrne true, če je telo zadelo zid ali rob sobe.
  function moveX(r, body, dx) {
    var T = r.tileSize;
    var hit = false;
    var col;

    if (dx > 0) {
      var right = body.x + body.width;
      var newRight = right + dx;
      for (col = Math.floor((right - EPS) / T) + 1; col <= Math.floor((newRight - EPS) / T); col++) {
        if (columnHasSolid(r, col, body)) {
          newRight = col * T;
          hit = true;
          break;
        }
      }
      body.x = newRight - body.width;
    } else if (dx < 0) {
      var left = body.x;
      var newLeft = left + dx;
      for (col = Math.floor(left / T) - 1; col >= Math.floor(newLeft / T); col--) {
        if (columnHasSolid(r, col, body)) {
          newLeft = (col + 1) * T;
          hit = true;
          break;
        }
      }
      body.x = newLeft;
    }

    if (body.x < 0) {
      body.x = 0;
      hit = true;
    } else if (body.x + body.width > r.width) {
      body.x = r.width - body.width;
      hit = true;
    }
    return hit;
  }

  // Ali je ploščica podlaga za padajoče telo.
  // oneWay: upoštevaj tudi ledene plošče in vrhove lestev.
  function isSurface(r, col, row, oneWay) {
    var tile = room.tileAt(r, col, row);
    if (room.isSolid(tile)) {
      return true;
    }
    return oneWay && (room.isOneWay(tile) || room.isLadderTop(r, col, row));
  }

  // Navpični premik. Vrne { landed, bumped }.
  // Enosmerne podlage ustavijo telo samo, če je bilo pred premikom v celoti nad njimi.
  function moveY(r, body, dy, oneWay) {
    var T = r.tileSize;
    var result = { landed: false, bumped: false };
    var row;
    var col;

    if (dy > 0) {
      var bottom = body.y + body.height;
      var newBottom = bottom + dy;
      for (row = Math.floor(bottom / T); row <= Math.floor((newBottom - EPS) / T); row++) {
        var top = row * T;
        if (top < bottom - EPS) {
          continue;
        }
        for (col = firstCol(body, T); col <= lastCol(body, T); col++) {
          if (isSurface(r, col, row, oneWay)) {
            body.y = top - body.height;
            result.landed = true;
            return result;
          }
        }
      }
      body.y = newBottom - body.height;
    } else if (dy < 0) {
      var upper = body.y;
      var newUpper = upper + dy;
      for (row = Math.floor((upper - EPS) / T); row >= Math.floor(newUpper / T); row--) {
        var edge = (row + 1) * T;
        if (edge > upper + EPS) {
          continue;
        }
        for (col = firstCol(body, T); col <= lastCol(body, T); col++) {
          if (room.isSolid(room.tileAt(r, col, row))) {
            body.y = edge;
            result.bumped = true;
            return result;
          }
        }
      }
      body.y = newUpper;
    }
    return result;
  }

  // Ploščice, ki jih telo prekriva: kliče fn(col, row, tile).
  function forEachTile(r, body, fn) {
    var T = r.tileSize;
    for (var row = firstRow(body, T); row <= lastRow(body, T); row++) {
      for (var col = firstCol(body, T); col <= lastCol(body, T); col++) {
        fn(col, row, room.tileAt(r, col, row));
      }
    }
  }

  var physics = {
    moveX: moveX,
    moveY: moveY,
    forEachTile: forEachTile
  };

  if (isNode) {
    module.exports = physics;
  } else {
    root.PinPin.register('core.physics', physics);
  }
})(this);
