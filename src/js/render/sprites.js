// Izris pingvina: sličica iz animacije, zrcaljenje za levo in utripanje ob neranljivosti.
(function (PinPin) {
  'use strict';

  var spriteConfig = PinPin.get('config.sprites', 'config/sprites.js');
  var player = PinPin.get('core.player', 'core/player.js');

  function drawPlayer(ctx, game, cache, scale) {
    var p = game.player;
    if (p.invulnerable > 0 && Math.floor(p.invulnerable * 10) % 2 === 1) {
      return;
    }
    var f = player.frame(p);
    var info = cache.info(f.image);
    var x = player.centerX(p) - game.cameraX;
    var y = p.y + p.height + spriteConfig.penguin.footOffset - info.height;
    var image = cache.get(f.image, scale);

    if (f.mirror) {
      ctx.save();
      ctx.translate(x, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(image, -info.width / 2, y, info.width, info.height);
      ctx.restore();
    } else {
      ctx.drawImage(image, x - info.width / 2, y, info.width, info.height);
    }
  }

  PinPin.register('render.sprites', { drawPlayer: drawPlayer });
})(window.PinPin);
