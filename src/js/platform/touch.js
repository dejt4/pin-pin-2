// Gumbi na zaslonu za naprave na dotik (telefon, tablica).
// Gumbi so elementi HTML z atributom data-action. Za vsak prst se poišče gumb pod njim,
// zato drsenje po križcu zamenja smer in več prstov deluje hkrati.
(function (PinPin) {
  'use strict';

  function isTouchDevice() {
    return 'ontouchstart' in window ||
      (navigator.maxTouchPoints || 0) > 0 ||
      (navigator.msMaxTouchPoints || 0) > 0;
  }

  // panel: element z gumbi; onShow: klic, ko se gumbi prvič pokažejo (za novo postavitev)
  function createTouch(panel, onShow) {
    var buttons = panel.querySelectorAll('[data-action]');
    // prst (identifier) → gumb pod njim ali null
    var fingers = {};
    // akcije, ki so bile pritisnjene od zadnjega branja (tudi če je prst že spuščen)
    var tapped = {};
    var shown = false;

    function show() {
      if (shown) {
        return;
      }
      shown = true;
      document.body.className += ' touch';
      if (onShow) {
        onShow();
      }
    }

    function buttonAt(x, y) {
      var el = document.elementFromPoint(x, y);
      while (el && el !== panel && el !== document.body) {
        if (el.getAttribute && el.getAttribute('data-action')) {
          return el;
        }
        el = el.parentNode;
      }
      return null;
    }

    function refresh() {
      var held = {};
      var id;
      for (id in fingers) {
        if (fingers[id]) {
          held[fingers[id].getAttribute('data-action')] = true;
        }
      }
      for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        var active = !!held[b.getAttribute('data-action')];
        var name = b.className.replace(/\s*\bactive\b/g, '');
        b.className = active ? name + ' active' : name;
      }
    }

    function onTouch(event) {
      show();
      var ended = event.type === 'touchend' || event.type === 'touchcancel';
      for (var i = 0; i < event.changedTouches.length; i++) {
        var t = event.changedTouches[i];
        if (ended) {
          delete fingers[t.identifier];
        } else {
          var button = buttonAt(t.clientX, t.clientY);
          fingers[t.identifier] = button;
          if (button) {
            tapped[button.getAttribute('data-action')] = true;
          }
        }
      }
      refresh();
      // brez pomikanja, povečave in izbire besedila
      if (event.cancelable) {
        event.preventDefault();
      }
    }

    var options = { passive: false };
    document.addEventListener('touchstart', onTouch, options);
    document.addEventListener('touchmove', onTouch, options);
    document.addEventListener('touchend', onTouch, options);
    document.addEventListener('touchcancel', onTouch, options);

    if (isTouchDevice()) {
      show();
    }

    return {
      // vrne {akcija: true} za gumbe, ki se jih dotika prst ali so bili pritisnjeni od zadnjega branja
      read: function () {
        var result = {};
        var id;
        var name;
        for (id in fingers) {
          if (fingers[id]) {
            result[fingers[id].getAttribute('data-action')] = true;
          }
        }
        for (name in tapped) {
          result[name] = true;
        }
        tapped = {};
        return result;
      }
    };
  }

  PinPin.register('platform.touch', {
    isTouchDevice: isTouchDevice,
    createTouch: createTouch
  });
})(window.PinPin);
