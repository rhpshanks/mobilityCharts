/* ==========================================================================
   MobilityCharts site behaviour: theme switch, embed copy, table sorting.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- theme switch, remembered between visits ------------------------- */

  var KEY = 'mc-theme';
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { saved = null; }
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  function current() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function paintButton(btn) {
    var mode = current();
    btn.textContent = mode === 'dark' ? 'Light' : 'Dark';
    btn.setAttribute('aria-label', 'Switch to ' + (mode === 'dark' ? 'light' : 'dark') + ' theme');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-btn');
    if (btn) {
      paintButton(btn);
      btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
        paintButton(btn);
      });
    }

    /* ---- embed copy button -------------------------------------------- */

    document.querySelectorAll('.copy-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var target = document.querySelector(b.getAttribute('data-target'));
        if (!target) return;
        var payload = target.textContent;
        var done = function () {
          var label = b.textContent;
          b.textContent = 'Copied';
          b.classList.add('done');
          setTimeout(function () { b.textContent = label; b.classList.remove('done'); }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(payload).then(done, fallback);
        } else { fallback(); }

        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = payload;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });

    /* ---- sortable data tables ----------------------------------------- */

    document.querySelectorAll('table.data').forEach(function (tbl) {
      tbl.querySelectorAll('th').forEach(function (th, idx) {
        th.addEventListener('click', function () {
          var body = tbl.tBodies[0];
          var rows = Array.prototype.slice.call(body.rows);
          var asc = th.getAttribute('data-asc') !== 'true';
          rows.sort(function (a, b) {
            var x = a.cells[idx].textContent.trim();
            var y = b.cells[idx].textContent.trim();
            var nx = parseFloat(x.replace(/[^0-9.\-]/g, ''));
            var ny = parseFloat(y.replace(/[^0-9.\-]/g, ''));
            var same = !isNaN(nx) && !isNaN(ny);
            if (same) return asc ? nx - ny : ny - nx;
            return asc ? x.localeCompare(y) : y.localeCompare(x);
          });
          tbl.querySelectorAll('th').forEach(function (o) { o.removeAttribute('data-asc'); });
          th.setAttribute('data-asc', asc ? 'true' : 'false');
          rows.forEach(function (r) { body.appendChild(r); });
        });
      });
    });

    /* ---- subscribe box: no backend yet, so state that plainly ---------- */

    document.querySelectorAll('.sub-row form, form.sub-row').forEach(function (f) {
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var note = f.parentNode.querySelector('.sub-note');
        if (note) note.textContent = 'Mailing list not wired yet. Beehiiv embed goes here at launch.';
      });
    });
  });
})();
