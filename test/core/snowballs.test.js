'use strict';

var test = require('node:test');
var assert = require('node:assert');
var room = require('../../src/js/core/room.js');
var player = require('../../src/js/core/player.js');
var snowballs = require('../../src/js/core/snowballs.js');
var settings = require('../../src/js/config/settings.js');
var h = require('../helpers.js');

var DT = h.DT;
var T = h.T;

// kup v stolpcu 3, zid v stolpcu 12
var r = h.parseRoom([
  '...............G',
  '...........B....',
  '..S*........B...',
  '################'
]);

function setup() {
  var p = player.create(room.startPoint(r));
  var s = snowballs.createState();
  var input = h.createInput();
  return { p: p, s: s, input: input };
}

// en korak pingvina in kep
function step(t, names) {
  var act = t.input(names);
  player.step(t.p, r, act, DT);
  snowballs.update(t.s, t.p, r, act, DT, 0);
}

function run(t, names, n) {
  for (var i = 0; i < n; i++) {
    step(t, names);
  }
}

function walkToPile(t) {
  for (var i = 0; i < 100 && !t.s.atPile; i++) {
    step(t, ['right']);
  }
  step(t, []);
  assert.strictEqual(t.s.atPile, true);
}

test('hoja skozi kup snega', function () {
  var t = setup();
  run(t, ['right'], 60);
  assert.ok(t.p.x > 4 * T, 'kup ni ovira');
});

test('začetek sobe: pingvin nima kepe in brez kupa ne meče', function () {
  var t = setup();
  assert.strictEqual(t.s.carrying, false);
  step(t, ['throw']);
  assert.strictEqual(t.s.balls.length, 0);
});

test('ob kupu: pet metov s premori', function () {
  var t = setup();
  walkToPile(t);
  var thrown = 0;
  for (var i = 0; i < 5; i++) {
    step(t, ['throw']);
    thrown += 1;
    run(t, [], 25);
  }
  assert.strictEqual(thrown, 5);
  assert.strictEqual(t.s.atPile, true);
});

test('ob kupu: prehitro pritiskanje vrže samo eno kepo', function () {
  var t = setup();
  walkToPile(t);
  step(t, ['throw']);
  step(t, []);
  step(t, ['throw']);
  assert.strictEqual(t.s.balls.length, 1);
});

test('odhod od kupa: ena nošena kepa, ki se porabi', function () {
  var t = setup();
  walkToPile(t);
  run(t, ['right'], 40);
  assert.strictEqual(t.s.atPile, false);
  assert.strictEqual(t.s.carrying, true);
  step(t, ['throw']);
  assert.strictEqual(t.s.balls.length, 1);
  assert.strictEqual(t.s.carrying, false);
  run(t, [], 30);
  step(t, ['throw']);
  assert.ok(t.s.balls.length <= 1, 'brez kepe ni novega meta');
});

test('kepa leti v smer pogleda', function () {
  var t = setup();
  walkToPile(t);
  run(t, ['left'], 1);
  run(t, [], 1);
  step(t, ['throw']);
  var x = t.s.balls[0].x;
  run(t, [], 5);
  assert.ok(t.s.balls[0].x < x);
  assert.strictEqual(t.s.balls[0].dir, -1);
});

test('kepa leti vodoravno z višine prsi in izgine ob ledeni kocki', function () {
  var t = setup();
  walkToPile(t);
  step(t, ['throw']);
  var ball = t.s.balls[0];
  assert.strictEqual(ball.y, t.p.y + settings.snowball.chest);
  var y = ball.y;
  for (var i = 0; i < 200 && t.s.balls.length > 0; i++) {
    step(t, []);
    if (t.s.balls.length) {
      assert.strictEqual(t.s.balls[0].y, y);
      assert.ok(t.s.balls[0].x + t.s.balls[0].width <= 12 * T + 1);
    }
  }
  assert.strictEqual(t.s.balls.length, 0);
});

test('kepa izgine, ko zapusti vidni del sobe', function () {
  var open = h.parseRoom([
    '.................................G',
    '..S*..............................',
    '##################################'
  ]);
  var p = player.create(room.startPoint(open));
  var s = snowballs.createState();
  var input = h.createInput();
  for (var i = 0; i < 30; i++) {
    var a = input(i === 20 ? ['throw'] : (s.atPile ? [] : ['right']));
    player.step(p, open, a, DT);
    snowballs.update(s, p, open, a, DT, 0);
  }
  assert.strictEqual(s.balls.length, 1);
  for (i = 0; i < 200 && s.balls.length; i++) {
    snowballs.update(s, p, open, input([]), DT, 0);
    if (s.balls.length) {
      assert.ok(s.balls[0].x <= settings.screen.width);
    }
  }
  assert.strictEqual(s.balls.length, 0);
});

test('med plezanjem ni meta', function () {
  var lr = h.parseRoom([
    '......G',
    '..H====',
    '..H....',
    '.SH*...',
    '#######'
  ]);
  var p = player.create(room.startPoint(lr));
  var s = snowballs.createState();
  s.carrying = true;
  var input = h.createInput();
  for (var i = 0; i < 40 && p.mode !== 'climb'; i++) {
    var a = input(i < 20 ? ['right'] : ['up']);
    player.step(p, lr, a, DT);
    snowballs.update(s, p, lr, a, DT, 0);
  }
  // poravnaj na lestev in pleži
  p.x = 2 * T + T / 2 - p.width / 2;
  p.mode = 'climb';
  p.ladderCol = 2;
  var act = input(['throw']);
  snowballs.update(s, p, lr, act, DT, 0);
  assert.strictEqual(s.balls.length, 0);
  assert.strictEqual(s.carrying, true);
});

test('animacija meta traja približno 0,25 s', function () {
  var t = setup();
  walkToPile(t);
  step(t, ['throw']);
  step(t, []);
  assert.strictEqual(t.p.anim, 'throw');
  assert.strictEqual(player.frame(t.p).image, 'jump-takeoff');
  run(t, [], Math.ceil(settings.snowball.throwTime / DT) + 1);
  assert.notStrictEqual(t.p.anim, 'throw');
});
