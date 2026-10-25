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
    'block': { file: 'graphic/terrain/block.png', width: 40, height: 48 },
    'bush': { file: 'graphic/decor/bush.png', width: 37, height: 27 },
    'carrot': { file: 'graphic/food/carrot.png', width: 23, height: 29 },
    'crystals': { file: 'graphic/terrain/crystals.png', width: 45, height: 42 },
    'ground-1-1': { file: 'graphic/terrain/ground-1-1.png', width: 40, height: 40 },
    'ground-1-2': { file: 'graphic/terrain/ground-1-2.png', width: 40, height: 40 },
    'ground-1-3': { file: 'graphic/terrain/ground-1-3.png', width: 40, height: 40 },
    'ground-1-4': { file: 'graphic/terrain/ground-1-4.png', width: 40, height: 40 },
    'ground-2-1': { file: 'graphic/terrain/ground-2-1.png', width: 40, height: 40 },
    'ground-2-2': { file: 'graphic/terrain/ground-2-2.png', width: 40, height: 40 },
    'ground-2-3': { file: 'graphic/terrain/ground-2-3.png', width: 40, height: 40 },
    'ground-2-4': { file: 'graphic/terrain/ground-2-4.png', width: 40, height: 40 },
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
    'ladder-1-1': { file: 'graphic/terrain/ladder-1-1.png', width: 40, height: 40 },
    'ladder-2-1': { file: 'graphic/terrain/ladder-2-1.png', width: 40, height: 40 },
    'ledge-1': { file: 'graphic/terrain/ledge-1.png', width: 40, height: 69 },
    'ledge-2': { file: 'graphic/terrain/ledge-2.png', width: 40, height: 69 },
    'ledge-3': { file: 'graphic/terrain/ledge-3.png', width: 40, height: 69 },
    'ledge-4': { file: 'graphic/terrain/ledge-4.png', width: 40, height: 69 },
    'mountains-far': { file: 'graphic/background/mountains-far.png', width: 535, height: 130 },
    'mountains-near': { file: 'graphic/background/mountains-near.png', width: 526, height: 150 },
    'polar-push-1': { file: 'graphic/animals/polar-push-1.png', width: 82, height: 53 },
    'polar-push-2': { file: 'graphic/animals/polar-push-2.png', width: 82, height: 53 },
    'polar-walk-1': { file: 'graphic/animals/polar-walk-1.png', width: 82, height: 53 },
    'polar-walk-2': { file: 'graphic/animals/polar-walk-2.png', width: 82, height: 53 },
    'polar-walk-3': { file: 'graphic/animals/polar-walk-3.png', width: 82, height: 53 },
    'rock': { file: 'graphic/decor/rock.png', width: 33, height: 22 },
    'tree': { file: 'graphic/decor/tree.png', width: 58, height: 92 },
    'water-1': { file: 'graphic/background/water-1.png', width: 467, height: 60 },
    'water-2': { file: 'graphic/background/water-2.png', width: 467, height: 60 },
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
