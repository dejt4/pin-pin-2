'use strict';

var test = require('node:test');
var assert = require('node:assert');
var room = require('../../src/js/core/room.js');
var physics = require('../../src/js/core/physics.js');

var T = 40;

function parse(rows) {
  return room.parse({ name: 'test', rows: rows }, T);
}

function body(x, y) {
  return { x: x, y: y, width: 26, height: 40 };
}

var r = parse([
  'S.......G',
  '.........',
  '...===...',
  '.........',
  '.....B...',
  '#########'
]);

test('zid: telo se ustavi ob ledeni kocki', function () {
  var b = body(150, 160);
  var hit = false;
  for (var i = 0; i < 20; i++) {
    hit = physics.moveX(r, b, 3) || hit;
  }
  assert.strictEqual(hit, true);
  assert.strictEqual(b.x + b.width, 5 * T);
});

test('zid z leve: telo se ustavi na desni strani kocke', function () {
  var b = body(250, 160);
  for (var i = 0; i < 20; i++) {
    physics.moveX(r, b, -3);
  }
  assert.strictEqual(b.x, 6 * T);
});

test('rob sobe: telo ne gre čez levi ali desni rob', function () {
  var b = body(5, 160);
  assert.strictEqual(physics.moveX(r, b, -10), true);
  assert.strictEqual(b.x, 0);
  var c = body(r.width - 30, 160);
  physics.moveX(r, c, 10);
  assert.strictEqual(c.x + c.width, r.width);
});

test('pristanek na tleh', function () {
  var b = body(10, 100);
  var res;
  for (var i = 0; i < 30; i++) {
    res = physics.moveY(r, b, 8, true);
    if (res.landed) { break; }
  }
  assert.strictEqual(res.landed, true);
  assert.strictEqual(b.y + b.height, 5 * T);
});

test('stoječe telo ob padanju takoj pristane (ostane na tleh)', function () {
  var b = body(10, 5 * T - 40);
  var res = physics.moveY(r, b, 0.5, true);
  assert.strictEqual(res.landed, true);
  assert.strictEqual(b.y + b.height, 5 * T);
});

test('udarec z glavo ob trdno ploščico', function () {
  // telo pod kocko v stolpcu 5, ki stoji na vrstici 4: glava gre gor proti tlom? uporabi novo sobo
  var s = parse([
    'S...G',
    '..#..',
    '.....',
    '.....',
    '#####'
  ]);
  var b = body(85, 110);
  var res;
  for (var i = 0; i < 10; i++) {
    res = physics.moveY(s, b, -8, true);
    if (res.bumped) { break; }
  }
  assert.strictEqual(res.bumped, true);
  assert.strictEqual(b.y, 2 * T);
});

test('ledena plošča: od spodaj skozi, od zgoraj pristanek', function () {
  // telo pod ploščo v vrstici 2 gre gor skozi
  var b = body(130, 130);
  physics.moveY(r, b, -100, true);
  assert.strictEqual(b.y, 30);
  // nato pada nanjo in pristane na njenem vrhu
  var res;
  for (var i = 0; i < 10; i++) {
    res = physics.moveY(r, b, 5, true);
    if (res.landed) { break; }
  }
  assert.strictEqual(res.landed, true);
  assert.strictEqual(b.y + b.height, 2 * T);
});

test('ledena plošča: brez enosmernih podlag (plezanje) gre telo skozi', function () {
  var b = body(130, 40);
  var res = physics.moveY(r, b, 10, false);
  assert.strictEqual(res.landed, false);
  assert.strictEqual(b.y, 50);
});

test('vrh lestve je enosmerna podlaga', function () {
  var s = parse([
    'S...G',
    '..H..',
    '..H..',
    '#####'
  ]);
  var b = body(87, 0);
  var res = physics.moveY(s, b, 5, true);
  assert.strictEqual(res.landed, true);
  assert.strictEqual(b.y + b.height, T);
});

test('zapora ustavi telo z obeh strani', function () {
  var open = parse([
    'S........G',
    '..........',
    '##########'
  ]);
  var wall = [{ x: 200, y: 0, width: 40, height: 80 }];
  var b = body(100, 40);
  for (var i = 0; i < 40; i++) {
    physics.moveX(open, b, 3, wall);
  }
  assert.strictEqual(b.x + b.width, 200);
  var c = body(300, 40);
  for (i = 0; i < 40; i++) {
    physics.moveX(open, c, -3, wall);
  }
  assert.strictEqual(c.x, 240);
});

test('zapora ne ustavi telesa, ki je nad ali pod njo', function () {
  var open = parse([
    'S........G',
    '..........',
    '##########'
  ]);
  var wall = [{ x: 200, y: 0, width: 40, height: 30 }];
  var b = body(100, 40);
  for (var i = 0; i < 60; i++) {
    physics.moveX(open, b, 3, wall);
  }
  assert.ok(b.x > 240);
});
