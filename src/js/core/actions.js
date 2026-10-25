// Prevod naprav v akcije igre. Pravila igre vidijo samo akcije.
//
// Stanje akcij: { down: {akcija: bool}, pressed: {akcija: bool} }
//   down    akcija je aktivna (tipka ali gumb se drži)
//   pressed akcija je v tem koraku na novo aktivna
(function (root) {
  'use strict';

  var NAMES = ['left', 'right', 'up', 'down', 'jump', 'throw'];

  function emptyFlags() {
    var flags = {};
    for (var i = 0; i < NAMES.length; i++) {
      flags[NAMES[i]] = false;
    }
    return flags;
  }

  function createState() {
    return { down: emptyFlags(), pressed: emptyFlags() };
  }

  // keys: {keyCode: true} za tipke, ki se držijo (ali so bile pritisnjene od zadnjega branja)
  // pads: seznam kontrolerjev {buttons: [bool], axes: [number]}
  // previous: stanje akcij iz prejšnjega koraka
  function read(controls, keys, pads, previous) {
    var down = emptyFlags();
    var code;

    for (code in keys) {
      if (keys[code] && Object.prototype.hasOwnProperty.call(controls.keyboard, code)) {
        down[controls.keyboard[code]] = true;
      }
    }

    var map = controls.gamepad;
    for (var p = 0; p < pads.length; p++) {
      var pad = pads[p];
      if (!pad) {
        continue;
      }
      for (var index in map.buttons) {
        if (pad.buttons[index]) {
          down[map.buttons[index]] = true;
        }
      }
      var ax = pad.axes[map.axisX] || 0;
      var ay = pad.axes[map.axisY] || 0;
      if (ax <= -map.deadZone) {
        down.left = true;
      }
      if (ax >= map.deadZone) {
        down.right = true;
      }
      if (ay <= -map.deadZone) {
        down.up = true;
      }
      if (ay >= map.deadZone) {
        down.down = true;
      }
    }

    var pressed = emptyFlags();
    for (var i = 0; i < NAMES.length; i++) {
      var name = NAMES[i];
      pressed[name] = down[name] && !(previous && previous.down[name]);
    }

    return { down: down, pressed: pressed };
  }

  function anyPressed(state) {
    for (var i = 0; i < NAMES.length; i++) {
      if (state.pressed[NAMES[i]]) {
        return true;
      }
    }
    return false;
  }

  var actions = {
    NAMES: NAMES,
    createState: createState,
    read: read,
    anyPressed: anyPressed
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = actions;
  } else {
    root.PinPin.register('core.actions', actions);
  }
})(this);
