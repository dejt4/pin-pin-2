// Animacije pingvina: imena sličic (brez .png) in hitrost v sličicah na sekundo.
// faces: smer, v katero gleda sličica; če pingvin gleda drugam, se zrcali.
// Animacija brez faces se nikoli ne zrcali.
(function (root) {
  'use strict';

  var animations = {
    standRight: { frames: ['stand-right'] },
    standLeft: { frames: ['stand-left'] },
    walkRight: { frames: ['walk-right-1', 'walk-right-2', 'walk-right-3', 'walk-right-2'], fps: 9 },
    walkLeft: { frames: ['walk-left-1', 'walk-left-2', 'walk-left-3', 'walk-left-2'], fps: 9 },
    jumpTakeoff: { frames: ['jump-takeoff'], faces: 'right' },
    jumpRising: { frames: ['jump-rising'], faces: 'right' },
    jumpApex: { frames: ['jump-apex'], faces: 'right' },
    jumpFalling: { frames: ['jump-landing'], faces: 'right' },
    jumpLanding: { frames: ['jump-landing'], faces: 'right' },
    climb: { frames: ['walk-up-1', 'walk-up-2', 'walk-up-3', 'walk-up-2'], fps: 7 },
    climbIdle: { frames: ['walk-up-2'] },
    hurt: { frames: ['bump-left'], faces: 'left' },
    // nadomestek, dokler ni sličic za met: odriv s stegnjenim krilcem
    throw: { frames: ['jump-takeoff'], faces: 'right' },
    tired: { frames: ['cry-1', 'cry-2', 'cry-3', 'cry-2'], fps: 4 },
    front: { frames: ['stand-down'] },
    back: { frames: ['walk-up-1'] }
  };

  // Trajanje kratkih prehodov v sekundah.
  var timing = {
    takeoff: 0.08,
    landing: 0.1,
    // navpična hitrost (px/s), pod katero je pingvin "na vrhu" skoka
    apexSpeed: 150
  };

  var config = { animations: animations, timing: timing };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
  } else {
    root.PinPin.register('config.animations', config);
  }
})(this);
