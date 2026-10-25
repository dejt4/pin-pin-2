'use strict';

var test = require('node:test');
var assert = require('node:assert');
var fs = require('node:fs');
var path = require('node:path');
var sprites = require('../../src/js/config/sprites.js');
var animConfig = require('../../src/js/config/animations.js');

test('vse datoteke sličic obstajajo', function () {
  Object.keys(sprites.images).forEach(function (name) {
    var file = path.join(__dirname, '..', '..', 'src', sprites.images[name].file);
    assert.ok(fs.existsSync(file), 'manjka ' + sprites.images[name].file);
  });
});

test('vse sličice animacij so na seznamu sličic', function () {
  Object.keys(animConfig.animations).forEach(function (key) {
    animConfig.animations[key].frames.forEach(function (frame) {
      assert.ok(sprites.images[frame], 'animacija ' + key + ': sličica ' + frame + ' ni v config/sprites.js');
    });
  });
});

test('za vsako vrsto hrane je sličica', function () {
  assert.deepStrictEqual(sprites.food, ['apple', 'carrot', 'banana']);
  sprites.food.forEach(function (name) {
    assert.ok(sprites.images[name]);
  });
});

test('za vse živali in ovire so sličice hoje, udarca in stopenj', function () {
  ['bear', 'polar', 'wolf'].forEach(function (animal) {
    [1, 2, 3].forEach(function (n) { assert.ok(sprites.images[animal + '-walk-' + n], animal + ' hoja ' + n); });
    [1, 2].forEach(function (n) { assert.ok(sprites.images[animal + '-push-' + n], animal + ' udarec ' + n); });
  });
  [1, 2, 3, 4, 5].forEach(function (n) { assert.ok(sprites.images['ice-wall-' + n]); });
  [1, 2, 3, 4, 5, 6, 7].forEach(function (n) { assert.ok(sprites.images['icicle-' + n]); });
});
