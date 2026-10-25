// Vrstica energije v zgornjem levem kotu in točke v zgornjem desnem (ne premikata se s kamero).
(function (PinPin) {
  'use strict';

  var energy = PinPin.get('core.energy', 'core/energy.js');
  var spriteConfig = PinPin.get('config.sprites', 'config/sprites.js');

  var settings = PinPin.get('config.settings', 'config/settings.js');

  var W = settings.screen.width;
  var X = 12;
  var Y = 12;
  var BAR_X = 54;
  var BAR_W = 150;
  var BAR_H = 16;

  function barColor(ratio) {
    if (ratio > 0.5) {
      return '#4cc35a';
    }
    if (ratio > 0.25) {
      return '#f2c230';
    }
    return '#e5483b';
  }

  function draw(ctx, game, cache, scale) {
    var ratio = energy.ratio(game.energy);
    var icon = spriteConfig.food[0];
    var info = cache.info(icon);
    ctx.drawImage(cache.get(icon, scale), X, Y + (BAR_H - info.height) / 2, info.width, info.height);

    ctx.fillStyle = 'rgba(20, 40, 60, 0.6)';
    ctx.fillRect(BAR_X - 3, Y - 3, BAR_W + 6, BAR_H + 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(BAR_X, Y, BAR_W, BAR_H);
    ctx.fillStyle = barColor(ratio);
    ctx.fillRect(BAR_X, Y, BAR_W * ratio, BAR_H);

    // točke zgoraj desno
    ctx.font = 'bold 22px "Trebuchet MS", Verdana, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1d3557';
    ctx.fillStyle = '#ffd166';
    var label = '★ ' + game.score;
    ctx.strokeText(label, W - X, Y - 3);
    ctx.fillText(label, W - X, Y - 3);
  }

  PinPin.register('render.hud', { draw: draw });
})(window.PinPin);
