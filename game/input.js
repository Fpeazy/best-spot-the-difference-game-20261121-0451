// input.js — mouse + keyboard. Satu tugas: mengubah input jadi aksi game.
(function () {
  function toSceneCoords(frameEl, clientX, clientY) {
    var svg = frameEl.querySelector('svg');
    if (!svg) return null;
    var rect = frameEl.getBoundingClientRect();
    var vb = svg.viewBox.baseVal;
    return {
      x: (clientX - rect.left) / rect.width * vb.width,
      y: (clientY - rect.top) / rect.height * vb.height
    };
  }
  function bindFrame(frameId) {
    var el = document.getElementById(frameId);
    if (!el) return;
    el.addEventListener('click', function (ev) {
      var p = toSceneCoords(el, ev.clientX, ev.clientY);
      if (p && window.MUSEUM) MUSEUM.clickAt(p.x, p.y);
    });
    el.addEventListener('mousemove', function (ev) {
      var p = toSceneCoords(el, ev.clientX, ev.clientY);
      if (p && window.MUSEUM_LOUPE) MUSEUM_LOUPE.hover(el, ev.clientX, ev.clientY, p.x, p.y);
    });
    el.addEventListener('mouseleave', function () {
      if (window.MUSEUM_LOUPE) MUSEUM_LOUPE.leave();
    });
  }
  function bindKeys() {
    document.addEventListener('keydown', function (ev) {
      if (!window.MUSEUM) return;
      var k = ev.key.toLowerCase();
      if (k === '1' || k === '2' || k === '3') MUSEUM.gotoScene(parseInt(k, 10) - 1);
      else if (k === 'h') MUSEUM.useHint();
      else if (k === 'm' && window.MUSEUM_LOUPE) MUSEUM_LOUPE.toggle();
      else if (k === 'r') MUSEUM.restartScene();
    });
  }
  window.MUSEUM_INPUT = {
    init: function () {
      bindFrame('frame-left');
      bindFrame('frame-right');
      bindKeys();
      var hintBtn = document.getElementById('hint-btn');
      if (hintBtn) hintBtn.addEventListener('click', function () { if (window.MUSEUM) MUSEUM.useHint(); });
      document.querySelectorAll('#scene-tabs .tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          if (window.MUSEUM) MUSEUM.gotoScene(parseInt(tab.dataset.scene, 10));
        });
      });
      var again = document.getElementById('play-again');
      if (again) again.addEventListener('click', function () { if (window.MUSEUM) MUSEUM.restartAll(); });
      var retry = document.getElementById('try-again');
      if (retry) retry.addEventListener('click', function () { if (window.MUSEUM) MUSEUM.restartAll(); });
    }
  };
})();
