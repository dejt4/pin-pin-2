// Generirano z `npm run sprites` iz tools/sprites.json. Ne urejaj ročno.
// Velikosti so logične (točke igre); sličice so shranjene v 2-kratni velikosti.
// Vsaka sličica se nariše s sredino na sredini lika in dnom na tleh (sveče: vrh na stropu).
(function (root) {
  'use strict';

  var spriteInfo = {
    'apple': { file: 'graphic/food/apple.png', width: 21, height: 24 },
    'banana': { file: 'graphic/food/banana.png', width: 23, height: 22 },
    'bear-push-1': { file: 'graphic/animals/bear-push-1.png', width: 100, height: 53 },
    'bear-push-2': { file: 'graphic/animals/bear-push-2.png', width: 100, height: 53 },
    'bear-walk-1': { file: 'graphic/animals/bear-walk-1.png', width: 100, height: 53 },
    'bear-walk-2': { file: 'graphic/animals/bear-walk-2.png', width: 100, height: 53 },
    'bear-walk-3': { file: 'graphic/animals/bear-walk-3.png', width: 100, height: 53 },
    'carrot': { file: 'graphic/food/carrot.png', width: 23, height: 29 },
    'ice-wall-1': { file: 'graphic/obstacles/ice-wall-1.png', width: 82, height: 73 },
    'ice-wall-2': { file: 'graphic/obstacles/ice-wall-2.png', width: 82, height: 73 },
    'ice-wall-3': { file: 'graphic/obstacles/ice-wall-3.png', width: 82, height: 73 },
    'ice-wall-4': { file: 'graphic/obstacles/ice-wall-4.png', width: 82, height: 73 },
    'ice-wall-5': { file: 'graphic/obstacles/ice-wall-5.png', width: 82, height: 73 },
    'icicle-1': { file: 'graphic/obstacles/icicle-1.png', width: 69, height: 80 },
    'icicle-2': { file: 'graphic/obstacles/icicle-2.png', width: 69, height: 80 },
    'icicle-3': { file: 'graphic/obstacles/icicle-3.png', width: 69, height: 80 },
    'icicle-4': { file: 'graphic/obstacles/icicle-4.png', width: 69, height: 80 },
    'icicle-5': { file: 'graphic/obstacles/icicle-5.png', width: 69, height: 80 },
    'icicle-6': { file: 'graphic/obstacles/icicle-6.png', width: 69, height: 80 },
    'icicle-7': { file: 'graphic/obstacles/icicle-7.png', width: 69, height: 80 },
    'polar-push-1': { file: 'graphic/animals/polar-push-1.png', width: 82, height: 53 },
    'polar-push-2': { file: 'graphic/animals/polar-push-2.png', width: 82, height: 53 },
    'polar-walk-1': { file: 'graphic/animals/polar-walk-1.png', width: 82, height: 53 },
    'polar-walk-2': { file: 'graphic/animals/polar-walk-2.png', width: 82, height: 53 },
    'polar-walk-3': { file: 'graphic/animals/polar-walk-3.png', width: 82, height: 53 },
    'wolf-push-1': { file: 'graphic/animals/wolf-push-1.png', width: 78, height: 45 },
    'wolf-push-2': { file: 'graphic/animals/wolf-push-2.png', width: 78, height: 45 },
    'wolf-walk-1': { file: 'graphic/animals/wolf-walk-1.png', width: 78, height: 45 },
    'wolf-walk-2': { file: 'graphic/animals/wolf-walk-2.png', width: 78, height: 45 },
    'wolf-walk-3': { file: 'graphic/animals/wolf-walk-3.png', width: 78, height: 45 }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = spriteInfo;
  } else {
    root.PinPin.register('config.spriteInfo', spriteInfo);
  }
})(this);
