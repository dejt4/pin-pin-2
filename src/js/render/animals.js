// Izris živali z nadomestnimi liki, dokler ni sličic: medved, volk, muha, komarji.
// Ko pridejo sličice, se zamenja samo ta datoteka; pravila v core/animals.js ostanejo.
(function (PinPin) {
  'use strict';

  var settings = PinPin.get('config.settings', 'config/settings.js');
  var animals = PinPin.get('core.animals', 'core/animals.js');

  var W = settings.screen.width;

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // Elipsa z arc namesto ctx.ellipse, ki ga starejši brskalniki (PS4) morda nimajo.
  function ellipse(ctx, cx, cy, rx, ry, rotation, stroke) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(rx, ry);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();
    if (stroke) {
      ctx.stroke();
    }
  }

  function eye(ctx, x, y) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1b1b1b';
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Medved ali volk: telo, glava na sprednji strani, ušesa, noge, ki se premikajo pri hoji.
  function drawWalker(ctx, a, x, time) {
    var bear = a.type === 'bear';
    var body = a.hitTime > 0 ? '#f4e3c8' : (bear ? '#8a5a2b' : '#8e959c');
    var dark = bear ? '#5e3b1a' : '#5d646b';
    var front = a.dir > 0 ? x + a.width : x;
    var y = a.y;
    var legH = bear ? 10 : 8;
    var step = Math.sin(time * 10) * 3;

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#2a2a2a';

    // noge
    ctx.fillStyle = dark;
    ctx.fillRect(x + 8 + step, y + a.height - legH, 8, legH);
    ctx.fillRect(x + a.width - 16 - step, y + a.height - legH, 8, legH);

    // telo
    ctx.fillStyle = body;
    roundRect(ctx, x + 2, y + (bear ? 12 : 6), a.width - 4, a.height - legH - (bear ? 10 : 4), bear ? 14 : 9);
    ctx.fill();
    ctx.stroke();

    // rep volka
    if (!bear) {
      var tail = a.dir > 0 ? x : x + a.width;
      ctx.beginPath();
      ctx.moveTo(tail, y + 10);
      ctx.lineTo(tail - a.dir * 14, y + 2);
      ctx.lineTo(tail - a.dir * 4, y + 16);
      ctx.closePath();
      ctx.fillStyle = body;
      ctx.fill();
      ctx.stroke();
    }

    // glava
    var hx = front - a.dir * (bear ? 14 : 12);
    var hy = y + (bear ? 14 : 8);
    var hr = bear ? 15 : 11;
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(hx, hy, hr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // ušesa
    ctx.fillStyle = dark;
    if (bear) {
      ctx.beginPath();
      ctx.arc(hx - 9, hy - 11, 5, 0, Math.PI * 2);
      ctx.arc(hx + 9, hy - 11, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(hx - 8, hy - 6);
      ctx.lineTo(hx - 4, hy - 18);
      ctx.lineTo(hx, hy - 8);
      ctx.moveTo(hx + 1, hy - 8);
      ctx.lineTo(hx + 6, hy - 18);
      ctx.lineTo(hx + 9, hy - 5);
      ctx.fill();
    }

    // gobec in oko na sprednji strani
    ctx.fillStyle = bear ? '#c9a27a' : '#c7cdd2';
    ctx.beginPath();
    ctx.arc(hx + a.dir * (hr - 3), hy + 4, bear ? 6 : 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1b1b1b';
    ctx.beginPath();
    ctx.arc(hx + a.dir * (hr + 1), hy + 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, hx + a.dir * 4, hy - 4);
  }

  function drawFlyBody(ctx, cx, cy, time) {
    var flap = Math.abs(Math.sin(time * 30)) * 6 + 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = '#9fb4c4';
    ctx.lineWidth = 1;
    ellipse(ctx, cx - 6, cy - 8, 6, flap, -0.4, true);
    ellipse(ctx, cx + 6, cy - 8, 6, flap, 0.4, true);
    ctx.fillStyle = '#2b2b33';
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 3, 3, 0, Math.PI * 2);
    ctx.arc(cx + 4, cy - 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFly(ctx, a, x, time) {
    var cx = x + a.width / 2;
    var cy = a.y + a.height / 2 + Math.sin(time * 4) * 4;
    if (a.gone) {
      // odlet navzgor in v stran
      cx += a.leaveTime * 120;
      cy -= a.leaveTime * 200;
      if (cy < -20) {
        return;
      }
      drawFlyBody(ctx, cx, cy, time);
      return;
    }
    drawFlyBody(ctx, cx, cy, time);

    // vrstica napredka: 5 delov nad muho
    var parts = settings.animals.flyHits;
    var bw = 8;
    var gap = 2;
    var total = parts * bw + (parts - 1) * gap;
    var bx = x + a.width / 2 - total / 2;
    var by = a.y - 14;
    for (var i = 0; i < parts; i++) {
      ctx.fillStyle = i < a.hits ? '#ffd166' : 'rgba(255, 255, 255, 0.6)';
      ctx.strokeStyle = '#1d3557';
      ctx.lineWidth = 1.5;
      ctx.fillRect(bx + i * (bw + gap), by, bw, 6);
      ctx.strokeRect(bx + i * (bw + gap), by, bw, 6);
    }
  }

  // komar je narisan okoli (0, 0) in povečan, da ga otrok opazi
  var MOSQUITO_SCALE = 1.6;

  function drawMosquito(ctx, x, y, time, stuck) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(MOSQUITO_SCALE, MOSQUITO_SCALE);
    drawMosquitoShape(ctx, time + x, stuck);
    ctx.restore();
  }

  function drawMosquitoShape(ctx, time, stuck) {
    var cx = 0;
    var cy = 0;
    ctx.strokeStyle = '#3d3d3d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // tanke noge
    ctx.moveTo(cx - 2, cy + 2);
    ctx.lineTo(cx - 6, cy + 8);
    ctx.moveTo(cx + 2, cy + 2);
    ctx.lineTo(cx + 6, cy + 8);
    // rilček
    ctx.moveTo(cx + 4, cy);
    ctx.lineTo(cx + 10, cy + 2);
    ctx.stroke();
    if (!stuck) {
      var flap = Math.abs(Math.sin(time * 35)) * 4 + 2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ellipse(ctx, cx - 3, cy - 5, 3, flap, -0.5, false);
      ellipse(ctx, cx + 3, cy - 5, 3, flap, 0.5, false);
    }
    ctx.fillStyle = '#8c8c8c';
    ellipse(ctx, cx, cy, 6, 3, 0, false);
    if (stuck) {
      // kepa, ki ga je prilepila
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx + 4, cy - 3, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawMosquitoes(ctx, a, x, time) {
    var total = settings.animals.mosquitoes;
    for (var i = 0; i < total; i++) {
      var stuck = i < a.stuck;
      var cx;
      var cy;
      if (stuck) {
        cx = x + 6 + i * 14;
        cy = a.floorY - 6;
      } else {
        cx = x + a.width / 2 + Math.sin(time * 3 + i * 2.1) * 12;
        cy = a.y + 8 + i * 12 + Math.cos(time * 4 + i) * 4;
      }
      drawMosquito(ctx, cx, cy, time, stuck);
    }
  }

  function draw(ctx, game) {
    var camX = game.cameraX;
    var time = game.stateTime;
    var list = game.animals;
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var x = a.x - camX;
      if (x + a.width < -60 || x > W + 60) {
        continue;
      }
      if (animals.isWalker(a)) {
        drawWalker(ctx, a, x, time);
      } else if (a.type === 'fly') {
        drawFly(ctx, a, x, time);
      } else {
        drawMosquitoes(ctx, a, x, time);
      }
    }
  }

  PinPin.register('render.animals', { draw: draw });
})(window.PinPin);
