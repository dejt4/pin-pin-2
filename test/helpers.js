'use strict';

// Pomožne funkcije za teste: akcije iz imen in simulacija korakov.

var actions = require('../src/js/core/actions.js');
var controls = require('../src/js/config/controls.js');
var settings = require('../src/js/config/settings.js');
var room = require('../src/js/core/room.js');

var KEYS = { left: 37, up: 38, right: 39, down: 40, jump: 89, throw: 88 };

// Ustvari bralnik akcij: input(['right', 'jump']) vrne stanje akcij za en korak.
function createInput() {
  var previous = null;
  return function (names) {
    var keys = {};
    (names || []).forEach(function (name) {
      keys[KEYS[name]] = true;
    });
    previous = actions.read(controls, keys, [], previous);
    return previous;
  };
}

function parseRoom(rows) {
  return room.parse({ name: 'test', rows: rows }, settings.tileSize);
}

module.exports = {
  createInput: createInput,
  parseRoom: parseRoom,
  DT: settings.step,
  T: settings.tileSize
};
