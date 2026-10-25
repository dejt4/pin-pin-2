// Zagon igre: nalaganje sličic, zanka s fiksnim časovnim korakom in izris.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');
  var spriteConfig = PinPin.get('config.sprites', 'config/sprites.js');
  var room1 = PinPin.get('config.room1', 'config/rooms/room-1.js');
  var loop = PinPin.get('core.loop', 'core/loop.js');
  var gameModule = PinPin.get('core.game', 'core/game.js');
  var screenModule = PinPin.get('platform.screen', 'platform/screen.js');
  var inputModule = PinPin.get('platform.input', 'platform/input.js');
  var images = PinPin.get('platform.images', 'platform/images.js');
  var rendererModule = PinPin.get('render.renderer', 'render/renderer.js');

  var requestFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(function () {
        callback(Date.now());
      }, 1000 / 60);
    };

  function now() {
    return window.performance && window.performance.now ? window.performance.now() : Date.now();
  }

  function start() {
    var canvas = document.getElementById('game');
    var screen = screenModule.createScreen(canvas);
    var input = inputModule.createInput(window);
    var loading = rendererModule.createRenderer(screen, null);

    loading.drawMessage('Nalaganje ...');

    images.load(spriteConfig.images, function (error, loaded) {
      if (error) {
        loading.drawMessage(error, true);
        return;
      }
      var cache = images.createSpriteCache(spriteConfig.images, loaded);
      var renderer = rendererModule.createRenderer(screen, cache);
      var game = gameModule.create(room1);
      var clock = loop.createClock();
      var last = now();

      function frame() {
        var t = now();
        var steps = loop.advance(clock, (t - last) / 1000, settings.step, settings.maxStepsPerFrame);
        last = t;
        for (var i = 0; i < steps; i++) {
          gameModule.step(game, input.read(), settings.step);
        }
        renderer.draw(game);
        requestFrame(frame);
      }

      requestFrame(frame);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window.PinPin);
