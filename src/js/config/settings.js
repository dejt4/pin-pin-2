// Nastavitve igre: velikosti, fizika, energija, časi. Samo podatki.
// Hitrosti so v slikovnih točkah (px) na sekundo, časi v sekundah.
(function (root) {
  'use strict';

  var settings = {
    // logična velikost slike (16 : 9) in ploščice: 16 × 9 ploščic na zaslon
    screen: { width: 640, height: 360 },
    tileSize: 40,

    // fiksni časovni korak pravil
    step: 1 / 60,
    maxStepsPerFrame: 5,

    player: {
      // trkovni pravokotnik (ožji od sličice)
      width: 26,
      height: 40,
      walkSpeed: 160,
      jumpSpeed: 460,
      gravity: 1000,
      maxFallSpeed: 600,
      climbSpeed: 100,
      // odriv ob konicah
      knockbackSpeedX: 160,
      knockbackSpeedY: 300,
      invulnerableTime: 1.5
    },

    energy: {
      max: 100,
      // od polne do nič v 120 s
      drainPerSecond: 100 / 120,
      fish: 25,
      pitPenalty: 15,
      spikesPenalty: 10
    },

    flow: {
      // najkrajši čas pred ponovnim začetkom po utrujenosti ali cilju
      restartDelay: 2
    },

    camera: {
      parallax: 0.3
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = settings;
  } else {
    root.PinPin.register('config.settings', settings);
  }
})(this);
