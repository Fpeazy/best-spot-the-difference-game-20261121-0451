// scenes.js — data + gambar tiap scene (SVG flat vector BERLAPIS:
// background / midground / foreground yang jelas, palet hangat museum).
// Satu tugas: mendefinisikan apa yang digambar + di mana 30 perbedaannya.
// Setiap scene punya draw('asli' | 'berubah') -> markup SVG dalam viewBox 620x470.
// Aturan fairness: setiap diff >=24px pada render 1024px (radius hit >= 26 di sini).
(function () {
  var NS = 'http://www.w3.org/2000/svg';

  // ---------- helper bentuk ----------
  // Moci, kucing museum: tidur meringkuk. (x, y) = tengah badan.
  function cat(x, y, s, body) {
    s = s || 1;
    body = body || '#e8912d';
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
      '<ellipse cx="0" cy="6" rx="26" ry="13" fill="' + body + '"/>' +
      '<circle cx="20" cy="-4" r="11" fill="' + body + '"/>' +
      '<path d="M13 -12 L16 -20 L21 -12 Z" fill="' + body + '"/>' +
      '<path d="M24 -12 L27 -20 L31 -11 Z" fill="' + body + '"/>' +
      '<path d="M-24 2 Q-34 -8 -26 -16" stroke="' + body + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<path d="M-14 -4 Q-6 -6 2 -4 M6 2 Q14 0 20 -2" stroke="#b96f1e" stroke-width="2" fill="none"/>' +
      '<circle cx="23" cy="-6" r="1.6" fill="#2b2118"/>' +
      '<path d="M28 -2 Q30 1 27 2" stroke="#2b2118" stroke-width="1.4" fill="none"/>' +
      '</g>';
  }
  // Bingkai kain batik: bingkai emas + motif. (x, y, w, h, motif)
  function batikFrame(x, y, w, h, motif) {
    return '<g>' +
      '<rect x="' + (x - 5) + '" y="' + (y - 5) + '" width="' + (w + 10) + '" height="' + (h + 10) +
      '" rx="4" fill="#8a6d2f"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#fdf6e3" stroke="#d9a441" stroke-width="1.5"/>' +
      motif +
      '</g>';
  }
  // Motif mega mendung: awan berlapis. warna = biru (asli) / hijau (berubah).
  function megaMendung(x, y, w, h, color) {
    var s = '';
    var rows = [[0, 18], [1, 34], [0, 50], [1, 66]];
    rows.forEach(function (r) {
      var off = r[0] * 14, yy = y + r[1];
      for (var cx = x + 8 + off; cx < x + w - 6; cx += 28) {
        s += '<path d="M' + cx + ' ' + yy + ' a11 11 0 0 1 22 0 Z" fill="' + color + '" stroke="rgba(43,33,24,0.25)" stroke-width="1"/>';
      }
    });
    return s;
  }
  // Motif parang: garis diagonal. n = jumlah garis (asli 4, berubah 3).
  function parang(x, y, w, h, n) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var x0 = x + 10 + i * 34;
      s += '<path d="M' + x0 + ' ' + (y + h - 8) + ' L' + (x0 + 26) + ' ' + (y + 8) +
        '" stroke="#7a3b1e" stroke-width="8" stroke-linecap="round"/>';
      s += '<circle cx="' + (x0 + 13) + '" cy="' + (y + h / 2) + '" r="4.5" fill="#c96f3f"/>';
    }
    return s;
  }
  function kawung(x, y, w, h) {
    var s = '';
    [[0.25, 0.3], [0.75, 0.3], [0.25, 0.75], [0.75, 0.75]].forEach(function (p) {
      var cx = x + w * p[0], cy = y + h * p[1];
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="16" fill="none" stroke="#0f5f5c" stroke-width="5"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#d9a441"/>';
    });
    return s;
  }
  function truntum(x, y, w, h) {
    var s = '';
    for (var i = 0; i < 8; i++) {
      var cx = x + 14 + (i % 4) * 34, cy = y + 16 + Math.floor(i / 4) * 42;
      s += '<path d="M' + cx + ' ' + (cy - 8) + ' L' + (cx + 3) + ' ' + (cy - 3) + ' L' + (cx + 8) + ' ' + cy +
        ' L' + (cx + 3) + ' ' + (cy + 3) + ' L' + cx + ' ' + (cy + 8) + ' L' + (cx - 3) + ' ' + (cy + 3) +
        ' L' + (cx - 8) + ' ' + cy + ' L' + (cx - 3) + ' ' + (cy - 3) + ' Z" fill="#8a2f5c"/>';
    }
    return s;
  }
  function sidomukti(x, y, w, h) {
    var s = '';
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 2; j++) {
        var cx = x + 22 + i * 44, cy = y + 20 + j * 40;
        s += '<rect x="' + (cx - 11) + '" y="' + (cy - 11) + '" width="22" height="22" fill="none" stroke="#b23a2e" stroke-width="4" transform="rotate(45 ' + cx + ' ' + cy + ')"/>' +
          '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#b23a2e"/>';
      }
    }
    return s;
  }
  function lasem(x, y, w, h) {
    var s = '';
    var cw = w / 6, ch = h / 3;
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 3; j++) {
        if ((i + j) % 2 === 0) s += '<rect x="' + (x + i * cw) + '" y="' + (y + j * ch) + '" width="' + cw + '" height="' + ch + '" fill="#a83226"/>';
      }
    }
    return s;
  }

  // ================= SCENE 1 — GALERI BATIK =================
  var scene1 = {
    id: 'batik',
    name: 'Galeri Batik',
    sub: 'Ruangan 1 dari 3',
    diffCount: 8,
    diffs: [
      { id: 1, name: 'Motif parang — satu garis hilang', type: 'removed', x: 310, y: 137, r: 36 },
      { id: 2, name: 'Mega mendung — biru jadi hijau', type: 'recoloured', x: 120, y: 137, r: 36 },
      { id: 3, name: 'Kucing Moci — hilang dari bangku', type: 'removed', x: 330, y: 392, r: 34 },
      { id: 4, name: 'Tanda — MENYENTUH jadi MEMOTRET', type: 'word', x: 525, y: 340, r: 36, shape: 'rect', rx: 55, ry: 20 },
      { id: 5, name: 'Pot tanaman — daun 5 jadi 4', type: 'removed', x: 75, y: 350, r: 34 },
      { id: 6, name: 'Lampu langit-langit — 3 nyala jadi 2', type: 'removed', x: 410, y: 38, r: 31 },
      { id: 7, name: 'Ubin lantai — motif terbalik', type: 'flipped', x: 505, y: 447, r: 31 },
      { id: 8, name: 'Bingkai batik lasem — mengecil', type: 'resized', x: 500, y: 257, r: 38 }
    ],
    draw: function (variant) {
      var B = variant === 'berubah';
      var s = '';
      // defs: gradasi dinding + lantai + glow lampu
      s += '<defs>' +
        '<linearGradient id="wall1" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#fdf3d8"/><stop offset="1" stop-color="#eec98f"/></linearGradient>' +
        '<linearGradient id="floor1" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#b98a52"/><stop offset="1" stop-color="#7d5527"/></linearGradient>' +
        '<radialGradient id="lampGlow" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#ffe9a8" stop-opacity="0.9"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>' +
        '</defs>';
      // ---- BACKGROUND: dinding + jendela lengkung + langit-langit ----
      s += '<rect x="0" y="0" width="620" height="400" fill="url(#wall1)"/>';
      s += '<rect x="0" y="0" width="620" height="14" fill="#8a6d2f"/>';
      [70, 300, 520].forEach(function (cx) {
        s += '<g><path d="M' + (cx - 34) + ' 78 L' + (cx - 34) + ' 34 A34 26 0 0 1 ' + (cx + 34) +
          ' 34 L' + (cx + 34) + ' 78 Z" fill="#bfe0ea" stroke="#8a6d2f" stroke-width="4"/>' +
          '<circle cx="' + (cx + 10) + '" cy="48" r="10" fill="#ffd97a"/>' +
          '<path d="M' + (cx - 24) + ' 62 Q' + (cx - 8) + ' 52 ' + (cx + 6) + ' 62 Q' + (cx + 20) + ' 70 ' + (cx + 26) + ' 60" stroke="#fff" stroke-width="3" fill="none"/></g>';
        // ambang jendela (finishing): garis tegas di bawah lengkung
        s += '<rect x="' + (cx - 38) + '" y="78" width="76" height="5" rx="2" fill="#8a6d2f"/>';
      });
      // lampu langit-langit (3, tengah mati di berubah) — di antara jendela, bukan di depannya
      [185, 410, 590].forEach(function (cx, i) {
        var lit = !(B && i === 1);
        s += '<line x1="' + cx + '" y1="14" x2="' + cx + '" y2="26" stroke="#6b5636" stroke-width="3"/>';
        if (lit) s += '<circle cx="' + cx + '" cy="40" r="31" fill="url(#lampGlow)"/>';
        s += '<path d="M' + (cx - 14) + ' 26 L' + (cx + 14) + ' 26 L' + (cx + 8) + ' 40 L' + (cx - 8) + ' 40 Z" fill="' + (lit ? '#d9a441' : '#8a7a5c') + '"/>' +
          '<circle cx="' + cx + '" cy="42" r="7.5" fill="' + (lit ? '#fff3c4' : '#6b6248') + '"/>';
      });
      // ---- MIDGROUND: 6 bingkai batik (2 baris x 3) ----
      s += batikFrame(40, 96, 150, 84, megaMendung(40, 96, 150, 84, B ? '#3f8f5f' : '#2f6fb2'));
      s += batikFrame(235, 96, 150, 84, parang(235, 96, 150, 84, B ? 3 : 4));
      s += batikFrame(430, 96, 150, 84, kawung(430, 96, 150, 84));
      s += batikFrame(40, 210, 150, 84, truntum(40, 210, 150, 84));
      s += batikFrame(235, 210, 150, 84, sidomukti(235, 210, 150, 84));
      // lasem: mengecil di berubah
      if (B) s += '<g transform="translate(500,257) scale(0.82) translate(-500,-257)">' + batikFrame(430, 210, 150, 84, lasem(430, 210, 150, 84)) + '</g>';
      else s += batikFrame(430, 210, 150, 84, lasem(430, 210, 150, 84));
      // tanda di dinding kanan
      s += '<g><rect x="470" y="320" width="110" height="40" rx="6" fill="#2b2118" stroke="#d9a441" stroke-width="1.5"/>' +
        '<text x="525" y="338" text-anchor="middle" fill="#f7ead2" font-size="14" font-weight="bold">DILARANG</text>' +
        '<text x="525" y="354" text-anchor="middle" fill="#ffd97a" font-size="14" font-weight="bold">' + (B ? 'MEMOTRET' : 'MENYENTUH') + '</text></g>';
      // ---- FOREGROUND: lantai + ubin + bangku + pot ----
      s += '<rect x="0" y="400" width="620" height="70" fill="url(#floor1)"/>';
      for (var px = 0; px < 620; px += 62) {
        s += '<line x1="' + px + '" y1="400" x2="' + px + '" y2="470" stroke="#7a5230" stroke-width="2"/>';
      }
      // ubin motif di lantai (satu terbalik di berubah)
      for (var tx = 0; tx < 5; tx++) {
        var ux = 30 + tx * 120;
        var flip = (B && tx === 4);
        s += '<g transform="translate(' + ux + ',432) ' + (flip ? 'scale(-1,1) translate(-40,0)' : '') + '">' +
          '<rect x="0" y="0" width="40" height="30" rx="3" fill="#e8dcc0" stroke="#8a6d2f" stroke-width="2"/>' +
          '<path d="M20 4 L26 15 L20 26 L14 15 Z" fill="#c96f3f"/></g>';
      }
      // karpet runner bermotif di lantai (dekorasi non-diff, di bawah bangku)
      s += '<g><rect x="205" y="406" width="250" height="60" rx="4" fill="#a83226" stroke="#7a241a" stroke-width="2"/>' +
        '<rect x="213" y="412" width="234" height="48" rx="3" fill="none" stroke="#d9a441" stroke-width="2"/></g>';
      for (var dx = 232; dx <= 428; dx += 28) {
        s += '<path d="M' + dx + ' 428 L' + (dx + 7) + ' 436 L' + dx + ' 444 L' + (dx - 7) + ' 436 Z" fill="#d9a441"/>';
      }
      // pot tanaman kiri (5 daun -> 4)
      s += '<g><path d="M55 400 L60 372 L95 372 L100 400 Z" fill="#a83226"/>' +
        '<rect x="52" y="366" width="50" height="10" rx="3" fill="#7a241a"/></g>';
      var leaves = B ? 4 : 5;
      for (var li = 0; li < leaves; li++) {
        var lx = 62 + li * 11, lh = 26 - Math.abs(li - 2) * 5;
        s += '<ellipse cx="' + lx + '" cy="' + (368 - lh / 2) + '" rx="6" ry="' + lh / 2 + '" fill="#3f7d3a" transform="rotate(' + ((li - 2) * 12) + ' ' + lx + ' 368)"/>';
      }
      // pot tanaman kedua di ujung kiri deretan bangku (dekorasi non-diff)
      s += '<g><path d="M192 400 L196 372 L220 372 L224 400 Z" fill="#2f6f5c"/>' +
        '<rect x="188" y="366" width="36" height="10" rx="3" fill="#245548"/>' +
        '<circle cx="198" cy="360" r="10" fill="#4a8f3f" stroke="#2f5c28" stroke-width="1"/>' +
        '<circle cx="206" cy="352" r="11" fill="#55a047" stroke="#2f5c28" stroke-width="1"/>' +
        '<circle cx="214" cy="360" r="10" fill="#4a8f3f" stroke="#2f5c28" stroke-width="1"/></g>';
      // pedestal display + vas keramik di ujung kanan deretan bangku (dekorasi non-diff)
      s += '<g><rect x="436" y="352" width="32" height="50" fill="#6b5636"/>' +
        '<rect x="434" y="348" width="34" height="6" rx="2" fill="#d9a441"/>' +
        '<rect x="434" y="400" width="34" height="5" fill="#4a3a22"/>' +
        '<path d="M442 348 C436 336 436 328 444 324 L460 324 C468 328 468 336 462 348 Z" fill="#2f6fb2"/>' +
        '<rect x="442" y="334" width="20" height="4" fill="#fdf6e3"/>' +
        '<rect x="448" y="320" width="8" height="6" fill="#2f6fb2"/>' +
        '<path d="M452 320 Q448 310 444 308" stroke="#3f7d3a" stroke-width="2" fill="none"/>' +
        '<path d="M452 320 Q456 310 460 308" stroke="#3f7d3a" stroke-width="2" fill="none"/></g>';
      // bayangan lembut di bawah bangku + pot (cahaya dari langit-langit, atas)
      s += '<ellipse cx="320" cy="430" rx="115" ry="8" fill="#000" opacity="0.12"/>' +
        '<ellipse cx="78" cy="426" rx="38" ry="6" fill="#000" opacity="0.12"/>' +
        '<ellipse cx="206" cy="424" rx="26" ry="5" fill="#000" opacity="0.12"/>';
      // bangku kayu + Moci (hilang di berubah)
      s += '<g><rect x="230" y="384" width="200" height="14" rx="4" fill="#7a5230"/>' +
        '<rect x="230" y="384" width="200" height="3" rx="1.5" fill="#a87b45"/>' +
        '<rect x="242" y="398" width="12" height="26" fill="#5d3d20"/>' +
        '<rect x="406" y="398" width="12" height="26" fill="#5d3d20"/></g>';
      if (!B) s += cat(330, 378, 1);
      // tali pembatas depan bingkai bawah (foreground tipis)
      s += '<g><line x1="30" y1="318" x2="590" y2="318" stroke="#d9a441" stroke-width="4"/>' +
        '<circle cx="30" cy="318" r="6" fill="#8a6d2f"/><circle cx="310" cy="318" r="6" fill="#8a6d2f"/><circle cx="590" cy="318" r="6" fill="#8a6d2f"/></g>';
      return s;
    }
  };

  // ================= SCENE 2 — RUANG FOSIL =================
  var scene2 = {
    id: 'fosil',
    name: 'Ruang Fosil',
    sub: 'Ruangan 2 dari 3',
    diffCount: 10,
    diffs: [
      { id: 1, name: 'Triceratops — tanduk 3 jadi 2', type: 'removed', x: 95, y: 285, r: 26 },
      { id: 2, name: 'Label — REX jadi REXX', type: 'word', x: 310, y: 385, r: 28, shape: 'rect', rx: 70, ry: 14 },
      { id: 3, name: 'Amonit — spiral berbalik arah', type: 'flipped', x: 90, y: 110, r: 30 },
      { id: 4, name: 'Trilobit di vitrin — 4 jadi 5', type: 'added', x: 505, y: 300, r: 26 },
      { id: 5, name: 'Tangga — anak tangga 6 jadi 5', type: 'removed', x: 60, y: 420, r: 28 },
      { id: 6, name: 'Spotlight — sorot pindah ke ekor', type: 'moved', x: 220, y: 260, r: 30 },
      { id: 7, name: 'Jejak kaki — 3 pasang jadi 2', type: 'removed', x: 420, y: 440, r: 26 },
      { id: 8, name: 'Pterodactyl — sayap terlipat jadi terbentang', type: 'moved', x: 390, y: 125, r: 28 },
      { id: 9, name: 'Peta dinding — satu benua hilang', type: 'removed', x: 520, y: 100, r: 28 },
      { id: 10, name: 'Gigi T-rex — satu gigi emas', type: 'recoloured', x: 215, y: 275, r: 22 }
    ],
    draw: function (variant) {
      var B = variant === 'berubah';
      var s = '';
      s += '<defs>' +
        '<linearGradient id="wall2" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#125e58"/><stop offset="1" stop-color="#083632"/></linearGradient>' +
        '<linearGradient id="floor2" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#33383e"/><stop offset="1" stop-color="#1d2024"/></linearGradient>' +
        '<radialGradient id="spot2" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#ffe9a8" stop-opacity="0.65"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>' +
        '</defs>';
      // ---- BACKGROUND: dinding teal + amonit + peta ----
      s += '<rect x="0" y="0" width="620" height="400" fill="url(#wall2)"/>';
      // amonit besar di dinding kiri (spiral berbalik di berubah)
      s += '<g transform="translate(90,110) ' + (B ? 'scale(-1,1)' : '') + '">' +
        '<circle r="34" fill="#e8dcc0" stroke="#8a6d2f" stroke-width="4"/>' +
        '<path d="M0 0 A6 6 0 0 1 6 -6 A12 12 0 0 1 0 -18 A20 20 0 0 1 -20 -8 A28 28 0 0 1 -14 16 A32 32 0 0 1 16 12" fill="none" stroke="#8a6d2f" stroke-width="4"/>' +
        '<circle r="4" fill="#8a6d2f"/></g>';
      // peta dinding kanan (satu benua hilang di berubah)
      s += '<g><rect x="470" y="60" width="120" height="80" rx="4" fill="#e8dcc0" stroke="#8a6d2f" stroke-width="3"/>' +
        '<ellipse cx="505" cy="92" rx="20" ry="14" fill="#3f7d5a"/>' +
        '<ellipse cx="545" cy="108" rx="16" ry="11" fill="#3f7d5a"/>' +
        (B ? '' : '<ellipse cx="568" cy="82" rx="10" ry="7" fill="#3f7d5a"/>') +
        '<path d="M480 128 Q530 122 580 130" stroke="#7a9cc6" stroke-width="3" fill="none"/></g>';
      // jendela gelap atas
      s += '<rect x="230" y="24" width="160" height="54" rx="26" fill="#0d2b33" stroke="#8a6d2f" stroke-width="3"/>' +
        '<circle cx="350" cy="44" r="12" fill="#e8e0c0" opacity="0.8"/>';
      // ---- MIDGROUND: spotlight + T-rex + triceratops + vitrin + pterodactyl ----
      // sorot lampu: ke tengkorak (asli) / ke ekor (berubah)
      var spotX = B ? 440 : 215;
      s += '<path d="M310 14 L' + (spotX - 55) + ' 300 L' + (spotX + 55) + ' 300 Z" fill="url(#spot2)"/>';
      s += '<circle cx="310" cy="20" r="10" fill="#d9a441"/>';
      // kolam cahaya spotlight di lantai (satu sumber cahaya: dari atas ke T-rex)
      s += '<ellipse cx="' + spotX + '" cy="408" rx="72" ry="10" fill="#ffe9a8" opacity="0.28"/>';
      // pterodactyl gantung (sayap terlipat / terbentang)
      s += '<line x1="390" y1="14" x2="390" y2="100" stroke="#2b2118" stroke-width="2"/>';
      if (B) {
        s += '<g fill="#c9b48a"><ellipse cx="390" cy="118" rx="16" ry="8"/><path d="M376 116 L330 96 L372 128 Z"/><path d="M404 116 L450 96 L408 128 Z"/><circle cx="404" cy="112" r="6"/></g>';
      } else {
        s += '<g fill="#c9b48a"><ellipse cx="390" cy="118" rx="16" ry="8"/><path d="M376 116 L352 138 L378 128 Z"/><path d="M404 116 L428 138 L402 128 Z"/><circle cx="404" cy="112" r="6"/></g>';
      }
      // kerangka T-rex (tengah): tengkorak, tulang punggung, rusuk, kaki, ekor
      s += '<g stroke="#e8dcc0" stroke-width="7" stroke-linecap="round" fill="none">' +
        '<path d="M150 320 L210 300 L280 292 L360 296 L450 320"/>' + // tulang punggung
        '<path d="M210 300 L205 340 M245 296 L242 344 M280 294 L280 346 M315 295 L318 344 M350 296 L356 340"/>' + // rusuk
        '<path d="M250 340 L240 392 M330 342 L342 392"/>' + // kaki
        '<path d="M450 320 L505 345"/>' + // ekor
        '</g>';
      // tengkorak T-rex + rahang + gigi (satu emas di berubah)
      s += '<g><ellipse cx="200" cy="278" rx="34" ry="24" fill="#e8dcc0" stroke="#b9a888" stroke-width="1.5"/>' +
        '<path d="M172 286 L196 302 L222 288 Z" fill="#e8dcc0"/>' +
        '<circle cx="188" cy="270" r="5" fill="#2b2118"/>' +
        '<path d="M176 292 l4 8 4 -8 4 8 4 -8" stroke="#fff" stroke-width="2" fill="none"/>' +
        '<path d="M196 292 l4 8 4 -8" stroke="' + (B ? '#d9a441' : '#fff') + '" stroke-width="3" fill="none"/></g>';
      // label nama Latin
      s += '<g><rect x="240" y="372" width="140" height="26" rx="4" fill="#2b2118" stroke="#d9a441" stroke-width="1"/>' +
        '<text x="310" y="390" text-anchor="middle" fill="#ffd97a" font-size="14" font-weight="bold" letter-spacing="1">TYRANNOSAURUS ' + (B ? 'REXX' : 'REX') + '</text></g>';
      // tengkorak triceratops di podium kiri (3 tanduk -> 2)
      s += '<g><rect x="55" y="330" width="90" height="16" fill="#8a6d2f"/><rect x="70" y="346" width="60" height="54" fill="#6b5636"/>' +
        '<ellipse cx="100" cy="300" rx="30" ry="20" fill="#e8dcc0" stroke="#b9a888" stroke-width="1.5"/>' +
        '<path d="M78 288 L70 262 L86 282 Z" fill="#e8dcc0"/>' +
        (B ? '' : '<path d="M100 282 L100 254 L110 282 Z" fill="#e8dcc0"/>') +
        '<path d="M118 288 L130 262 L126 290 Z" fill="#e8dcc0"/>' +
        '<circle cx="112" cy="296" r="4" fill="#2b2118"/></g>';
      // vitrin trilobit kanan (4 -> 5) + rim light di tepi atas (cahaya dari atas)
      s += '<g><rect x="470" y="270" width="90" height="70" rx="4" fill="#bfe0ea" opacity="0.28" stroke="#d9a441" stroke-width="3"/>' +
        '<line x1="470" y1="270" x2="560" y2="270" stroke="#ffd97a" stroke-width="2.5" opacity="1"/>' +
        '<rect x="470" y="340" width="90" height="12" fill="#8a6d2f"/></g>';
      var tri = B ? 5 : 4;
      for (var ti = 0; ti < tri; ti++) {
        var txp = 488 + (ti % 3) * 26, typ = 292 + Math.floor(ti / 3) * 26;
        s += '<ellipse cx="' + txp + '" cy="' + typ + '" rx="9" ry="6" fill="#b98a4a" stroke="#5d3d20" stroke-width="2"/>' +
          '<line x1="' + txp + '" y1="' + (typ - 6) + '" x2="' + txp + '" y2="' + (typ + 6) + '" stroke="#5d3d20" stroke-width="2"/>';
      }
      // ---- FOREGROUND: lantai + tangga + jejak ----
      s += '<rect x="0" y="400" width="620" height="70" fill="url(#floor2)"/>';
      // tangga kiri (6 anak tangga -> 5)
      var steps = B ? 5 : 6;
      for (var si = 0; si < steps; si++) {
        var sx = 20 + si * 12, sy = 448 - si * 8;
        s += '<rect x="' + sx + '" y="' + sy + '" width="60" height="8" fill="#5d6b74" stroke="#2b2118" stroke-width="1"/>' +
          '<line x1="' + sx + '" y1="' + sy + '" x2="' + (sx + 60) + '" y2="' + sy + '" stroke="#aeb9c2" stroke-width="2"/>';
      }
      // jejak kaki di lantai (3 pasang -> 2)
      var pairs = B ? 2 : 3;
      for (var fi = 0; fi < pairs; fi++) {
        var fx = 380 + fi * 42;
        s += '<ellipse cx="' + fx + '" cy="436" rx="7" ry="11" fill="#c9b48a" opacity="0.8" transform="rotate(-12 ' + fx + ' 436)"/>' +
          '<ellipse cx="' + (fx + 14) + '" cy="452" rx="7" ry="11" fill="#c9b48a" opacity="0.8" transform="rotate(12 ' + (fx + 14) + ' 452)"/>';
      }
      // tali pembatas
      s += '<g><line x1="180" y1="368" x2="470" y2="368" stroke="#d9a441" stroke-width="3"/>' +
        '<circle cx="180" cy="368" r="6" fill="#8a6d2f"/><circle cx="325" cy="368" r="6" fill="#8a6d2f"/><circle cx="470" cy="368" r="6" fill="#8a6d2f"/></g>';
      return s;
    }
  };

  // ================= SCENE 3 — MENARA PLANETARIUM =================
  var scene3 = {
    id: 'planetarium',
    name: 'Menara Planetarium',
    sub: 'Ruangan 3 dari 3',
    diffCount: 12,
    diffs: [
      { id: 1, name: 'Saturnus — cincin 2 jadi 1', type: 'removed', x: 140, y: 140, r: 30 },
      { id: 2, name: 'Rasi Biduk — satu bintang hilang', type: 'removed', x: 250, y: 60, r: 24 },
      { id: 3, name: 'Teleskop — mengarah ke Mars', type: 'moved', x: 300, y: 300, r: 30 },
      { id: 4, name: 'Label peta — ORION jadi ORIONN', type: 'word', x: 90, y: 200, r: 26, shape: 'rect', rx: 40, ry: 14 },
      { id: 5, name: 'Mars — merah jadi oranye', type: 'recoloured', x: 300, y: 110, r: 26 },
      { id: 6, name: 'Bulan sabit — menghadap kanan', type: 'flipped', x: 540, y: 130, r: 28 },
      { id: 7, name: 'Meja kontrol — tombol 6 jadi 5', type: 'removed', x: 310, y: 400, r: 28 },
      { id: 8, name: 'Astronot — visor turun', type: 'moved', x: 520, y: 290, r: 26 },
      { id: 9, name: 'Bintang jatuh — muncul', type: 'added', x: 400, y: 70, r: 26 },
      { id: 10, name: 'Jupiter — garis 3 jadi 2', type: 'removed', x: 460, y: 150, r: 28 },
      { id: 11, name: 'Jam dinding — 21:00 jadi 22:00', type: 'moved', x: 560, y: 60, r: 24 },
      { id: 12, name: 'Kucing Moci — tidur di peta bintang', type: 'added', x: 350, y: 445, r: 26 }
    ],
    draw: function (variant) {
      var B = variant === 'berubah';
      var s = '';
      s += '<defs>' +
        '<linearGradient id="wall3" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#27377a"/><stop offset="0.6" stop-color="#16224f"/><stop offset="1" stop-color="#0b1230"/></linearGradient>' +
        '<linearGradient id="floor3" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#2c3550"/><stop offset="1" stop-color="#141a2e"/></linearGradient>' +
        '<radialGradient id="spot3" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#9fb4ff" stop-opacity="0.5"/><stop offset="1" stop-color="#9fb4ff" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#cfe0ff" stop-opacity="0.35"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></radialGradient>' +
        '</defs>';
      // ---- BACKGROUND: kubah + bintang berkelip + Biduk ----
      s += '<path d="M0 400 L0 150 A310 190 0 0 1 620 150 L620 400 Z" fill="url(#wall3)"/>';
      s += '<rect x="0" y="400" width="620" height="70" fill="url(#floor3)"/>';
      // bintang kecil berkelip (efek: class twinkle, delay berbeda)
      var stars = [[40, 90], [90, 60], [150, 120], [210, 50], [260, 130], [330, 60], [380, 120], [430, 50], [480, 100], [540, 60], [580, 140], [60, 180], [200, 170], [330, 180], [500, 190], [580, 210], [120, 220], [260, 230], [420, 220]];
      stars.forEach(function (p, i) {
        s += '<circle class="twinkle" style="animation-delay:' + (i * 0.35) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (2.5 + (i % 3) * 0.5) + '" fill="#fff"/>';
      });
      // Rasi Biduk (satu bintang hilang di berubah)
      var dipper = [[180, 60], [215, 48], [250, 60], [280, 82], [310, 78], [335, 55], [355, 88]];
      s += '<g stroke="#ffd97a" stroke-width="2.5" fill="none"><path d="M180 60 L215 48 L250 60 L280 82 L310 78 L335 55"/></g>';
      dipper.forEach(function (p, i) {
        if (B && i === 2) return; // bintang hilang
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#ffd97a"/>';
      });
      // bintang jatuh (hanya di berubah)
      if (B) {
        s += '<g><line x1="400" y1="70" x2="440" y2="96" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' +
          '<circle cx="400" cy="70" r="4" fill="#fff"/></g>';
      }
      // jendela bulan sabit — sabit TEBAL yang terbaca: cakram pucat + carving gelap
      s += '<circle cx="540" cy="130" r="46" fill="url(#moonGlow)"/>' +
        '<g><circle cx="540" cy="130" r="34" fill="#1b2a5e" stroke="#d9a441" stroke-width="3"/>' +
        '<circle cx="540" cy="130" r="21" fill="#ffe9a8"/>' +
        '<circle cx="' + (B ? 530 : 550) + '" cy="126" r="18" fill="#1b2a5e"/></g>';
      // seberkas cahaya bulan dari jendela ke lantai (sumber cahaya kedua yang lembut)
      s += '<path d="M522 162 L558 162 L606 400 L486 400 Z" fill="#cfe0ff" opacity="0.07"/>';
      // jam dinding (21:00 -> 22:00)
      s += '<g><circle cx="560" cy="60" r="20" fill="#f7ead2" stroke="#8a6d2f" stroke-width="3"/>' +
        '<line x1="560" y1="60" x2="560" y2="46" stroke="#2b2118" stroke-width="3"/>' +
        '<line x1="560" y1="60" x2="' + (B ? '572' : '548') + '" y2="60" stroke="#2b2118" stroke-width="3"/>' +
        '<circle cx="560" cy="60" r="2.5" fill="#2b2118"/></g>';
      // ---- MIDGROUND: planet + teleskop + astronot + peta bintang ----
      // Saturnus (2 cincin -> 1)
      s += '<g><circle cx="140" cy="140" r="34" fill="#eec27a" stroke="#b98a4a" stroke-width="1.5"/>' +
        '<ellipse cx="140" cy="140" rx="56" ry="14" fill="none" stroke="#d9a441" stroke-width="5" transform="rotate(-18 140 140)"/>' +
        (B ? '' : '<ellipse cx="140" cy="140" rx="66" ry="18" fill="none" stroke="#c9a24a" stroke-width="3" transform="rotate(-18 140 140)"/>') +
        '<path d="M118 128 Q140 118 162 130" stroke="#c9a24a" stroke-width="3" fill="none"/></g>';
      // Mars (merah -> oranye)
      s += '<circle cx="300" cy="110" r="24" fill="' + (B ? '#e8912d' : '#c65a3a') + '" stroke="#8a3a20" stroke-width="1.5"/>' +
        '<circle cx="292" cy="104" r="5" fill="#8a3a20" opacity="0.6"/><circle cx="308" cy="118" r="4" fill="#8a3a20" opacity="0.6"/>';
      // Jupiter (3 garis -> 2)
      s += '<circle cx="460" cy="150" r="30" fill="#d8b48a" stroke="#a8825a" stroke-width="1.5"/>' +
        '<path d="M432 142 Q460 136 488 142" stroke="#a83226" stroke-width="5" fill="none"/>' +
        '<path d="M432 156 Q460 150 488 156" stroke="#a83226" stroke-width="5" fill="none"/>' +
        (B ? '' : '<path d="M436 168 Q460 163 484 168" stroke="#c96f3f" stroke-width="4" fill="none"/>');
      // peta bintang di dinding kiri + label ORION(N)
      s += '<g><rect x="40" y="180" width="110" height="70" rx="4" fill="#0d1a3a" stroke="#d9a441" stroke-width="2"/>' +
        '<circle cx="70" cy="205" r="3" fill="#fff"/><circle cx="95" cy="195" r="3" fill="#fff"/><circle cx="120" cy="210" r="3" fill="#fff"/><circle cx="90" cy="228" r="3" fill="#fff"/>' +
        '<path d="M70 205 L95 195 L120 210 L90 228" stroke="#ffd97a" stroke-width="1.5" fill="none"/>' +
        '<text x="95" y="242" text-anchor="middle" fill="#ffd97a" font-size="13" font-weight="bold">' + (B ? 'ORIONN' : 'ORION') + '</text></g>';
      // teleskop (mengarah bulan / Mars)
      var ang = B ? -28 : -52;
      s += '<g transform="translate(300,330) rotate(' + ang + ')">' +
        '<rect x="-8" y="-70" width="16" height="70" rx="6" fill="#c9c9c9" stroke="#6b6b6b" stroke-width="2"/>' +
        '<line x1="-4" y1="-66" x2="-4" y2="-6" stroke="#fff" stroke-width="2" opacity="0.35"/>' +
        '<circle cx="0" cy="-72" r="10" fill="#9fb4ff"/></g>' +
        '<path d="M288 330 L312 330 L318 380 L282 380 Z" fill="#5d6b74"/>';
      // sorot teleskop
      s += '<path d="M300 262 L' + (B ? '290' : '252') + ' 120 L' + (B ? '318' : '276') + ' 118 Z" fill="url(#spot3)"/>';
      // manekin astronot (visor naik / turun)
      s += '<g><rect x="500" y="300" width="40" height="70" rx="10" fill="#e8e8e8" stroke="#b9b9b9" stroke-width="1.5"/>' +
        '<circle cx="520" cy="278" r="20" fill="#f4f4f4" stroke="#b9b9b9" stroke-width="2"/>' +
        (B ? '<path d="M504 272 A16 16 0 0 1 536 272 L536 282 L504 282 Z" fill="#7fb069"/>' :
          '<path d="M504 272 A16 16 0 0 1 536 272 L536 262 A16 16 0 0 0 504 262 Z" fill="#9fb4ff"/>') +
        '<rect x="508" y="330" width="10" height="8" fill="#c65a3a"/><rect x="524" y="330" width="10" height="8" fill="#c65a3a"/></g>';
      // ---- FOREGROUND: meja kontrol + peta lantai + Moci ----
      s += '<g><rect x="180" y="384" width="260" height="46" rx="8" fill="#3a3f45" stroke="#d9a441" stroke-width="2"/>' +
        '<rect x="180" y="384" width="260" height="4" rx="2" fill="#ffffff" opacity="0.08"/>' +
        '<rect x="196" y="392" width="40" height="22" rx="3" fill="#1d2b1d"/>' +
        '<circle cx="206" cy="403" r="3" fill="#7fd08a"/><circle cx="218" cy="403" r="3" fill="#ffd97a"/></g>';
      var btns = B ? 5 : 6;
      for (var bi = 0; bi < btns; bi++) {
        var bx = 260 + bi * 28;
        s += '<circle cx="' + bx + '" cy="403" r="9" fill="' + ['#c65a3a', '#d9a441', '#3f7d5a', '#7fb069', '#9fb4ff', '#c96f3f'][bi] + '" stroke="#2b2118" stroke-width="2"/>';
      }
      // peta bintang di lantai (border lebih terang supaya terbaca di lantai gelap)
      s += '<g><rect x="60" y="428" width="500" height="34" rx="4" fill="#182642" stroke="#8a9cc6" stroke-width="2.5"/>' +
        '<circle cx="110" cy="445" r="3" fill="#fff"/><circle cx="180" cy="440" r="3" fill="#fff"/><circle cx="250" cy="448" r="3" fill="#fff"/><circle cx="430" cy="442" r="3" fill="#fff"/><circle cx="500" cy="448" r="3" fill="#fff"/>' +
        '<path d="M110 445 L180 440 L250 448" stroke="#ffd97a" stroke-width="1.5" fill="none"/></g>';
      // Moci tidur di peta bintang (hanya di berubah)
      if (B) s += cat(350, 440, 0.9);
      return s;
    }
  };

  window.SCENES = [scene1, scene2, scene3];
})();
