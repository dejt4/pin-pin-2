'use strict';

var test = require('node:test');
var assert = require('node:assert');
var energy = require('../../src/js/core/energy.js');
var settings = require('../../src/js/config/settings.js');

var DT = settings.step;

function wait(e, seconds) {
  for (var i = 0; i < Math.round(seconds / DT); i++) {
    energy.drain(e, DT);
  }
}

function near(actual, expected, tolerance) {
  assert.ok(Math.abs(actual - expected) <= tolerance, actual + ' ni blizu ' + expected);
}

test('začetna energija je polna', function () {
  var e = energy.create();
  assert.strictEqual(energy.ratio(e), 1);
});

test('upad: po minuti približno pol energije, po dveh minutah nič', function () {
  var e = energy.create();
  wait(e, 60);
  near(energy.ratio(e), 0.5, 0.01);
  wait(e, 61);
  assert.strictEqual(e.value, 0);
  assert.strictEqual(energy.isEmpty(e), true);
});

test('hrana pri polovični energiji da približno tri četrtine', function () {
  var e = energy.create();
  e.value = e.max / 2;
  energy.eatFood(e);
  near(energy.ratio(e), 0.75, 0.001);
});

test('hrana pri polni energiji: energija ostane polna', function () {
  var e = energy.create();
  energy.eatFood(e);
  assert.strictEqual(energy.ratio(e), 1);
});

test('padec v prepad vzame približno 15 %, konice približno 10 %', function () {
  var e = energy.create();
  energy.pitPenalty(e);
  near(energy.ratio(e), 0.85, 0.001);
  var f = energy.create();
  energy.spikesPenalty(f);
  near(energy.ratio(f), 0.9, 0.001);
});

test('energija ne pade pod nič', function () {
  var e = energy.create();
  e.value = 3;
  energy.spikesPenalty(e);
  assert.strictEqual(e.value, 0);
});
