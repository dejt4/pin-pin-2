// Sličice: datoteke, velikost izrisa v logičnih točkah in izrez (crop) iz izvirnika.
// Sličice živali, ovir in hrane pripravi `npm run sprites` (glej config/sprite-info.js).
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var spriteInfo = isNode ? require('./sprite-info.js') : root.PinPin.get('config.spriteInfo', 'config/sprite-info.js');

  var PENGUIN = [
    'stand-right', 'stand-left', 'stand-down',
    'walk-right-1', 'walk-right-2', 'walk-right-3',
    'walk-left-1', 'walk-left-2', 'walk-left-3',
    'walk-up-1', 'walk-up-2', 'walk-up-3',
    'jump-takeoff', 'jump-rising', 'jump-apex', 'jump-landing',
    'bump-left',
    'cry-1', 'cry-2', 'cry-3'
  ];

  // vrsta hrane po indeksu iz sobe
  var FOOD = ['apple', 'carrot', 'banana'];

  var images = {};
  var i;

  // Pingvin v izvirniku (308 × 340) ima okoli sebe prazen rob;
  // viden lik je visok približno 44 točk, stopala so 8 točk nad spodnjim robom sličice.
  for (i = 0; i < PENGUIN.length; i++) {
    images[PENGUIN[i]] = { file: 'graphic/penguin/' + PENGUIN[i] + '.png', width: 56, height: 62 };
  }

  for (var name in spriteInfo) {
    images[name] = spriteInfo[name];
  }

  images['ice-cube'] = { file: 'graphic/ice/ice-cube.png', width: 40, height: 40, crop: { x: 40, y: 0, width: 256, height: 208 } };
  images['ice-floe'] = { file: 'graphic/ice/ice-floe.png', width: 44, height: 26 };
  images['ice-spikes'] = { file: 'graphic/ice/ice-spikes.png', width: 52, height: 40, crop: { x: 20, y: 0, width: 296, height: 208 } };

  var sprites = {
    images: images,
    food: FOOD,
    penguin: {
      // koliko točk pod stopali se konča sličica
      footOffset: 8
    }
  };

  if (isNode) {
    module.exports = sprites;
  } else {
    root.PinPin.register('config.sprites', sprites);
  }
})(this);
