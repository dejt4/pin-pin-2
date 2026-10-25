'use strict';

var test = require('node:test');
var assert = require('node:assert');
var camera = require('../../src/js/core/camera.js');
var settings = require('../../src/js/config/settings.js');

var W = settings.screen.width;
var ROOM = 6 * W;

test('začetek sobe: kamera na levem robu, pingvin levo od sredine', function () {
  assert.strictEqual(camera.follow(ROOM, 100), 0);
});

test('sredina sobe: pingvin na sredini zaslona', function () {
  var x = camera.follow(ROOM, 2000);
  assert.strictEqual(2000 - x, W / 2);
});

test('konec sobe: desni rob sobe na desnem robu zaslona', function () {
  assert.strictEqual(camera.follow(ROOM, ROOM - 50), ROOM - W);
});

test('paralaksa: ozadje se pomakne manj kot ploščice', function () {
  var offset = camera.backgroundOffset(W);
  assert.ok(offset > 0 && offset < W);
});
