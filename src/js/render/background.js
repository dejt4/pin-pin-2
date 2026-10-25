// Ozadje: nebo (barvni prehod) in dve plasti gorskih panoram s paralakso.
// Panorama se ponavlja izmenično zrcaljena, zato se konec ene ujema z začetkom naslednje.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');
  var camera = PinPin.get('core.camera', 'core/camera.js');

  var W = settings.screen.width;
  var H = settings.screen.height;

  // spodnji rob plasti (logične točke od vrha zaslona)
  var FAR_BOTTOM = 250;
  var NEAR_BOTTOM = 300;

  var sky = null;

  function drawLayer(ctx, cache, scale, name, offset, bottom) {
    var info = cache.info(name);
    var image = cache.get(name, scale);
    var w = info.width;
    var y = bottom - info.height;
    var first = Math.floor(offset / w);
    for (var i = first; i * w - offset < W; i++) {
      var x = i * w - offset;
      if (i % 2 === 0) {
        ctx.drawImage(image, x, y, w, info.height);
      } else {
        ctx.save();
        ctx.translate(x + w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(image, 0, y, w, info.height);
        ctx.restore();
      }
    }
  }

  function draw(ctx, cameraX, cache, scale) {
    if (!sky) {
      sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#6fb7e8');
      sky.addColorStop(1, '#dff2fb');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    drawLayer(ctx, cache, scale, 'mountains-far', camera.backgroundOffset(cameraX, 'far'), FAR_BOTTOM);
    drawLayer(ctx, cache, scale, 'mountains-near', camera.backgroundOffset(cameraX, 'near'), NEAR_BOTTOM);
  }

  PinPin.register('render.background', { draw: draw });
})(window.PinPin);
