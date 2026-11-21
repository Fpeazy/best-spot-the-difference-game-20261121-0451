// timer.js — hitung mundur total 15:00, TANPA pause (by design). Satu tugas: waktu.
(function () {
  var TOTAL = 900; // 15 menit, seluruh game
  var remaining = TOTAL;
  var running = false;
  var interval = null;
  var onTimeout = null;
  var lastTick = 0;

  function fmt(s) {
    s = Math.max(0, Math.ceil(s));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }
  function render() {
    var el = document.getElementById('timer');
    if (el) el.textContent = fmt(remaining);
    var box = document.querySelector('.timer-box');
    if (box) box.classList.toggle('low', remaining <= 120);
  }
  function tick() {
    if (!running) return;
    var now = Date.now();
    var dt = (now - lastTick) / 1000;
    lastTick = now;
    remaining -= dt;
    if (remaining <= 0) {
      remaining = 0;
      running = false;
      clearInterval(interval);
      interval = null;
      render();
      if (onTimeout) onTimeout();
      return;
    }
    render();
  }
  window.MUSEUM_TIMER = {
    total: TOTAL,
    start: function (onEnd) {
      onTimeout = onEnd || onTimeout;
      if (running) return;
      running = true;
      lastTick = Date.now();
      if (!interval) interval = setInterval(tick, 200);
      render();
    },
    stop: function () { running = false; if (interval) { clearInterval(interval); interval = null; } },
    penalty: function (sec) { remaining = Math.max(0, remaining - sec); render(); if (remaining <= 0 && onTimeout) { running = false; onTimeout(); } },
    bonus: function (sec) { remaining = Math.min(TOTAL, remaining + sec); render(); },
    set: function (sec) { remaining = Math.max(0, Math.min(TOTAL, sec)); render(); },
    get: function () { return remaining; },
    isRunning: function () { return running; }
  };
})();
