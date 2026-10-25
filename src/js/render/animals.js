// Izris živali s sličicami: hoja (3 sličice v zanki) in udarec (2 sličici).
// Sličice gledajo desno in so poravnane na sredino in dno (glej config/sprite-info.js),
// zato se narišejo samo na položaj stopal.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');

  var W = settings.screen.width;
  var WALK = [1, 2, 3, 2];

  function frameName(a) {
    if (a.pushTime > 0) {
      // prva polovica udarca: zamah, druga: udarec
      return a.type + '-push-' + (a.pushTime > settings.animals.pushTime / 2 ? 1 : 2);
    }
    var index = Math.floor(a.walkTime * settings.animals.walkFps) % WALK.length;
    return a.type + '-walk-' + WALK[index];
  }

  function draw(ctx, game, cache, scale) {
    var camX = game.cameraX;
    var list = game.animals;
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var name = frameName(a);
      var info = cache.info(name);
      var cx = a.x + a.width / 2 - camX;
      if (cx + info.width / 2 < 0 || cx - info.width / 2 > W) {
        continue;
      }
      var y = a.y + a.height - info.height;
      var image = cache.get(name, scale);
      if (a.dir < 0) {
        ctx.save();
        ctx.translate(cx, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(image, -info.width / 2, y, info.width, info.height);
        ctx.restore();
      } else {
        ctx.drawImage(image, cx - info.width / 2, y, info.width, info.height);
      }
    }
  }

  PinPin.register('render.animals', { draw: draw });
})(window.PinPin);
