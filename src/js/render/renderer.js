// Izris celotnega stanja igre. Stanje samo bere.
(function (PinPin) {
  'use strict';

  var background = PinPin.get('render.background', 'render/background.js');
  var tiles = PinPin.get('render.tiles', 'render/tiles.js');
  var sprites = PinPin.get('render.sprites', 'render/sprites.js');
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
        sprites.drawPlayer(ctx, game, cache, scale);
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
