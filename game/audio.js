// audio.js — WebAudio bleeps, tanpa file eksternal. Satu tugas: bunyi game.
(function () {
  var ctx = null;
  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, vol, when) {
    var c = ac();
    if (!c) return;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, c.currentTime + (when || 0));
    g.gain.linearRampToValueAtTime(vol || 0.12, c.currentTime + (when || 0) + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (when || 0) + dur);
    o.connect(g).connect(c.destination);
    o.start(c.currentTime + (when || 0));
    o.stop(c.currentTime + (when || 0) + dur + 0.05);
  }
  window.MUSEUM_AUDIO = {
    found: function () { tone(660, 0.16, 'sine', 0.14); tone(990, 0.22, 'sine', 0.12, 0.09); },
    wrong: function () { tone(140, 0.18, 'triangle', 0.14); },
    hint: function () { tone(1180, 0.1, 'sine', 0.08); tone(1560, 0.14, 'sine', 0.07, 0.07); },
    streak: function () { tone(523, 0.12, 'sine', 0.12); tone(659, 0.12, 'sine', 0.12, 0.1); tone(784, 0.2, 'sine', 0.12, 0.2); },
    victory: function () {
      [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.25, 'sine', 0.13, i * 0.13); });
    },
    click: function () { tone(440, 0.05, 'square', 0.04); }
  };
})();
