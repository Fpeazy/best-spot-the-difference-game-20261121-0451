// main.js — wiring: HUD, scene, victory, game over, dan state screenshot.
// Satu tugas: menyatukan semua modul jadi game yang bisa dimainkan.
(function () {
  var engine = window.MUSEUM_ENGINE;
  var over = false;

  function totalFound() {
    var st = engine.getState();
    return st.found[0].size + st.found[1].size + st.found[2].size;
  }
  function showVictory() {
    over = true;
    if (window.MUSEUM_TIMER) MUSEUM_TIMER.stop();
    if (window.MUSEUM_AUDIO) MUSEUM_AUDIO.victory();
    var t = MUSEUM_TIMER ? Math.round(MUSEUM_TIMER.get()) : 0;
    var mm = Math.floor(t / 60), ss = t % 60;
    var detail = document.getElementById('victory-detail');
    if (detail) {
      detail.textContent = 'Semua jejak yang berubah sudah ketemu — 30/30, sisa waktu ' +
        (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss + '.';
    }
    spawnConfetti();
    document.getElementById('victory').classList.remove('hidden');
  }
  function spawnConfetti() {
    var card = document.querySelector('#victory .overlay-card');
    if (!card || card.querySelector('.confetti-star')) return;
    // Posisi deterministik (dari indeks) supaya screenshot konsisten.
    for (var i = 0; i < 26; i++) {
      var s = document.createElement('span');
      s.className = 'confetti-star';
      var left = (i * 37) % 100;
      var top = 8 + ((i * 53) % 70);
      var size = 6 + (i % 3) * 3;
      s.style.left = left + '%';
      s.style.top = top + '%';
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.animationDelay = (i * 0.12) + 's';
      s.style.background = ['#ffd97a', '#d9a441', '#fff', '#c96f3f'][i % 4];
      card.appendChild(s);
    }
  }
  function showGameOver() {
    over = true;
    if (window.MUSEUM_TIMER) MUSEUM_TIMER.stop();
    var d = document.getElementById('gameover-detail');
    if (d) d.textContent = 'Pintu museum terkunci — ketemu ' + totalFound() + '/30 perbedaan.';
    document.getElementById('gameover').classList.remove('hidden');
  }

  // ---- State screenshot: ?scene=N&found=a,b&time=S&hint=N&ronda=1&loupe=x,y&victory=1 ----
  // Semua state diterapkan lewat fungsi game sendiri (klik/temukan lewat engine),
  // lalu animasi dibekukan (body.shot-mode) supaya tiap screenshot konsisten.
  function applyShotState() {
    var q = new URLSearchParams(window.location.search);
    if (!q.has('scene') && !q.has('victory') && !q.has('found') && !q.has('click') && !q.has('act')) return false;
    document.body.classList.add('shot-mode');
    if (window.MUSEUM_LOUPE) MUSEUM_LOUPE.setEnabled(false);
    var sceneIdx = parseInt(q.get('scene') || '0', 10);
    if (q.get('victory') === '1') {
      // Selesaikan semua scene lewat engine.
      [0, 1, 2].forEach(function (si) {
        engine.getState().sceneIndex = si;
        window.SCENES[si].diffs.forEach(function (d, di) { engine.findByIndex(si, di); });
      });
      engine.getState().sceneIndex = 2;
      engine.rerender(null);
      engine.renderHud();
      if (window.MUSEUM_TIMER) { MUSEUM_TIMER.stop(); MUSEUM_TIMER.set(187); }
      showVictory();
      return true;
    }
    engine.gotoScene(sceneIdx);
    var found = (q.get('found') || '').split(',').filter(function (v) { return v !== ''; })
      .map(function (v) { return parseInt(v, 10); });
    found.forEach(function (di) { engine.findByIndex(sceneIdx, di); });
    engine.getState().sceneIndex = sceneIdx;
    engine.rerender(null);
    engine.renderHud();
    if (q.get('hint') !== null && window.MUSEUM_HINT) MUSEUM_HINT.set(parseInt(q.get('hint'), 10));
    if (q.get('ronda') === '1') {
      var badge = document.getElementById('ronda-badge');
      if (badge) { badge.classList.remove('hidden'); badge.classList.add('pulse'); }
    }
    if (q.get('loupe')) {
      var parts = q.get('loupe').split(',');
      if (window.MUSEUM_LOUPE) {
        MUSEUM_LOUPE.setEnabled(true);
        MUSEUM_LOUPE.pin('frame-right', parseInt(parts[0], 10), parseInt(parts[1], 10));
      }
    }
    if (window.MUSEUM_TIMER) {
      MUSEUM_TIMER.stop();
      MUSEUM_TIMER.set(parseInt(q.get('time') || '827', 10));
    }
    // Hook uji interaksi (dipakai hanya saat verifikasi): klik asli & aksi UI.
    if (q.get('click')) {
      var cp = q.get('click').split(',');
      window.MUSEUM.clickAt(parseInt(cp[0], 10), parseInt(cp[1], 10));
    }
    if (q.get('act') === 'hint') window.MUSEUM.useHint();
    return true;
  }

  window.MUSEUM = {
    init: function () {
      engine.initState();
      engine.rerender(null);
      engine.renderHud();
      if (window.MUSEUM_INPUT) MUSEUM_INPUT.init();
      applyShotState();
    },
    isOver: function () { return over; },
    clickAt: function (x, y) {
      if (over) return null;
      return engine.clickAt(x, y);
    },
    useHint: function () { if (!over && window.MUSEUM_HINT) return MUSEUM_HINT.use(); return false; },
    gotoScene: function (i) { if (!over) engine.gotoScene(i); },
    restartScene: function () { if (!over) engine.restartScene(); },
    restartAll: function () { over = false; engine.restartAll(); },
    sceneComplete: function () {
      if (engine.allDone()) { showVictory(); return; }
      var st = engine.getState();
      var next = st.sceneIndex + 1;
      if (next <= 2) engine.gotoScene(next);
    },
    timeOut: function () { if (!over) showGameOver(); },
    pickUnfound: function () { return engine.pickUnfound(); },
    totalFound: totalFound
  };

  document.addEventListener('DOMContentLoaded', function () { window.MUSEUM.init(); });
})();
