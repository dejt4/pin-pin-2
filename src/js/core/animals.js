// Živali: medved in volk hodita sem in tja, muha in komarji zapirajo pot.
//
// Medved, volk: { type, x, y, width, height, dir, startX, speed, range, hitTime }
// Muha:         { type: 'fly', x, y, width, height, hits, gone, leaveTime, floorY }
// Komarji:      { type: 'mosquitoes', x, y, width, height, stuck, floorY }
// floorY je zgornji rob prve podlage pod muho ali komarji (do tja sega zapora).
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var PinPin = isNode ? null : root.PinPin;
  var settings = isNode ? require('../config/settings.js') : PinPin.get('config.settings', 'config/settings.js');
  var math = isNode ? require('./math.js') : PinPin.get('core.math', 'core/math.js');
  var room = isNode ? require('./room.js') : PinPin.get('core.room', 'core/room.js');

  var cfg = settings.animals;
  var EPS = 1e-6;

  function isWalker(a) {
    return a.type === 'bear' || a.type === 'wolf';
  }

  // Ali žival še zapira pot (muha ni pregnana, niso vsi komarji prilepljeni).
  function isBlocking(a) {
    if (a.type === 'fly') {
      return !a.gone;
    }
    if (a.type === 'mosquitoes') {
      return a.stuck < cfg.mosquitoes;
    }
    return false;
  }

  function createOne(r, info) {
    var T = r.tileSize;
    if (isWalker(info)) {
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
        hitTime: 0
      };
    }
    var a = {
      type: info.type,
      x: info.col * T,
      y: info.row * T,
      width: T,
      height: T,
      floorY: room.surfaceBelow(r, info.col, info.row)
    };
    if (info.type === 'fly') {
      a.hits = 0;
      a.gone = false;
      a.leaveTime = 0;
    } else {
      a.stuck = 0;
    }
    return a;
  }

  // Živali na začetnih mestih iz sobe.
  function create(r) {
    var list = [];
    for (var i = 0; i < r.animals.length; i++) {
      list.push(createOne(r, r.animals[i]));
    }
    return list;
  }

  // Ali sme hodeča žival na položaj nextX (tla pod sprednjim robom, brez zidu in konic).
  function canWalkTo(r, a, nextX) {
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
    return Math.abs(nextX - a.startX) <= a.range;
  }

  function stepWalker(r, a, dt) {
    if (a.hitTime > 0) {
      a.hitTime = Math.max(0, a.hitTime - dt);
    }
    var nextX = a.x + a.dir * a.speed * dt;
    if (canWalkTo(r, a, nextX)) {
      a.x = nextX;
    } else {
      a.dir = -a.dir;
    }
  }

  function step(list, r, dt) {
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      if (isWalker(a)) {
        stepWalker(r, a, dt);
      } else if (a.type === 'fly' && a.gone) {
        a.leaveTime += dt;
      }
    }
  }

  // Zadetek kepe v žival. Vrne dogodek za točke ali null.
  function hit(a) {
    if (isWalker(a)) {
      a.dir = -a.dir;
      a.hitTime = cfg.hitTime;
      return null;
    }
    if (a.type === 'fly') {
      a.hits++;
      if (a.hits >= cfg.flyHits) {
        a.gone = true;
        return 'fly';
      }
      return null;
    }
    a.stuck++;
    return 'mosquito';
  }

  // Kepe, ki zadenejo žival, izginejo (dead). Vrne seznam dogodkov ('fly', 'mosquito').
  function hitBy(list, balls) {
    var events = [];
    for (var b = 0; b < balls.length; b++) {
      var ball = balls[b];
      for (var i = 0; i < list.length && !ball.dead; i++) {
        var a = list[i];
        if ((isWalker(a) || isBlocking(a)) && math.overlaps(ball, a)) {
          ball.dead = true;
          var event = hit(a);
          if (event) {
            events.push(event);
          }
        }
      }
    }
    return events;
  }

  // Zapore poti za pingvina: stolpec muhe ali komarjev nad prvo podlago pod njimi
  // (in nad vrhom sobe, da je ni mogoče preskočiti).
  function blockers(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      if (isBlocking(a)) {
        result.push({ x: a.x, y: -a.floorY, width: a.width, height: 2 * a.floorY });
      }
    }
    return result;
  }

  // Ali se medved ali volk dotika pingvina.
  function catches(list, p) {
    for (var i = 0; i < list.length; i++) {
      if (isWalker(list[i]) && math.overlaps(list[i], p)) {
        return true;
      }
    }
    return false;
  }

  var animals = {
    create: create,
    step: step,
    hitBy: hitBy,
    blockers: blockers,
    catches: catches,
    isWalker: isWalker,
    isBlocking: isBlocking
  };

  if (isNode) {
    module.exports = animals;
  } else {
    PinPin.register('core.animals', animals);
  }
})(this);
