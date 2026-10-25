// Čiste pomožne matematične funkcije.
(function (root) {
  'use strict';

  function clamp(value, min, max) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }

  function sign(value) {
    if (value > 0) {
      return 1;
    }
    if (value < 0) {
      return -1;
    }
    return 0;
  }

  // Ali se pravokotnika {x, y, width, height} prekrivata (dotik robov ne šteje).
  function overlaps(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
      a.y < b.y + b.height && a.y + a.height > b.y;
  }

  var math = {
    clamp: clamp,
    sign: sign,
    overlaps: overlaps
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = math;
  } else {
    root.PinPin.register('core.math', math);
  }
})(this);
