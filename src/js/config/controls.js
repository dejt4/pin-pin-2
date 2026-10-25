// Razporeditev tipk in gumbov kontrolerja na akcije igre. Samo podatki.
(function (root) {
  'use strict';

  var controls = {
    // keyCode → akcija
    // gor je skok ali plezanje (glej core/player.js)
    keyboard: {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      32: 'throw'   // presledek
    },

    // standardna razporeditev kontrolerja (PS4)
    gamepad: {
      buttons: {
        2: 'throw',   // □
        12: 'up',     // križec
        13: 'down',
        14: 'left',
        15: 'right'
      },
      // leva palčka
      axisX: 0,
      axisY: 1,
      // odklon palčke, pod katerim akcija ni aktivna
      deadZone: 0.5
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = controls;
  } else {
    root.PinPin.register('config.controls', controls);
  }
})(this);
