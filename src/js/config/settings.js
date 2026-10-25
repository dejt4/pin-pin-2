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
      food: 25,
      pitPenalty: 15,
      spikesPenalty: 10,
      caughtPenalty: 15
    },

    snowball: {
      speed: 360,
      size: 10,
      // višina kepe pod vrhom pingvina (prsi)
      chest: 12,
      // najkrajši čas med dvema metoma
      cooldown: 0.3,
      // trajanje animacije meta
      throwTime: 0.25
    },

    animals: {
      // trkovni pravokotnik (malo manjši od sličice), hitrost,
      // range: največja razdalja od začetnega položaja v ploščicah
      bear: { width: 58, height: 48, speed: 50, range: 4 },
      polar: { width: 58, height: 48, speed: 50, range: 4 },
      wolf: { width: 54, height: 34, speed: 80, range: 4 },
      // trajanje udarca ob ulovu pingvina
      pushTime: 0.5,
      // hitrost menjave sličic hoje (sličic na sekundo)
      walkFps: 8
    },

    obstacles: {
      // ledeni zid: trkovni pravokotnik na tleh, zadetki do razpada, trajanje razpada
      wall: { width: 60, height: 72, hits: 5, breakTime: 0.4 },
      // ledena sveča: visi s stropa, dolžina skoraj do tal (dve ploščici niže)
      icicle: { width: 24, length: 70, hits: 3, breakTime: 0.6 }
    },

    score: {
      wall: 3,
      icicle: 1
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
