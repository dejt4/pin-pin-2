'use strict';

var test = require('node:test');
var assert = require('node:assert');
var game = require('../../src/js/core/game.js');
var player = require('../../src/js/core/player.js');
var energy = require('../../src/js/core/energy.js');
var settings = require('../../src/js/config/settings.js');
var h = require('../helpers.js');

var DT = h.DT;
var T = h.T;

function room(rows) {
  return { name: 'test', rows: rows };
}

// 30 stolpcev: hrana, konice, prepad 3 ploščic in cilj
var source = room([
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '.S..f.....^..........G........',
  '##################...#########',
  '##################...#########'
]);

function playing(src) {
  var g = game.create(src || source);
  var input = h.createInput();
  game.step(g, input(['jump']), DT);
  game.step(g, input([]), DT);
  assert.strictEqual(g.state, 'playing');
  return { g: g, input: input };
}

function run(s, names, n) {
  for (var i = 0; i < n; i++) {
    game.step(s.g, s.input(names), DT);
  }
}

// Stanja igre

test('igra se začne na začetnem zaslonu s pingvinom od spredaj', function () {
  var g = game.create(source);
  game.step(g, h.createInput()([]), DT);
  assert.strictEqual(g.state, 'start');
  assert.strictEqual(player.frame(g.player).image, 'stand-down');
});

test('katerakoli akcija na začetnem zaslonu začne igranje s polno energijo', function () {
  var g = game.create(source);
  var input = h.createInput();
  game.step(g, input(['left']), DT);
  assert.strictEqual(g.state, 'playing');
  assert.strictEqual(energy.ratio(g.energy), 1);
  assert.strictEqual(Object.keys(g.collected).length, 0);
});

test('energija ne upada na začetnem zaslonu', function () {
  var g = game.create(source);
  var input = h.createInput();
  for (var i = 0; i < 600; i++) {
    game.step(g, input([]), DT);
  }
  assert.strictEqual(energy.ratio(g.energy), 1);
});

// Ribe

test('pobiranje hrane: izgine in doda energijo', function () {
  var s = playing();
  s.g.energy.value = 50;
  run(s, ['right'], 60);
  assert.strictEqual(s.g.collected[0], true);
  assert.ok(s.g.energy.value > 70);
});

// Konice

test('dotik konic: izguba energije, odriv nazaj, utripanje', function () {
  var s = playing();
  var hit = false;
  for (var i = 0; i < 300 && !hit; i++) {
    var before = s.g.energy.value;
    game.step(s.g, s.input(['right']), DT);
    hit = s.g.player.mode === 'hurt';
    if (hit) {
      var lost = before - s.g.energy.value;
      assert.ok(Math.abs(lost - settings.energy.spikesPenalty) < 0.1);
    }
  }
  assert.ok(hit, 'pingvin se je dotaknil konic');
  assert.ok(s.g.player.vx < 0, 'odrinjen nazaj (levo)');
  assert.ok(s.g.player.vy < 0, 'in navzgor');
  assert.ok(s.g.player.invulnerable > 0);
});

test('neranljivost: ponoven dotik konic med utripanjem ne vzame energije', function () {
  var s = playing();
  for (var i = 0; i < 300 && s.g.player.mode !== 'hurt'; i++) {
    game.step(s.g, s.input(['right']), DT);
  }
  var after = s.g.energy.value;
  // takoj nazaj na konice
  run(s, ['right'], 40);
  assert.ok(s.g.player.invulnerable > 0);
  assert.ok(after - s.g.energy.value < 1, 'samo upad s časom');
});

test('konice vzamejo zadnjo energijo: pingvin se utrudi', function () {
  var s = playing();
  // mimo hrane, nato malo energije
  run(s, ['right'], 80);
  s.g.energy.value = 5;
  for (var i = 0; i < 300 && s.g.state === 'playing'; i++) {
    game.step(s.g, s.input(['right']), DT);
  }
  assert.strictEqual(s.g.state, 'tired');
  assert.strictEqual(s.g.energy.value, 0);
});

// Prepad

function fallIntoPit(s) {
  // postavi pingvina nad prepad (stolpca 18–20)
  player.placeAt(s.g.player, { x: 19 * T + T / 2, y: 7 * T });
  s.g.player.mode = 'air';
  for (var i = 0; i < 200; i++) {
    var y = s.g.player.y;
    game.step(s.g, s.input([]), DT);
    if (s.g.player.y < y) {
      return;
    }
  }
}

test('padec v prepad: varno mesto en zaslon nazaj in manj energije', function () {
  var s = playing();
  var before = s.g.energy.value;
  fallIntoPit(s);
  var p = s.g.player;
  assert.strictEqual(p.mode, 'ground');
  assert.ok(player.centerX(p) <= 19 * T - 16 * T + T, 'vsaj en zaslon levo');
  assert.strictEqual(p.y + p.height, 7 * T, 'stoji na tleh');
  var lost = before - s.g.energy.value;
  assert.ok(Math.abs(lost - settings.energy.pitPenalty) < 1);
});

test('pobrana hrana ostane pobrana po padcu v prepad', function () {
  var s = playing();
  run(s, ['right'], 60);
  assert.strictEqual(s.g.collected[0], true);
  fallIntoPit(s);
  assert.strictEqual(s.g.collected[0], true);
});

// Utrujenost

test('energija pade na nič: utrujenost, jok, brez gibanja', function () {
  var s = playing();
  s.g.energy.value = 0.001;
  run(s, [], 2);
  assert.strictEqual(s.g.state, 'tired');
  var x = s.g.player.x;
  run(s, ['right', 'jump'], 30);
  assert.strictEqual(s.g.player.x, x);
  assert.strictEqual(s.g.player.anim, 'tired');
  assert.strictEqual(energy.ratio(s.g.energy), 0);
});

test('prezgodnji pritisk po utrujenosti ne začne znova', function () {
  var s = playing();
  s.g.energy.value = 0.001;
  run(s, [], 2);
  run(s, [], 10);
  game.step(s.g, s.input(['up']), DT);
  assert.strictEqual(s.g.state, 'tired');
  assert.strictEqual(game.restartReady(s.g), false);
});

test('ponoven začetek po utrujenosti: soba od začetka', function () {
  var s = playing();
  run(s, ['right'], 60);
  s.g.energy.value = 0.001;
  run(s, [], 2);
  run(s, [], Math.ceil(settings.flow.restartDelay / DT) + 1);
  assert.strictEqual(game.restartReady(s.g), true);
  game.step(s.g, s.input(['up']), DT);
  assert.strictEqual(s.g.state, 'playing');
  assert.strictEqual(energy.ratio(s.g.energy), 1);
  assert.strictEqual(Object.keys(s.g.collected).length, 0);
  assert.strictEqual(Math.floor(player.centerX(s.g.player) / T), 1);
});

// Cilj

function reachGoal() {
  var src = room([
    '..........',
    '.S......G.',
    '##########'
  ]);
  var s = playing(src);
  for (var i = 0; i < 400 && s.g.state === 'playing'; i++) {
    game.step(s.g, s.input(['right']), DT);
  }
  return s;
}

test('prihod do cilja: Bravo, pingvin od zadaj, se ne premika, energija ne upada', function () {
  var s = reachGoal();
  assert.strictEqual(s.g.state, 'goal');
  var x = s.g.player.x;
  var e = s.g.energy.value;
  run(s, ['right'], 60);
  assert.strictEqual(s.g.player.x, x);
  assert.strictEqual(s.g.energy.value, e);
  assert.strictEqual(player.frame(s.g.player).image, 'walk-up-1');
});

test('ponovno igranje po cilju po 2 sekundah', function () {
  var s = reachGoal();
  run(s, [], 10);
  game.step(s.g, s.input(['left']), DT);
  assert.strictEqual(s.g.state, 'goal');
  run(s, [], Math.ceil(settings.flow.restartDelay / DT));
  game.step(s.g, s.input(['left']), DT);
  assert.strictEqual(s.g.state, 'playing');
});

// Kamera v igri

test('kamera sledi pingvinu in ostane v sobi', function () {
  var s = playing();
  assert.strictEqual(s.g.cameraX, 0);
  player.placeAt(s.g.player, { x: 25 * T, y: 7 * T });
  run(s, [], 1);
  assert.strictEqual(s.g.cameraX, s.g.room.width - settings.screen.width);
});

// Kepe, ovire, živali in točke

// 40 stolpcev: kup, ledeni zid, strop z ledeno svečo, prepad, volk
var zoo = room([
  '........................................',
  '........................................',
  '........................................',
  '........................................',
  '..........####..........................',
  '...........i............................',
  '.S.*...W...........*....V.............G.',
  '##################...###################',
  '##################...###################'
]);

function standAtPile(s) {
  for (var i = 0; i < 100 && !s.g.snow.atPile; i++) {
    game.step(s.g, s.input(['right']), DT);
  }
  run(s, [], 1);
  assert.strictEqual(s.g.snow.atPile, true);
}

// vrže n kep z dovolj časa, da priletijo do cilja
function throwMany(s, n) {
  for (var i = 0; i < n; i++) {
    game.step(s.g, s.input(['throw']), DT);
    run(s, [], 60);
  }
}

test('ledeni zid s kupa: pet kep, razpad in 3 točke', function () {
  var s = playing(zoo);
  standAtPile(s);
  throwMany(s, 4);
  assert.strictEqual(s.g.obstacles[1].hits, 4);
  assert.strictEqual(s.g.score, 0);
  throwMany(s, 1);
  assert.strictEqual(s.g.obstacles[1].broken, true);
  assert.strictEqual(s.g.score, settings.score.wall);
});

test('pingvin se ustavi pred celim zidom', function () {
  var s = playing(zoo);
  run(s, ['right'], 200);
  var wall = s.g.obstacles[1];
  assert.ok(s.g.player.x + s.g.player.width <= wall.x + 1e-6);
});

test('ledena sveča: tri kepe in 1 točka', function () {
  var s = playing(zoo);
  var icicle = s.g.obstacles[0];
  s.g.obstacles[1].broken = true;
  // k kupu za zidom (stolpec 19) ne gre, sveča je pred njim: pingvin vzame kepo s prvega kupa
  standAtPile(s);
  throwMany(s, 3);
  assert.strictEqual(icicle.broken, true);
  assert.strictEqual(s.g.score, settings.score.icicle);
});

test('točke in razbite ovire ostanejo po padcu v prepad, nošena kepa tudi', function () {
  var s = playing(zoo);
  standAtPile(s);
  throwMany(s, 5);
  run(s, ['right'], 30);
  assert.strictEqual(s.g.snow.carrying, true);
  fallIntoPit(s);
  assert.strictEqual(s.g.score, settings.score.wall);
  assert.strictEqual(s.g.obstacles[1].broken, true);
  assert.strictEqual(s.g.snow.carrying, true);
});

test('ponovni začetek: točke nič, ovire cele, živali na mestu, brez kepe', function () {
  var s = playing(zoo);
  standAtPile(s);
  throwMany(s, 5);
  run(s, ['right'], 30);
  s.g.energy.value = 0.001;
  run(s, [], 2);
  run(s, [], Math.ceil(settings.flow.restartDelay / DT) + 1);
  game.step(s.g, s.input(['up']), DT);
  assert.strictEqual(s.g.state, 'playing');
  assert.strictEqual(s.g.score, 0);
  assert.strictEqual(s.g.obstacles[1].broken, false);
  assert.strictEqual(s.g.obstacles[1].hits, 0);
  assert.strictEqual(s.g.snow.carrying, false);
  assert.strictEqual(s.g.animals[0].x, s.g.animals[0].startX);
});

test('ulov volka: udarec, nazaj en zaslon, približno 15 % energije manj, neranljivost', function () {
  var s = playing(zoo);
  var wolf = s.g.animals[0];
  player.placeAt(s.g.player, { x: wolf.x + wolf.width / 2, y: 7 * T });
  var before = s.g.energy.value;
  run(s, [], 1);
  var p = s.g.player;
  assert.ok(player.centerX(p) <= wolf.x + wolf.width - 16 * T + T, 'vsaj en zaslon nazaj');
  assert.ok(Math.abs(before - s.g.energy.value - settings.energy.caughtPenalty) < 0.1);
  assert.ok(p.invulnerable > 0);
  assert.ok(wolf.pushTime > 0, 'volk pokaže udarec');
});
