// Izris kupov snega, letečih kep in kepe, ki jo pingvin nosi.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');
  var room = PinPin.get('core.room', 'core/room.js');
  var player = PinPin.get('core.player', 'core/player.js');

  var W = settings.screen.width;

  function ball(ctx, x, y, radius) {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#7fa6c4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  function drawPile(ctx, x, y, T) {
    var base = y + T;
    ctx.fillStyle = '#f4f9fd';
    ctx.strokeStyle = '#5f8fb4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 4, base);
    ctx.quadraticCurveTo(x + 2, base - 22, x + 14, base - 24);
    ctx.quadraticCurveTo(x + 22, base - 34, x + 30, base - 22);
    ctx.quadraticCurveTo(x + 42, base - 18, x + T + 4, base);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // nekaj kep na vrhu
    ball(ctx, x + 12, base - 8, 5);
    ball(ctx, x + 26, base - 10, 5);
    ball(ctx, x + 19, base - 18, 5);
  }

  // Kupi snega so za pingvinom, zato se rišejo pred njim.
  function drawPiles(ctx, game) {
    var r = game.room;
    var T = r.tileSize;
    var camX = game.cameraX;
    var first = Math.max(0, Math.floor(camX / T) - 1);
    var last = Math.min(r.cols - 1, Math.floor((camX + W) / T) + 1);
    for (var row = 0; row < r.rows; row++) {
      for (var col = first; col <= last; col++) {
        if (room.isPile(r.tiles[row][col])) {
          drawPile(ctx, col * T - camX, row * T, T);
        }
      }
    }
  }

  // Leteče kepe in nošena kepa se rišejo čez pingvina.
  function drawBalls(ctx, game) {
    var camX = game.cameraX;
    var balls = game.snow.balls;
    for (var i = 0; i < balls.length; i++) {
      var b = balls[i];
      ball(ctx, b.x + b.width / 2 - camX, b.y + b.height / 2, b.width / 2 + 1);
    }
    var p = game.player;
    // kepa utripa skupaj s pingvinom (glej render/sprites.js)
    var hidden = p.invulnerable > 0 && Math.floor(p.invulnerable * 10) % 2 === 1;
    if (game.snow.carrying && !game.snow.atPile && game.state === 'playing' && p.mode !== 'climb' && !hidden) {
      ball(ctx, player.centerX(p) + p.facing * 14 - camX, p.y + 24, 6);
    }
  }

  PinPin.register('render.snowballs', {
    drawPiles: drawPiles,
    drawBalls: drawBalls
  });
})(window.PinPin);
