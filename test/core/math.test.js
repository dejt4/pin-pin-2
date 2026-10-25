'use strict';

var test = require('node:test');
var assert = require('node:assert');
var math = require('../../src/js/core/math.js');
var settings = require('../../src/js/config/settings.js');

test('clamp omeji vrednost na interval', function () {
  assert.strictEqual(math.clamp(5, 0, 10), 5);
  assert.strictEqual(math.clamp(-1, 0, 10), 0);
  assert.strictEqual(math.clamp(11, 0, 10), 10);
});

test('sign vrne -1, 0 ali 1', function () {
  assert.strictEqual(math.sign(-3), -1);
  assert.strictEqual(math.sign(0), 0);
  assert.strictEqual(math.sign(2), 1);
});

test('overlaps: prekrivanje da, dotik robov ne', function () {
  var a = { x: 0, y: 0, width: 10, height: 10 };
  assert.strictEqual(math.overlaps(a, { x: 5, y: 5, width: 10, height: 10 }), true);
  assert.strictEqual(math.overlaps(a, { x: 10, y: 0, width: 10, height: 10 }), false);
});

test('nastavitve: zaslon je 16 × 9 ploščic', function () {
  assert.strictEqual(settings.screen.width / settings.tileSize, 16);
  assert.strictEqual(settings.screen.height / settings.tileSize, 9);
});

test('nastavitve: padanje je počasnejše od ene ploščice na korak', function () {
  assert.ok(settings.player.maxFallSpeed * settings.step < settings.tileSize);
});
