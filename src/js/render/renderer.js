// Izris celotnega stanja igre. Stanje samo bere.
(function (PinPin) {
  'use strict';

  var background = PinPin.get('render.background', 'render/background.js');
  var tiles = PinPin.get('render.tiles', 'render/tiles.js');
  var sprites = PinPin.get('render.sprites', 'render/sprites.js');
  var snowballs = PinPin.get('render.snowballs', 'render/snowballs.js');
  var animals = PinPin.get('render.animals', 'render/animals.js');
  var hud = PinPin.get('render.hud', 'render/hud.js');
  var overlay = PinPin.get('render.overlay', 'render/overlay.js');

  function createRenderer(screen, cache) {
    return {
      draw: function (game) {
        var ctx = screen.ctx;
        var scale = screen.pixelScale;
        screen.begin();
        background.draw(ctx, game.cameraX);
        tiles.draw(ctx, game, cache, scale);
        snowballs.drawPiles(ctx, game);
        animals.draw(ctx, game);
        sprites.drawPlayer(ctx, game, cache, scale);
        snowballs.drawBalls(ctx, game);
        if (game.state !== 'start') {
          hud.draw(ctx, game, cache, scale);
        }
        overlay.draw(ctx, game);
      },

      drawMessage: function (message, small) {
        screen.begin();
        overlay.drawMessage(screen.ctx, message, small);
      }
    };
  }

  PinPin.register('render.renderer', { createRenderer: createRenderer });
})(window.PinPin);
