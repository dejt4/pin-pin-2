// Energija pingvina: upad s časom, ribe, kazni. Vrednost je med 0 in max.
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var settings = isNode ? require('../config/settings.js') : root.PinPin.get('config.settings', 'config/settings.js');
  var math = isNode ? require('./math.js') : root.PinPin.get('core.math', 'core/math.js');

  var cfg = settings.energy;

  function create() {
    return { value: cfg.max, max: cfg.max };
  }

  function change(e, amount) {
    e.value = math.clamp(e.value + amount, 0, e.max);
  }

  function drain(e, dt) {
    change(e, -cfg.drainPerSecond * dt);
  }

  function eatFish(e) {
    change(e, cfg.fish);
  }

  function pitPenalty(e) {
    change(e, -cfg.pitPenalty);
  }

  function spikesPenalty(e) {
    change(e, -cfg.spikesPenalty);
  }

  function caughtPenalty(e) {
    change(e, -cfg.caughtPenalty);
  }

  function isEmpty(e) {
    return e.value <= 0;
  }

  // delež energije med 0 in 1 (za vrstico na zaslonu)
  function ratio(e) {
    return e.value / e.max;
  }

  var energy = {
    create: create,
    drain: drain,
    eatFish: eatFish,
    pitPenalty: pitPenalty,
    spikesPenalty: spikesPenalty,
    caughtPenalty: caughtPenalty,
    isEmpty: isEmpty,
    ratio: ratio
  };

  if (isNode) {
    module.exports = energy;
  } else {
    root.PinPin.register('core.energy', energy);
  }
})(this);
