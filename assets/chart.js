/* ==========================================================================
   MobilityCharts chart renderer
   Plain SVG, zero dependencies, styled by CSS classes so that light and dark
   themes need no re-render. Encodes the SOP-03 visual standard:
     - bar charts always start at zero
     - bars sorted by value, never alphabetically
     - direct value labels rather than a legend
     - source credit and site mark drawn inside the SVG itself
   ========================================================================== */

(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) {
      if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
    }
    return node;
  }

  function text(str, attrs) {
    var node = el('text', attrs);
    node.textContent = str;
    return node;
  }

  function fmt(n, decimals) {
    var d = decimals === undefined ? 0 : decimals;
    return Number(n).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function niceMax(v) {
    if (v <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log10(v)));
    var step = mag / 2;
    return Math.ceil(v / step) * step;
  }

  /* ---- horizontal bar chart -------------------------------------------- */

  function bar(cfg) {
    var rows = cfg.data.slice().sort(function (a, b) { return b.value - a.value; });
    if (cfg.limit) rows = rows.slice(0, cfg.limit);

    /* The viewBox matches the mount width so that label text lands at its true
       pixel size. A fixed 700 unit box would shrink 13px labels to 5px on a
       phone, which fails the SOP-03 legibility rule. */
    var W = cfg._W || 700;
    var narrow = W < 460;
    var padL = Math.min(cfg.labelWidth || 150, Math.round(W * 0.34));
    var padR = narrow ? 54 : 74;
    var padT = 34;
    var padB = 46;
    var rowH = narrow ? 26 : 30;
    var gap = narrow ? 7 : 9;
    var plotW = W - padL - padR;
    var H = padT + rows.length * rowH + (rows.length - 1) * gap + padB;

    var max = niceMax(Math.max.apply(null, rows.map(function (r) { return r.value; })));
    var svg = el('svg', {
      'class': 'mc-svg',
      viewBox: '0 0 ' + W + ' ' + H,
      role: 'img',
      'aria-label': cfg.alt || cfg.title || 'bar chart'
    });

    /* unit caption sitting above the plot */
    svg.appendChild(text(cfg.unit || '', { 'class': 'mc-unit', x: padL, y: 16 }));

    /* vertical gridlines at quarter steps, drawn behind the bars */
    for (var g = 0; g <= 4; g++) {
      var gx = padL + (plotW * g) / 4;
      svg.appendChild(el('line', {
        'class': 'mc-grid', x1: gx, x2: gx, y1: padT - 8, y2: padT + rows.length * (rowH + gap) - gap + 4
      }));
      svg.appendChild(text(fmt(max * g / 4, cfg.decimals), {
        'class': 'mc-tick', x: gx, y: padT + rows.length * (rowH + gap) - gap + 20, 'text-anchor': 'middle'
      }));
    }

    rows.forEach(function (r, i) {
      var y = padT + i * (rowH + gap);
      var w = Math.max(2, (r.value / max) * plotW);

      svg.appendChild(text(r.label, {
        'class': 'mc-label', x: padL - 12, y: y + rowH / 2 + 4.5, 'text-anchor': 'end'
      }));
      svg.appendChild(el('rect', {
        'class': 'mc-track', x: padL, y: y + 4, width: plotW, height: rowH - 8, rx: 3
      }));
      svg.appendChild(el('rect', {
        'class': 'mc-bar' + (r.muted ? ' alt' : ''),
        x: padL, y: y + 4, width: w, height: rowH - 8, rx: 3
      }));
      svg.appendChild(text(fmt(r.value, cfg.decimals) + (cfg.suffix || ''), {
        'class': 'mc-value', x: padL + w + 9, y: y + rowH / 2 + 4.5
      }));
    });

    /* zero baseline, stated explicitly because the SOP demands it */
    svg.appendChild(el('line', {
      'class': 'mc-axis', x1: padL, x2: padL, y1: padT - 8, y2: padT + rows.length * (rowH + gap) - gap + 4
    }));

    footer(svg, cfg, W, H);
    return svg;
  }

  /* ---- time series line chart ------------------------------------------ */

  function line(cfg) {
    var rows = cfg.data.slice();
    var W = cfg._W || 700;
    var narrow = W < 460;
    var H = narrow ? 250 : 340;
    var padL = narrow ? 44 : 62, padR = narrow ? 16 : 26, padT = 34, padB = 46;
    var plotW = W - padL - padR, plotH = H - padT - padB;

    var max = niceMax(Math.max.apply(null, rows.map(function (r) { return r.value; })));
    var svg = el('svg', {
      'class': 'mc-svg', viewBox: '0 0 ' + W + ' ' + H, role: 'img',
      'aria-label': cfg.alt || cfg.title || 'line chart'
    });

    svg.appendChild(text(cfg.unit || '', { 'class': 'mc-unit', x: padL, y: 16 }));

    for (var g = 0; g <= 4; g++) {
      var gy = padT + plotH - (plotH * g) / 4;
      svg.appendChild(el('line', { 'class': 'mc-grid', x1: padL, x2: padL + plotW, y1: gy, y2: gy }));
      svg.appendChild(text(fmt(max * g / 4, cfg.decimals), {
        'class': 'mc-tick', x: padL - 10, y: gy + 4, 'text-anchor': 'end'
      }));
    }

    var stepX = rows.length > 1 ? plotW / (rows.length - 1) : 0;
    var pts = rows.map(function (r, i) {
      return [padL + i * stepX, padT + plotH - (r.value / max) * plotH];
    });

    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var area = d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (padT + plotH) + ' L' + pts[0][0].toFixed(1) + ' ' + (padT + plotH) + ' Z';

    svg.appendChild(el('path', { 'class': 'mc-fill', d: area }));
    svg.appendChild(el('path', { 'class': 'mc-line', d: d }));

    pts.forEach(function (p, i) {
      svg.appendChild(el('circle', { 'class': 'mc-dot', cx: p[0], cy: p[1], r: i === pts.length - 1 ? 5 : 3 }));
      var every = Math.ceil(rows.length / 8);
      if (i % every === 0 || i === rows.length - 1) {
        svg.appendChild(text(rows[i].label, {
          'class': 'mc-tick', x: p[0], y: padT + plotH + 20, 'text-anchor': 'middle'
        }));
      }
    });

    var last = pts[pts.length - 1];
    svg.appendChild(text(fmt(rows[rows.length - 1].value, cfg.decimals) + (cfg.suffix || ''), {
      'class': 'mc-value', x: last[0] - 6, y: last[1] - 13, 'text-anchor': 'end'
    }));

    svg.appendChild(el('line', { 'class': 'mc-axis', x1: padL, x2: padL + plotW, y1: padT + plotH, y2: padT + plotH }));

    footer(svg, cfg, W, H);
    return svg;
  }

  /* ---- credit line and site mark, on every chart without exception ----- */

  function footer(svg, cfg, W, H) {
    var credit = 'Source: ' + (cfg.source || 'not set');
    if (cfg.sourceDate) credit += ' · ' + cfg.sourceDate;
    svg.appendChild(text(credit, { 'class': 'mc-credit', x: 0, y: H - 6 }));
    svg.appendChild(text('mobilitycharts.com', { 'class': 'mc-mark', x: W, y: H - 6, 'text-anchor': 'end' }));
  }

  /* ---- public entry point ---------------------------------------------- */

  var mounted = [];

  function widthOf(mount) {
    var w = mount.clientWidth || 700;
    return Math.max(300, Math.min(700, Math.round(w)));
  }

  function draw(entry) {
    var cfg = entry.cfg;
    cfg._W = widthOf(entry.mount);
    var svg = cfg.type === 'line' ? line(cfg) : bar(cfg);
    /* Cap the drawn width at the viewBox width. Without this, a wide container
       stretches the SVG and magnifies every label past its intended size. */
    svg.style.maxWidth = cfg._W + 'px';
    entry.mount.innerHTML = '';
    entry.mount.appendChild(svg);
    entry.width = cfg._W;
    return svg;
  }

  function render(cfg) {
    var mount = typeof cfg.mount === 'string' ? document.querySelector(cfg.mount) : cfg.mount;
    if (!mount) return null;
    var entry = { mount: mount, cfg: cfg, width: 0 };
    mounted.push(entry);
    return draw(entry);
  }

  /* Re-draw only when the mount width actually moves, so that a scrollbar
     appearing or a phone rotating does not trigger needless work. */
  var timer = null;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      mounted.forEach(function (entry) {
        if (widthOf(entry.mount) !== entry.width) draw(entry);
      });
    }, 140);
  });

  /* ---- table builder, kept beside the chart so both read one dataset --- */

  function table(cfg) {
    var mount = typeof cfg.mount === 'string' ? document.querySelector(cfg.mount) : cfg.mount;
    if (!mount) return;
    var rows = cfg.data.slice().sort(function (a, b) { return b.value - a.value; });

    var html = '<table class="data"><thead><tr>' +
      '<th class="num" style="width:58px">#</th>' +
      '<th>' + (cfg.labelHead || 'Name') + '</th>' +
      '<th class="num">' + (cfg.valueHead || 'Value') + '</th>' +
      '</tr></thead><tbody>';

    rows.forEach(function (r, i) {
      html += '<tr><td class="num">' + (i + 1) + '</td><td>' + r.label +
        '</td><td class="num">' + fmt(r.value, cfg.decimals) + (cfg.suffix || '') + '</td></tr>';
    });
    mount.innerHTML = html + '</tbody></table>';
  }

  global.MC = { render: render, table: table, fmt: fmt };
})(window);
