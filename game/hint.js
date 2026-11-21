// hint.js — Hint KILAT: layar kedip putih 0,3 dtk, lalu siluet hitam SATU diff
// yang belum ketemu muncul sebentar (bentuk/area, bukan lingkaran di titik persis).
(function () {
  var MAX_HINTS = 3;
  var hintsLeft = MAX_HINTS;

  function renderCount() {
    var el = document.getElementById('hint-count');
    if (el) el.textContent = hintsLeft;
    var btn = document.getElementById('hint-btn');
    if (btn) btn.disabled = hintsLeft <= 0;
  }
  function silhouetteFor(diff) {
    // Bentuk siluet mengikuti tipe diff: bulat untuk objek kecil, kotak untuk area.
    var s = '';
    if (diff.shape === 'rect') {
      s = '<rect x="' + (diff.x - diff.rx) + '" y="' + (diff.y - diff.ry) + '" width="' + (diff.rx * 2) +
        '" height="' + (diff.ry * 2) + '" rx="10" fill="#000" opacity="0.85"/>';
    } else {
      s = '<circle cx="' + diff.x + '" cy="' + diff.y + '" r="' + (diff.r || 30) +
        '" fill="#000" opacity="0.85"/>';
    }
    return '<g class="hint-silhouette">' + s + '</g>';
  }
  window.MUSEUM_HINT = {
    max: MAX_HINTS,
    left: function () { return hintsLeft; },
    set: function (n) { hintsLeft = Math.max(0, Math.min(MAX_HINTS, n)); renderCount(); },
    use: function () {
      if (hintsLeft <= 0) return false;
      var game = window.MUSEUM;
      if (!game || !game.pickUnfound) return false;
      var diff = game.pickUnfound();
      if (!diff) return false;
      hintsLeft--;
      renderCount();
      if (window.MUSEUM_AUDIO) MUSEUM_AUDIO.hint();
      var flash = document.getElementById('flash');
      if (flash) {
        flash.classList.remove('on');
        void flash.offsetWidth; // restart animasi
        flash.classList.add('on');
      }
      // Siluet muncul setelah kedip, di KEDUA panel, lalu hilang.
      setTimeout(function () {
        ['frame-left', 'frame-right'].forEach(function (id) {
          var svg = document.querySelector('#' + id + ' svg');
          if (!svg) return;
          var tmp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          tmp.innerHTML = silhouetteFor(diff);
          while (tmp.firstChild) svg.appendChild(tmp.firstChild);
        });
        setTimeout(function () {
          document.querySelectorAll('.hint-silhouette').forEach(function (n) { n.remove(); });
        }, 1400);
      }, 380);
      return true;
    }
  };
})();
