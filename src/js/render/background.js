// Ozadje: nebo in gore, narisano s kodo, dokler ni slike ozadja.
// Daljne gore se pomikajo s faktorjem paralakse, bližnji hribi dvakrat hitreje.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');
  var camera = PinPin.get('core.camera', 'core/camera.js');

  var W = settings.screen.width;
  var H = settings.screen.height;

  // Višina vrha v sloju za indeks; ponovljivo brez naključja.
  function peak(index, min, range) {
    var n = Math.sin(index * 12.9898) * 43758.5453;
    return min + (n - Math.floor(n)) * range;
  }

  function drawLayer(ctx, offset, spacing, baseY, min, range, color) {
    var first = Math.floor(offset / spacing) - 1;
    var last = Math.ceil((offset + W) / spacing) + 1;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(first * spacing - offset, H);
    for (var i = first; i <= last; i++) {
      var x = i * spacing - offset;
      ctx.lineTo(x, baseY - peak(i, min, range));
      ctx.lineTo(x + spacing / 2, baseY - peak(i + 0.5, min * 0.4, range * 0.4));
    }
    ctx.lineTo(last * spacing - offset, H);
    ctx.closePath();
    ctx.fill();
  }

  function draw(ctx, cameraX) {
    var sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#6fb7e8');
    sky.addColorStop(1, '#d9f0fb');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    var far = camera.backgroundOffset(cameraX);
    drawLayer(ctx, far, 160, 260, 70, 90, '#a9c9e2');
    drawLayer(ctx, far * 2, 110, 290, 30, 40, '#e8f4fb');
  }

  PinPin.register('render.background', { draw: draw });
})(window.PinPin);
