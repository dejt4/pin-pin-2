// Celotno stanje igre in en korak pravil.
//
// Stanja (state):
//   start    začetni zaslon
//   playing  igranje
//   tired    pingvin je utrujen (energija nič)
//   goal     cilj dosežen
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var PinPin = isNode ? null : root.PinPin;
  var settings = isNode ? require('../config/settings.js') : PinPin.get('config.settings', 'config/settings.js');
  var math = isNode ? require('./math.js') : PinPin.get('core.math', 'core/math.js');
  var actions = isNode ? require('./actions.js') : PinPin.get('core.actions', 'core/actions.js');
  var room = isNode ? require('./room.js') : PinPin.get('core.room', 'core/room.js');
  var physics = isNode ? require('./physics.js') : PinPin.get('core.physics', 'core/physics.js');
  var player = isNode ? require('./player.js') : PinPin.get('core.player', 'core/player.js');
  var energy = isNode ? require('./energy.js') : PinPin.get('core.energy', 'core/energy.js');
  var camera = isNode ? require('./camera.js') : PinPin.get('core.camera', 'core/camera.js');

  var SCREEN_COLS = settings.screen.width / settings.tileSize;
  // del ploščice s konicami, ki rani (spodnji del, malo ožji)
  var SPIKES_TOP = 0.4;
  var SPIKES_INSET = 4;

  function create(roomSource) {
    var r = room.parse(roomSource, settings.tileSize);
    var game = {
      state: 'start',
      stateTime: 0,
      room: r,
      player: player.create(room.startPoint(r)),
      energy: energy.create(),
      collected: {},
      cameraX: 0
    };
    game.player.pose = 'front';
    return game;
  }

  function setState(game, state) {
    game.state = state;
    game.stateTime = 0;
  }

  // Soba od začetka: pingvin na začetku, polna energija, vse ribe na mestu.
  function reset(game) {
    game.player = player.create(room.startPoint(game.room));
    game.energy = energy.create();
    game.collected = {};
    updateCamera(game);
  }

  function updateCamera(game) {
    game.cameraX = camera.follow(game.room.width, player.centerX(game.player));
  }

  function collectFish(game) {
    var fish = game.room.fish;
    for (var i = 0; i < fish.length; i++) {
      var f = fish[i];
      if (!game.collected[f.id] && math.overlaps(game.player, f)) {
        game.collected[f.id] = true;
        energy.eatFish(game.energy);
      }
    }
  }

  function touchSpikes(game) {
    var p = game.player;
    var r = game.room;
    var T = r.tileSize;
    var hitX = null;
    physics.forEachTile(r, p, function (col, row, tile) {
      if (hitX !== null || !room.isSpikes(tile)) {
        return;
      }
      var spikes = {
        x: col * T + SPIKES_INSET,
        y: row * T + T * SPIKES_TOP,
        width: T - 2 * SPIKES_INSET,
        height: T * (1 - SPIKES_TOP)
      };
      if (math.overlaps(p, spikes)) {
        hitX = col * T + T / 2;
      }
    });
    if (hitX !== null && player.hurt(p, hitX)) {
      energy.spikesPenalty(game.energy);
    }
  }

  // Ali je pingvin padel pod spodnji rob sobe; če je, ga vrne na varno mesto.
  function checkPit(game) {
    var p = game.player;
    if (p.y <= game.room.height) {
      return false;
    }
    var point = room.safePoint(game.room, player.centerX(p), SCREEN_COLS);
    player.placeAt(p, point);
    return true;
  }

  function reachedGoal(game) {
    var goals = game.room.goals;
    for (var i = 0; i < goals.length; i++) {
      if (math.overlaps(game.player, goals[i])) {
        return true;
      }
    }
    return false;
  }

  function stepPlaying(game, act, dt) {
    energy.drain(game.energy, dt);
    player.step(game.player, game.room, act, dt);
    collectFish(game);
    touchSpikes(game);
    if (checkPit(game)) {
      energy.pitPenalty(game.energy);
    }
    if (energy.isEmpty(game.energy)) {
      player.setTired(game.player);
      setState(game, 'tired');
    } else if (reachedGoal(game)) {
      game.player.pose = 'back';
      game.player.vx = 0;
      setState(game, 'goal');
    }
  }

  var IDLE = actions.createState();

  function canRestart(game, act) {
    return game.stateTime >= settings.flow.restartDelay && actions.anyPressed(act);
  }

  function startPlaying(game) {
    reset(game);
    setState(game, 'playing');
  }

  // act: akcije tega koraka (glej core/actions.js)
  function step(game, act, dt) {
    game.stateTime += dt;
    switch (game.state) {
    case 'start':
      player.updateAnimation(game.player, dt);
      if (actions.anyPressed(act)) {
        startPlaying(game);
      }
      break;
    case 'playing':
      stepPlaying(game, act, dt);
      break;
    case 'tired':
      // pingvin brez nadzora pade na tla in joka
      player.step(game.player, game.room, IDLE, dt);
      checkPit(game);
      if (canRestart(game, act)) {
        startPlaying(game);
      }
      break;
    case 'goal':
      player.updateAnimation(game.player, dt);
      if (canRestart(game, act)) {
        startPlaying(game);
      }
      break;
    }
    updateCamera(game);
  }

  // Ali sme igralec že začeti znova (za prikaz navodila).
  function restartReady(game) {
    return (game.state === 'tired' || game.state === 'goal') &&
      game.stateTime >= settings.flow.restartDelay;
  }

  var gameModule = {
    create: create,
    step: step,
    restartReady: restartReady
  };

  if (isNode) {
    module.exports = gameModule;
  } else {
    PinPin.register('core.game', gameModule);
  }
})(this);
