'use strict';

var test = require('node:test');
var assert = require('node:assert');
var room = require('../../src/js/core/room.js');
var player = require('../../src/js/core/player.js');
var animals = require('../../src/js/core/animals.js');
var physics = require('../../src/js/core/physics.js');
var settings = require('../../src/js/config/settings.js');
var h = require('../helpers.js');

var DT = h.DT;
var T = h.T;

function ball(a, dir) {
  return { x: a.x + a.width / 2 - 5, y: a.y + a.height / 2 - 5, width: 10, height: 10, dir: dir || 1, dead: false };
}

function walkFor(list, r, seconds) {
  var positions = [];
  for (var i = 0; i < Math.round(seconds / DT); i++) {
    animals.step(list, r, DT);
    positions.push(list[0].x);
  }
  return positions;
}

test('medved: postavitev na tleh pod znakom', function () {
  var r = h.parseRoom([
    'S........G',
    '....M.....',
    '##########'
  ]);
  var list = animals.create(r);
  var bear = list[0];
  assert.strictEqual(bear.type, 'bear');
  assert.strictEqual(bear.y + bear.height, 2 * T);
  assert.strictEqual(bear.x + bear.width / 2, 4 * T + T / 2);
  assert.ok(bear.height < 100, 'nižji od skoka pingvina');
});

test('medved se obrne na robu prepada', function () {
  var r = h.parseRoom([
    'S........G',
    '...M......',
    '..####....',
    '..........'
  ]);
  var list = animals.create(r);
  var xs = walkFor(list, r, 10);
  var min = Math.min.apply(null, xs);
  var max = Math.max.apply(null, xs);
  assert.ok(min >= 2 * T - 1e-6, 'ne gre čez levi rob');
  assert.ok(max + list[0].width <= 6 * T + 1e-6, 'ne gre čez desni rob');
  assert.ok(max - min > T, 'hodi sem in tja');
});

test('volk se obrne na meji poti, ob zidu in pred konicami', function () {
  var r = h.parseRoom([
    'S...................G',
    '..B.......V......^...',
    '#####################'
  ]);
  var list = animals.create(r);
  var xs = walkFor(list, r, 20);
  var wolf = list[0];
  var range = settings.animals.wolf.range * T;
  assert.ok(Math.min.apply(null, xs) >= wolf.startX - range - 1e-6);
  assert.ok(Math.max.apply(null, xs) <= wolf.startX + range + 1e-6);
  // ob zidu in konicah v bližini
  var near = h.parseRoom([
    'S.......G',
    '..B.V.^..',
    '#########'
  ]);
  var l2 = animals.create(near);
  var xs2 = walkFor(l2, near, 10);
  assert.ok(Math.min.apply(null, xs2) >= 3 * T - 1e-6);
  assert.ok(Math.max.apply(null, xs2) + l2[0].width <= 6 * T + 1e-6);
});

test('volk je hitrejši od medveda', function () {
  assert.ok(settings.animals.wolf.speed > settings.animals.bear.speed);
});

test('kepa obrne medveda, ta se ne ustavi', function () {
  var r = h.parseRoom([
    'S........G',
    '....M.....',
    '##########'
  ]);
  var list = animals.create(r);
  var bear = list[0];
  assert.strictEqual(bear.dir, -1);
  var balls = [ball(bear)];
  var events = animals.hitBy(list, balls);
  assert.strictEqual(balls[0].dead, true);
  assert.deepStrictEqual(events, []);
  assert.strictEqual(bear.dir, 1);
  var x = bear.x;
  animals.step(list, r, DT);
  assert.ok(bear.x > x);
});

test('pingvin preskoči volka', function () {
  var r = h.parseRoom([
    '...................G',
    '.S..........V.......',
    '####################'
  ]);
  var list = animals.create(r);
  var p = player.create(room.startPoint(r));
  var input = h.createInput();
  var caught = false;
  for (var i = 0; i < 300; i++) {
    var wolf = list[0];
    var gap = wolf.x - (p.x + p.width);
    var names = ['right'];
    if (p.mode === 'ground' && gap > 0 && gap < 50) {
      names.push('jump');
    }
    player.step(p, r, input(names), DT);
    animals.step(list, r, DT);
    caught = caught || animals.catches(list, p);
  }
  assert.strictEqual(caught, false);
  assert.ok(p.x > list[0].x + list[0].width, 'pingvin je za volkom');
});

test('dotik medveda se zazna', function () {
  var r = h.parseRoom([
    'S........G',
    '....M.....',
    '##########'
  ]);
  var list = animals.create(r);
  var p = player.create({ x: 4 * T + 20, y: 2 * T });
  assert.strictEqual(animals.catches(list, p), true);
});

test('muha zapira pot do prve podlage pod njo', function () {
  var r = h.parseRoom([
    'S........G',
    '.....u....',
    '.....=....',
    '..........',
    '##########'
  ]);
  var list = animals.create(r);
  var walls = animals.blockers(list);
  assert.strictEqual(walls.length, 1);
  // pod ploščo je prosto
  var below = { x: 5 * T, y: 3 * T, width: 26, height: 40 };
  var above = { x: 5 * T, y: T, width: 26, height: 40 };
  var w = walls[0];
  assert.ok(w.y + w.height <= 2 * T + 1e-6);
  assert.ok(!(below.y < w.y + w.height && below.y + below.height > w.y));
  assert.ok(above.y < w.y + w.height && above.y + above.height > w.y);
});

test('muha: pet zadetkov, vrstica se ne prazni, odlet in prosta pot', function () {
  var r = h.parseRoom([
    'S........G',
    '.....u....',
    '##########'
  ]);
  var list = animals.create(r);
  var fly = list[0];
  var events = [];
  for (var i = 0; i < 2; i++) {
    events = events.concat(animals.hitBy(list, [ball(fly)]));
  }
  // čas mine, zadetki ostanejo
  for (i = 0; i < 600; i++) {
    animals.step(list, r, DT);
  }
  assert.strictEqual(fly.hits, 2);
  for (i = 0; i < 3; i++) {
    events = events.concat(animals.hitBy(list, [ball(fly)]));
  }
  assert.strictEqual(fly.gone, true);
  assert.deepStrictEqual(events, ['fly']);
  assert.strictEqual(animals.blockers(list).length, 0);
  // pregnane muhe kepa ne zadene več
  var b = ball(fly);
  animals.hitBy(list, [b]);
  assert.strictEqual(b.dead, false);
});

test('pingvin se ustavi pred muho in gre naprej, ko je pregnana', function () {
  var r = h.parseRoom([
    '.........G',
    '.S...u....',
    '##########'
  ]);
  var list = animals.create(r);
  var p = player.create(room.startPoint(r));
  var input = h.createInput();
  for (var i = 0; i < 120; i++) {
    player.step(p, r, input(i % 20 === 0 ? ['right', 'jump'] : ['right']), DT, animals.blockers(list));
  }
  assert.ok(p.x + p.width <= 5 * T + 1e-6, 'muha zapira pot tudi pri skoku');
  list[0].gone = true;
  for (i = 0; i < 60; i++) {
    player.step(p, r, input(['right']), DT, animals.blockers(list));
  }
  assert.ok(p.x > 6 * T);
});

test('komarji: vsaka kepa prilepi enega, po treh je pot prosta', function () {
  var r = h.parseRoom([
    'S........G',
    '.....k....',
    '##########'
  ]);
  var list = animals.create(r);
  var group = list[0];
  var events = animals.hitBy(list, [ball(group)]);
  assert.deepStrictEqual(events, ['mosquito']);
  assert.strictEqual(group.stuck, 1);
  assert.strictEqual(animals.blockers(list).length, 1);
  animals.hitBy(list, [ball(group)]);
  events = animals.hitBy(list, [ball(group)]);
  assert.deepStrictEqual(events, ['mosquito']);
  assert.strictEqual(group.stuck, 3);
  assert.strictEqual(animals.blockers(list).length, 0);
});

test('ena kepa zadene samo eno žival', function () {
  var r = h.parseRoom([
    'S........G',
    '.....k....',
    '##########'
  ]);
  var list = animals.create(r);
  var b = ball(list[0]);
  animals.hitBy(list, [b]);
  animals.hitBy(list, [b]);
  assert.strictEqual(list[0].stuck, 1);
});

test('zapora se upošteva v fiziki tudi brez pingvina', function () {
  var r = h.parseRoom([
    'S........G',
    '.....u....',
    '##########'
  ]);
  var walls = animals.blockers(animals.create(r));
  var body = { x: 100, y: 40, width: 26, height: 40 };
  for (var i = 0; i < 100; i++) {
    physics.moveX(r, body, 3, walls);
  }
  assert.strictEqual(body.x + body.width, 5 * T);
});
