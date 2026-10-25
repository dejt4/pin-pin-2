'use strict';

// Samodejni igralec za teste prve sobe: hodi desno, skoči pred prepadom, zidom,
// konicami ali živaljo, pleza po vsaki lestvi enkrat, ob zaprti poti pa gre po kepo
// do kupa snega in meče, dokler pot ni prosta.

var room = require('../src/js/core/room.js');
var game = require('../src/js/core/game.js');
var player = require('../src/js/core/player.js');
var animals = require('../src/js/core/animals.js');
var h = require('./helpers.js');

var T = h.T;

// onStep(i, info) je neobvezen klic za sledenje.
function play(g, maxSteps, onStep) {
  var r = g.room;
  var input = h.createInput();
  var climbed = {};
  var fetching = false;

  function isSurface(col, row) {
    var t = room.tileAt(r, col, row);
    return room.isSolid(t) || room.isOneWay(t) || room.isLadderTop(r, col, row);
  }

  game.step(g, input(['jump']), h.DT);
  game.step(g, input([]), h.DT);

  for (var i = 0; i < maxSteps && g.state === 'playing'; i++) {
    var p = g.player;
    var col = Math.floor(player.centerX(p) / T);
    var feetRow = Math.round((p.y + p.height) / T);

    var blockedWithin = function (distance) {
      return animals.blockers(g.animals).some(function (b) {
        var gap = b.x - (p.x + p.width);
        return gap > -1 && gap < distance && p.y < b.y + b.height && p.y + p.height > b.y;
      });
    };
    var blocked = blockedWithin(8 * T);
    if (blockedWithin(2) && !g.snow.atPile && !g.snow.carrying) {
      fetching = true;
    }
    if (g.snow.atPile) {
      fetching = false;
    }
    var walkerAhead = g.animals.some(function (a) {
      var gap = a.x - (p.x + p.width);
      return animals.isWalker(a) && gap > 0 && gap < 50 && Math.abs(a.y + a.height - (p.y + p.height)) < 1;
    });
    var ladderHere = room.isLadder(room.tileAt(r, col, feetRow - 1));

    var names = ['right'];
    var why = 'walk';
    if (blocked && p.mode !== 'climb' && (g.snow.atPile || g.snow.carrying)) {
      // po vrnitvi h kupu se najprej obrne proti živali
      names = p.facing < 0 ? ['right'] : (i % 2 ? [] : ['throw']);
      why = 'throw';
    } else if (fetching && p.mode === 'ground') {
      names = ['left'];
      why = 'fetch';
    } else if (p.mode === 'climb' || (p.mode === 'ground' && ladderHere && !climbed[col])) {
      names = ['up'];
      why = 'climb';
      if (p.mode === 'climb') {
        climbed[col] = true;
      }
    } else if (p.mode === 'ground') {
      var ahead = Math.floor((player.centerX(p) + 30) / T);
      var gap = !isSurface(ahead, feetRow);
      var wall = room.isSolid(room.tileAt(r, ahead, feetRow - 1));
      var spikes = room.isSpikes(room.tileAt(r, ahead, feetRow - 1));
      if (gap || wall || spikes || walkerAhead) {
        names.push('jump');
        why = 'jump';
      }
    }
    game.step(g, input(names), h.DT);
    if (onStep) {
      onStep(i, { why: why, col: col, row: feetRow, mode: p.mode, x: p.x });
    }
  }
  return { steps: i, climbed: Object.keys(climbed).length };
}

module.exports = { play: play };
