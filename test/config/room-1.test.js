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

// Preprost samodejni igralec: hodi desno, skoči pred prepadom, zidom ali konicami
// in pleza po lestvi, kadar je pred njo.
function isSurface(col, row) {
  var t = room.tileAt(r, col, row);
  return room.isSolid(t) || room.isOneWay(t) || room.isLadderTop(r, col, row);
}

test('prvo sobo je mogoče prehoditi do cilja, preden zmanjka energije', function () {
  var game = require('../../src/js/core/game.js');
  var player = require('../../src/js/core/player.js');
  var h = require('../helpers.js');
  var g = game.create(room1);
  var input = h.createInput();
  game.step(g, input(['jump']), h.DT);
  game.step(g, input([]), h.DT);

  var climbed = {};
  for (var i = 0; i < 60 * 120 && g.state === 'playing'; i++) {
    var p = g.player;
    var col = Math.floor(player.centerX(p) / T);
    var feetRow = Math.round((p.y + p.height) / T);
    var names = ['right'];
    var ladderHere = room.isLadder(room.tileAt(r, col, feetRow - 1));
    if (p.mode === 'climb' || (p.mode === 'ground' && ladderHere && !climbed[col])) {
      names = ['up'];
      if (p.mode === 'climb') {
        climbed[col] = true;
      }
    } else if (p.mode === 'ground') {
      var ahead = Math.floor((player.centerX(p) + 30) / T);
      var gap = !isSurface(ahead, feetRow);
      var wall = room.isSolid(room.tileAt(r, ahead, feetRow - 1));
      var spikes = room.isSpikes(room.tileAt(r, ahead, feetRow - 1));
      if (gap || wall || spikes) {
        names.push('jump');
      }
    }
    game.step(g, input(names), h.DT);
  }
  assert.strictEqual(g.state, 'goal');
  assert.ok(Object.keys(climbed).length > 0, 'pot vodi po lestvi');
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
