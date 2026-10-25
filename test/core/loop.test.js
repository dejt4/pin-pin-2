'use strict';

var test = require('node:test');
var assert = require('node:assert');
var loop = require('../../src/js/core/loop.js');
var room = require('../../src/js/core/room.js');
var player = require('../../src/js/core/player.js');
var settings = require('../../src/js/config/settings.js');
var h = require('../helpers.js');

var STEP = settings.step;

test('60 sličic na sekundo: en korak na sličico', function () {
  var clock = loop.createClock();
  var total = 0;
  for (var i = 0; i < 60; i++) {
    total += loop.advance(clock, 1 / 60, STEP, 5);
  }
  assert.strictEqual(total, 60);
});

test('30 sličic na sekundo: dva koraka na sličico', function () {
  var clock = loop.createClock();
  var total = 0;
  for (var i = 0; i < 30; i++) {
    total += loop.advance(clock, 1 / 30, STEP, 5);
  }
  assert.strictEqual(total, 60);
});

test('dolg zatik izvede največ maxSteps korakov', function () {
  var clock = loop.createClock();
  assert.strictEqual(loop.advance(clock, 2, STEP, 5), 5);
  assert.strictEqual(clock.accumulator, 0);
});

// Ena sekunda hoje desno s skokom pri dani hitrosti sličic.
function simulate(fps) {
  var r = h.parseRoom([
    '...............G',
    '..S.............',
    '################'
  ]);
  var p = player.create(room.startPoint(r));
  var input = h.createInput();
  var clock = loop.createClock();
  var stepIndex = 0;
  for (var frame = 0; frame < fps; frame++) {
    var steps = loop.advance(clock, 1 / fps, STEP, settings.maxStepsPerFrame);
    for (var s = 0; s < steps; s++) {
      player.step(p, r, input(stepIndex === 10 ? ['right', 'jump'] : ['right']), STEP);
      stepIndex++;
    }
  }
  return { x: p.x, y: p.y, steps: stepIndex };
}

test('pot pingvina je enaka pri 30 in 60 sličicah na sekundo', function () {
  var a = simulate(60);
  var b = simulate(30);
  assert.strictEqual(a.steps, 60);
  assert.deepStrictEqual(a, b);
});
