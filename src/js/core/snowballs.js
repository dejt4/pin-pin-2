// Kupi snega in kepe: nošena kepa, met, let kepe in zadetki ploščic.
//
// Stanje: { atPile, carrying, cooldown, balls: [{ x, y, width, height, dir, dead }] }
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var PinPin = isNode ? null : root.PinPin;
  var settings = isNode ? require('../config/settings.js') : PinPin.get('config.settings', 'config/settings.js');
  var room = isNode ? require('./room.js') : PinPin.get('core.room', 'core/room.js');
  var physics = isNode ? require('./physics.js') : PinPin.get('core.physics', 'core/physics.js');

  var cfg = settings.snowball;

  function createState() {
    return { atPile: false, carrying: false, cooldown: 0, balls: [] };
  }

  function touchesPile(r, body) {
    var found = false;
    physics.forEachTile(r, body, function (col, row, tile) {
      if (room.isPile(tile)) {
        found = true;
      }
    });
    return found;
  }

  function canThrow(state, p) {
    if (state.cooldown > 0) {
      return false;
    }
    if (p.mode !== 'ground' && p.mode !== 'air') {
      return false;
    }
    return state.atPile || state.carrying;
  }

  function spawn(state, p) {
    var size = cfg.size;
    state.balls.push({
      x: p.facing > 0 ? p.x + p.width : p.x - size,
      y: p.y + cfg.chest,
      width: size,
      height: size,
      dir: p.facing,
      dead: false
    });
  }

  function hitsWall(r, ball) {
    var hit = false;
    physics.forEachTile(r, ball, function (col, row, tile) {
      if (room.isSolid(tile)) {
        hit = true;
      }
    });
    return hit;
  }

  // Korak: kup, nošena kepa, met in let kep. Vrne true, če je pingvin v tem koraku vrgel kepo.
  function update(state, p, r, act, dt, cameraX) {
    var thrown = false;
    if (state.cooldown > 0) {
      state.cooldown = Math.max(0, state.cooldown - dt);
    }

    var atPile = touchesPile(r, p);
    if (state.atPile && !atPile) {
      // odhod od kupa: ena kepa v krilcu
      state.carrying = true;
    }
    state.atPile = atPile;

    if (act.pressed.throw && canThrow(state, p)) {
      spawn(state, p);
      if (!state.atPile) {
        state.carrying = false;
      }
      state.cooldown = cfg.cooldown;
      p.throwTime = cfg.throwTime;
      thrown = true;
    }

    var left = cameraX;
    var right = cameraX + settings.screen.width;
    for (var i = 0; i < state.balls.length; i++) {
      var ball = state.balls[i];
      ball.x += ball.dir * cfg.speed * dt;
      if (hitsWall(r, ball) || ball.x + ball.width < left || ball.x > right) {
        ball.dead = true;
      }
    }
    removeDead(state);
    return thrown;
  }

  function removeDead(state) {
    var alive = [];
    for (var i = 0; i < state.balls.length; i++) {
      if (!state.balls[i].dead) {
        alive.push(state.balls[i]);
      }
    }
    state.balls = alive;
  }

  // Ob vrnitvi na varno mesto: leteče kepe izginejo, nošena kepa ostane.
  function clearFlying(state) {
    state.balls = [];
  }

  var snowballs = {
    createState: createState,
    update: update,
    removeDead: removeDead,
    clearFlying: clearFlying
  };

  if (isNode) {
    module.exports = snowballs;
  } else {
    PinPin.register('core.snowballs', snowballs);
  }
})(this);
