'use strict';

var test = require('node:test');
var assert = require('node:assert');
var terrain = require('../../src/js/core/terrain.js');
var h = require('../helpers.js');

var r = h.parseRoom([
  '...............G',
  '..H====.........',
  '..H.......####..',
  '.SH.............',
  '######...#######',
  '######...#######'
]);

test('debela tla: zgornja ploščica in podlaga iz kamnov', function () {
  assert.strictEqual(terrain.groundPiece(r, 2, 4), 'ground-1-2');
  assert.strictEqual(terrain.groundPiece(r, 2, 5), 'ground-2-2');
  assert.strictEqual(terrain.thickness(r, 2, 4), 2);
});

test('robovi tal ob prepadu in na koncih sobe', function () {
  assert.strictEqual(terrain.groundPiece(r, 0, 4), 'ground-1-1', 'levi rob sobe');
  assert.strictEqual(terrain.groundPiece(r, 5, 4), 'ground-1-4', 'desni rob pred prepadom');
  assert.strictEqual(terrain.groundPiece(r, 9, 4), 'ground-1-1', 'levi rob za prepadom');
  assert.strictEqual(terrain.groundPiece(r, 15, 5), 'ground-2-4');
});

test('sredina se izmenjuje po stolpcih, enaka kosa nista drug ob drugem', function () {
  var names = [];
  for (var c = 10; c <= 14; c++) {
    names.push(terrain.groundPiece(r, c, 4));
  }
  assert.deepStrictEqual(names, ['ground-1-2', 'ground-1-3', 'ground-1-2', 'ground-1-3', 'ground-1-2']);
});

test('tanka tla in ledene plošče so ledena polica z robovi', function () {
  assert.strictEqual(terrain.groundPiece(r, 10, 2), 'ledge-1');
  assert.strictEqual(terrain.groundPiece(r, 11, 2), 'ledge-3');
  assert.strictEqual(terrain.groundPiece(r, 13, 2), 'ledge-4');
  assert.strictEqual(terrain.groundPiece(r, 3, 1), 'ledge-1');
  assert.strictEqual(terrain.groundPiece(r, 6, 1), 'ledge-4');
});

test('druge ploščice nimajo kosa tal', function () {
  assert.strictEqual(terrain.groundPiece(r, 7, 4), null);
  assert.strictEqual(terrain.groundPiece(r, 2, 1), null);
});

test('lestev: vrh in ostali deli', function () {
  assert.strictEqual(terrain.ladderPiece(r, 2, 1), 'ladder-1-1');
  assert.strictEqual(terrain.ladderPiece(r, 2, 2), 'ladder-2-1');
  assert.strictEqual(terrain.ladderPiece(r, 2, 3), 'ladder-2-1');
});

test('stolpci vode so stolpci prepada', function () {
  assert.strictEqual(terrain.isWaterColumn(r, 7), true);
  assert.strictEqual(terrain.isWaterColumn(r, 5), false);
  assert.strictEqual(terrain.isWaterColumn(r, -1), false);
});
