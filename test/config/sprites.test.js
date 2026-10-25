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

test('za vsako barvo ribe je sličica', function () {
  assert.strictEqual(sprites.fish.length, 4);
  sprites.fish.forEach(function (name) {
    assert.ok(sprites.images[name]);
  });
});
