// Vhod: združi tipkovnico in kontroler v akcije igre za vsak korak.
(function (PinPin) {
  'use strict';

  var controls = PinPin.get('config.controls', 'config/controls.js');
  var actions = PinPin.get('core.actions', 'core/actions.js');
  var keyboardModule = PinPin.get('platform.keyboard', 'platform/keyboard.js');
  var gamepad = PinPin.get('platform.gamepad', 'platform/gamepad.js');

  function createInput(target) {
    var keyboard = keyboardModule.createKeyboard(target);
    var state = actions.createState();

    return {
      // prebere naprave in vrne akcije za naslednji korak pravil
      read: function () {
        state = actions.read(controls, keyboard.read(), gamepad.read(), state);
        return state;
      }
    };
  }

  PinPin.register('platform.input', { createInput: createInput });
})(window.PinPin);
