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
