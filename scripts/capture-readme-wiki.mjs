#!/usr/bin/env node
/**
 * Regenerate every image and animation the README and wiki use, in one shot.
 *
 * Builds the harness once, then drives the two capture scripts with the
 * parameters that produce the committed README/wiki assets:
 *   - scripts/capture-screenshots.mjs --compose  → every still PNG (the card,
 *     sky compass, tile gallery, and the more-info dialog)
 *   - scripts/capture-timelapse.mjs              → the animated sky-compass GIF
 *
 * Run it whenever the cards change and the README/wiki imagery needs refreshing:
 *   node scripts/capture-readme-wiki.mjs           # or: npm run capture:readme-wiki
 *   node scripts/capture-readme-wiki.mjs --theme light
 *   node scripts/capture-readme-wiki.mjs --skip-timelapse   # stills only (faster)
 *
 * Requirements (dev-only): Playwright (`npm i` + `npx playwright install
 * chromium`) and ffmpeg on PATH (for the GIF and the composed tile gallery).
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULTS = {
  theme: 'dark',
  skipScreenshots: false,
  skipTimelapse: false,
  help: false,
};

const HELP = `
Regenerate all README and wiki images and animations from the dev harness.

Usage:
  node scripts/capture-readme-wiki.mjs [options]
  npm run capture:readme-wiki -- [options]

Options:
  --theme <dark|light>   Theme for every asset.        (default: ${DEFAULTS.theme})
  --skip-screenshots     Skip the still PNGs + tile gallery.
  --skip-timelapse       Skip the animated sky-compass GIF (much faster).
  -h, --help             Show this help.

Builds the harness once, then runs capture-screenshots.mjs --compose and
capture-timelapse.mjs (both with --no-build). Needs Playwright + ffmpeg.
`;

function parseArgs(argv) {
  const o = { ...DEFAULTS };
  const next = (i) => {
    const v = argv[i + 1];
    if (v === undefined) throw new Error(`missing value for ${argv[i]}`);
    return v;
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '-h':
      case '--help': o.help = true; break;
      case '--skip-screenshots': o.skipScreenshots = true; break;
      case '--skip-timelapse': o.skipTimelapse = true; break;
      case '--theme': o.theme = next(i++); break;
      default:
        throw new Error(`unknown option: ${a} (try --help)`);
    }
  }
  return o;
}

function run(cmd, args, label) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: ROOT });
  if (r.status !== 0) {
    console.error(`✗ ${label} failed (exit ${r.status ?? r.signal})`);
    process.exit(1);
  }
}

function capture(script, extra) {
  run('node', [path.join('scripts', script), '--no-build', ...extra], script);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(HELP);
    return;
  }

  console.log('▸ Building harness once…');
  run('npm', ['run', 'build:harness'], 'harness build');

  const theme = ['--theme', opts.theme];
  if (!opts.skipScreenshots) {
    console.log('\n▸ Stills + tile gallery…');
    capture('capture-screenshots.mjs', ['--compose', ...theme]);
  }
  if (!opts.skipTimelapse) {
    console.log('\n▸ Sky-compass time-lapse GIF…');
    capture('capture-timelapse.mjs', theme);
  }

  console.log('\n✓ README/wiki assets regenerated in images/.');
}

try {
  main();
} catch (err) {
  console.error(`✗ ${err.message ?? err}`);
  process.exit(1);
}
