// Sličice: datoteke, velikost izrisa v logičnih točkah in izrez (crop) iz izvirnika.
(function (root) {
  'use strict';

  var PENGUIN = [
    'stand-right', 'stand-left', 'stand-down',
    'walk-right-1', 'walk-right-2', 'walk-right-3',
    'walk-left-1', 'walk-left-2', 'walk-left-3',
    'walk-up-1', 'walk-up-2', 'walk-up-3',
    'jump-takeoff', 'jump-rising', 'jump-apex', 'jump-landing',
    'bump-left',
    'cry-1', 'cry-2', 'cry-3'
  ];

  var FISH = ['fish-green', 'fish-red', 'fish-yellow', 'fish-steel'];

  var images = {};
  var i;

  // Pingvin v izvirniku (308 × 340) ima okoli sebe prazen rob;
  // viden lik je visok približno 44 točk, stopala so 8 točk nad spodnjim robom sličice.
  for (i = 0; i < PENGUIN.length; i++) {
    images[PENGUIN[i]] = { file: 'graphic/penguin/' + PENGUIN[i] + '.png', width: 56, height: 62 };
  }

  for (i = 0; i < FISH.length; i++) {
    images[FISH[i]] = { file: 'graphic/fish/' + FISH[i] + '.png', width: 34, height: 18 };
  }

  images['ice-cube'] = { file: 'graphic/ice/ice-cube.png', width: 40, height: 40, crop: { x: 40, y: 0, width: 256, height: 208 } };
  images['ice-floe'] = { file: 'graphic/ice/ice-floe.png', width: 44, height: 26 };
  images['ice-spikes'] = { file: 'graphic/ice/ice-spikes.png', width: 52, height: 40, crop: { x: 20, y: 0, width: 296, height: 208 } };

  var sprites = {
    images: images,
    // barve rib po indeksu barve iz sobe
    fish: FISH,
    penguin: {
      // koliko točk pod stopali se konča sličica
      footOffset: 8
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = sprites;
  } else {
    root.PinPin.register('config.sprites', sprites);
  }
})(this);
