// Izris ledenih ovir: zid po stopnji poškodbe, sveča po stanju (cela, počena, padec, drobci).
// Zid je poravnan na sredino in dno (tla), sveča na vrh (strop); glej config/sprite-info.js.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');

  var W = settings.screen.width;
  var cfg = settings.obstacles;

  // ice-wall-1 cel, 2 počen, 3 močno počen, 4 razpad, 5 drobci
  function wallFrame(o) {
    if (o.broken) {
      return o.breakTime < cfg.wall.breakTime ? 4 : 5;
    }
    if (o.hits >= 4) {
      return 3;
    }
    return o.hits >= 2 ? 2 : 1;
  }

  // icicle-1 cela, 2 počena, 3–6 padec in razbitje, 7 drobci
  function icicleFrame(o) {
    if (!o.broken) {
      return o.hits >= 1 ? 2 : 1;
    }
    var step = cfg.icicle.breakTime / 4;
    return Math.min(7, 3 + Math.floor(o.breakTime / step));
  }

  function draw(ctx, game, cache, scale) {
    var camX = game.cameraX;
    var list = game.obstacles;
    for (var i = 0; i < list.length; i++) {
      var o = list[i];
      var cx = o.x + o.width / 2 - camX;
      var name;
      var y;
      if (o.type === 'wall') {
        name = 'ice-wall-' + wallFrame(o);
      } else {
        name = 'icicle-' + icicleFrame(o);
      }
      var info = cache.info(name);
      if (cx + info.width / 2 < 0 || cx - info.width / 2 > W) {
        continue;
      }
      y = o.type === 'wall' ? o.floorY - info.height : o.top;
      ctx.drawImage(cache.get(name, scale), cx - info.width / 2, y, info.width, info.height);
    }
  }

  PinPin.register('render.obstacles', { draw: draw });
})(window.PinPin);
