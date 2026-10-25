// Tipkovnica: beleži tipke po keyCode.
// Tipka, ki je bila pritisnjena in spuščena med dvema branjima, se vseeno prebere enkrat.
(function (PinPin) {
  'use strict';

  var controls = PinPin.get('config.controls', 'config/controls.js');

  function createKeyboard(target) {
    var held = {};
    var tapped = {};

    function isMapped(code) {
      return Object.prototype.hasOwnProperty.call(controls.keyboard, code);
    }

    target.addEventListener('keydown', function (event) {
      var code = event.keyCode;
      if (isMapped(code)) {
        // puščice in ostale tipke igre ne premikajo strani
        event.preventDefault();
      }
      held[code] = true;
      tapped[code] = true;
    });

    target.addEventListener('keyup', function (event) {
      held[event.keyCode] = false;
    });

    // ob izgubi fokusa se vse tipke spustijo
    target.addEventListener('blur', function () {
      held = {};
      tapped = {};
    });

    return {
      // vrne {keyCode: true} za tipke, ki se držijo ali so bile pritisnjene od zadnjega branja
      read: function () {
        var keys = {};
        var code;
        for (code in held) {
          if (held[code]) {
            keys[code] = true;
          }
        }
        for (code in tapped) {
          keys[code] = true;
        }
        tapped = {};
        return keys;
      }
    };
  }

  PinPin.register('platform.keyboard', { createKeyboard: createKeyboard });
})(window.PinPin);
