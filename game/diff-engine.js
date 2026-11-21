// diff-engine.js — deteksi klik, state ketemu, skor, streak RONDA.
// Satu tugas: logika menemukan perbedaan.
(function () {
  var state = null; // diisi main.js: { sceneIndex, found: [Set, Set, Set], score, streak: {count, lastAt, awarded} }

  function dist(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function nearestUnfound(scene, x, y) {
    var found = state.found[state.sceneIndex];
    var best = null, bestD = Infinity;
    scene.diffs.forEach(function (d) {
      if (found.has(d.id)) return;
      var dd = dist({ x: x, y: y }, d);
      var radius = Math.max(d.r || 28, 26) + 10; // toleransi klik
      if (dd < radius && dd < bestD) { best = d; bestD = dd; }
    });
    return best;
  }
  function renderHud() {
    var scene = window.SCENES[state.sceneIndex];
    var found = state.found[state.sceneIndex];
    var el = document.getElementById('counter');
    if (el) el.textContent = 'DITEMUKAN ' + found.size + ' \u2022 SISA ' + (scene.diffs.length - found.size);
    var name = document.getElementById('scene-name');
    if (name) name.textContent = scene.name;
    var dots = document.getElementById('dots');
    if (dots) {
      dots.innerHTML = '';
      scene.diffs.forEach(function (d) {
        var s = document.createElement('span');
        s.className = 'dot' + (found.has(d.id) ? ' found' : '');
        dots.appendChild(s);
      });
    }
    var list = document.getElementById('found-names');
    if (list) {
      list.innerHTML = '';
      scene.diffs.forEach(function (d) {
        if (!found.has(d.id)) return;
        var li = document.createElement('li');
        li.textContent = d.name;
        list.appendChild(li);
      });
    }
    var score = document.getElementById('score');
    if (score) score.textContent = state.score;
    document.querySelectorAll('#scene-tabs .tab').forEach(function (tab, i) {
      tab.classList.toggle('active', i === state.sceneIndex);
      tab.classList.toggle('done', state.found[i].size === window.SCENES[i].diffs.length);
    });
  }
  function rerender(floatIdx) {
    var scene = window.SCENES[state.sceneIndex];
    var foundArr = Array.from(state.found[state.sceneIndex]);
    window.MUSEUM_RENDERER.renderScene(scene, foundArr, floatIdx);
  }
  function markFound(diff) {
    var scene = window.SCENES[state.sceneIndex];
    state.found[state.sceneIndex].add(diff.id);
    var idx = scene.diffs.findIndex(function (d) { return d.id === diff.id; });
    state.score += 100;
    // Streak RONDA: 3 temuan benar berurutan dalam 8 detik -> +15 detik (sekali per scene).
    var now = Date.now();
    var st = state.streak;
    if (now - st.lastAt <= 8000) st.count++; else st.count = 1;
    st.lastAt = now;
    var streakHit = false;
    if (st.count >= 3 && !st.awarded[state.sceneIndex]) {
      st.awarded[state.sceneIndex] = true;
      streakHit = true;
      if (window.MUSEUM_TIMER) MUSEUM_TIMER.bonus(15);
      var badge = document.getElementById('ronda-badge');
      if (badge) { badge.classList.remove('hidden'); badge.classList.add('pulse'); }
      if (window.MUSEUM_AUDIO) MUSEUM_AUDIO.streak();
    }
    if (window.MUSEUM_AUDIO) MUSEUM_AUDIO.found();
    rerender(idx);
    renderHud();
    // Angka melayang hilang sendiri setelah 1,2 detik (supaya screenshot deterministik).
    setTimeout(function () { rerender(null); }, 1200);
    // Scene selesai?
    if (state.found[state.sceneIndex].size === scene.diffs.length) {
      setTimeout(function () { if (window.MUSEUM) MUSEUM.sceneComplete(); }, 900);
    }
    return streakHit;
  }
  window.MUSEUM_ENGINE = {
    initState: function () {
      state = {
        sceneIndex: 0,
        found: [new Set(), new Set(), new Set()],
        score: 0,
        streak: { count: 0, lastAt: 0, awarded: [false, false, false] }
      };
      return state;
    },
    getState: function () { return state; },
    clickAt: function (x, y) {
      if (!state || window.MUSEUM.isOver()) return null;
      var scene = window.SCENES[state.sceneIndex];
      var diff = nearestUnfound(scene, x, y);
      if (diff) {
        if (window.MUSEUM_TIMER && !MUSEUM_TIMER.isRunning()) MUSEUM_TIMER.start(function () { if (window.MUSEUM) MUSEUM.timeOut(); });
        return markFound(diff);
      }
      // Klik salah: -5 detik + thud.
      if (window.MUSEUM_TIMER) MUSEUM_TIMER.penalty(5);
      if (window.MUSEUM_AUDIO) MUSEUM_AUDIO.wrong();
      state.streak.count = 0;
      return false;
    },
    // Untuk mode screenshot / API: temukan diff lewat jalurnya sendiri.
    findByIndex: function (sceneIdx, diffIdx) {
      state.sceneIndex = sceneIdx;
      var scene = window.SCENES[sceneIdx];
      var diff = scene.diffs[diffIdx];
      if (!diff || state.found[sceneIdx].has(diff.id)) return false;
      if (window.MUSEUM_TIMER && !MUSEUM_TIMER.isRunning()) MUSEUM_TIMER.start(function () { if (window.MUSEUM) MUSEUM.timeOut(); });
      return markFound(diff);
    },
    pickUnfound: function () {
      var scene = window.SCENES[state.sceneIndex];
      var unfound = scene.diffs.filter(function (d) { return !state.found[state.sceneIndex].has(d.id); });
      return unfound.length ? unfound[Math.floor(Math.random() * unfound.length)] : null;
    },
    gotoScene: function (i) {
      if (i < 0 || i > 2 || i === state.sceneIndex) return false;
      state.sceneIndex = i;
      state.streak.count = 0;
      var badge = document.getElementById('ronda-badge');
      if (badge && !state.streak.awarded[i]) { badge.classList.add('hidden'); badge.classList.remove('pulse'); }
      rerender(null);
      renderHud();
      return true;
    },
    restartScene: function () {
      state.found[state.sceneIndex] = new Set();
      state.streak.count = 0;
      state.streak.awarded[state.sceneIndex] = false;
      var badge = document.getElementById('ronda-badge');
      if (badge) { badge.classList.add('hidden'); badge.classList.remove('pulse'); }
      rerender(null);
      renderHud();
    },
    restartAll: function () {
      state.found = [new Set(), new Set(), new Set()];
      state.score = 0;
      state.sceneIndex = 0;
      state.streak = { count: 0, lastAt: 0, awarded: [false, false, false] };
      document.getElementById('victory').classList.add('hidden');
      document.getElementById('gameover').classList.add('hidden');
      var badge = document.getElementById('ronda-badge');
      if (badge) { badge.classList.add('hidden'); badge.classList.remove('pulse'); }
      if (window.MUSEUM_TIMER) MUSEUM_TIMER.set(900);
      rerender(null);
      renderHud();
    },
    rerender: rerender,
    renderHud: renderHud,
    allDone: function () {
      return window.SCENES.every(function (s, i) { return state.found[i].size === s.diffs.length; });
    }
  };
})();
