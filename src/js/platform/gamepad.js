// Kontroler: prebere stanje vseh priključenih kontrolerjev (Gamepad API).
// Brez podpore ali brez kontrolerja vrne prazen seznam.
(function (PinPin) {
  'use strict';

  function isPressed(button) {
    // starejši brskalniki vračajo številke namesto objektov
    if (typeof button === 'number') {
      return button > 0.5;
    }
    return !!button && (button.pressed || button.value > 0.5);
  }

  function read() {
    var result = [];
    if (!navigator.getGamepads) {
      return result;
    }
    var pads;
    try {
      pads = navigator.getGamepads();
    } catch (e) {
      return result;
    }
    if (!pads) {
      return result;
    }
    for (var i = 0; i < pads.length; i++) {
      var pad = pads[i];
      if (!pad || pad.connected === false) {
        continue;
      }
      var buttons = [];
      for (var b = 0; b < pad.buttons.length; b++) {
        buttons.push(isPressed(pad.buttons[b]));
      }
      var axes = [];
      for (var a = 0; a < pad.axes.length; a++) {
        axes.push(pad.axes[a]);
      }
      result.push({ buttons: buttons, axes: axes });
    }
    return result;
  }

  PinPin.register('platform.gamepad', { read: read });
})(window.PinPin);
