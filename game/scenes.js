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
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#fdf6e3" stroke="#e8b64c" stroke-width="2"/>' +
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

  // ---------- V1.4: grade pemenang uji buta 300px ----------
  // Tiga varian diuji buta (A Hangat Dalam, B Golden Hour, C Fokus Sorot):
  // C menang — sorot radial hangat + vignette kuat, dinding peach-emas,
  // cincin paling terbaca di 300px. Nilai C di-hardcode di bawah; hanya
  // warna dinding/lantai/vignette — diff, posisi, dan logika tidak disentuh.
  var GRADE1 = { name: 'Fokus Sorot', con: 1.22, hue: 8, sat: 1.38, vig: 0.60,
    wall: ['#ffe9b0', '#eeb45c', '#c98a3e'], floor: ['#a87c40', '#5d3a1c'], glow: 0.28 };

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
      { id: 7, name: 'Ubin lantai — motif terbalik', type: 'flipped', x: 505, y: 442, r: 26 },
      { id: 8, name: 'Bingkai batik lasem — mengecil', type: 'resized', x: 500, y: 257, r: 38 }
    ],
    draw: function (variant) {
      var B = variant === 'berubah';
      var G = GRADE1;
      var s = '';
      // defs: gradasi dinding + lantai + glow lampu
      s += '<defs>' +
        '<linearGradient id="wall1" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + G.wall[0] + '"/><stop offset="0.55" stop-color="' + G.wall[1] + '"/><stop offset="1" stop-color="' + G.wall[2] + '"/></linearGradient>' +
        '<linearGradient id="floor1" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + G.floor[0] + '"/><stop offset="1" stop-color="' + G.floor[1] + '"/></linearGradient>' +
        '<radialGradient id="lampGlow" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#ffe9a8" stop-opacity="0.9"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="vig1" cx="0.5" cy="0.45" r="0.75">' +
        '<stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="' + G.vig + '"/></radialGradient>' +
        (G.glow ? '<radialGradient id="glow1" cx="0.5" cy="0.42" r="0.55">' +
        '<stop offset="0" stop-color="#fff3c4" stop-opacity="' + G.glow + '"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>' : '') +
        '<filter id="grade1" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">' +
        '<feColorMatrix type="matrix" values="' + (G.sepia ? '0.848 0.192 0.047 0 0 0.087 0.922 0.042 0 0 0.068 0.134 0.783 0 0 0 0 0 1 0' : G.con + ' 0 0 0 0 0 ' + G.con + ' 0 0 0 0 0 ' + G.con + ' 0 0 0 0 0 1 0') + '"/>' +
        '<feColorMatrix type="hueRotate" values="' + G.hue + '"/>' +
        '<feColorMatrix type="saturate" values="' + G.sat + '"/>' +
        '</filter>' +
        '</defs>';
      // Grading resep "Museum Hangat" (skill color-grading-effects):
      // brightnessContrast(0.06, 0.10) + hueSaturation(0.03, 0.22),
      // diterapkan literal sebagai filter SVG (sRGB) pada seluruh scene.
      // V1.3: diperkuat bertahap (saturate 1.22->1.32, kontras 1.10->1.15,
      // hueRotate 5.4->8, vignette 0.35->0.45, dinding/lantai lebih dalam)
      // karena integrasi glfx.js asli tidak jelas lebih baik (dinding
      // memutih, motif tidak lebih terbaca) — direvert ke literal.
      // V1.4: grade pemenang uji buta 300px — C Fokus Sorot (glow 0.28 + vig 0.60).
      s += '<g filter="url(#grade1)">';
      // ---- BACKGROUND: dinding + jendela lengkung + langit-langit ----
      s += '<rect x="0" y="0" width="620" height="400" fill="url(#wall1)"/>';
      // sorot radial hangat (varian C) — hanya dinding, objek tetap terang.
      if (G.glow) s += '<rect x="0" y="0" width="620" height="400" fill="url(#glow1)"/>';
      // vignette resep Museum Hangat (0.6/0.35) — hanya dinding, objek tetap terang.
      s += '<rect x="0" y="0" width="620" height="400" fill="url(#vig1)"/>';
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
      s += '</g>'; // tutup grup grading grade1
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
      { id: 1, name: 'Triceratops — tanduk 3 jadi 2', type: 'removed', x: 85, y: 264, r: 30 },
      { id: 2, name: 'Label — REX jadi REXX', type: 'word', x: 220, y: 385, r: 28, shape: 'rect', rx: 70, ry: 14 },
      { id: 3, name: 'Amonit — spiral berbalik arah', type: 'flipped', x: 90, y: 110, r: 36 },
      { id: 4, name: 'Trilobit di vitrin — 4 jadi 5', type: 'added', x: 522, y: 278, r: 28 },
      { id: 5, name: 'Tangga — anak tangga 6 jadi 5', type: 'removed', x: 110, y: 412, r: 28 },
      { id: 6, name: 'Spotlight — sorot pindah ke ekor', type: 'moved', x: 215, y: 295, r: 32 },
      { id: 7, name: 'Jejak kaki — 3 pasang jadi 2', type: 'removed', x: 470, y: 444, r: 28 },
      { id: 8, name: 'Pterodactyl — sayap terlipat jadi terbentang', type: 'moved', x: 380, y: 112, r: 32 },
      { id: 9, name: 'Peta dinding — satu benua hilang', type: 'removed', x: 583, y: 80, r: 28 },
      { id: 10, name: 'Gigi T-rex — satu gigi emas', type: 'recoloured', x: 150, y: 286, r: 26 }
    ],
    draw: function (variant) {
      var B = variant === 'berubah';
      var s = '';
      s += '<defs>' +
        '<linearGradient id="wall2" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#14706a"/><stop offset="0.55" stop-color="#0d4f49"/><stop offset="1" stop-color="#062622"/></linearGradient>' +
        '<linearGradient id="floor2" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#3a4046"/><stop offset="1" stop-color="#191d21"/></linearGradient>' +
        '<linearGradient id="bone2" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#f6ead0"/><stop offset="1" stop-color="#d9c49a"/></linearGradient>' +
        '<radialGradient id="spot2" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#ffe9a8" stop-opacity="0.75"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="vig2" cx="0.5" cy="0.45" r="0.75">' +
        '<stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>' +
        '<filter id="grade2" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">' +
        '<feColorMatrix type="matrix" values="1.19 0 0 0 -0.11 0 1.19 0 0 -0.11 0 0 1.19 0 0 -0.11 0 0 0 1 0"/>' +
        '<feColorMatrix type="hueRotate" values="-12"/>' +
        '<feColorMatrix type="saturate" values="1.28"/>' +
        '</filter>' +
        '</defs>';
      // Grading resep "Aula Fosil Teal" (skill color-grading-effects):
      // brightnessContrast(-0.04, 0.14) + hueSaturation(-0.06, 0.18),
      // diterapkan literal sebagai filter SVG (sRGB) pada seluruh scene.
      // V1.4: didorong searah pemenang uji buta (sat 1.18->1.28, kontras
      // 1.14->1.19, hue -10.8->-12, vig 0.5->0.55, sorot 0.20->0.24).
      s += '<g filter="url(#grade2)">';
      // ---- BACKGROUND: dinding teal bergradasi + balok langit-langit + molding ----
      s += '<rect x="0" y="0" width="620" height="400" fill="url(#wall2)"/>';
      s += '<rect x="0" y="0" width="620" height="16" fill="#3a2a18"/>' +
        '<rect x="0" y="16" width="620" height="3" fill="#d9a441" opacity="0.7"/>';
      [155, 465].forEach(function (bx) {
        s += '<rect x="' + (bx - 4) + '" y="19" width="8" height="381" fill="#000" opacity="0.10"/>' +
          '<rect x="' + (bx - 1) + '" y="19" width="2" height="381" fill="#ffd97a" opacity="0.18"/>';
      });
      s += '<line x1="0" y1="170" x2="620" y2="170" stroke="#d9a441" stroke-width="2" opacity="0.35"/>';
      // lantai digambar di background supaya kaki T-rex berdiri DI ATAS lantai
      s += '<rect x="0" y="400" width="620" height="70" fill="url(#floor2)"/>';
      s += '<line x1="0" y1="400" x2="620" y2="400" stroke="#ffd97a" stroke-width="2" opacity="0.25"/>';
      // amonit BESAR di dinding kiri (spiral berbalik di berubah) — target loupe
      s += '<g transform="translate(90,110) ' + (B ? 'scale(-1,1)' : '') + '">' +
        '<circle r="42" fill="#efe3c2" stroke="#8a6d2f" stroke-width="5"/>' +
        '<circle r="34" fill="none" stroke="#c9a24a" stroke-width="2"/>' +
        '<path d="M0 0 A7 7 0 0 1 7 -7 A14 14 0 0 1 0 -21 A23 23 0 0 1 -23 -9 A31 31 0 0 1 -16 19 A38 38 0 0 1 19 14" fill="none" stroke="#8a6d2f" stroke-width="5" stroke-linecap="round"/>' +
        '<circle r="5" fill="#8a6d2f"/></g>';
      // cetakan fosil pakis di dinding (dekorasi non-diff, mengisi celah dinding)
      s += '<g><rect x="160" y="40" width="60" height="78" rx="3" fill="#efe3c2" stroke="#8a6d2f" stroke-width="3"/>' +
        '<path d="M190 108 L190 52" stroke="#3f7d3a" stroke-width="3" fill="none"/>' +
        '<path d="M190 100 Q176 92 172 80 M190 100 Q204 92 208 80 M190 88 Q178 80 174 68 M190 88 Q202 80 206 68 M190 76 Q180 68 177 58 M190 76 Q200 68 203 58" stroke="#3f7d3a" stroke-width="2.5" fill="none"/>' +
        '<circle cx="190" cy="52" r="3" fill="#3f7d3a"/></g>';
      // peta dinding kanan BESAR (satu benua hilang di berubah)
      s += '<g><rect x="465" y="55" width="140" height="100" rx="4" fill="#efe3c2" stroke="#8a6d2f" stroke-width="4"/>' +
        '<ellipse cx="505" cy="95" rx="24" ry="16" fill="#3f7d5a"/>' +
        '<ellipse cx="550" cy="118" rx="18" ry="12" fill="#3f7d5a"/>' +
        (B ? '' : '<ellipse cx="583" cy="80" rx="12" ry="9" fill="#3f7d5a"/>') +
        '<path d="M478 140 Q535 132 595 142" stroke="#7a9cc6" stroke-width="4" fill="none"/>' +
        '<path d="M505 95 l-8 -6 M505 95 l10 -4" stroke="#2f5c28" stroke-width="1.5"/></g>';
      // jendela gelap atas + bulan
      s += '<rect x="230" y="24" width="160" height="54" rx="26" fill="#0d2b33" stroke="#8a6d2f" stroke-width="3"/>' +
        '<circle cx="350" cy="44" r="12" fill="#e8e0c0" opacity="0.85"/>' +
        '<circle cx="346" cy="41" r="3" fill="#c9c2a4" opacity="0.7"/>';
      // vignette tepi (dinding lebih gelap di tepi, bukan datar)
      s += '<rect x="0" y="0" width="620" height="400" fill="url(#vig2)"/>';
      // ---- MIDGROUND: spotlight + T-rex + triceratops + vitrin + pterodactyl ----
      // SATU sumber cahaya: lampu langit-langit di (310,26); kerucut LEBAR ke tengkorak
      // (asli) / ke ekor (berubah) — perpindahannya harus langsung kelihatan.
      var cone = B
        ? { x0: 402, y0: 330, x1: 552, y1: 330, px: 480, py: 408 }
        : { x0: 142, y0: 302, x1: 288, y1: 302, px: 215, py: 408 };
      s += '<path d="M304 30 L316 30 L' + cone.x1 + ' ' + cone.y0 + ' L' + cone.x0 + ' ' + cone.y0 +
        ' Z" fill="#ffe9a8" opacity="0.24"/>';
      s += '<path d="M307 30 L313 30 L' + (cone.x1 - 22) + ' ' + (cone.y0 - 8) + ' L' + (cone.x0 + 22) + ' ' + (cone.y0 - 8) +
        ' Z" fill="#ffe9a8" opacity="0.28"/>';
      // rumah lampu + glow
      s += '<circle cx="310" cy="30" r="26" fill="url(#spot2)"/>' +
        '<path d="M296 18 L324 18 L330 32 L290 32 Z" fill="#2b2118" stroke="#d9a441" stroke-width="2"/>' +
        '<circle cx="310" cy="34" r="8" fill="#fff3c4" stroke="#d9a441" stroke-width="2"/>';
      // kolam cahaya di lantai (ikut target sorot)
      s += '<ellipse cx="' + cone.px + '" cy="' + cone.py + '" rx="88" ry="11" fill="#ffe9a8" opacity="0.30"/>';
      // pterodactyl gantung BESAR (sayap terlipat / terbentang — bentuk beda JELAS)
      s += '<line x1="380" y1="16" x2="380" y2="92" stroke="#2b2118" stroke-width="2.5"/>';
      if (B) {
        s += '<g fill="#d8c9a3" stroke="#8a7a5c" stroke-width="1.5">' +
          '<path d="M372 108 L300 88 L366 126 Z"/><path d="M388 108 L460 88 L394 126 Z"/>' +
          '<ellipse cx="380" cy="112" rx="22" ry="10"/>' +
          '<circle cx="400" cy="104" r="8"/><path d="M406 102 L422 106 L406 110 Z" fill="#d8c9a3"/></g>';
      } else {
        s += '<g fill="#d8c9a3" stroke="#8a7a5c" stroke-width="1.5">' +
          '<path d="M372 110 L338 152 L378 126 Z"/><path d="M388 110 L422 152 L382 126 Z"/>' +
          '<ellipse cx="380" cy="112" rx="22" ry="10"/>' +
          '<circle cx="400" cy="104" r="8"/><path d="M406 102 L422 106 L406 110 Z" fill="#d8c9a3"/></g>';
      }
      // KERANGKA T-REX — centerpiece BESAR, harus langsung terbaca "T-REX":
      // tengkorak besar + rahang terbuka bergigi, punggung melengkung, rusuk distinct,
      // dua kaki belakang, lengan kecil berjari dua, ekor panjang bersegmen.
      // Tulang digambar 2 lapis (outline gelap lebar, lalu tulang krem) supaya tegas.
      s += '<ellipse cx="350" cy="410" rx="150" ry="7" fill="#000" opacity="0.18"/>';
      s += '<g fill="none" stroke-linecap="round">' +
        '<path d="M235 240 Q290 205 350 215 Q400 225 430 285" stroke="#a08d64" stroke-width="13"/>' +
        '<path d="M235 240 Q290 205 350 215 Q400 225 430 285" stroke="url(#bone2)" stroke-width="8"/>' +
        '<path d="M265 224 Q258 255 252 268 M295 212 Q290 248 286 264 M325 211 Q322 250 320 266 M355 219 Q354 256 356 270 M385 235 Q386 268 390 280 M410 258 Q414 285 420 296" stroke="#a08d64" stroke-width="10"/>' +
        '<path d="M265 224 Q258 255 252 268 M295 212 Q290 248 286 264 M325 211 Q322 250 320 266 M355 219 Q354 256 356 270 M385 235 Q386 268 390 280 M410 258 Q414 285 420 296" stroke="url(#bone2)" stroke-width="6"/>' +
        '<path d="M340 240 L352 318 L358 392 M398 252 L408 322 L414 392" stroke="#a08d64" stroke-width="12"/>' +
        '<path d="M340 240 L352 318 L358 392 M398 252 L408 322 L414 392" stroke="url(#bone2)" stroke-width="7"/>' +
        '<path d="M358 392 L344 404 M358 392 L360 406 M358 392 L374 404 M414 392 L400 404 M414 392 L416 406 M414 392 L430 404" stroke="url(#bone2)" stroke-width="6"/>' +
        '<path d="M258 272 L246 306 M268 275 L260 308" stroke="url(#bone2)" stroke-width="5"/>' +
        '<path d="M246 306 L240 312 M246 306 L250 313 M260 308 L256 314 M260 308 L264 314" stroke="url(#bone2)" stroke-width="4"/>' +
        '</g>';
      // ruas tulang punggung (vertebra) + pinggul + bahu
      [[250, 232], [280, 214], [310, 207], [340, 211], [370, 222], [398, 242], [420, 265]].forEach(function (p) {
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6.5" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>';
      });
      s += '<circle cx="340" cy="238" r="10" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        '<circle cx="398" cy="250" r="10" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        '<circle cx="258" cy="272" r="9" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>';
      // ekor panjang bersegmen (meruncing ke kanan-bawah)
      s += '<g><polygon points="428,278 512,322 514,332 432,294" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        '<path d="M448 282 L452 296 M468 296 L472 310 M488 308 L492 322" stroke="#a08d64" stroke-width="2"/></g>';
      // tengkorak T-rex + rahang terbuka + gigi (satu gigi DEPAN EMAS BESAR di berubah)
      s += '<g>' +
        '<ellipse cx="210" cy="248" rx="42" ry="30" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        '<path d="M185 232 Q200 224 218 230" stroke="#a08d64" stroke-width="3" fill="none"/>' +
        '<polygon points="168,250 138,272 150,284 185,274" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        '<polygon points="175,288 145,296 155,306 195,296" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        '<circle cx="200" cy="240" r="6" fill="#2b2118"/><circle cx="202" cy="238" r="1.8" fill="#fff"/>' +
        '<circle cx="150" cy="260" r="2.5" fill="#2b2118"/>' +
        '<path d="M164 279 L170 279 L167 287 Z M176 275 L182 275 L179 283 Z" fill="#fff" stroke="#b9a888" stroke-width="1"/>' +
        '<path d="M160 294 L166 294 L163 288 Z M176 292 L182 292 L179 286 Z" fill="#fff" stroke="#b9a888" stroke-width="1"/>' +
        (B ? '<circle cx="150" cy="286" r="17" fill="#ffd97a" opacity="0.4"/>' +
          '<path d="M166 274 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#ffd97a"/>' : '') +
        '<path d="M140 274 L160 274 L150 296 Z" fill="' + (B ? '#d9a441' : '#fff') + '" stroke="' + (B ? '#8a6d2f' : '#b9a888') + '" stroke-width="2"/>' +
        '</g>';
      // label nama Latin (plakat besar di dinding)
      s += '<g><rect x="145" y="372" width="150" height="26" rx="4" fill="#2b2118" stroke="#d9a441" stroke-width="1.5"/>' +
        '<text x="220" y="390" text-anchor="middle" fill="#ffd97a" font-size="13" font-weight="bold" letter-spacing="1">TYRANNOSAURUS ' + (B ? 'REXX' : 'REX') + '</text></g>';
      // tengkorak triceratops BESAR di podium kiri: frill kipas + 3 tanduk jelas
      // (tanduk hidung HILANG di berubah — 3 jadi 2)
      s += '<g>' +
        '<rect x="40" y="340" width="90" height="14" rx="3" fill="#8a6d2f"/>' +
        '<rect x="55" y="354" width="60" height="48" fill="#6b5636"/>' +
        '<rect x="55" y="354" width="60" height="4" fill="#a87b45"/>' +
        '<path d="M55 300 Q52 262 85 252 Q118 262 115 300 Q100 290 85 290 Q70 290 55 300 Z" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        '<path d="M62 276 l6 -8 M74 266 l6 -8 M85 262 l0 -9 M96 266 l-6 -8 M108 276 l-6 -8" stroke="#a08d64" stroke-width="2"/>' +
        '<ellipse cx="85" cy="298" rx="30" ry="18" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        '<path d="M60 288 L46 246 L72 282 Z" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        '<path d="M110 288 L126 248 L104 284 Z" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>' +
        (B ? '' : '<path d="M82 294 L85 258 L94 294 Z" fill="url(#bone2)" stroke="#a08d64" stroke-width="2"/>') +
        '<circle cx="96" cy="296" r="4" fill="#2b2118"/>' +
        '<path d="M62 308 Q85 316 108 308" stroke="#a08d64" stroke-width="2" fill="none"/></g>';
      // vitrin trilobit BESAR kanan (4 -> 5, yang ke-5 di baris bawah tengah)
      s += '<g><rect x="475" y="225" width="95" height="75" rx="4" fill="#bfe0ea" opacity="0.25" stroke="#d9a441" stroke-width="3"/>' +
        '<line x1="475" y1="225" x2="570" y2="225" stroke="#ffd97a" stroke-width="3"/>' +
        '<line x1="480" y1="262" x2="565" y2="262" stroke="#d9a441" stroke-width="2" opacity="0.6"/>' +
        '<rect x="475" y="300" width="95" height="10" fill="#8a6d2f"/></g>';
      var tri = B ? [[495, 244], [522, 244], [549, 244], [495, 280], [522, 280]]
        : [[495, 244], [522, 244], [549, 244], [495, 280]];
      tri.forEach(function (p) {
        s += '<g><ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="12" ry="8" fill="#b98a4a" stroke="#5d3d20" stroke-width="2"/>' +
          '<line x1="' + p[0] + '" y1="' + (p[1] - 8) + '" x2="' + p[0] + '" y2="' + (p[1] + 8) + '" stroke="#5d3d20" stroke-width="2"/>' +
          '<line x1="' + (p[0] - 12) + '" y1="' + p[1] + '" x2="' + (p[0] + 12) + '" y2="' + p[1] + '" stroke="#5d3d20" stroke-width="1.5"/>' +
          '<path d="M' + (p[0] + 12) + ' ' + p[1] + ' l6 -3 l-6 3 l6 3 Z" fill="#5d3d20"/></g>';
      });
      // ---- FOREGROUND: tangga + jejak + tali pembatas MERAH (lantai sudah di background) ----
      // tangga kiri (6 anak tangga -> 5; yang hilang = anak tangga paling atas)
      var steps = B ? 5 : 6;
      for (var si = 0; si < steps; si++) {
        var sx = 20 + si * 14, sy = 452 - si * 9;
        s += '<rect x="' + sx + '" y="' + sy + '" width="64" height="9" fill="#5d6b74" stroke="#2b2118" stroke-width="1"/>' +
          '<line x1="' + sx + '" y1="' + sy + '" x2="' + (sx + 64) + '" y2="' + sy + '" stroke="#cfe0e8" stroke-width="2"/>';
      }
      // jejak kaki BESAR di lantai (3 pasang -> 2; yang hilang = pasangan ketiga)
      var pairs = B ? 2 : 3;
      for (var fi = 0; fi < pairs; fi++) {
        var fx = 380 + fi * 45;
        s += '<ellipse cx="' + fx + '" cy="436" rx="9" ry="13" fill="#d8c9a3" opacity="0.85" transform="rotate(-12 ' + fx + ' 436)"/>' +
          '<ellipse cx="' + (fx + 15) + '" cy="452" rx="9" ry="13" fill="#d8c9a3" opacity="0.85" transform="rotate(12 ' + (fx + 15) + ' 452)"/>';
      }
      // tali pembatas MERAH di depan T-rex (foreground, tiga tiang kuningan)
      s += '<g>' +
        '<path d="M300 385 Q365 402 430 385 Q495 402 560 385" stroke="#a83226" stroke-width="5" fill="none"/>' +
        '<path d="M300 385 Q365 398 430 385 Q495 398 560 385" stroke="#c65a3a" stroke-width="2" fill="none"/>';
      [300, 430, 560].forEach(function (px) {
        s += '<rect x="' + (px - 3) + '" y="372" width="6" height="42" fill="#d9a441" stroke="#8a6d2f" stroke-width="1"/>' +
          '<circle cx="' + px + '" cy="370" r="6" fill="#d9a441" stroke="#8a6d2f" stroke-width="1.5"/>';
      });
      s += '</g>'; // tutup tali pembatas
      s += '</g>'; // tutup grup grading grade2
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
      { id: 1, name: 'Saturnus — cincin 2 jadi 1', type: 'removed', x: 140, y: 140, r: 34 },
      { id: 2, name: 'Rasi Biduk — satu bintang hilang', type: 'removed', x: 250, y: 60, r: 28 },
      { id: 3, name: 'Teleskop — mengarah ke Mars', type: 'moved', x: 300, y: 300, r: 32 },
      { id: 4, name: 'Label peta — ORION jadi ORIONN', type: 'word', x: 95, y: 215, r: 28, shape: 'rect', rx: 40, ry: 14 },
      { id: 5, name: 'Mars — merah jadi oranye', type: 'recoloured', x: 305, y: 122, r: 30 },
      { id: 6, name: 'Bulan sabit — menghadap kanan', type: 'flipped', x: 540, y: 130, r: 32 },
      { id: 7, name: 'Meja kontrol — tombol 6 jadi 5', type: 'removed', x: 402, y: 407, r: 28 },
      { id: 8, name: 'Astronot — visor turun', type: 'moved', x: 520, y: 272, r: 30 },
      { id: 9, name: 'Bintang jatuh — muncul', type: 'added', x: 430, y: 85, r: 30 },
      { id: 10, name: 'Jupiter — garis 3 jadi 2', type: 'removed', x: 460, y: 158, r: 32 },
      { id: 11, name: 'Jam dinding — 21:00 jadi 22:00', type: 'moved', x: 560, y: 60, r: 28 },
      { id: 12, name: 'Kucing Moci — tidur di peta bintang', type: 'added', x: 350, y: 451, r: 28 }
    ],
    draw: function (variant) {
      var B = variant === 'berubah';
      var s = '';
      s += '<defs>' +
        '<linearGradient id="wall3" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#2c3a7d"/><stop offset="0.5" stop-color="#1a2450"/><stop offset="1" stop-color="#0b1230"/></linearGradient>' +
        '<linearGradient id="floor3" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#2c3550"/><stop offset="1" stop-color="#141a2e"/></linearGradient>' +
        '<linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#0d1b3e"/><stop offset="1" stop-color="#060a18"/></linearGradient>' +
        '<radialGradient id="spot3" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#9fb4ff" stop-opacity="0.5"/><stop offset="1" stop-color="#9fb4ff" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#cfe0ff" stop-opacity="0.4"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="nebA" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#7a4a9e" stop-opacity="0.55"/><stop offset="1" stop-color="#7a4a9e" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="nebB" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#c96f8f" stop-opacity="0.5"/><stop offset="1" stop-color="#c96f8f" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="nebC" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#4a6fd8" stop-opacity="0.5"/><stop offset="1" stop-color="#4a6fd8" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="vig3" cx="0.5" cy="0.45" r="0.75">' +
        '<stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.50"/></radialGradient>' +
        '<filter id="grade3" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">' +
        '<feColorMatrix type="matrix" values="1.17 0 0 0 -0.14 0 1.17 0 0 -0.14 0 0 1.17 0 0 -0.14 0 0 0 1 0"/>' +
        '<feColorMatrix type="hueRotate" values="-20"/>' +
        '<feColorMatrix type="saturate" values="1.40"/>' +
        '</filter>' +
        '</defs>';
      // Grading resep "Planetarium" (skill color-grading-effects):
      // brightnessContrast(-0.08, 0.12) + hueSaturation(-0.10, 0.30),
      // diterapkan literal sebagai filter SVG (sRGB) pada seluruh scene.
      // V1.4: didorong searah pemenang uji buta (sat 1.3->1.40, kontras
      // 1.12->1.17, hue -18->-20, vig 0.45->0.50) + langit gelap di belakang
      // kubah supaya sudut atas tidak krem kosong.
      s += '<g filter="url(#grade3)">';
      // ---- BACKGROUND: langit gelap + kubah nebula + Bima Sakti + bintang warna-warni + rusuk kubah ----
      s += '<rect x="0" y="0" width="620" height="470" fill="url(#sky3)"/>';
      s += '<path d="M0 400 L0 150 A310 190 0 0 1 620 150 L620 400 Z" fill="url(#wall3)"/>';
      s += '<ellipse cx="120" cy="130" rx="130" ry="70" fill="url(#nebA)"/>' +
        '<ellipse cx="490" cy="90" rx="140" ry="75" fill="url(#nebB)"/>' +
        '<ellipse cx="320" cy="270" rx="170" ry="55" fill="url(#nebC)"/>';
      // pita Bima Sakti: deret bintang kecil menyilang kubah
      [[70, 310], [105, 292], [140, 272], [175, 255], [210, 236], [245, 218], [280, 200], [315, 182], [350, 164], [385, 146], [420, 128], [455, 110], [490, 92], [525, 74], [560, 56]].forEach(function (p, i) {
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (1.5 + (i % 3)) + '" fill="#fff" opacity="' + (0.35 + (i % 3) * 0.15) + '"/>';
      });
      // rusuk kubah (bayangan halus)
      s += '<path d="M155 400 Q155 110 310 0" stroke="#fff" stroke-width="10" fill="none" opacity="0.05"/>' +
        '<path d="M465 400 Q465 110 310 0" stroke="#fff" stroke-width="10" fill="none" opacity="0.05"/>';
      s += '<rect x="0" y="400" width="620" height="70" fill="url(#floor3)"/>';
      // vignette resep Planetarium (0.5/0.5) — hanya latar (dome/nebula/lantai),
      // bintang + planet digambar sesudahnya jadi tetap terang.
      s += '<rect x="0" y="0" width="620" height="470" fill="url(#vig3)"/>';
      // bintang bervariasi ukuran + warna (efek: class twinkle, delay berbeda)
      var stars = [[40, 90, 3, '#fff'], [90, 60, 4, '#ffd97a'], [150, 120, 2.5, '#fff'], [210, 50, 3.5, '#9fb4ff'], [260, 130, 2.5, '#fff'], [330, 60, 4, '#ffd97a'], [380, 120, 2.5, '#9fb4ff'], [430, 50, 3, '#fff'], [480, 100, 4, '#ffd97a'], [580, 140, 2.5, '#fff'], [60, 180, 3, '#9fb4ff'], [200, 170, 2.5, '#fff'], [330, 180, 3.5, '#ffd97a'], [500, 190, 2.5, '#fff'], [580, 210, 3, '#9fb4ff'], [120, 220, 2.5, '#ffd97a'], [260, 230, 3, '#fff'], [420, 220, 2.5, '#9fb4ff']];
      stars.forEach(function (p, i) {
        s += '<circle class="twinkle" style="animation-delay:' + (i * 0.35) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="' + p[3] + '"/>';
      });
      // bintang 4-sisi (sparkle besar, warna-warni)
      [[170, 90], [360, 90], [520, 240], [80, 250]].forEach(function (p, i) {
        var c = ['#ffd97a', '#9fb4ff', '#fff', '#ffd97a'][i];
        s += '<path d="M' + p[0] + ' ' + (p[1] - 7) + ' L' + (p[0] + 2) + ' ' + (p[1] - 2) + ' L' + (p[0] + 7) + ' ' + p[1] +
          ' L' + (p[0] + 2) + ' ' + (p[1] + 2) + ' L' + p[0] + ' ' + (p[1] + 7) + ' L' + (p[0] - 2) + ' ' + (p[1] + 2) +
          ' L' + (p[0] - 7) + ' ' + p[1] + ' L' + (p[0] - 2) + ' ' + (p[1] - 2) + ' Z" fill="' + c + '"/>';
      });
      // Rasi Biduk BESAR (satu bintang hilang di berubah)
      var dipper = [[180, 60], [215, 48], [250, 60], [280, 82], [310, 78], [335, 55], [355, 88]];
      s += '<g stroke="#ffd97a" stroke-width="2.5" fill="none"><path d="M180 60 L215 48 L250 60 L280 82 L310 78 L335 55"/></g>';
      dipper.forEach(function (p, i) {
        if (B && i === 2) return; // bintang hilang
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" fill="#ffd97a" stroke="#b98a4a" stroke-width="1.5"/>';
      });
      // bintang jatuh PANJANG + terang (hanya di berubah)
      if (B) {
        s += '<g><line x1="392" y1="60" x2="468" y2="110" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.25"/>' +
          '<line x1="392" y1="60" x2="468" y2="110" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
          '<circle cx="392" cy="60" r="5" fill="#fff"/>' +
          '<circle cx="430" cy="85" r="2.5" fill="#fff"/></g>';
      }
      // jendela bulan sabit BESAR — sabit tebal yang terbaca
      s += '<circle cx="540" cy="130" r="52" fill="url(#moonGlow)"/>' +
        '<g><circle cx="540" cy="130" r="36" fill="#1b2a5e" stroke="#d9a441" stroke-width="3"/>' +
        '<circle cx="540" cy="130" r="24" fill="#ffe9a8"/>' +
        '<circle cx="' + (B ? 528 : 552) + '" cy="126" r="21" fill="#1b2a5e"/></g>';
      // seberkas cahaya bulan dari jendela ke lantai
      s += '<path d="M522 162 L558 162 L606 400 L486 400 Z" fill="#cfe0ff" opacity="0.08"/>';
      // jam dinding BESAR (21:00 -> 22:00 — jarum jam pindah jelas)
      s += '<g><circle cx="560" cy="60" r="28" fill="#f7ead2" stroke="#8a6d2f" stroke-width="3.5"/>';
      for (var ti2 = 0; ti2 < 12; ti2++) {
        var a2 = ti2 * Math.PI / 6, tx1 = 560 + Math.sin(a2) * 22, ty1 = 60 - Math.cos(a2) * 22,
          tx2 = 560 + Math.sin(a2) * 25, ty2 = 60 - Math.cos(a2) * 25;
        s += '<line x1="' + tx1.toFixed(1) + '" y1="' + ty1.toFixed(1) + '" x2="' + tx2.toFixed(1) + '" y2="' + ty2.toFixed(1) + '" stroke="#2b2118" stroke-width="1.5"/>';
      }
      s += '<line x1="560" y1="60" x2="560" y2="38" stroke="#2b2118" stroke-width="3.5" stroke-linecap="round"/>' +
        '<line x1="560" y1="60" x2="' + (B ? 542 : 538) + '" y2="' + (B ? 44 : 60) + '" stroke="#2b2118" stroke-width="3.5" stroke-linecap="round"/>' +
        '<circle cx="560" cy="60" r="3" fill="#2b2118"/></g>';
      // ---- MIDGROUND: planet BESAR + teleskop + astronot + peta bintang ----
      // Saturnus BESAR (cincin luar TEBAL hilang di berubah — 2 jadi 1)
      s += '<g><circle cx="140" cy="140" r="42" fill="#eec27a" stroke="#b98a4a" stroke-width="2"/>' +
        '<path d="M108 122 Q140 108 172 124" stroke="#c9a24a" stroke-width="4" fill="none"/>' +
        '<path d="M112 156 Q140 166 168 154" stroke="#c9a24a" stroke-width="3" fill="none" opacity="0.7"/>' +
        '<ellipse cx="140" cy="140" rx="62" ry="16" fill="none" stroke="#d9a441" stroke-width="6" transform="rotate(-18 140 140)"/>' +
        (B ? '' : '<ellipse cx="140" cy="140" rx="74" ry="21" fill="none" stroke="#c9a24a" stroke-width="4" transform="rotate(-18 140 140)"/>') +
        '</g>';
      // Mars BESAR dengan marka permukaan (merah KUAT -> oranye KUAT)
      s += '<circle cx="305" cy="122" r="30" fill="' + (B ? '#f08c1e' : '#d4542e') + '" stroke="#8a3a20" stroke-width="2"/>' +
        '<circle cx="296" cy="114" r="6" fill="#8a3a20" opacity="0.55"/><circle cx="314" cy="130" r="5" fill="#8a3a20" opacity="0.55"/>' +
        '<circle cx="310" cy="108" r="3.5" fill="#8a3a20" opacity="0.5"/>' +
        '<path d="M288 100 Q305 92 322 100" stroke="#fff" stroke-width="4" fill="none" opacity="0.6"/>';
      // Jupiter BESAR (pita TEBAL 3 -> 2 + Bintik Merah Besar)
      s += '<circle cx="460" cy="150" r="36" fill="#d8b48a" stroke="#a8825a" stroke-width="2"/>' +
        '<path d="M426 138 Q460 131 494 138" stroke="#a83226" stroke-width="6" fill="none"/>' +
        '<path d="M426 156 Q460 149 494 156" stroke="#a83226" stroke-width="6" fill="none"/>' +
        (B ? '' : '<path d="M430 172 Q460 166 490 172" stroke="#c96f3f" stroke-width="5" fill="none"/>') +
        '<ellipse cx="474" cy="164" rx="10" ry="6" fill="#b23a2e"/>';
      // peta bintang di dinding kiri + label ORION(N) BESAR
      s += '<g><rect x="35" y="175" width="120" height="80" rx="4" fill="#0d1a3a" stroke="#d9a441" stroke-width="2.5"/>' +
        '<circle cx="65" cy="205" r="3.5" fill="#fff"/><circle cx="92" cy="194" r="3.5" fill="#fff"/><circle cx="120" cy="210" r="3.5" fill="#fff"/><circle cx="88" cy="228" r="3.5" fill="#fff"/>' +
        '<path d="M65 205 L92 194 L120 210 L88 228" stroke="#ffd97a" stroke-width="1.5" fill="none"/>' +
        '<text x="95" y="248" text-anchor="middle" fill="#ffd97a" font-size="15" font-weight="bold">' + (B ? 'ORIONN' : 'ORION') + '</text></g>';
      // teleskop BESAR: asli mengarah ke BULAN (kanan-atas), berubah ke MARS (atas)
      var tang = B ? -8 : 48;
      var beam = B
        ? '<path d="M285 221 L291 112 L319 112 Z" fill="url(#spot3)"/>'
        : '<path d="M382 256 L526 118 L556 142 Z" fill="url(#spot3)"/>';
      s += beam +
        '<g transform="translate(300,330) rotate(' + tang + ')">' +
        '<rect x="-11" y="-118" width="22" height="118" rx="9" fill="#c9c9c9" stroke="#6b6b6b" stroke-width="2"/>' +
        '<line x1="-6" y1="-112" x2="-6" y2="-8" stroke="#fff" stroke-width="2.5" opacity="0.4"/>' +
        '<circle cx="0" cy="-120" r="12" fill="#9fb4ff" stroke="#6b6b6b" stroke-width="2"/>' +
        '<rect x="-14" y="-6" width="28" height="10" rx="3" fill="#8a8a8a"/></g>' +
        '<circle cx="300" cy="330" r="11" fill="#d9a441" stroke="#8a6d2f" stroke-width="2"/>' +
        '<path d="M284 336 L316 336 L322 382 L278 382 Z" fill="#5d6b74" stroke="#3a4046" stroke-width="1.5"/>' +
        '<ellipse cx="300" cy="384" rx="34" ry="5" fill="#000" opacity="0.2"/>';
      // manekin astronot BESAR dengan detail baju (visor: wajah terlihat / visor hijau menutup)
      s += '<g>' +
        '<rect x="548" y="300" width="14" height="44" rx="6" fill="#d8d8d8" stroke="#b9b9b9" stroke-width="1.5"/>' +
        '<rect x="486" y="302" width="12" height="38" rx="6" fill="#e8e8e8" stroke="#b9b9b9" stroke-width="1.5"/>' +
        '<rect x="498" y="292" width="44" height="78" rx="12" fill="#e8e8e8" stroke="#b9b9b9" stroke-width="2"/>' +
        '<rect x="508" y="312" width="24" height="18" rx="3" fill="#3a3f45"/>' +
        '<rect x="511" y="317" width="7" height="7" fill="#c65a3a"/><rect x="522" y="317" width="7" height="7" fill="#c65a3a"/>' +
        '<rect x="498" y="348" width="44" height="8" fill="#c65a3a" opacity="0.85"/>' +
        '<rect x="504" y="370" width="14" height="26" fill="#e8e8e8" stroke="#b9b9b9" stroke-width="1.5"/>' +
        '<rect x="522" y="370" width="14" height="26" fill="#e8e8e8" stroke="#b9b9b9" stroke-width="1.5"/>' +
        '<rect x="502" y="394" width="18" height="10" rx="3" fill="#c65a3a"/><rect x="520" y="394" width="18" height="10" rx="3" fill="#c65a3a"/>' +
        '<circle cx="520" cy="268" r="26" fill="#f4f4f4" stroke="#b9b9b9" stroke-width="2"/>' +
        (B
          ? '<ellipse cx="520" cy="268" rx="18" ry="17" fill="#7fb069" stroke="#4a7a3a" stroke-width="1.5"/>' +
            '<path d="M508 258 L530 276" stroke="#fff" stroke-width="3" opacity="0.55"/>'
          : '<circle cx="520" cy="268" r="17" fill="#f2c89b"/>' +
            '<circle cx="514" cy="265" r="2" fill="#2b2118"/><circle cx="526" cy="265" r="2" fill="#2b2118"/>' +
            '<path d="M514 274 Q520 278 526 274" stroke="#2b2118" stroke-width="1.5" fill="none"/>' +
            '<path d="M503 258 A17 17 0 0 1 537 258 L537 249 A17 17 0 0 0 503 249 Z" fill="#9fb4ff" stroke="#6b8fc6" stroke-width="1.5"/>') +
        '</g>';
      // ---- FOREGROUND: meja kontrol BESAR + peta lantai + Moci ----
      s += '<g><rect x="170" y="380" width="280" height="54" rx="8" fill="#3a3f45" stroke="#d9a441" stroke-width="2"/>' +
        '<rect x="170" y="380" width="280" height="4" rx="2" fill="#ffffff" opacity="0.08"/>' +
        '<rect x="182" y="390" width="52" height="28" rx="3" fill="#1d2b1d" stroke="#2f5c28" stroke-width="1.5"/>' +
        '<circle cx="192" cy="404" r="3" fill="#7fd08a"/><circle cx="206" cy="404" r="3" fill="#ffd97a"/>' +
        '<path d="M216 404 l5 -5 5 5 5 -5" stroke="#7fd08a" stroke-width="1.5" fill="none"/></g>';
      var btns = B ? 5 : 6;
      for (var bi = 0; bi < btns; bi++) {
        var bx = 252 + bi * 30;
        s += '<circle cx="' + bx + '" cy="407" r="12" fill="' + ['#c65a3a', '#d9a441', '#3f7d5a', '#7fb069', '#9fb4ff', '#c96f3f'][bi] + '" stroke="#2b2118" stroke-width="2"/>' +
          '<circle cx="' + (bx - 3) + '" cy="403" r="3" fill="#fff" opacity="0.4"/>';
      }
      // peta bintang di lantai (border terang supaya terbaca di lantai gelap)
      s += '<g><rect x="60" y="436" width="500" height="30" rx="4" fill="#182642" stroke="#8a9cc6" stroke-width="2.5"/>' +
        '<circle cx="110" cy="451" r="3" fill="#fff"/><circle cx="180" cy="446" r="3" fill="#fff"/><circle cx="250" cy="454" r="3" fill="#fff"/><circle cx="430" cy="448" r="3" fill="#fff"/><circle cx="500" cy="454" r="3" fill="#fff"/>' +
        '<path d="M110 451 L180 446 L250 454" stroke="#ffd97a" stroke-width="1.5" fill="none"/></g>';
      // Moci tidur di peta bintang (hanya di berubah) — oranye besar dan jelas
      if (B) s += cat(350, 448, 1.05);
      s += '</g>'; // tutup grup grading grade3
      return s;
    }
  };

  window.SCENES = [scene1, scene2, scene3];
})();
