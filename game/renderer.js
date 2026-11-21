// renderer.js — menggambar satu scene dua kali (ASLI vs BERUBAH) dari satu definisi.
// Satu tugas: mengubah scene + state ketemu jadi markup SVG dua panel.
(function () {
  var W = 620, H = 470;

  function markerMarkup(diff, idx) {
    // Cincin emas BERDENYUT + percikan bintang + nomor (efek; di mode screenshot animasi dibekukan).
    var x = diff.x, y = diff.y, r = diff.r || 28;
    var sparks = '';
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (d) {
      var sx = x + d[0] * (r + 8), sy = y + d[1] * (r + 8);
      sparks += '<path class="sparkle" d="M' + sx + ' ' + (sy - 5) + ' L' + (sx + 1.8) + ' ' + (sy - 1.8) +
        ' L' + (sx + 5) + ' ' + sy + ' L' + (sx + 1.8) + ' ' + (sy + 1.8) + ' L' + sx + ' ' + (sy + 5) +
        ' L' + (sx - 1.8) + ' ' + (sy + 1.8) + ' L' + (sx - 5) + ' ' + sy + ' L' + (sx - 1.8) + ' ' + (sy - 1.8) +
        ' Z" fill="#ffd97a" stroke="#d9a441" stroke-width="0.8"/>';
    });
    return '<g class="found-ring">' +
      '<circle class="ring-pulse" cx="' + x + '" cy="' + y + '" r="' + r + '" fill="rgba(217,164,65,0.18)" stroke="#d9a441" stroke-width="6.5"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 7) + '" fill="none" stroke="#ffd97a" stroke-width="3"/>' +
      sparks +
      '<circle cx="' + (x + r * 0.62) + '" cy="' + (y - r * 0.62) + '" r="12.5" fill="#d9a441" stroke="#fff" stroke-width="2.5"/>' +
      '<text x="' + (x + r * 0.62) + '" y="' + (y - r * 0.62 + 5) + '" text-anchor="middle" font-size="14" font-weight="900" fill="#2b2118">' + (idx + 1) + '</text>' +
      '</g>';
  }
  function floatNumber(diff, idx) {
    // Angka melayang sesaat saat ketemu (dihapus sendiri oleh diff-engine).
    return '<g class="float-num"><text x="' + diff.x + '" y="' + (diff.y - diff.r - 8) +
      '" text-anchor="middle" font-size="26" font-weight="900" fill="#d9a441" stroke="#2b2118" stroke-width="4" paint-order="stroke">+' +
      (idx + 1) + '</text></g>';
  }
  function renderInto(frameId, scene, variant, foundIds, floatIdx) {
    var frame = document.getElementById(frameId);
    if (!frame || !scene) return;
    var found = foundIds || [];
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      scene.name + ' (' + variant + ')">' + scene.draw(variant);
    found.forEach(function (fid) {
      var idx = scene.diffs.findIndex(function (d) { return d.id === fid; });
      if (idx >= 0) svg += markerMarkup(scene.diffs[idx], idx);
    });
    if (floatIdx !== undefined && floatIdx !== null) {
      var fd = scene.diffs[floatIdx];
      if (fd) svg += floatNumber(fd, floatIdx);
    }
    svg += '</svg>';
    frame.innerHTML = svg;
  }
  window.MUSEUM_RENDERER = {
    width: W,
    height: H,
    renderScene: function (scene, foundIds, floatIdx) {
      renderInto('frame-left', scene, 'asli', foundIds, floatIdx);
      renderInto('frame-right', scene, 'berubah', foundIds, floatIdx);
    }
  };
})();
