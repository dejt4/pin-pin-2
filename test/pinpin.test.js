'use strict';

var test = require('node:test');
var assert = require('node:assert');
var PinPin = require('../src/js/pinpin.js');

test('register in get vrneta isti modul', function () {
  var registry = PinPin.createRegistry();
  var value = { a: 1 };
  registry.register('core.example', value);
  assert.strictEqual(registry.get('core.example', 'core/example.js'), value);
  assert.strictEqual(registry.has('core.example'), true);
});

test('get nenaloženega modula sproži jasno napako z imenom datoteke', function () {
  var registry = PinPin.createRegistry();
  assert.throws(function () {
    registry.get('core.missing', 'core/missing.js');
  }, /core\.missing.*js\/core\/missing\.js/);
});

test('dvojna registracija sproži napako', function () {
  var registry = PinPin.createRegistry();
  registry.register('x', 1);
  assert.throws(function () {
    registry.register('x', 2);
  }, /že registriran/);
});
