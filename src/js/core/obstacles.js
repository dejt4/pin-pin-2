// Ledene ovire: ledeni zid na tleh in ledena sveča, ki visi s stropa.
// Obe zapirata pot, dokler ju kepe ne razbijejo.
//
// Ovira: { type: 'wall' | 'icicle', x, y, width, height, top, floorY, hits, broken, breakTime }
//   x, y, width, height  pravokotnik, ki ga zadene kepa
//   top, floorY          zapora sega od top do floorY (zid: nad vrh sobe; sveča: od stropa)
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var PinPin = isNode ? null : root.PinPin;
  var settings = isNode ? require('../config/settings.js') : PinPin.get('config.settings', 'config/settings.js');
  var math = isNode ? require('./math.js') : PinPin.get('core.math', 'core/math.js');

  var cfg = settings.obstacles;

  function createOne(r, info) {
    var T = r.tileSize;
    var cx = info.col * T + T / 2;
    var o = { type: info.type, hits: 0, broken: false, breakTime: 0 };
    if (info.type === 'wall') {
      o.floorY = (info.row + 1) * T;
      o.width = cfg.wall.width;
      o.height = cfg.wall.height;
      o.x = cx - o.width / 2;
      o.y = o.floorY - o.height;
      // zidu se ne da izogniti s skokom
      o.top = -o.floorY;
    } else {
      o.top = info.row * T;
      o.floorY = (info.row + 2) * T;
      o.width = cfg.icicle.width;
      o.height = cfg.icicle.length;
      o.x = cx - o.width / 2;
      o.y = o.top;
    }
    return o;
  }

  function create(r) {
    var list = [];
    for (var i = 0; i < r.obstacles.length; i++) {
      list.push(createOne(r, r.obstacles[i]));
    }
    return list;
  }

  function step(list, dt) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].broken) {
        list[i].breakTime += dt;
      }
    }
  }

  // Kepe, ki zadenejo nerazbito oviro, izginejo (dead). Vrne dogodke ('wall', 'icicle') za razbite ovire.
  function hitBy(list, balls) {
    var events = [];
    for (var b = 0; b < balls.length; b++) {
      var ball = balls[b];
      for (var i = 0; i < list.length && !ball.dead; i++) {
        var o = list[i];
        if (o.broken || !math.overlaps(ball, o)) {
          continue;
        }
        ball.dead = true;
        o.hits++;
        if (o.hits >= cfg[o.type].hits) {
          o.broken = true;
          o.breakTime = 0;
          events.push(o.type);
        }
      }
    }
    return events;
  }

  // Zapore poti za pingvina in živali (samo nerazbite ovire).
  function blockers(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
      var o = list[i];
      if (!o.broken) {
        result.push({ x: o.x, y: o.top, width: o.width, height: o.floorY - o.top });
      }
    }
    return result;
  }

  var obstacles = {
    create: create,
    step: step,
    hitBy: hitBy,
    blockers: blockers
  };

  if (isNode) {
    module.exports = obstacles;
  } else {
    PinPin.register('core.obstacles', obstacles);
  }
})(this);
