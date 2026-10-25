// Nalaganje sličic in enkratno pomanjšanje na velikost izrisa.
// Risanje velikih izvirnikov s pomanjšanjem vsako sličico je na PS4 lahko počasno.
(function (PinPin) {
  'use strict';

  // list: { ime: { file, width, height, crop } }
  // done(error, images): error je sporočilo z imenom datoteke, ki se ni naložila
  function load(list, done) {
    var names = [];
    var name;
    for (name in list) {
      names.push(name);
    }
    var images = {};
    var remaining = names.length;
    var failed = false;

    if (remaining === 0) {
      done(null, images);
      return;
    }

    function loadOne(key) {
      var img = new Image();
      img.onload = function () {
        if (failed) {
          return;
        }
        images[key] = img;
        remaining--;
        if (remaining === 0) {
          done(null, images);
        }
      };
      img.onerror = function () {
        if (failed) {
          return;
        }
        failed = true;
        done('Ne morem naložiti sličice: ' + list[key].file);
      };
      img.src = list[key].file;
    }

    for (var i = 0; i < names.length; i++) {
      loadOne(names[i]);
    }
  }

  // Predpomnilnik pomanjšanih sličic za dano povečavo zaslona (pixelScale).
  function createSpriteCache(list, images) {
    var cache = {};
    var cacheScale = 0;

    function prepare(name, pixelScale) {
      var info = list[name];
      var img = images[name];
      var canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(info.width * pixelScale));
      canvas.height = Math.max(1, Math.round(info.height * pixelScale));
      var ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      if ('imageSmoothingQuality' in ctx) {
        ctx.imageSmoothingQuality = 'high';
      }
      var crop = info.crop || { x: 0, y: 0, width: img.width, height: img.height };
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
      return canvas;
    }

    return {
      // pomanjšana sličica (platno) za ime
      get: function (name, pixelScale) {
        if (pixelScale !== cacheScale) {
          cache = {};
          cacheScale = pixelScale;
        }
        if (!cache[name]) {
          cache[name] = prepare(name, pixelScale);
        }
        return cache[name];
      },
      info: function (name) {
        return list[name];
      }
    };
  }

  PinPin.register('platform.images', {
    load: load,
    createSpriteCache: createSpriteCache
  });
})(window.PinPin);
