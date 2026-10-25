'use strict';

var test = require('node:test');
var assert = require('node:assert');
var room = require('../../src/js/core/room.js');

var T = 40;

function parse(rows) {
  return room.parse({ name: 'test', rows: rows }, T);
}

test('razčlenitev: vrste ploščic, ribe, začetek in cilj', function () {
  var r = parse([
    '......',
    '.S.fG.',
    '#B=H^#'
  ]);
  assert.strictEqual(r.cols, 6);
  assert.strictEqual(r.rows, 3);
  assert.strictEqual(r.width, 240);
  assert.strictEqual(r.height, 120);
  assert.deepStrictEqual(r.start, { col: 1, row: 1 });
  assert.strictEqual(r.goals.length, 1);
  assert.strictEqual(r.goals[0].col, 4);
  assert.strictEqual(r.fish.length, 1);
  assert.strictEqual(r.fish[0].col, 3);
  assert.strictEqual(r.fish[0].x, 120);
  // S, f in G niso ploščice
  assert.strictEqual(room.tileAt(r, 1, 1), '.');
  assert.strictEqual(room.tileAt(r, 3, 1), '.');
  assert.strictEqual(room.isSolid(room.tileAt(r, 0, 2)), true);
  assert.strictEqual(room.isSolid(room.tileAt(r, 1, 2)), true);
  assert.strictEqual(room.isOneWay(room.tileAt(r, 2, 2)), true);
  assert.strictEqual(room.isLadder(room.tileAt(r, 3, 2)), true);
  assert.strictEqual(room.isSpikes(room.tileAt(r, 4, 2)), true);
});

test('izven sobe je prazno', function () {
  var r = parse(['SG', '##']);
  assert.strictEqual(room.tileAt(r, -1, 0), '.');
  assert.strictEqual(room.tileAt(r, 0, 5), '.');
});

test('barva ribe je določena s položajem', function () {
  var r = parse(['ffffS', 'G....']);
  var colors = r.fish.map(function (f) { return f.color; });
  assert.deepStrictEqual(colors, [0, 1, 2, 3]);
  assert.deepStrictEqual(parse(['ffffS', 'G....']).fish[2].color, 2);
});

test('napaka: neenake dolžine vrstic', function () {
  assert.throws(function () { parse(['S..', 'G.']); }, /vrstica 2/);
});

test('napaka: neznan znak z vrstico in stolpcem', function () {
  assert.throws(function () { parse(['S..', 'G.x']); }, /"x".*vrstici 2, stolpec 3/);
});

test('napaka: brez začetka, brez cilja, dva začetka', function () {
  assert.throws(function () { parse(['..G']); }, /ni začetka/);
  assert.throws(function () { parse(['S..']); }, /ni cilja/);
  assert.throws(function () { parse(['S.S', 'G..']); }, /več kot en začetek/);
});

test('vrh lestve', function () {
  var r = parse([
    'S..G',
    '.H..',
    '.H..',
    '####'
  ]);
  assert.strictEqual(room.isLadderTop(r, 1, 1), true);
  assert.strictEqual(room.isLadderTop(r, 1, 2), false);
});

// Soba za varno mesto: zaslon je tukaj 4 stolpce širok.
var SCREEN = 4;

test('varno mesto: vsaj en zaslon levo od padca', function () {
  var r = parse([
    'S.............G',
    '###########...#',
    '###########...#'
  ]);
  // padec v stolpcu 12 → iskanje od stolpca 8 levo
  var p = room.safePoint(r, 12 * T + 20, SCREEN);
  assert.strictEqual(p.col, 8);
  assert.strictEqual(p.row, 0);
  assert.strictEqual(p.x, 8 * T + 20);
  assert.strictEqual(p.y, T);
});

test('varno mesto: ni ob robu prepada', function () {
  var r = parse([
    'S.............G',
    '######.########',
    '######.########'
  ]);
  // stolpca 5 in 7 sta ob prepadu v stolpcu 6
  var p = room.safePoint(r, 11 * T, SCREEN);
  assert.strictEqual(p.col, 4);
});

test('varno mesto: ni ob konicah', function () {
  var r = parse([
    'S.....^^......G',
    '###############'
  ]);
  // od stolpca 8 levo: 8, 7, 6, 5 so konice ali ob njih
  var p = room.safePoint(r, 12 * T, SCREEN);
  assert.strictEqual(p.col, 4);
});

test('varno mesto: ne pod trdno ploščico in ne na ledeni plošči', function () {
  var r = parse([
    'S.....B.......G',
    '...........==..',
    '###############'
  ]);
  // stolpec 6: nad tlemi je ledena kocka, zato ni varen
  var p = room.safePoint(r, 10 * T, SCREEN);
  assert.strictEqual(p.col, 5);
  assert.strictEqual(p.row, 1);
  var q = room.safePoint(r, 16 * T, SCREEN);
  // stolpca 11 in 12 imata ledeno ploščo nad tlemi; 12 je pod ploščo
  assert.strictEqual(q.col, 10);
});

test('varno mesto: blizu začetka je začetek', function () {
  var r = parse([
    '..S......G',
    '#####...##'
  ]);
  var p = room.safePoint(r, 6 * T, SCREEN);
  assert.strictEqual(p.col, 2);
  assert.strictEqual(p.row, 0);
});

test('kupi snega in živali', function () {
  var r = parse([
    '...u..k..',
    '.S*.M.V.G',
    '#########'
  ]);
  assert.strictEqual(room.isPile(room.tileAt(r, 2, 1)), true);
  assert.strictEqual(room.isSolid(room.tileAt(r, 2, 1)), false);
  assert.deepStrictEqual(r.animals.map(function (a) { return a.type; }), ['fly', 'mosquitoes', 'bear', 'wolf']);
  assert.deepStrictEqual({ col: r.animals[2].col, row: r.animals[2].row }, { col: 4, row: 1 });
  // živali niso ploščice
  assert.strictEqual(room.tileAt(r, 4, 1), '.');
  assert.strictEqual(room.tileAt(r, 3, 0), '.');
});

test('napaka: medved ali volk brez tal', function () {
  assert.throws(function () { parse(['SM.G', '#.##']); }, /vrstici 1, stolpec 2 ni trdnih tal/);
  assert.throws(function () { parse(['V..G', '.S..', '####']); }, /ni trdnih tal/);
});

test('prva podlaga pod vrstico', function () {
  var r = parse([
    'S..G',
    '....',
    '.==.',
    '####'
  ]);
  assert.strictEqual(room.surfaceBelow(r, 1, 0), 2 * T);
  assert.strictEqual(room.surfaceBelow(r, 0, 0), 3 * T);
});
