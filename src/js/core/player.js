// Pingvin: hoja, skok, gravitacija, lestve, odriv, utrujenost in izbira animacije.
//
// Stanja (mode):
//   ground  stoji ali hodi po podlagi
//   air     skače ali pada
//   climb   pleza po lestvi (brez gravitacije)
//   hurt    odrinjen od konic, brez nadzora do pristanka
//   tired   utrujen, brez nadzora
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var PinPin = isNode ? null : root.PinPin;
  var settings = isNode ? require('../config/settings.js') : PinPin.get('config.settings', 'config/settings.js');
  var animConfig = isNode ? require('../config/animations.js') : PinPin.get('config.animations', 'config/animations.js');
  var math = isNode ? require('./math.js') : PinPin.get('core.math', 'core/math.js');
  var room = isNode ? require('./room.js') : PinPin.get('core.room', 'core/room.js');
  var physics = isNode ? require('./physics.js') : PinPin.get('core.physics', 'core/physics.js');

  var EPS = 1e-6;
  var cfg = settings.player;

  // point: { x, y } sredina stopal
  function create(point) {
    var p = {
      x: 0,
      y: 0,
      width: cfg.width,
      height: cfg.height,
      vx: 0,
      vy: 0,
      facing: 1,
      mode: 'ground',
      ladderCol: -1,
      climbing: false,
      invulnerable: 0,
      jumpTime: Infinity,
      landTime: 0,
      // preostanek animacije meta kepe (nastavi core/snowballs.js)
      throwTime: 0,
      // posebna poza za zaslone (null, 'front', 'back')
      pose: null,
      anim: null,
      animTime: 0
    };
    placeAt(p, point);
    return p;
  }

  function placeAt(p, point) {
    p.x = point.x - p.width / 2;
    p.y = point.y - p.height;
    p.vx = 0;
    p.vy = 0;
    p.mode = 'ground';
    p.ladderCol = -1;
    p.climbing = false;
    p.jumpTime = Infinity;
    p.landTime = 0;
    p.throwTime = 0;
  }

  function centerX(p) {
    return p.x + p.width / 2;
  }

  function centerCol(p, r) {
    return Math.floor(centerX(p) / r.tileSize);
  }

  // Ali je v stolpcu sredine pingvina lestev, ki jo pingvin prekriva.
  function ladderAtBody(p, r) {
    var T = r.tileSize;
    var col = centerCol(p, r);
    for (var row = Math.floor(p.y / T); row <= Math.floor((p.y + p.height - EPS) / T); row++) {
      if (room.isLadder(room.tileAt(r, col, row))) {
        return true;
      }
    }
    return false;
  }

  // Ali pingvin stoji na vrhu lestve.
  function onLadderTop(p, r) {
    var T = r.tileSize;
    var feetRow = Math.round((p.y + p.height) / T);
    if (Math.abs(feetRow * T - (p.y + p.height)) > EPS) {
      return false;
    }
    return room.isLadderTop(r, centerCol(p, r), feetRow);
  }

  function startClimb(p, r) {
    var T = r.tileSize;
    var col = centerCol(p, r);
    p.mode = 'climb';
    p.ladderCol = col;
    p.x = col * T + T / 2 - p.width / 2;
    p.vx = 0;
    p.vy = 0;
  }

  function direction(act) {
    return (act.down.left ? -1 : 0) + (act.down.right ? 1 : 0);
  }

  function jump(p) {
    p.vy = -cfg.jumpSpeed;
    p.mode = 'air';
    p.jumpTime = 0;
  }

  // Gibanje z gravitacijo (vsa stanja razen plezanja).
  function stepBody(p, r, dt, blockers) {
    p.vy = Math.min(p.vy + cfg.gravity * dt, cfg.maxFallSpeed);
    physics.moveX(r, p, p.vx * dt, blockers);
    var res = physics.moveY(r, p, p.vy * dt, true);
    if (res.landed) {
      p.vy = 0;
      if (p.mode === 'air') {
        p.landTime = animConfig.timing.landing;
        p.mode = 'ground';
      } else if (p.mode === 'hurt') {
        p.vx = 0;
        p.mode = 'ground';
      }
    } else {
      if (res.bumped) {
        p.vy = 0;
      }
      if (p.mode === 'ground') {
        // stopil čez rob
        p.mode = 'air';
        p.jumpTime = Infinity;
      }
    }
  }

  function stepFree(p, r, act, dt, blockers) {
    if (p.mode === 'ground' || p.mode === 'air') {
      var dir = direction(act);
      p.vx = dir * cfg.walkSpeed;
      if (dir !== 0) {
        p.facing = dir;
      }
      if (p.mode === 'ground') {
        // gor pri lestvi pomeni plezanje, drugje skok (samo ob novem pritisku)
        if (act.down.up && ladderAtBody(p, r)) {
          startClimb(p, r);
          return;
        }
        if (act.down.down && onLadderTop(p, r)) {
          startClimb(p, r);
          stepClimb(p, r, act, dt, blockers);
          return;
        }
        if (act.pressed.up) {
          jump(p);
        }
      }
    } else if (p.mode === 'tired') {
      p.vx = 0;
    }
    stepBody(p, r, dt, blockers);
  }

  function stepClimb(p, r, act, dt, blockers) {
    var T = r.tileSize;
    var dir = direction(act);

    if (dir !== 0) {
      // stran z lestve
      p.facing = dir;
      p.mode = 'air';
      p.jumpTime = Infinity;
      p.climbing = false;
      stepFree(p, r, act, dt, blockers);
      return;
    }

    var vertical = (act.down.up ? -1 : 0) + (act.down.down ? 1 : 0);
    var dy = vertical * cfg.climbSpeed * dt;
    p.climbing = vertical !== 0;
    p.vx = 0;
    p.vy = 0;

    if (dy < 0) {
      physics.moveY(r, p, dy, false);
      var bottom = p.y + p.height;
      var feetRow = Math.floor((bottom - EPS) / T);
      if (!room.isLadder(room.tileAt(r, p.ladderCol, feetRow))) {
        // stopala so nad vrhom lestve: stopi na vrh
        p.y = (feetRow + 1) * T - p.height;
        p.mode = 'ground';
        p.climbing = false;
      }
    } else if (dy > 0) {
      var res = physics.moveY(r, p, dy, false);
      if (res.landed) {
        p.mode = 'ground';
        p.climbing = false;
      } else if (!ladderAtBody(p, r)) {
        p.mode = 'air';
        p.jumpTime = Infinity;
        p.climbing = false;
      }
    }
  }

  // blockers: neobvezne zapore poti (glej core/physics.js moveX)
  function step(p, r, act, dt, blockers) {
    if (p.invulnerable > 0) {
      p.invulnerable = Math.max(0, p.invulnerable - dt);
    }
    if (p.landTime > 0) {
      p.landTime = Math.max(0, p.landTime - dt);
    }
    if (p.throwTime > 0) {
      p.throwTime = Math.max(0, p.throwTime - dt);
    }
    if (p.mode === 'climb') {
      stepClimb(p, r, act, dt, blockers);
    } else {
      stepFree(p, r, act, dt, blockers);
    }
    if (p.mode === 'air') {
      p.jumpTime += dt;
    }
    updateAnimation(p, dt);
  }

  // Odriv od nevarnosti na položaju sourceX. Vrne false, če je pingvin neranljiv.
  function hurt(p, sourceX) {
    if (p.invulnerable > 0 || p.mode === 'tired') {
      return false;
    }
    var dir = math.sign(centerX(p) - sourceX) || -p.facing;
    p.vx = dir * cfg.knockbackSpeedX;
    p.vy = -cfg.knockbackSpeedY;
    p.mode = 'hurt';
    p.climbing = false;
    p.invulnerable = cfg.invulnerableTime;
    return true;
  }

  function setTired(p) {
    p.mode = 'tired';
    p.vx = 0;
    p.climbing = false;
    if (p.vy < 0) {
      p.vy = 0;
    }
  }

  function animationKey(p) {
    if (p.pose === 'front') {
      return 'front';
    }
    if (p.pose === 'back') {
      return 'back';
    }
    var timing = animConfig.timing;
    switch (p.mode) {
    case 'tired':
      return 'tired';
    case 'hurt':
      return 'hurt';
    case 'climb':
      return p.climbing ? 'climb' : 'climbIdle';
    }
    if (p.throwTime > 0) {
      return 'throw';
    }
    switch (p.mode) {
    case 'air':
      if (p.jumpTime < timing.takeoff) {
        return 'jumpTakeoff';
      }
      if (p.vy < -timing.apexSpeed) {
        return 'jumpRising';
      }
      if (p.vy > timing.apexSpeed) {
        return 'jumpFalling';
      }
      return 'jumpApex';
    default:
      if (p.landTime > 0) {
        return 'jumpLanding';
      }
      if (p.vx !== 0) {
        return p.facing > 0 ? 'walkRight' : 'walkLeft';
      }
      return p.facing > 0 ? 'standRight' : 'standLeft';
    }
  }

  function updateAnimation(p, dt) {
    var key = animationKey(p);
    if (key !== p.anim) {
      p.anim = key;
      p.animTime = 0;
    } else {
      p.animTime += dt;
    }
  }

  // Sličica za izris: { image, mirror }.
  function frame(p) {
    var key = p.anim || animationKey(p);
    var anim = animConfig.animations[key];
    var index = 0;
    if (anim.fps) {
      index = Math.floor(p.animTime * anim.fps) % anim.frames.length;
    }
    var facingName = p.facing > 0 ? 'right' : 'left';
    return {
      image: anim.frames[index],
      mirror: !!anim.faces && anim.faces !== facingName
    };
  }

  var player = {
    create: create,
    placeAt: placeAt,
    step: step,
    hurt: hurt,
    setTired: setTired,
    animationKey: animationKey,
    updateAnimation: updateAnimation,
    frame: frame,
    centerX: centerX
  };

  if (isNode) {
    module.exports = player;
  } else {
    PinPin.register('core.player', player);
  }
})(this);
