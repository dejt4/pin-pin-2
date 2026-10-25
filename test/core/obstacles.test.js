'use strict';

var test = require('node:test');
var assert = require('node:assert');
var room = require('../../src/js/core/room.js');
var player = require('../../src/js/core/player.js');
var obstacles = require('../../src/js/core/obstacles.js');
var settings = require('../../src/js/config/settings.js');
var h = require('../helpers.js');

var DT = h.DT;
var T = h.T;

function ball(o) {
  return { x: o.x + o.width / 2 - 5, y: o.y + o.height / 2 - 5, width: 10, height: 10, dir: 1, dead: false };
}

function hit(list, o, times) {
  var events = [];
  for (var i = 0; i < times; i++) {
    events = events.concat(obstacles.hitBy(list, [ball(o)]));
  }
  return events;
}

// Pingvin hodi desno in skače; vrne, ali je prišel mimo stolpca col.
function walkPast(r, list, col, steps) {
  var p = player.create(room.startPoint(r));
  var input = h.createInput();
  for (var i = 0; i < steps; i++) {
    player.step(p, r, input(i % 20 === 0 ? ['right', 'up'] : ['right']), DT, obstacles.blockers(list));
  }
  return p.x > (col + 1) * T;
}

var wallRoom = h.parseRoom([
  '.........G',
  '..........',
  '..........',
  '.S...W....',
  '##########'
]);

test('ledeni zid stoji na tleh pod znakom', function () {
  var list = obstacles.create(wallRoom);
  var wall = list[0];
  assert.strictEqual(wall.type, 'wall');
  assert.strictEqual(wall.y + wall.height, 4 * T);
  assert.strictEqual(wall.x + wall.width / 2, 5 * T + T / 2);
});

test('zid ustavi pingvina pri hoji in skoku', function () {
  var list = obstacles.create(wallRoom);
  assert.strictEqual(walkPast(wallRoom, list, 6, 200), false);
});

test('zid: stopnje, zadetki ostanejo, razpad po petih kepah', function () {
  var list = obstacles.create(wallRoom);
  var wall = list[0];
  var events = hit(list, wall, 2);
  assert.strictEqual(wall.hits, 2);
  assert.strictEqual(wall.broken, false);
  assert.strictEqual(obstacles.blockers(list).length, 1, 'počen zid še zapira pot');
  // čas mine, zadetki ostanejo
  for (var i = 0; i < 300; i++) {
    obstacles.step(list, DT);
  }
  events = events.concat(hit(list, wall, 3));
  assert.strictEqual(wall.broken, true);
  assert.deepStrictEqual(events, ['wall']);
  assert.strictEqual(obstacles.blockers(list).length, 0);
  assert.strictEqual(walkPast(wallRoom, list, 6, 200), true);
});

test('kepa izgine ob nerazbitem zidu, skozi razbitega leti naprej', function () {
  var list = obstacles.create(wallRoom);
  var b = ball(list[0]);
  obstacles.hitBy(list, [b]);
  assert.strictEqual(b.dead, true);
  hit(list, list[0], settings.obstacles.wall.hits);
  var c = ball(list[0]);
  obstacles.hitBy(list, [c]);
  assert.strictEqual(c.dead, false);
});

test('razpad zidu teče s časom', function () {
  var list = obstacles.create(wallRoom);
  hit(list, list[0], 5);
  obstacles.step(list, 0.2);
  assert.ok(Math.abs(list[0].breakTime - 0.2) < 1e-9);
});

var icicleRoom = h.parseRoom([
  '.........G',
  '..........',
  '....####..',
  '.....i....',
  '.S........',
  '##########'
]);

test('ledena sveča visi s stropa skoraj do tal', function () {
  var list = obstacles.create(icicleRoom);
  var icicle = list[0];
  assert.strictEqual(icicle.type, 'icicle');
  assert.strictEqual(icicle.y, 3 * T);
  assert.ok(icicle.y + icicle.height < 5 * T);
  assert.ok(icicle.y + icicle.height > 5 * T - 20, 'kepa z višine prsi jo zadene');
});

test('sveča zapira pot pod stropom, nad stropom ne', function () {
  var list = obstacles.create(icicleRoom);
  var wall = obstacles.blockers(list)[0];
  assert.strictEqual(wall.y, 3 * T);
  assert.strictEqual(wall.y + wall.height, 5 * T);
  assert.strictEqual(walkPast(icicleRoom, list, 6, 200), false);
});

test('sveča: ena kepa jo načne, tretja jo odlomi', function () {
  var list = obstacles.create(icicleRoom);
  var icicle = list[0];
  assert.deepStrictEqual(hit(list, icicle, 1), []);
  assert.strictEqual(icicle.hits, 1);
  assert.strictEqual(obstacles.blockers(list).length, 1);
  assert.deepStrictEqual(hit(list, icicle, 2), ['icicle']);
  assert.strictEqual(icicle.broken, true);
  assert.strictEqual(walkPast(icicleRoom, list, 6, 200), true);
});

test('kepa z višine prsi pingvina zadene svečo', function () {
  var list = obstacles.create(icicleRoom);
  var p = player.create(room.startPoint(icicleRoom));
  var b = { x: 5 * T + 10, y: p.y + settings.snowball.chest, width: 10, height: 10, dir: 1, dead: false };
  obstacles.hitBy(list, [b]);
  assert.strictEqual(b.dead, true);
});
