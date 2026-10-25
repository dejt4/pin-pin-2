// Živali: rjavi medved, beli medved in volk hodijo sem in tja po svojem delu tal.
//
// Žival: { type, x, y, width, height, dir, startX, speed, range, walkTime, pushTime }
//   walkTime  čas hoje (za menjavo sličic)
//   pushTime  preostanek udarca po ulovu pingvina (med tem žival stoji)
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var PinPin = isNode ? null : root.PinPin;
  var settings = isNode ? require('../config/settings.js') : PinPin.get('config.settings', 'config/settings.js');
  var math = isNode ? require('./math.js') : PinPin.get('core.math', 'core/math.js');
  var room = isNode ? require('./room.js') : PinPin.get('core.room', 'core/room.js');

  var cfg = settings.animals;
  var EPS = 1e-6;

  function createOne(r, info) {
    var T = r.tileSize;
    var size = cfg[info.type];
    var x = info.col * T + T / 2 - size.width / 2;
    return {
      type: info.type,
      x: x,
      y: (info.row + 1) * T - size.height,
      width: size.width,
      height: size.height,
      // na začetku gleda levo, proti pingvinu, ki pride z leve
      dir: -1,
      startX: x,
      speed: size.speed,
      range: size.range * T,
      walkTime: 0,
      pushTime: 0
    };
  }

  // Živali na začetnih mestih iz sobe.
  function create(r) {
    var list = [];
    for (var i = 0; i < r.animals.length; i++) {
      list.push(createOne(r, r.animals[i]));
    }
    return list;
  }

  // Ali sme žival na položaj nextX: tla pod sprednjim robom, brez zidu, konic in zapor ovir.
  function canWalkTo(r, a, nextX, blockers) {
    var T = r.tileSize;
    var frontX = a.dir > 0 ? nextX + a.width - EPS : nextX;
    var col = Math.floor(frontX / T);
    var floorRow = Math.round((a.y + a.height) / T);
    var floor = room.tileAt(r, col, floorRow);
    if (!room.isSolid(floor) && !room.isOneWay(floor)) {
      return false;
    }
    for (var row = Math.floor(a.y / T); row <= Math.floor((a.y + a.height - EPS) / T); row++) {
      var tile = room.tileAt(r, col, row);
      if (room.isSolid(tile) || room.isSpikes(tile)) {
        return false;
      }
    }
    if (nextX < 0 || nextX + a.width > r.width) {
      return false;
    }
    var body = { x: nextX, y: a.y, width: a.width, height: a.height };
    for (var i = 0; blockers && i < blockers.length; i++) {
      if (math.overlaps(body, blockers[i])) {
        return false;
      }
    }
    return Math.abs(nextX - a.startX) <= a.range;
  }

  // blockers: zapore ledenih ovir (glej core/obstacles.js)
  function step(list, r, dt, blockers) {
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      if (a.pushTime > 0) {
        a.pushTime = Math.max(0, a.pushTime - dt);
        continue;
      }
      var nextX = a.x + a.dir * a.speed * dt;
      if (canWalkTo(r, a, nextX, blockers)) {
        a.x = nextX;
        a.walkTime += dt;
      } else {
        a.dir = -a.dir;
      }
    }
  }

  // Kepe, ki zadenejo žival, izginejo (dead), žival se obrne.
  function hitBy(list, balls) {
    for (var b = 0; b < balls.length; b++) {
      var ball = balls[b];
      for (var i = 0; i < list.length && !ball.dead; i++) {
        if (math.overlaps(ball, list[i])) {
          ball.dead = true;
          list[i].dir = -list[i].dir;
        }
      }
    }
  }

  // Žival, ki se dotika pingvina, ali null.
  function catcher(list, p) {
    for (var i = 0; i < list.length; i++) {
      if (math.overlaps(list[i], p)) {
        return list[i];
      }
    }
    return null;
  }

  // Ob ulovu žival za kratek čas obstane in pokaže udarec.
  function push(a) {
    a.pushTime = cfg.pushTime;
  }

  var animals = {
    create: create,
    step: step,
    hitBy: hitBy,
    catcher: catcher,
    push: push
  };

  if (isNode) {
    module.exports = animals;
  } else {
    PinPin.register('core.animals', animals);
  }
})(this);
