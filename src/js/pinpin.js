// Imenski prostor PinPin: registracija in pridobivanje modulov.
// V brskalniku je window.PinPin, v Node.js (testi) se izvozi z module.exports.
(function (root) {
  'use strict';

  function createRegistry() {
    var modules = {};

    return {
      register: function (name, value) {
        if (Object.prototype.hasOwnProperty.call(modules, name)) {
          throw new Error('PinPin: modul "' + name + '" je že registriran.');
        }
        modules[name] = value;
        return value;
      },

      // file je pot skripte, ki registrira modul, da napaka pove, kaj manjka.
      get: function (name, file) {
        if (!Object.prototype.hasOwnProperty.call(modules, name)) {
          throw new Error('PinPin: modul "' + name + '" ni naložen. ' +
            'Preveri, da je js/' + file + ' v index.html pred skripto, ki ga uporablja.');
        }
        return modules[name];
      },

      has: function (name) {
        return Object.prototype.hasOwnProperty.call(modules, name);
      },

      createRegistry: createRegistry
    };
  }

  var PinPin = createRegistry();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PinPin;
  } else {
    root.PinPin = PinPin;
  }
})(this);
