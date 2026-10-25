// Ploščice sobe s sličicami (tla, police, blok, kristali, lestev), voda v prepadih,
// okraski, cilj in hrana. Kateri kos tal ali lestve se nariše, določi core/terrain.js.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');
  var spriteConfig = PinPin.get('config.sprites', 'config/sprites.js');
  var room = PinPin.get('core.room', 'core/room.js');
  var terrain = PinPin.get('core.terrain', 'core/terrain.js');

  var W = settings.screen.width;
  var H = settings.screen.height;
  // gladina vode pod vrhom tal ob prepadu
  var WATER_DROP = 16;
  // hitrost menjave sličic valov (na sekundo) in počasnega premikanja (točk na sekundo)
  var WATER_FPS = 2;
  var WATER_DRIFT = 12;
  var WATER_DEEP = '#0b3f8f';
  var DECOR = { tree: 'tree', bush: 'bush', rock: 'rock' };

  function drawSprite(ctx, cache, scale, name, x, y) {
    var info = cache.info(name);
    ctx.drawImage(cache.get(name, scale), x, y, info.width, info.height);
  }

  // Sličica s sredino na sredini ploščice in dnom na dnu ploščice.
  function drawStanding(ctx, cache, scale, name, x, bottom, T) {
    var info = cache.info(name);
    ctx.drawImage(cache.get(name, scale), x + (T - info.width) / 2, bottom - info.height, info.width, info.height);
  }

  function drawGoal(ctx, goal) {
    // iglu: kupola iz snežnih blokov z vhodom
    var cx = goal.x + goal.width / 2;
    var base = goal.y + goal.height;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, base, 46, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b8d4e6';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    for (var i = 1; i < 3; i++) {
      var ry = base - i * 15;
      var half = Math.sqrt(46 * 46 - (i * 15) * (i * 15));
      ctx.moveTo(cx - half, ry);
      ctx.lineTo(cx + half, ry);
    }
    ctx.stroke();
    ctx.fillStyle = '#2b3d52';
    ctx.beginPath();
    ctx.arc(cx, base, 14, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
  }

  function drawDecor(ctx, game, cache, scale, first, last) {
    var r = game.room;
    var T = r.tileSize;
    for (var i = 0; i < r.decor.length; i++) {
      var d = r.decor[i];
      if (d.col < first - 2 || d.col > last + 2) {
        continue;
      }
      drawStanding(ctx, cache, scale, DECOR[d.type], d.col * T - game.cameraX, (d.row + 1) * T, T);
    }
  }

  // Voda v zaporednih stolpcih prepada: valovi (dve sličici) od gladine navzdol, pod njimi globina.
  function drawWater(ctx, game, cache, scale, first, last) {
    var r = game.room;
    var T = r.tileSize;
    var camX = game.cameraX;
    var name = 'water-' + (1 + Math.floor(game.stateTime * WATER_FPS) % 2);
    var info = cache.info(name);
    var image = cache.get(name, scale);
    var surface = (r.rows - 2) * T + WATER_DROP;
    var col = first;
    while (col <= last) {
      if (!terrain.isWaterColumn(r, col)) {
        col++;
        continue;
      }
      var start = col;
      while (col <= last && terrain.isWaterColumn(r, col)) {
        col++;
      }
      var x0 = start * T - camX;
      var x1 = col * T - camX;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, surface, x1 - x0, H - surface);
      ctx.clip();
      ctx.fillStyle = WATER_DEEP;
      ctx.fillRect(x0, surface + info.height - 2, x1 - x0, H - surface);
      // vzorec je vezan na sobo, zato se sosednji stolpci nadaljujejo brez vrzeli
      var shift = (start * T + game.stateTime * WATER_DRIFT) % info.width;
      for (var x = x0 - shift; x < x1; x += info.width) {
        ctx.drawImage(image, x, surface, info.width, info.height);
      }
      ctx.restore();
    }
  }

  function drawTile(ctx, cache, scale, r, tile, col, row, x, y, T) {
    if (tile === room.TILES.GROUND || tile === room.TILES.FLOE) {
      drawSprite(ctx, cache, scale, terrain.groundPiece(r, col, row), x, y);
    } else if (tile === room.TILES.LADDER) {
      drawSprite(ctx, cache, scale, terrain.ladderPiece(r, col, row), x, y);
    } else if (tile === room.TILES.CUBE) {
      drawStanding(ctx, cache, scale, 'block', x, y + T, T);
    } else if (tile === room.TILES.SPIKES) {
      drawStanding(ctx, cache, scale, 'crystals', x, y + T, T);
    }
  }

  function draw(ctx, game, cache, scale) {
    var r = game.room;
    var T = r.tileSize;
    var camX = game.cameraX;
    var firstCol = Math.max(0, Math.floor(camX / T));
    var lastCol = Math.min(r.cols - 1, Math.floor((camX + W) / T));

    drawDecor(ctx, game, cache, scale, firstCol, lastCol);
    drawWater(ctx, game, cache, scale, firstCol, lastCol);

    for (var g = 0; g < r.goals.length; g++) {
      ctx.save();
      ctx.translate(-camX, 0);
      drawGoal(ctx, r.goals[g]);
      ctx.restore();
    }

    // police s svečami segajo pod svojo ploščico, zato se vrstice rišejo od spodaj navzgor
    for (var row = r.rows - 1; row >= 0; row--) {
      for (var col = firstCol; col <= lastCol; col++) {
        drawTile(ctx, cache, scale, r, r.tiles[row][col], col, row, col * T - camX, row * T, T);
      }
    }

    var food = r.food;
    for (var i = 0; i < food.length; i++) {
      var f = food[i];
      if (game.collected[f.id] || f.x + f.width < camX || f.x > camX + W) {
        continue;
      }
      var name = spriteConfig.food[f.kind];
      var info = cache.info(name);
      // rahlo pozibavanje
      var bob = Math.sin(game.stateTime * 3 + f.id) * 2;
      drawSprite(ctx, cache, scale, name,
        f.x + (f.width - info.width) / 2 - camX,
        f.y + (f.height - info.height) / 2 + bob);
    }
  }

  PinPin.register('render.tiles', { draw: draw });
})(window.PinPin);
