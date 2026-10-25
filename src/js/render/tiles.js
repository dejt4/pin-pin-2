// Ploščice sobe, ribe in cilj. Tla in lestve so barvni pravokotniki, dokler ni grafike.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');
  var spriteConfig = PinPin.get('config.sprites', 'config/sprites.js');
  var room = PinPin.get('core.room', 'core/room.js');

  var W = settings.screen.width;

  function drawSprite(ctx, cache, scale, name, x, y) {
    var info = cache.info(name);
    ctx.drawImage(cache.get(name, scale), x, y, info.width, info.height);
  }

  function drawGround(ctx, r, col, row, x, y, T) {
    ctx.fillStyle = '#9fc3dc';
    ctx.fillRect(x, y, T, T);
    ctx.fillStyle = '#86adc9';
    ctx.fillRect(x + 4, y + 18, 10, 6);
    ctx.fillRect(x + 22, y + 30, 12, 5);
    if (room.tileAt(r, col, row - 1) !== room.TILES.GROUND) {
      // snežna odeja na vrhu
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, T, 10);
      ctx.fillStyle = '#e6f2fa';
      ctx.fillRect(x, y + 10, T, 3);
    }
  }

  function drawLadder(ctx, x, y, T) {
    ctx.fillStyle = '#8a5a2b';
    ctx.fillRect(x + 7, y, 5, T);
    ctx.fillRect(x + T - 12, y, 5, T);
    ctx.fillStyle = '#b07a43';
    for (var i = 0; i < 3; i++) {
      ctx.fillRect(x + 7, y + 6 + i * 13, T - 14, 4);
    }
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

  function draw(ctx, game, cache, scale) {
    var r = game.room;
    var T = r.tileSize;
    var camX = game.cameraX;
    var firstCol = Math.max(0, Math.floor(camX / T));
    var lastCol = Math.min(r.cols - 1, Math.floor((camX + W) / T));
    var col;
    var row;

    for (var g = 0; g < r.goals.length; g++) {
      ctx.save();
      ctx.translate(-camX, 0);
      drawGoal(ctx, r.goals[g]);
      ctx.restore();
    }

    for (row = 0; row < r.rows; row++) {
      for (col = firstCol; col <= lastCol; col++) {
        var tile = r.tiles[row][col];
        var x = col * T - camX;
        var y = row * T;
        if (tile === room.TILES.GROUND) {
          drawGround(ctx, r, col, row, x, y, T);
        } else if (tile === room.TILES.CUBE) {
          drawSprite(ctx, cache, scale, 'ice-cube', x, y);
        } else if (tile === room.TILES.FLOE) {
          drawSprite(ctx, cache, scale, 'ice-floe', x - 2, y - 2);
        } else if (tile === room.TILES.LADDER) {
          drawLadder(ctx, x, y, T);
        } else if (tile === room.TILES.SPIKES) {
          drawSprite(ctx, cache, scale, 'ice-spikes', x - 6, y);
        } else if (row === r.rows - 1) {
          // dno prepada: temna voda, da je luknja vidna
          ctx.fillStyle = '#24577f';
          ctx.fillRect(x, y + 12, T, T - 12);
        }
      }
    }

    var fish = r.fish;
    for (var i = 0; i < fish.length; i++) {
      var f = fish[i];
      if (game.collected[f.id] || f.x + f.width < camX || f.x > camX + W) {
        continue;
      }
      var name = spriteConfig.fish[f.color];
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
