// Kamera: vodoravno sledi pingvinu in se ustavi na robovih sobe.
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var settings = isNode ? require('../config/settings.js') : root.PinPin.get('config.settings', 'config/settings.js');
  var math = isNode ? require('./math.js') : root.PinPin.get('core.math', 'core/math.js');

  // Levi rob kamere v sobi za pingvina s sredino targetX.
  function follow(roomWidth, targetX) {
    var w = settings.screen.width;
    return math.clamp(targetX - w / 2, 0, Math.max(0, roomWidth - w));
  }

  // Zamik ozadja: pomika se počasneje od ploščic.
  function backgroundOffset(cameraX) {
    return cameraX * settings.camera.parallax;
  }

  var camera = {
    follow: follow,
    backgroundOffset: backgroundOffset
  };

  if (isNode) {
    module.exports = camera;
  } else {
    root.PinPin.register('core.camera', camera);
  }
})(this);
