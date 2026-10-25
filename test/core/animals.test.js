'use strict';

var test = require('node:test');
var assert = require('node:assert');
var room = require('../../src/js/core/room.js');
var player = require('../../src/js/core/player.js');
var animals = require('../../src/js/core/animals.js');
var obstacles = require('../../src/js/core/obstacles.js');
var settings = require('../../src/js/config/settings.js');
var h = require('../helpers.js');

var DT = h.DT;
var T = h.T;

function ball(a) {
  return { x: a.x + a.width / 2 - 5, y: a.y + a.height / 2 - 5, width: 10, height: 10, dir: 1, dead: false };
}

function walkFor(list, r, seconds, blockers) {
  var positions = [];
  for (var i = 0; i < Math.round(seconds / DT); i++) {
    animals.step(list, r, DT, blockers);
    positions.push(list[0].x);
  }
  return positions;
}

test('medvedi in volk: postavitev na tleh pod znakom', function () {
  var r = h.parseRoom([
    'S........G',
    '..M..P..V.',
    '##########'
  ]);
  var list = animals.create(r);
  assert.deepStrictEqual(list.map(function (a) { return a.type; }), ['bear', 'polar', 'wolf']);
  list.forEach(function (a) {
    assert.strictEqual(a.y + a.height, 2 * T);
  });
  assert.strictEqual(list[0].x + list[0].width / 2, 2 * T + T / 2);
  assert.ok(list[0].height < 100 && list[1].height < 100, 'nižja od skoka pingvina');
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

test('beli medved se obrne pred celim ledenim zidom, za razbitim gre naprej', function () {
  var r = h.parseRoom([
    'S..........G',
    '..W..P......',
    '############'
  ]);
  var list = animals.create(r);
  var obs = obstacles.create(r);
  var xs = walkFor(list, r, 10, obstacles.blockers(obs));
  var wall = obstacles.blockers(obs)[0];
  assert.ok(Math.min.apply(null, xs) >= wall.x + wall.width - 1e-6);
});

test('volk je hitrejši od medvedov, beli medved je kot rjavi', function () {
  assert.ok(settings.animals.wolf.speed > settings.animals.bear.speed);
  assert.deepStrictEqual(settings.animals.polar, settings.animals.bear);
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
  animals.hitBy(list, balls);
  assert.strictEqual(balls[0].dead, true);
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
      names.push('up');
    }
    player.step(p, r, input(names), DT);
    animals.step(list, r, DT);
    caught = caught || animals.catcher(list, p) !== null;
  }
  assert.strictEqual(caught, false);
  assert.ok(p.x > list[0].x + list[0].width, 'pingvin je za volkom');
});

test('ulov: žival se dotika pingvina, udari in za kratek čas obstane', function () {
  var r = h.parseRoom([
    'S........G',
    '....M.....',
    '##########'
  ]);
  var list = animals.create(r);
  var p = player.create({ x: 4 * T + 20, y: 2 * T });
  var bear = animals.catcher(list, p);
  assert.strictEqual(bear, list[0]);
  animals.push(bear);
  var x = bear.x;
  walkFor(list, r, settings.animals.pushTime - 0.05);
  assert.strictEqual(bear.x, x, 'med udarcem stoji');
  walkFor(list, r, 0.2);
  assert.notStrictEqual(bear.x, x, 'nato hodi naprej');
});

test('čas hoje teče samo med hojo', function () {
  var r = h.parseRoom([
    'S........G',
    '....V.....',
    '##########'
  ]);
  var list = animals.create(r);
  walkFor(list, r, 0.5);
  var t = list[0].walkTime;
  assert.ok(t > 0.4);
  animals.push(list[0]);
  walkFor(list, r, 0.2);
  assert.strictEqual(list[0].walkTime, t);
});
