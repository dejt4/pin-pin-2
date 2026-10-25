// Napisi na zaslonu: nalaganje, napaka, začetek, utrujenost, cilj.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');
  var game = PinPin.get('core.game', 'core/game.js');

  var W = settings.screen.width;
  var H = settings.screen.height;
  var FONT = '"Trebuchet MS", Verdana, Arial, sans-serif';

  function text(ctx, value, y, size) {
    ctx.font = 'bold ' + size + 'px ' + FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(4, size / 6);
    ctx.strokeStyle = '#1d3557';
    ctx.strokeText(value, W / 2, y);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(value, W / 2, y);
  }

  function dim(ctx, alpha) {
    ctx.fillStyle = 'rgba(10, 30, 50, ' + alpha + ')';
    ctx.fillRect(0, 0, W, H);
  }

  // Zaslon pred začetkom igre (nalaganje ali napaka).
  function drawMessage(ctx, message, small) {
    ctx.fillStyle = '#1d3557';
    ctx.fillRect(0, 0, W, H);
    text(ctx, message, H / 2, small ? 18 : 32);
  }

  function draw(ctx, g) {
    switch (g.state) {
    case 'start':
      dim(ctx, 0.25);
      text(ctx, 'Pin-Pin', 90, 64);
      text(ctx, 'Pritisni tipko za začetek', 160, 26);
      break;
    case 'tired':
      text(ctx, 'Utrujen sem ...', 110, 44);
      if (game.restartReady(g)) {
        text(ctx, 'Pritisni tipko za ponovni začetek', 170, 24);
      }
      break;
    case 'goal':
      text(ctx, 'Bravo!', 100, 64);
      text(ctx, 'Točke: ' + g.score, 160, 30);
      if (game.restartReady(g)) {
        text(ctx, 'Pritisni tipko za novo igro', 205, 24);
      }
      break;
    }
  }

  PinPin.register('render.overlay', {
    draw: draw,
    drawMessage: drawMessage
  });
})(window.PinPin);
