// MUSEUM NUSANTARA — Jejak yang Berubah. Entrypoint (Node 22, standard library only).
//
// The game is plain static files under game/ (index.html + ES modules, no
// library, no network request) and 4 screenshots of its own code under
// screenshots/. This program hands the entry in: it copies game/ and
// screenshots/ from beside this file to /output and writes /output/dossier.json
// with the vendored make.fun library, the summary the judge reads.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function handIn() {
  mkdirSync(outDir, { recursive: true });
  cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
  const shotsDir = join(repoRoot, 'screenshots');
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  if (existsSync(shotsDir)) {
    cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
  }
  // Never hand in an entry with no screenshots: the judge's first criterion
  // is what the screenshots show, so fail loudly instead of submitting blind.
  const shots = readdirSync(join(outDir, 'screenshots')).filter((f) => /\.(png|jpe?g)$/i.test(f));
  if (shots.length < 3) {
    throw new Error(`expected at least 3 screenshots, found ${shots.length}`);
  }
  // The scorer's own caps (from the kit's RULES.txt): at most 4 screenshots,
  // each at most 256 KiB; game/ at most 993 files and 48 MiB in all; every
  // path under game/ at most 1000 bytes. buildDossier refuses an entry the
  // scorer would refuse, so a failure here is a failure to fix, not to skip.
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
  return readdirSync(join(outDir, 'screenshots')).length;
}

const shotCount = handIn();
console.log(`MUSEUM NUSANTARA handed in: ${shotCount} screenshot(s), dossier written to ${outDir}/dossier.json`);
