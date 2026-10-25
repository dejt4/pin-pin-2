'use strict';

var test = require('node:test');
var assert = require('node:assert');
var lib = require('../../tools/sprite-lib.js');

// Slika iz znakov: '.' črno ozadje, 'x' svetla točka, 'o' temna točka (svetlost 10).
function fromRows(rows) {
  var img = lib.createImage(rows[0].length, rows.length);
  rows.forEach(function (row, y) {
    for (var x = 0; x < row.length; x++) {
      var i = (y * img.width + x) * 4;
      var v = row[x] === 'x' ? 200 : (row[x] === 'o' ? 10 : 0);
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  });
  return img;
}

function alpha(img, x, y) {
  return img.data[(y * img.width + x) * 4 + 3];
}

test('ozadje povezano z robom postane prosojno, temna točka znotraj lika ostane', function () {
  var img = fromRows([
    '.......',
    '.xxxxx.',
    '.xxoxx.',
    '.xxxxx.',
    '.......'
  ]);
  lib.removeBackground(img, 30);
  assert.strictEqual(alpha(img, 0, 0), 0);
  assert.strictEqual(alpha(img, 1, 1), 255);
  assert.strictEqual(alpha(img, 3, 2), 255, 'zenica ostane');
});

test('telo je največja skupina točk', function () {
  var img = fromRows([
    'x.......',
    '...xxx..',
    '...xxx..',
    '........'
  ]);
  lib.removeBackground(img, 30);
  var b = lib.boxes(img);
  assert.deepStrictEqual(b.body, { x0: 3, y0: 1, x1: 5, y1: 2 });
  assert.deepStrictEqual(b.all, { x0: 0, y0: 0, x1: 5, y1: 2 });
});

test('odstranitev skupin ob levem robu ohrani telo', function () {
  var img = fromRows([
    'x.......',
    'x..xxx..',
    '...xxx..'
  ]);
  lib.removeBackground(img, 30);
  lib.dropEdgeTouching(img, ['left']);
  assert.strictEqual(alpha(img, 0, 0), 0);
  assert.strictEqual(alpha(img, 3, 1), 255);
});

test('poravnava bottom: enaka velikost, telo na sredini in na dnu', function () {
  var a = fromRows([
    '..........',
    '..xxx.....',
    '..xxx.....',
    '..........'
  ]);
  var b = fromRows([
    '..........',
    '.....xxx.x',
    '.....xxx..',
    '..........'
  ]);
  lib.removeBackground(a, 30);
  lib.removeBackground(b, 30);
  var out = lib.layoutGroup([{ name: 'a', image: a }, { name: 'b', image: b }], { align: 'bottom', height: 2, scale: 1 });
  assert.strictEqual(out[0].width, out[1].width);
  assert.strictEqual(out[0].height, out[1].height);
  // dno telesa je na zadnji vrstici, sredina telesa na sredini
  var img = out[0].image;
  var mid = img.width / 2;
  assert.ok(alpha(img, mid, img.height - 1) > 0);
  assert.ok(alpha(img, mid - 1, img.height - 1) > 0);
});

test('poravnava cell: vse sličice ohranijo celico in so enako velike', function () {
  var a = fromRows(['xx..', '....', '....', '....']);
  var b = fromRows(['....', '....', '....', '..xx']);
  var out = lib.layoutGroup([{ name: 'a', image: a }, { name: 'b', image: b }], { align: 'cell', height: 4, scale: 1 });
  assert.strictEqual(out[0].height, 4);
  assert.ok(alpha(out[0].image, 0, 0) > 0, 'vrh ostane zgoraj');
  assert.ok(alpha(out[1].image, 3, 3) > 0, 'drobci ostanejo spodaj');
});

test('pomanjšanje povpreči barvo brez temnih robov ob prosojnosti', function () {
  var img = lib.createImage(2, 1);
  img.data.set([255, 0, 0, 255, 0, 0, 0, 0]);
  var out = lib.resize(img, 1, 1);
  assert.strictEqual(out.data[0], 255, 'rdeča ostane rdeča');
  assert.strictEqual(out.data[3], 128);
});

// Slika s šahovnico: 'c' svetlo siva, 'w' bela, 'o' temna obroba, 's' bel sneg (enak kot 'w').
function checkerRows(rows) {
  var img = lib.createImage(rows[0].length, rows.length);
  var colors = { c: [210, 210, 210], w: [250, 250, 250], o: [20, 40, 90], s: [250, 250, 250], b: [80, 140, 220] };
  rows.forEach(function (row, y) {
    for (var x = 0; x < row.length; x++) {
      var i = (y * img.width + x) * 4;
      var col = colors[row[x]];
      img.data[i] = col[0];
      img.data[i + 1] = col[1];
      img.data[i + 2] = col[2];
      img.data[i + 3] = 255;
    }
  });
  return img;
}

test('šahovnica postane prosojna, sneg znotraj obrobe ostane', function () {
  var img = checkerRows([
    'cwcwcwc',
    'wooooow',
    'cosssoc',
    'wobbbow',
    'cooooow'
  ]);
  lib.removeChecker(img);
  assert.strictEqual(alpha(img, 0, 0), 0);
  assert.strictEqual(alpha(img, 1, 0), 0);
  assert.strictEqual(alpha(img, 2, 2), 255, 'sneg ostane');
  assert.strictEqual(alpha(img, 1, 1), 255, 'obroba ostane');
});

test('prava prosojnost: nizka alfa postane prosojna, ostalo neprosojno', function () {
  var img = lib.createImage(2, 1);
  img.data.set([10, 10, 10, 100, 10, 10, 10, 200]);
  lib.applyAlpha(img, 128);
  assert.strictEqual(img.data[3], 0);
  assert.strictEqual(img.data[7], 255);
});

test('razrez na ploščice: enako veliki trakovi, ki skupaj dajo kos', function () {
  var img = fromRows([
    '..........',
    '.xxxxxxxx.',
    '.xxxxxxxx.',
    '..........'
  ]);
  lib.removeBackground(img, 30);
  var out = lib.layoutGroup([{ name: 'tla', image: img }], { align: 'slices', cols: 4, rows: 2, tile: 2, scale: 1 });
  assert.deepStrictEqual(out.map(function (s) { return s.name; }),
    ['tla-1-1', 'tla-1-2', 'tla-1-3', 'tla-1-4', 'tla-2-1', 'tla-2-2', 'tla-2-3', 'tla-2-4']);
  out.forEach(function (s) {
    assert.strictEqual(s.image.width, 2);
    assert.strictEqual(s.image.height, 2);
    assert.strictEqual(alpha(s.image, 0, 0), 255, 'trak je poln, brez vrzeli');
  });
  var single = lib.layoutGroup([{ name: 'polica', image: img }], { align: 'slices', cols: 2, tile: 4, scale: 1 });
  assert.deepStrictEqual(single.map(function (s) { return s.name; }), ['polica-1', 'polica-2']);
  assert.strictEqual(single[0].height, single[1].height);
});

test('pas: obrezan in pomanjšan na dano višino', function () {
  var img = fromRows([
    '..........',
    '.xxxxxxxx.',
    '.xxxxxxxx.',
    '..........'
  ]);
  lib.removeBackground(img, 30);
  var out = lib.layoutGroup([{ name: 'gore', image: img }], { align: 'strip', height: 4, scale: 1 });
  assert.strictEqual(out[0].height, 4);
  assert.strictEqual(out[0].width, 16);
});
