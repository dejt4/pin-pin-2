'use strict';

var test = require('node:test');
var assert = require('node:assert');
var actions = require('../../src/js/core/actions.js');
var controls = require('../../src/js/config/controls.js');

function pad(buttons, axes) {
  var b = [];
  for (var i = 0; i < 16; i++) {
    b.push(buttons.indexOf(i) !== -1);
  }
  return { buttons: b, axes: axes || [0, 0] };
}

test('akcije so natanko left, right, up, down, jump, throw', function () {
  assert.deepStrictEqual(actions.NAMES, ['left', 'right', 'up', 'down', 'jump', 'throw']);
});

test('tipkovnica: puščice, Y in X', function () {
  var s = actions.read(controls, { 37: true, 38: true, 39: true, 40: true, 89: true, 88: true }, [], null);
  assert.deepStrictEqual(s.down, { left: true, right: true, up: true, down: true, jump: true, throw: true });
});

test('tipkovnica: neznana tipka ne sproži akcije', function () {
  var s = actions.read(controls, { 65: true }, [], null);
  assert.strictEqual(actions.anyPressed(s), false);
});

test('hoja s puščico: right je aktiven, dokler se drži', function () {
  var s1 = actions.read(controls, { 39: true }, [], null);
  var s2 = actions.read(controls, { 39: true }, [], s1);
  var s3 = actions.read(controls, {}, [], s2);
  assert.strictEqual(s1.down.right, true);
  assert.strictEqual(s2.down.right, true);
  assert.strictEqual(s3.down.right, false);
});

test('kontroler: × je skok, □ je kepa, križec so smeri', function () {
  var s = actions.read(controls, {}, [pad([0, 2, 14])], null);
  assert.strictEqual(s.down.jump, true);
  assert.strictEqual(s.down.throw, true);
  assert.strictEqual(s.down.left, true);
  assert.strictEqual(s.down.right, false);
});

test('kontroler: palčka nad mrtvo cono sproži smer', function () {
  var s = actions.read(controls, {}, [pad([], [0.9, -0.8])], null);
  assert.strictEqual(s.down.right, true);
  assert.strictEqual(s.down.up, true);
});

test('kontroler: mrtva cona palčke', function () {
  var s = actions.read(controls, {}, [pad([], [0.3, -0.4])], null);
  assert.strictEqual(actions.anyPressed(s), false);
  assert.strictEqual(s.down.right, false);
  assert.strictEqual(s.down.up, false);
});

test('ni kontrolerja: prazen ali null seznam ne povzroči napake', function () {
  assert.doesNotThrow(function () {
    actions.read(controls, { 39: true }, [], null);
    actions.read(controls, { 39: true }, [null], null);
  });
});

test('tipkovnica in kontroler hkrati', function () {
  var s = actions.read(controls, { 39: true }, [pad([0])], null);
  assert.strictEqual(s.down.right, true);
  assert.strictEqual(s.down.jump, true);
});

test('držanje: pressed samo v prvem koraku, nov pritisk po spustu', function () {
  var s1 = actions.read(controls, { 89: true }, [], null);
  var s2 = actions.read(controls, { 89: true }, [], s1);
  var s3 = actions.read(controls, {}, [], s2);
  var s4 = actions.read(controls, { 89: true }, [], s3);
  assert.strictEqual(s1.pressed.jump, true);
  assert.strictEqual(s2.pressed.jump, false);
  assert.strictEqual(s3.pressed.jump, false);
  assert.strictEqual(s4.pressed.jump, true);
});
