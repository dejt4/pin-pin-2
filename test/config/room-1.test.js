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

function count(predicate) {
  var n = 0;
  for (var c = 0; c < r.cols; c++) {
    for (var row = 0; row < r.rows; row++) {
      if (predicate(room.tileAt(r, c, row), c, row)) {
        n++;
      }
    }
  }
  return n;
}

// skupine zaporednih stolpcev, ki ustrezajo pogoju
function groups(predicate) {
  var n = 0;
  var inside = false;
  for (var c = 0; c < r.cols; c++) {
    var now = predicate(c);
    if (now && !inside) {
      n++;
    }
    inside = now;
  }
  return n;
}

test('prva soba: vsaj 600 stolpcev, prepadi, lestve, konice, plošče, hrana, cilj na koncu', function () {
  assert.ok(r.cols >= 600);
  assert.ok(groups(isPitColumn) >= 3, 'prepadi');
  assert.ok(count(function (t, c, row) { return room.isLadderTop(r, c, row); }) >= 3, 'lestve');
  assert.ok(groups(function (c) {
    for (var row = 0; row < r.rows; row++) {
      if (room.isSpikes(room.tileAt(r, c, row))) { return true; }
    }
    return false;
  }) >= 3, 'skupine konic');
  assert.ok(count(room.isOneWay) > 0, 'ledene plošče');
  assert.ok(r.food.length >= 30, 'hrana');
  assert.ok(r.goals[0].col >= r.cols - screenCols, 'cilj je na zadnjem zaslonu');
});

test('prva soba: kupi snega, medveda, volk in ledene ovire s kupom pred vsako', function () {
  var ground = (r.rows - 2) * T;
  var piles = [];
  count(function (t, c, row) {
    if (room.isPile(t)) {
      piles.push({ col: c, row: row });
    }
    return false;
  });
  assert.ok(piles.length >= 6, 'kupi snega');
  var types = r.animals.map(function (a) { return a.type; });
  ['bear', 'polar', 'wolf'].forEach(function (type) {
    assert.ok(types.indexOf(type) !== -1, 'manjka ' + type);
  });
  var main = { wall: 0, icicle: 0 };
  var side = 0;
  r.obstacles.forEach(function (o) {
    // vrstica, v kateri stoji pingvin, ko meče v oviro
    var standRow = o.type === 'icicle' ? o.row + 1 : o.row;
    var floor = (standRow + 1) * T;
    if (floor < ground) {
      side++;
    } else {
      main[o.type]++;
    }
    var pile = piles.filter(function (p) {
      return p.row === standRow && p.col < o.col && o.col - p.col <= 6;
    });
    assert.ok(pile.length > 0, 'pred oviro v stolpcu ' + o.col + ' ni kupa snega');
  });
  assert.ok(main.wall >= 3, 'ledeni zidovi na glavni poti');
  assert.ok(main.icicle >= 3, 'ledene sveče na glavni poti');
  assert.ok(side > 0, 'na stranskem nivoju ni ovire');
});

test('prvo sobo je mogoče prehoditi do cilja, preden zmanjka energije, in razbiti vse ovire', function () {
  var game = require('../../src/js/core/game.js');
  var bot = require('../bot.js');
  var g = game.create(room1);
  var result = bot.play(g, 60 * 600);
  assert.strictEqual(g.state, 'goal');
  assert.ok(result.climbed >= 3, 'pot vodi po lestvah in na stranski nivo');
  assert.ok(g.obstacles.every(function (o) { return o.broken; }), 'vse ovire so razbite');
  var expected = 0;
  g.obstacles.forEach(function (o) { expected += settings.score[o.type]; });
  assert.strictEqual(g.score, expected);
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
