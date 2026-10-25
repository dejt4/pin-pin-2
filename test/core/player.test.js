'use strict';

var test = require('node:test');
var assert = require('node:assert');
var room = require('../../src/js/core/room.js');
var player = require('../../src/js/core/player.js');
var settings = require('../../src/js/config/settings.js');
var h = require('../helpers.js');

var DT = h.DT;
var T = h.T;

function spawn(r) {
  return player.create(room.startPoint(r));
}

// Izvede n korakov z enakimi akcijami.
function run(p, r, input, names, n) {
  for (var i = 0; i < n; i++) {
    player.step(p, r, input(names), DT);
  }
}

function feet(p) {
  return p.y + p.height;
}

var flat = h.parseRoom([
  '...............G',
  '..S.............',
  '################'
]);

test('hoja desno: premik desno, pogled desno, animacija hoje', function () {
  var p = spawn(flat);
  var input = h.createInput();
  var x0 = p.x;
  run(p, flat, input, ['right'], 30);
  assert.ok(Math.abs(p.x - x0 - settings.player.walkSpeed * 0.5) < 1e-6);
  assert.strictEqual(p.facing, 1);
  assert.strictEqual(p.mode, 'ground');
  assert.strictEqual(p.anim, 'walkRight');
});

test('ustavitev: brez akcije pingvin obstane in gleda v zadnjo smer', function () {
  var p = spawn(flat);
  var input = h.createInput();
  run(p, flat, input, ['left'], 10);
  run(p, flat, input, [], 1);
  var x = p.x;
  run(p, flat, input, [], 10);
  assert.strictEqual(p.x, x);
  assert.strictEqual(p.anim, 'standLeft');
});

test('obe smeri hkrati: pingvin stoji', function () {
  var p = spawn(flat);
  var input = h.createInput();
  var x = p.x;
  run(p, flat, input, ['left', 'right'], 10);
  assert.strictEqual(p.x, x);
});

test('gravitacija: hoja čez rob, padanje in pristanek na podlagi spodaj', function () {
  var r = h.parseRoom([
    '..........G',
    '.S.........',
    '####.......',
    '...........',
    '###########'
  ]);
  var p = spawn(r);
  var input = h.createInput();
  var sawAir = false;
  for (var i = 0; i < 120; i++) {
    player.step(p, r, input(['right']), DT);
    sawAir = sawAir || p.mode === 'air';
  }
  assert.ok(sawAir);
  assert.strictEqual(p.mode, 'ground');
  assert.strictEqual(feet(p), 4 * T);
});

test('največja hitrost padanja', function () {
  var r = h.parseRoom(['S.G'].concat(new Array(40).fill('...')).concat(['###']));
  var p = spawn(r);
  p.y -= 1;
  p.mode = 'air';
  run(p, r, h.createInput(), [], 120);
  assert.strictEqual(p.vy, settings.player.maxFallSpeed);
});

test('skok s tal: dvig, vrh in pristanek', function () {
  var p = spawn(flat);
  var input = h.createInput();
  var y0 = p.y;
  var minY = p.y;
  var anims = {};
  player.step(p, flat, input(['jump']), DT);
  assert.strictEqual(p.mode, 'air');
  for (var i = 0; i < 120 && p.mode !== 'ground'; i++) {
    player.step(p, flat, input(['jump']), DT);
    minY = Math.min(minY, p.y);
    anims[p.anim] = true;
  }
  assert.strictEqual(p.mode, 'ground');
  assert.strictEqual(p.y, y0);
  assert.ok(y0 - minY > 2 * T, 'skok je višji od 2 ploščic');
  assert.ok(anims.jumpRising && anims.jumpApex && anims.jumpFalling);
});

test('ni dvojnega skoka in držanje skoka ne skače ponovno', function () {
  var p = spawn(flat);
  var input = h.createInput();
  player.step(p, flat, input(['jump']), DT);
  run(p, flat, input, [], 5);
  var vy = p.vy;
  player.step(p, flat, input(['jump']), DT);
  assert.ok(p.vy > vy, 'v zraku skok ne deluje, gravitacija vleče naprej');
  // drži skok do pristanka in še naprej: brez novega skoka
  run(p, flat, input, ['jump'], 120);
  assert.strictEqual(p.mode, 'ground');
});

test('udarec z glavo: dviganje se ustavi', function () {
  var r = h.parseRoom([
    '.....G',
    '..#...',
    '......',
    '..S...',
    '######'
  ]);
  var p = spawn(r);
  var input = h.createInput();
  player.step(p, r, input(['jump']), DT);
  for (var i = 0; i < 30 && p.vy < 0; i++) {
    player.step(p, r, input([]), DT);
  }
  assert.ok(p.y >= 2 * T, 'glava ne gre v ploščico');
  assert.ok(p.vy >= 0);
});

// Teče desno in skoči, ko je sredina pingvina tik pred robom pri x = edge.
function runAndJump(r, edge) {
  var p = spawn(r);
  var input = h.createInput();
  var jumped = false;
  for (var i = 0; i < 400; i++) {
    var names = ['right'];
    if (!jumped && player.centerX(p) >= edge - 4) {
      names.push('jump');
      jumped = true;
    }
    player.step(p, r, input(names), DT);
    if (p.y > r.height) {
      break;
    }
  }
  return p;
}

test('preskok prepada širine 3 ploščic', function () {
  var r = h.parseRoom([
    '...............G',
    '..S.............',
    '#####...########',
    '#####...########'
  ]);
  var p = runAndJump(r, 5 * T);
  assert.ok(p.y < r.height, 'ni padel v prepad');
  assert.strictEqual(p.mode, 'ground');
  assert.ok(p.x > 8 * T);
});

test('skok na ploščad 2 ploščici višje', function () {
  var r = h.parseRoom([
    '...............G',
    '................',
    '................',
    '.......#########',
    '..S....#########',
    '################'
  ]);
  var p = spawn(r);
  var input = h.createInput();
  for (var i = 0; i < 200; i++) {
    var names = ['right'];
    // ob zidu skoči in drži desno
    if (i === 80) {
      names.push('jump');
    }
    player.step(p, r, input(names), DT);
  }
  assert.strictEqual(p.mode, 'ground');
  assert.strictEqual(feet(p), 3 * T);
  assert.ok(p.x > 7 * T);
});

test('skok skozi ledeno ploščo od spodaj in pristanek na njej', function () {
  var r = h.parseRoom([
    '...............G',
    '................',
    '.====...........',
    '..S.............',
    '################'
  ]);
  var p = spawn(r);
  var input = h.createInput();
  player.step(p, r, input(['jump']), DT);
  run(p, r, input, [], 90);
  assert.strictEqual(p.mode, 'ground');
  assert.strictEqual(feet(p), 2 * T);
});

test('skok levo: sličice so zrcaljene', function () {
  var p = spawn(flat);
  var input = h.createInput();
  player.step(p, flat, input(['left', 'jump']), DT);
  run(p, flat, input, ['left'], 3);
  var f = player.frame(p);
  assert.strictEqual(p.facing, -1);
  assert.strictEqual(f.mirror, true);
  assert.ok(/^jump-/.test(f.image));
});

// Lestve
var ladderRoom = h.parseRoom([
  '...............G',
  '..f.............',
  '...H=====.......',
  '...H............',
  '...H............',
  '.S.H............',
  '################'
]);

function atLadder() {
  var p = spawn(ladderRoom);
  var input = h.createInput();
  // hodi desno, dokler sredina ni v stolpcu lestve
  for (var i = 0; i < 200 && Math.floor(player.centerX(p) / T) !== 3; i++) {
    player.step(p, ladderRoom, input(['right']), DT);
  }
  player.step(p, ladderRoom, input([]), DT);
  return { p: p, input: input };
}

test('plezanje gor in prihod na vrh', function () {
  var s = atLadder();
  var p = s.p;
  player.step(p, ladderRoom, s.input(['up']), DT);
  assert.strictEqual(p.mode, 'climb');
  assert.strictEqual(player.centerX(p), 3 * T + T / 2, 'poravnan na sredino lestve');
  player.step(p, ladderRoom, s.input(['up']), DT);
  assert.strictEqual(p.anim, 'climb');
  assert.strictEqual(player.frame(p).image.indexOf('walk-up'), 0);
  run(p, ladderRoom, s.input, ['up'], 200);
  assert.strictEqual(p.mode, 'ground');
  assert.strictEqual(feet(p), 2 * T, 'stoji na vrhu lestve');
  // hodi naprej po plošči
  run(p, ladderRoom, s.input, ['right'], 30);
  assert.strictEqual(p.mode, 'ground');
  assert.strictEqual(feet(p), 2 * T);
});

test('obvisi na lestvi, ko spusti gor', function () {
  var s = atLadder();
  var p = s.p;
  run(p, ladderRoom, s.input, ['up'], 30);
  var y = p.y;
  run(p, ladderRoom, s.input, [], 30);
  assert.strictEqual(p.mode, 'climb');
  assert.strictEqual(p.y, y);
  assert.strictEqual(p.anim, 'climbIdle');
});

test('spust z vrha lestve do tal', function () {
  var s = atLadder();
  var p = s.p;
  run(p, ladderRoom, s.input, ['up'], 200);
  assert.strictEqual(feet(p), 2 * T);
  player.step(p, ladderRoom, s.input(['down']), DT);
  assert.strictEqual(p.mode, 'climb');
  run(p, ladderRoom, s.input, ['down'], 300);
  assert.strictEqual(p.mode, 'ground');
  assert.strictEqual(feet(p), 6 * T);
});

test('izhod z lestve s skokom in s stranjo', function () {
  var s = atLadder();
  var p = s.p;
  run(p, ladderRoom, s.input, ['up'], 30);
  player.step(p, ladderRoom, s.input(['jump']), DT);
  assert.strictEqual(p.mode, 'air');
  assert.ok(p.vy < 0);

  var t = atLadder();
  run(t.p, ladderRoom, t.input, ['up'], 30);
  player.step(t.p, ladderRoom, t.input(['left']), DT);
  assert.strictEqual(t.p.mode, 'air');
});

test('gor brez lestve: nič se ne zgodi', function () {
  var p = spawn(flat);
  var input = h.createInput();
  var y = p.y;
  run(p, flat, input, ['up'], 20);
  assert.strictEqual(p.mode, 'ground');
  assert.strictEqual(p.y, y);
});

// Animacije
test('izbira animacije: stoja, hoja, odboj, jok, poze', function () {
  var p = spawn(flat);
  var input = h.createInput();
  run(p, flat, input, [], 1);
  assert.strictEqual(p.anim, 'standRight');
  assert.deepStrictEqual(player.frame(p), { image: 'stand-right', mirror: false });

  run(p, flat, input, ['left'], 1);
  assert.strictEqual(player.frame(p).image, 'walk-left-1');
  assert.strictEqual(player.frame(p).mirror, false);

  player.hurt(p, p.x - 100);
  run(p, flat, input, [], 1);
  assert.strictEqual(p.anim, 'hurt');
  // odriv v desno, sličica odboja gleda levo: pogled ostane levo, ni zrcaljenja
  assert.strictEqual(player.frame(p).image, 'bump-left');

  player.setTired(p);
  run(p, flat, input, [], 1);
  assert.strictEqual(player.frame(p).image.indexOf('cry-'), 0);

  p.pose = 'front';
  run(p, flat, input, [], 1);
  assert.strictEqual(player.frame(p).image, 'stand-down');
  p.pose = 'back';
  run(p, flat, input, [], 1);
  assert.strictEqual(player.frame(p).image, 'walk-up-1');
});

test('hoja: sličice se menjajo s časom', function () {
  var p = spawn(flat);
  var input = h.createInput();
  var images = {};
  for (var i = 0; i < 40; i++) {
    player.step(p, flat, input(['right']), DT);
    images[player.frame(p).image] = true;
  }
  assert.ok(images['walk-right-1'] && images['walk-right-2'] && images['walk-right-3']);
});

test('zapora ustavi pingvina pri hoji in skoku', function () {
  var p = spawn(flat);
  var input = h.createInput();
  // zapora sega tudi nad vrh sobe, da je ni mogoče preskočiti
  var wall = [{ x: 6 * T, y: -1000, width: T, height: 1000 + 2 * T }];
  for (var i = 0; i < 120; i++) {
    player.step(p, flat, input(i % 30 === 0 ? ['right', 'jump'] : ['right']), DT, wall);
  }
  assert.ok(p.x + p.width <= 6 * T);
});
