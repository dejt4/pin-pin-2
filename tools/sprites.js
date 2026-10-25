'use strict';

// Priprava sličic iz izvornih listov (npm run sprites).
// Nastavitve so v tools/sprites.json; izid so sličice v src/graphic/ in src/js/config/sprite-info.js.

var fs = require('node:fs');
var path = require('node:path');
var PNG = require('pngjs').PNG;
var lib = require('./sprite-lib.js');

var root = path.join(__dirname, '..');
var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'sprites.json'), 'utf8'));
var sources = {};

function readSource(file) {
  if (!sources[file]) {
    var png = PNG.sync.read(fs.readFileSync(path.join(root, 'src', 'graphic', 'source', file)));
    sources[file] = { width: png.width, height: png.height, data: png.data };
  }
  return sources[file];
}

function writePng(file, image) {
  var png = new PNG({ width: image.width, height: image.height });
  image.data.copy(png.data);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write(png, { colorType: 6 }));
}

var info = {};

config.groups.forEach(function (group) {
  var sheet = readSource(group.source);
  var threshold = group.threshold || config.threshold;
  var frames = group.frames.map(function (f) {
    var r = f.rect;
    var image = lib.crop(sheet, r[0], r[1], r[2], r[3]);
    // ozadje lista: temno (privzeto), naslikana šahovnica ali prava prosojnost
    if (group.background === 'checker') {
      lib.removeChecker(image);
    } else if (group.background === 'alpha') {
      lib.applyAlpha(image, 128);
    } else {
      lib.removeBackground(image, threshold);
    }
    // pravokotniki za brisanje so v koordinatah lista
    lib.clearRects(image, (f.clear || []).map(function (c) {
      return [c[0] - r[0], c[1] - r[1], c[2], c[3]];
    }));
    lib.dropEdgeTouching(image, f.dropEdges);
    return { name: f.name, image: image };
  });
  var laid = lib.layoutGroup(frames, {
    align: group.align,
    height: group.height,
    cols: group.cols,
    rows: group.rows,
    tile: config.tile,
    scale: config.scale
  });
  laid.forEach(function (s) {
    var rel = 'graphic/' + group.out + '/' + s.name + '.png';
    writePng(path.join(root, 'src', rel), s.image);
    info[s.name] = { file: rel, width: s.width, height: s.height };
    console.log(rel + '  ' + s.width + ' × ' + s.height);
  });
});

var names = Object.keys(info).sort();
var lines = names.map(function (name, i) {
  var s = info[name];
  return '    \'' + name + '\': { file: \'' + s.file + '\', width: ' + s.width + ', height: ' + s.height + ' }' +
    (i < names.length - 1 ? ',' : '');
});

var js = [
  '// Generirano z `npm run sprites` iz tools/sprites.json. Ne urejaj ročno.',
  '// Velikosti so logične (točke igre); sličice so shranjene v ' + config.scale + '-kratni velikosti.',
  '// Vsaka sličica se nariše s sredino na sredini lika in dnom na tleh (sveče: vrh na stropu).',
  '(function (root) {',
  '  \'use strict\';',
  '',
  '  var spriteInfo = {',
  lines.join('\n'),
  '  };',
  '',
  '  if (typeof module !== \'undefined\' && module.exports) {',
  '    module.exports = spriteInfo;',
  '  } else {',
  '    root.PinPin.register(\'config.spriteInfo\', spriteInfo);',
  '  }',
  '})(this);',
  ''
].join('\n');

fs.writeFileSync(path.join(root, 'src', 'js', 'config', 'sprite-info.js'), js);
console.log('src/js/config/sprite-info.js  ' + names.length + ' sličic');
