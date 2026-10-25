// Fiksni časovni korak: koliko korakov pravil izvesti za sličico, dolgo frameTime sekund.
// clock: { accumulator } se ohranja med sličicami.
(function (root) {
  'use strict';

  function createClock() {
    return { accumulator: 0 };
  }

  // Vrne število korakov; ostanek časa se prenese v naslednjo sličico.
  // Po dolgem zatiku se izvede največ maxSteps korakov, ostalo se zavrže.
  function advance(clock, frameTime, step, maxSteps) {
    clock.accumulator += Math.max(0, frameTime);
    var steps = Math.floor((clock.accumulator + 1e-9) / step);
    if (steps > maxSteps) {
      steps = maxSteps;
      clock.accumulator = 0;
    } else {
      clock.accumulator -= steps * step;
      if (clock.accumulator < 0) {
        clock.accumulator = 0;
      }
    }
    return steps;
  }

  var loop = {
    createClock: createClock,
    advance: advance
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = loop;
  } else {
    root.PinPin.register('core.loop', loop);
  }
})(this);
