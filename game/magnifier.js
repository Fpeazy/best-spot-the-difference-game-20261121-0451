// magnifier.js — Kaca Pembesar Kurator: lensa zoom 2x mengikuti kursor.
// Toggle dengan M. Satu tugas: loupe.
(function () {
  var enabled = true;
  var active = null; // {frameId, x, y} posisi kursor dalam koordinat scene
  var ZOOM = 2;
  var LENS = 190;

  function placeLens(clientX, clientY) {
    var lens = document.getElementById('loupe');
    if (!lens) return;
    lens.style.left = (clientX - LENS / 2) + 'px';
    lens.style.top = (clientY - LENS / 2) + 'px';
  }
  function updateInner(frameEl, sceneX, sceneY) {
    var inner = document.getElementById('loupe-inner');
    var svg = frameEl.querySelector('svg');
    if (!inner || !svg) return;
    var rect = frameEl.getBoundingClientRect();
    var vb = svg.viewBox.baseVal;
    var clone = svg.cloneNode(true);
    clone.setAttribute('width', vb.width * ZOOM);
    clone.setAttribute('height', vb.height * ZOOM);
    clone.querySelectorAll('.hint-silhouette').forEach(function (n) { n.remove(); });
    inner.innerHTML = '';
    inner.appendChild(clone);
    // Titik kursor di tengah lensa: offset = -(titik*zoom - LENS/2)
    var ox = -(sceneX * ZOOM - LENS / 2);
    var oy = -(sceneY * ZOOM - LENS / 2);
    inner.style.transform = 'translate(' + ox + 'px,' + oy + 'px)';
    void rect;
  }
  function show(frameEl, clientX, clientY, sceneX, sceneY) {
    if (!enabled) return;
    var lens = document.getElementById('loupe');
    if (!lens) return;
    lens.classList.remove('hidden');
    placeLens(clientX, clientY);
    updateInner(frameEl, sceneX, sceneY);
    active = { frame: frameEl.id, x: sceneX, y: sceneY };
  }
  function hide() {
    var lens = document.getElementById('loupe');
    if (lens) lens.classList.add('hidden');
    active = null;
  }
  window.MUSEUM_LOUPE = {
    isEnabled: function () { return enabled; },
    toggle: function () {
      enabled = !enabled;
      if (!enabled) hide();
      return enabled;
    },
    setEnabled: function (v) { enabled = !!v; if (!enabled) hide(); },
    hover: show,
    leave: hide,
    // Untuk screenshot: pasang loupe di posisi tetap.
    pin: function (frameId, sceneX, sceneY) {
      var frameEl = document.getElementById(frameId);
      if (!frameEl) return false;
      var rect = frameEl.getBoundingClientRect();
      var svg = frameEl.querySelector('svg');
      if (!svg) return false;
      var vb = svg.viewBox.baseVal;
      var clientX = rect.left + (sceneX / vb.width) * rect.width;
      var clientY = rect.top + (sceneY / vb.height) * rect.height;
      show(frameEl, clientX, clientY, sceneX, sceneY);
      return true;
    }
  };
})();
