[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Fpeazy/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Fpeazy/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# MUSEUM NUSANTARA — Jejak yang Berubah

A spot-the-difference game for the [make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451): a night round through a museum in Indonesia. Find what changed before the museum closes.

## The game

Three rooms, rising difficulty — **30 differences in all**:

1. **Galeri Batik** (8) — a bright batik gallery: mega mendung, parang, kawung, truntum, sidomukti and lasem cloths, a sleeping museum cat named Moci, and a sign that says DILARANG MENYENTUH.
2. **Ruang Fosil** (10) — a dark teal fossil hall: a T-rex skeleton, a triceratops skull, ammonites, a trilobite case and a pterodactyl hanging from the ceiling.
3. **Menara Planetarium** (12) — a star dome: Saturn, Mars, Jupiter, a telescope, an astronaut mannequin, and the Big Dipper. Find them all and the dome lights up into the shape of a cat.

## How it plays

- Two near-identical pictures side by side — click a difference on either one. Found differences get a pulsing gold ring, a number, and their name joins the "Sudah ketemu" list.
- **KILAT hint** (3 per game): the screen flashes and a silhouette shows one unfound difference.
- **Timer**: 15:00 for the whole game, shown as "TUTUP DALAM". There is **no pause button** — wrong clicks cost 5 seconds.
- **RONDA streak**: 3 correct finds in a row within 8 seconds earns +15 seconds (once per room).
- **Kaca Pembesar Kurator**: hover to zoom 2&times; (toggle with M). Keyboard: 1–3 switch rooms, H hint, R restart a room.
- All art is drawn in code (SVG, layered foreground / midground / background). No external files, no network requests, no AI images. Sound is tiny WebAudio bleeps.

## Play it

Serve `game/` with any static server and open `game/index.html` in desktop Chrome, or run `node serve.ts` (serves on http://localhost:8080) if present.

## Hand in

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
