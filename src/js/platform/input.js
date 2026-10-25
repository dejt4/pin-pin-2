// Vhod: združi tipkovnico, kontroler in gumbe na dotik v akcije igre za vsak korak.
(function (PinPin) {
  'use strict';

  var controls = PinPin.get('config.controls', 'config/controls.js');
  var actions = PinPin.get('core.actions', 'core/actions.js');
  var keyboardModule = PinPin.get('platform.keyboard', 'platform/keyboard.js');
  var gamepad = PinPin.get('platform.gamepad', 'platform/gamepad.js');

  // touch: gumbi na dotik (platform/touch.js) ali null
  function createInput(target, touch) {
    var keyboard = keyboardModule.createKeyboard(target);
    var state = actions.createState();

    return {
      // prebere naprave in vrne akcije za naslednji korak pravil
      read: function () {
        state = actions.read(controls, keyboard.read(), gamepad.read(), state, touch ? touch.read() : null);
        return state;
      }
    };
  }

  PinPin.register('platform.input', { createInput: createInput });
})(window.PinPin);
