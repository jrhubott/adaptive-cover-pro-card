#!/usr/bin/env node
/**
 * Capture still PNG screenshots of each card/control straight from the dev
 * harness — the README's marketing imagery, regenerable on demand.
 *
 * Pipeline: build the harness → serve it on an ephemeral port → drive it with
 * Playwright (headless Chromium) via the `?capture` bridge. For each shot we
 * load a scenario, enable only the target card, frame it like a real ha-card,
 * and screenshot the element to images/<name>.png at 2× density.
 *
 * Sibling to capture-timelapse.mjs (which builds the animated GIF). This one
 * needs no ffmpeg — there's nothing to encode — unless you pass --compose to
 * vstack the tile gallery into a single image.
 *
 * Requirements (dev-only, nothing here ships in the card bundle):
 *   - Playwright:  npm i  (it's a devDependency) and `npx playwright install chromium`
 *   - ffmpeg on PATH ONLY if you use --compose (e.g. `brew install ffmpeg`)
 *
 * Run `node scripts/capture-screenshots.mjs --help` for options.
 */

import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HARNESS_DIR = path.join(ROOT, 'harness');

/**
 * The shots that make up the README gallery. Each maps a card to a harness
 * scenario chosen to show one distinct state. `card` picks the element + the
 * render width; `config` is merged into that card's config section; `minutes`
 * (optional) pins the time of day, else the scenario's own time is used.
 */
const SHOTS = [
  // ── Heroes ──────────────────────────────────────────────────────────────
  {
    name: 'sky-compass',
    card: 'compass',
    scenario: 'summer-noon-south',
    minutes: 12 * 60,
    config: { show_elevation_chart: true, show_moon: false },
    note: 'Sky compass hero — sun high in the south window FOV.',
  },
  {
    name: 'card-preview',
    card: 'root',
    scenario: 'solar-tracking-active',
    minutes: 12 * 60,
    note: 'Full card hero — every section, solar handler winning.',
  },
  // ── Tile gallery (one badge state each) ──────────────────────────────────
  {
    name: 'tile-auto',
    card: 'tile',
    scenario: 'auto-default-badge',
    minutes: 12 * 60,
    note: 'Tile — green "Auto" badge (automatic control running, default position).',
  },
  {
    name: 'tile-solar',
    card: 'tile',
    scenario: 'solar-tracking-active',
    minutes: 12 * 60,
    note: 'Tile — "Solar tracking" badge with inline target.',
  },
  {
    name: 'tile-manual',
    card: 'tile',
    scenario: 'manual-override-active',
    minutes: 14 * 60,
    note: 'Tile — tappable "Manual" override badge with resume (↺).',
  },
  {
    name: 'tile-motion',
    card: 'tile',
    scenario: 'motion-idle-badge',
    minutes: 19 * 60,
    note: 'Tile — "Motion" badge (motion handler holding the cover).',
  },
];

/** Tile shots, in order, that --compose stacks into tile-gallery.png. */
const GALLERY_ORDER = ['tile-auto', 'tile-solar', 'tile-manual', 'tile-motion'];

const SELECTORS = {
  root: { tag: 'adaptive-cover-pro-card' },
  // Wait for the actual SVG, not just the shell — the card also renders a "no
  // match" message before discovery settles.
  compass: { tag: 'adaptive-cover-pro-sky-compass-card', wait: '.compass svg' },
  tile: { tag: 'adaptive-cover-pro-tile-card' },
};

const DEFAULTS = {
  theme: 'dark',
  cardWidth: 760, // render width for the full card and sky compass
  tileWidth: 460, // render width for tile shots
  only: null, // comma-separated shot names → capture just those
  outDir: 'images',
  compose: false, // vstack the tile gallery into tile-gallery.png (needs ffmpeg)
  gap: 28, // transparent px between tiles in the composed gallery (2× density)
  build: true,
  listShots: false,
  help: false,
};

const HELP = `
Capture still PNG screenshots of each card/control from the dev harness.

Usage:
  node scripts/capture-screenshots.mjs [options]
  npm run capture:screenshots -- [options]

One-time setup:
  npm install                     # installs the playwright devDependency
  npx playwright install chromium # downloads the headless browser
  # ffmpeg only needed for --compose, e.g.:  brew install ffmpeg

Options:
  --only <a,b,...>    Capture just these shot names (see --list-shots).
  --list-shots        Print the shot names + what each captures, then exit.
  --theme <dark|light>                                (default: ${DEFAULTS.theme})
  --card-width <px>   Render width for the full card & sky compass. (default: ${DEFAULTS.cardWidth})
  --tile-width <px>   Render width for tile shots.                   (default: ${DEFAULTS.tileWidth})
  --out-dir <dir>     Output directory for PNGs.                     (default: ${DEFAULTS.outDir})
  --compose           Also vstack the tile gallery into tile-gallery.png (needs ffmpeg).
  --gap <px>          Transparent gap between tiles in the gallery.     (default: ${DEFAULTS.gap})
  --no-build          Skip rebuilding the harness (use existing harness/dist).
  -h, --help          Show this help.

Examples:
  npm run capture:screenshots
  npm run capture:screenshots -- --only tile-solar --no-build
  npm run capture:screenshots -- --theme light --compose
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
      case '--list-shots': o.listShots = true; break;
      case '--no-build': o.build = false; break;
      case '--compose': o.compose = true; break;
      case '--gap': o.gap = Number(next(i++)); break;
      case '--only': o.only = next(i++).split(',').map((s) => s.trim()).filter(Boolean); break;
      case '--theme': o.theme = next(i++); break;
      case '--card-width': o.cardWidth = Number(next(i++)); break;
      case '--tile-width': o.tileWidth = Number(next(i++)); break;
      case '--out-dir': o.outDir = next(i++); break;
      default:
        throw new Error(`unknown option: ${a} (try --help)`);
    }
  }
  return o;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

/** Tiny static file server rooted at harness/ (the harness only self-serves in rollup watch mode). */
function startServer() {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
    const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
    const filePath = path.join(HARNESS_DIR, rel);
    if (!filePath.startsWith(HARNESS_DIR) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      res.statusCode = 404;
      res.end('not found');
      return;
    }
    res.setHeader('Content-Type', MIME[path.extname(filePath)] ?? 'application/octet-stream');
    res.end(readFileSync(filePath));
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    console.error(
      '✗ playwright not installed. Run `npm install`, then `npx playwright install chromium`.',
    );
    process.exit(1);
  }
}

function run(cmd, args, label) {
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`✗ ${label} failed (exit ${r.status})`);
    process.exit(1);
  }
}

function requireFfmpeg() {
  const r = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
  if (r.error || r.status !== 0) {
    console.error('✗ --compose needs ffmpeg on PATH. Install it (e.g. `brew install ffmpeg`) and retry.');
    process.exit(1);
  }
}

/** Build the config partial that enables ONLY the target card, with its config merged in. */
function enableOnly(card, config = {}) {
  const partial = {
    root: { enabled: card === 'root' },
    compass: { enabled: card === 'compass' },
    tile: { enabled: card === 'tile' },
  };
  Object.assign(partial[card], config);
  return partial;
}

async function captureShot(page, shot, opts) {
  const sel = SELECTORS[shot.card];
  const width = shot.card === 'tile' ? opts.tileWidth : opts.cardWidth;

  await page.evaluate((id) => window.__acpCapture.loadScenario(id), shot.scenario);

  // Toggle the target card off→on so card-stage recreates the element. The mock
  // never fires entity-registry-updated, so a card caches the registry from its
  // first mount — a remount is what makes it re-discover this scenario's
  // entry_ids instead of showing "no match".
  const partial = { theme: opts.theme, ...enableOnly(shot.card, shot.config) };
  const off = { ...partial, [shot.card]: { ...partial[shot.card], enabled: false } };
  await page.evaluate((p) => window.__acpCapture.setConfig(p), off);
  await page.evaluate((p) => window.__acpCapture.setConfig(p), partial);

  // Frame the target like a real ha-card (the harness stub draws no background)
  // and hide the section headings / disabled placeholders around it. A single
  // keyed <style> we replace each shot, so widths/tags never accumulate.
  await page.evaluate(
    ({ tag, width }) => {
      const app = document.querySelector('acp-harness-app');
      const stage = app?.shadowRoot?.querySelector('acp-harness-card-stage');
      if (!stage?.shadowRoot) return;
      stage.shadowRoot.getElementById('acp-cap-style')?.remove();
      const style = document.createElement('style');
      style.id = 'acp-cap-style';
      style.textContent =
        `${tag}{display:block;width:${width}px;background:var(--card-background-color);` +
        'border-radius:16px;overflow:hidden}' +
        '.card-host{max-width:none!important}' +
        '.card-heading,.disabled{display:none!important}' +
        ':host{padding:0!important}';
      stage.shadowRoot.appendChild(style);
    },
    { tag: sel.tag, width },
  );

  if (shot.minutes != null) {
    await page.evaluate((m) => window.__acpCapture.setMinutes(m), shot.minutes);
  }

  const card = page.locator(sel.tag).nth(shot.tileIndex ?? 0);
  if (sel.wait) {
    await card.locator(sel.wait).first().waitFor({ state: 'visible', timeout: 15000 });
  } else {
    await card.waitFor({ state: 'visible', timeout: 15000 });
  }

  const outPath = path.join(ROOT, opts.outDir, `${shot.name}.png`);
  mkdirSync(path.dirname(outPath), { recursive: true });
  await card.screenshot({ path: outPath, animations: 'disabled' });
  const kb = (statSync(outPath).size / 1024).toFixed(0);
  console.log(`  ✓ ${shot.name.padEnd(14)} → ${path.relative(ROOT, outPath)} (${kb} KB)`);
}

function composeGallery(opts, captured) {
  const have = GALLERY_ORDER.filter((n) => captured.includes(n));
  if (have.length < 2) {
    console.log('▸ Skipping --compose: need ≥2 tile shots in this run.');
    return;
  }
  requireFfmpeg();
  const inputs = [];
  for (const n of have) inputs.push('-i', path.join(ROOT, opts.outDir, `${n}.png`));
  const out = path.join(ROOT, opts.outDir, 'tile-gallery.png');
  // Pad a transparent strip below every tile but the last so they read as
  // separate cards on the page (matching a real stacked-tiles dashboard)
  // instead of one touching block. Output keeps alpha so the gap is invisible
  // on light and dark READMEs alike.
  const pads = have
    .map((_, i) =>
      i === have.length - 1
        ? `[${i}:v]format=rgba[v${i}]`
        : `[${i}:v]format=rgba,pad=iw:ih+${opts.gap}:0:0:color=#00000000[v${i}]`,
    )
    .join(';');
  const filter = `${pads};${have.map((_, i) => `[v${i}]`).join('')}vstack=inputs=${have.length}`;
  console.log('▸ Composing tile-gallery.png…');
  run(
    'ffmpeg',
    ['-y', ...inputs, '-filter_complex', filter, '-frames:v', '1', '-update', '1', out],
    'ffmpeg vstack',
  );
  const kb = (statSync(out).size / 1024).toFixed(0);
  console.log(`  ✓ tile-gallery   → ${path.relative(ROOT, out)} (${kb} KB)`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(HELP);
    return;
  }
  if (opts.listShots) {
    console.log('\nAvailable shots:');
    for (const s of SHOTS) console.log(`  ${s.name.padEnd(14)} ${s.note ?? ''}`);
    console.log(`\n  --compose stacks ${GALLERY_ORDER.join(', ')} into tile-gallery.png`);
    return;
  }

  const shots = opts.only ? SHOTS.filter((s) => opts.only.includes(s.name)) : SHOTS;
  if (opts.only) {
    const unknown = opts.only.filter((n) => !SHOTS.some((s) => s.name === n));
    if (unknown.length) {
      console.error(`✗ unknown shot(s): ${unknown.join(', ')} (try --list-shots)`);
      process.exit(1);
    }
  }

  const { chromium } = await loadPlaywright();

  if (opts.build) {
    console.log('▸ Building harness…');
    run('npm', ['run', 'build:harness'], 'harness build');
  }
  if (!existsSync(path.join(HARNESS_DIR, 'dist', 'harness.js'))) {
    console.error('✗ harness/dist/harness.js missing — run without --no-build first.');
    process.exit(1);
  }

  const { server, port } = await startServer();
  const browser = await chromium.launch();

  try {
    // Viewport must clear the harness's controls sidebar plus stage padding so
    // the card gets its full render width; tall enough for the full card.
    const ctx = await browser.newContext({
      viewport: { width: opts.cardWidth + 460, height: 1600 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${port}/?capture`, { waitUntil: 'load' });
    await page.waitForFunction(() => Boolean(window.__acpCapture), null, { timeout: 15000 });

    const ids = await page.evaluate(() => window.__acpCapture.listScenarios().map((s) => s.id));
    for (const s of shots) {
      if (!ids.includes(s.scenario)) {
        console.error(`✗ shot "${s.name}" references unknown scenario "${s.scenario}".`);
        process.exit(1);
      }
    }

    console.log(`▸ Capturing ${shots.length} shot(s) (${opts.theme})…`);
    for (const shot of shots) await captureShot(page, shot, opts);

    if (opts.compose) composeGallery(opts, shots.map((s) => s.name));
    console.log('✓ Done.');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(`✗ ${err.message ?? err}`);
  process.exit(1);
});
