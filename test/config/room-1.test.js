'use strict';

var test = require('node:test');
var assert = require('node:assert');
var room = require('../../src/js/core/room.js');
var settings = require('../../src/js/config/settings.js');
var room1 = require('../../src/js/config/rooms/room-1.js');

var T = settings.tileSize;
var screenCols = settings.screen.width / T;
var r = room.parse(room1, T);

function isPitColumn(col) {
  return !room.isSolid(room.tileAt(r, col, r.rows - 1));
}

test('prva soba se naloži brez napake', function () {
  assert.strictEqual(r.rows, settings.screen.height / T);
  assert.ok(r.cols >= 5 * screenCols, 'vsaj 5 zaslonov');
});

test('prva soba ima prepad, lestev, konice, ledene plošče, vsaj 8 rib in cilj na desnem koncu', function () {
  var counts = { ladder: 0, spikes: 0, floe: 0, pit: 0 };
  for (var c = 0; c < r.cols; c++) {
    if (isPitColumn(c)) {
      counts.pit++;
    }
    for (var row = 0; row < r.rows; row++) {
      var t = room.tileAt(r, c, row);
      if (room.isLadder(t)) { counts.ladder++; }
      if (room.isSpikes(t)) { counts.spikes++; }
      if (room.isOneWay(t)) { counts.floe++; }
    }
  }
  assert.ok(counts.pit > 0);
  assert.ok(counts.ladder > 0);
  assert.ok(counts.spikes > 0);
  assert.ok(counts.floe > 0);
  assert.ok(r.fish.length >= 8);
  assert.ok(r.goals[0].col >= r.cols - screenCols, 'cilj je na zadnjem zaslonu');
});

test('prva soba ima kupe snega, medveda, volka, muho in komarje na poti ter živali na stranskem nivoju', function () {
  var ground = (r.rows - 2) * T;
  var piles = [];
  for (var c = 0; c < r.cols; c++) {
    for (var row = 0; row < r.rows; row++) {
      if (room.isPile(room.tileAt(r, c, row))) {
        piles.push({ col: c, row: row });
      }
    }
  }
  assert.ok(piles.length >= 2);
  var types = r.animals.map(function (a) { return a.type; });
  ['bear', 'wolf', 'fly', 'mosquitoes'].forEach(function (type) {
    assert.ok(types.indexOf(type) !== -1, 'manjka ' + type);
  });
  var side = 0;
  r.animals.forEach(function (a) {
    if (a.type !== 'fly' && a.type !== 'mosquitoes') {
      return;
    }
    var floor = room.surfaceBelow(r, a.col, a.row);
    if (floor < ground) {
      side++;
    }
    // kup na isti višini največ 6 ploščic pred živaljo
    var pile = piles.filter(function (p) {
      return p.row === a.row && p.col < a.col && a.col - p.col <= 6;
    });
    assert.ok(pile.length > 0, 'pred živaljo v stolpcu ' + a.col + ' ni kupa snega');
  });
  assert.ok(side > 0, 'na stranskem nivoju ni muhe ali komarjev');
});

test('prvo sobo je mogoče prehoditi do cilja, preden zmanjka energije, in pregnati vse muhe in komarje', function () {
  var game = require('../../src/js/core/game.js');
  var animals = require('../../src/js/core/animals.js');
  var bot = require('../bot.js');
  var g = game.create(room1);
  var result = bot.play(g, 60 * 120);
  assert.strictEqual(g.state, 'goal');
  assert.ok(result.climbed > 1, 'pot vodi po lestvi in na stranski nivo');
  var cleared = g.animals.filter(function (a) { return a.type === 'fly' || a.type === 'mosquitoes'; })
    .every(function (a) { return !animals.isBlocking(a); });
  assert.ok(cleared, 'vse muhe in komarji so pregnani');
  assert.strictEqual(g.score, 3 + 3 + 3);
});

test('za vsak prepad obstaja varno mesto na tleh, ne v prepadu in ne ob konicah', function () {
  for (var c = 0; c < r.cols; c++) {
    if (!isPitColumn(c)) {
      continue;
    }
    var p = room.safePoint(r, c * T + T / 2, screenCols);
    assert.ok(p.col <= c - screenCols || (p.col === r.start.col && p.row === r.start.row),
      'prepad v stolpcu ' + c + ': varno mesto je vsaj en zaslon levo ali začetek');
    assert.ok(room.isSolid(room.tileAt(r, p.col, p.row + 1)), 'stoji na trdnih tleh');
    for (var d = -1; d <= 1; d++) {
      assert.ok(!room.isSpikes(room.tileAt(r, p.col + d, p.row)), 'ni ob konicah');
      assert.ok(!isPitColumn(p.col + d), 'ni ob prepadu');
    }
  }
});
