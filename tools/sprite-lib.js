'use strict';

// Čiste funkcije za pripravo sličic (uporablja tools/sprites.js, testira test/tools/).
// Slika: { width, height, data } z RGBA točkami (kot pngjs).

function createImage(width, height) {
  return { width: width, height: height, data: Buffer.alloc(width * height * 4) };
}

function crop(img, x, y, w, h) {
  var out = createImage(w, h);
  for (var row = 0; row < h; row++) {
    var sy = y + row;
    if (sy < 0 || sy >= img.height) {
      continue;
    }
    for (var col = 0; col < w; col++) {
      var sx = x + col;
      if (sx < 0 || sx >= img.width) {
        continue;
      }
      var si = (sy * img.width + sx) * 4;
      var di = (row * w + col) * 4;
      img.data.copy(out.data, di, si, si + 4);
    }
  }
  return out;
}

function brightness(img, i) {
  return Math.max(img.data[i], img.data[i + 1], img.data[i + 2]);
}

// Temne točke (svetlost <= threshold), povezane z robom slike, postanejo prosojne.
function removeBackground(img, threshold) {
  var w = img.width;
  var h = img.height;
  var seen = new Uint8Array(w * h);
  var stack = [];

  function push(x, y) {
    var p = y * w + x;
    if (seen[p]) {
      return;
    }
    seen[p] = 1;
    var i = p * 4;
    if (img.data[i + 3] === 0 || brightness(img, i) <= threshold) {
      stack.push(p);
    }
  }

  for (var x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (var y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  while (stack.length) {
    var p = stack.pop();
    img.data[p * 4 + 3] = 0;
    var px = p % w;
    var py = (p - px) / w;
    if (px > 0) { push(px - 1, py); }
    if (px < w - 1) { push(px + 1, py); }
    if (py > 0) { push(px, py - 1); }
    if (py < h - 1) { push(px, py + 1); }
  }
  return img;
}

// Pravokotniki [x, y, w, h] (v koordinatah slike) postanejo prosojni.
function clearRects(img, rects) {
  (rects || []).forEach(function (r) {
    for (var y = Math.max(0, r[1]); y < Math.min(img.height, r[1] + r[3]); y++) {
      for (var x = Math.max(0, r[0]); x < Math.min(img.width, r[0] + r[2]); x++) {
        img.data[(y * img.width + x) * 4 + 3] = 0;
      }
    }
  });
  return img;
}

// Povezane skupine neprosojnih točk (8 sosedov): [{ x0, y0, x1, y1, count, pixels }].
function components(img) {
  var w = img.width;
  var h = img.height;
  var label = new Int32Array(w * h).fill(-1);
  var result = [];
  for (var start = 0; start < w * h; start++) {
    if (label[start] !== -1 || img.data[start * 4 + 3] === 0) {
      continue;
    }
    var comp = { x0: w, y0: h, x1: -1, y1: -1, count: 0, pixels: [] };
    var id = result.length;
    var stack = [start];
    label[start] = id;
    while (stack.length) {
      var p = stack.pop();
      var x = p % w;
      var y = (p - x) / w;
      comp.pixels.push(p);
      comp.count++;
      if (x < comp.x0) { comp.x0 = x; }
      if (x > comp.x1) { comp.x1 = x; }
      if (y < comp.y0) { comp.y0 = y; }
      if (y > comp.y1) { comp.y1 = y; }
      for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
          var nx = x + dx;
          var ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) {
            continue;
          }
          var q = ny * w + nx;
          if (label[q] === -1 && img.data[q * 4 + 3] !== 0) {
            label[q] = id;
            stack.push(q);
          }
        }
      }
    }
    result.push(comp);
  }
  return result;
}

// Odstrani skupine (razen največje), ki se dotikajo naštetih robov ('left', 'right', 'top', 'bottom').
function dropEdgeTouching(img, edges) {
  if (!edges || !edges.length) {
    return img;
  }
  var comps = components(img);
  var body = largest(comps);
  comps.forEach(function (c) {
    if (c === body) {
      return;
    }
    var touches = (edges.indexOf('left') !== -1 && c.x0 === 0) ||
      (edges.indexOf('right') !== -1 && c.x1 === img.width - 1) ||
      (edges.indexOf('top') !== -1 && c.y0 === 0) ||
      (edges.indexOf('bottom') !== -1 && c.y1 === img.height - 1);
    if (touches) {
      c.pixels.forEach(function (p) {
        img.data[p * 4 + 3] = 0;
      });
    }
  });
  return img;
}

function largest(comps) {
  var best = null;
  comps.forEach(function (c) {
    if (!best || c.count > best.count) {
      best = c;
    }
  });
  return best;
}

// Okvir telesa (največja skupina) in okvir vseh neprosojnih točk.
function boxes(img) {
  var comps = components(img);
  if (!comps.length) {
    throw new Error('Sličica je prazna (vse ozadje).');
  }
  var body = largest(comps);
  var all = { x0: img.width, y0: img.height, x1: -1, y1: -1 };
  comps.forEach(function (c) {
    all.x0 = Math.min(all.x0, c.x0);
    all.y0 = Math.min(all.y0, c.y0);
    all.x1 = Math.max(all.x1, c.x1);
    all.y1 = Math.max(all.y1, c.y1);
  });
  return {
    body: { x0: body.x0, y0: body.y0, x1: body.x1, y1: body.y1 },
    all: all
  };
}

// Kopija slike src na sliko dst z zamikom (ox, oy).
function blit(src, dst, ox, oy) {
  for (var y = 0; y < src.height; y++) {
    var dy = y + oy;
    if (dy < 0 || dy >= dst.height) {
      continue;
    }
    for (var x = 0; x < src.width; x++) {
      var dx = x + ox;
      if (dx < 0 || dx >= dst.width) {
        continue;
      }
      var si = (y * src.width + x) * 4;
      if (src.data[si + 3] === 0) {
        continue;
      }
      src.data.copy(dst.data, (dy * dst.width + dx) * 4, si, si + 4);
    }
  }
  return dst;
}

// Pomanjšanje s povprečenjem točk (s predhodno pomnoženo prosojnostjo, brez temnih robov).
function resize(img, w, h) {
  var out = createImage(w, h);
  var sx = img.width / w;
  var sy = img.height / h;
  for (var y = 0; y < h; y++) {
    var y0 = y * sy;
    var y1 = (y + 1) * sy;
    for (var x = 0; x < w; x++) {
      var x0 = x * sx;
      var x1 = (x + 1) * sx;
      var r = 0;
      var g = 0;
      var b = 0;
      var a = 0;
      var area = 0;
      for (var yy = Math.floor(y0); yy < Math.ceil(y1); yy++) {
        var wy = Math.min(y1, yy + 1) - Math.max(y0, yy);
        for (var xx = Math.floor(x0); xx < Math.ceil(x1); xx++) {
          var wx = Math.min(x1, xx + 1) - Math.max(x0, xx);
          var weight = wx * wy;
          var i = (Math.min(yy, img.height - 1) * img.width + Math.min(xx, img.width - 1)) * 4;
          var alpha = img.data[i + 3] / 255;
          r += img.data[i] * alpha * weight;
          g += img.data[i + 1] * alpha * weight;
          b += img.data[i + 2] * alpha * weight;
          a += alpha * weight;
          area += weight;
        }
      }
      var o = (y * w + x) * 4;
      if (a > 0) {
        out.data[o] = Math.round(r / a);
        out.data[o + 1] = Math.round(g / a);
        out.data[o + 2] = Math.round(b / a);
      }
      out.data[o + 3] = Math.round((a / area) * 255);
    }
  }
  return out;
}

function even(n) {
  var v = Math.max(2, Math.round(n));
  return v % 2 ? v + 1 : v;
}

// Pripravi skupino sličic.
//   frames: [{ name, image }] že izrezane slike z odstranjenim ozadjem
//   options: { align: 'bottom' | 'cell', height: logična višina telesa (bottom) ali celice (cell), scale: točk na logično točko }
// Vrne [{ name, image, width, height }] z logično velikostjo (width, height).
function layoutGroup(frames, options) {
  var px = options.scale || 2;
  if (options.align === 'cell') {
    var cellH = frames[0].image.height;
    var cellW = frames[0].image.width;
    var k = (options.height * px) / cellH;
    var outW = even(cellW * k);
    var outH = even(cellH * k);
    return frames.map(function (f) {
      if (f.image.width !== cellW || f.image.height !== cellH) {
        throw new Error('Sličice poravnave "cell" morajo biti enako velike: ' + f.name);
      }
      return { name: f.name, image: resize(f.image, outW, outH), width: outW / px, height: outH / px };
    });
  }

  var measured = frames.map(function (f) {
    var b = boxes(f.image);
    return {
      frame: f,
      // vodoravno: sredina telesa; navpično: najnižja točka (stopala so na tleh)
      anchorX: (b.body.x0 + b.body.x1 + 1) / 2,
      anchorY: b.all.y1 + 1,
      all: b.all,
      bodyHeight: b.body.y1 - b.body.y0 + 1
    };
  });
  var scale = (options.height * px) / measured[0].bodyHeight;
  var side = 0;
  var up = 0;
  measured.forEach(function (m) {
    side = Math.max(side, m.anchorX - m.all.x0, m.all.x1 + 1 - m.anchorX);
    up = Math.max(up, m.anchorY - m.all.y0);
  });
  var srcW = Math.ceil(side * 2);
  var srcH = Math.ceil(up);
  var outWidth = even(srcW * scale);
  var outHeight = even(srcH * scale);
  return measured.map(function (m) {
    var canvas = createImage(srcW, srcH);
    blit(m.frame.image, canvas, Math.round(srcW / 2 - m.anchorX), Math.round(up - m.anchorY));
    return {
      name: m.frame.name,
      image: resize(canvas, outWidth, outHeight),
      width: outWidth / px,
      height: outHeight / px
    };
  });
}

module.exports = {
  createImage: createImage,
  crop: crop,
  removeBackground: removeBackground,
  clearRects: clearRects,
  dropEdgeTouching: dropEdgeTouching,
  components: components,
  boxes: boxes,
  resize: resize,
  layoutGroup: layoutGroup
};
