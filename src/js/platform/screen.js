// Zaslon: platno s stalno logično velikostjo (16 : 9), povečano na okno brez popačenja.
// Notranja ločljivost platna sledi dejanski velikosti, da je slika ostra tudi na televizorju.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');

  function createScreen(canvas) {
    var ctx = canvas.getContext('2d');
    var width = settings.screen.width;
    var height = settings.screen.height;
    var screen = {
      ctx: ctx,
      width: width,
      height: height,
      // logične točke → slikovne točke platna
      pixelScale: 1
    };

    function resize() {
      var winW = window.innerWidth || document.documentElement.clientWidth;
      var winH = window.innerHeight || document.documentElement.clientHeight;
      var scale = Math.min(winW / width, winH / height);
      var cssW = Math.floor(width * scale);
      var cssH = Math.floor(height * scale);
      var dpr = window.devicePixelRatio || 1;

      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      canvas.style.left = Math.floor((winW - cssW) / 2) + 'px';
      canvas.style.top = Math.floor((winH - cssH) / 2) + 'px';
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);

      screen.pixelScale = canvas.width / width;
    }

    // pred vsakim izrisom: logične koordinate
    screen.begin = function () {
      ctx.setTransform(screen.pixelScale, 0, 0, screen.pixelScale, 0, 0);
      ctx.imageSmoothingEnabled = true;
    };

    resize();
    window.addEventListener('resize', resize);
    return screen;
  }

  PinPin.register('platform.screen', { createScreen: createScreen });
})(window.PinPin);
