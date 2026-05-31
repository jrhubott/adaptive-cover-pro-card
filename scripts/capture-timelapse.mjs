#!/usr/bin/env node
/**
 * Capture a time-lapse GIF of the sky-compass card sweeping through a simulated
 * day, straight from the dev harness.
 *
 * Pipeline: build the harness → serve it on an ephemeral port → drive it with
 * Playwright (headless Chromium) via the `?capture` bridge, stepping the
 * time-of-day minute by minute and screenshotting the card → encode the frames
 * to a palette-optimised, auto-looping GIF with ffmpeg.
 *
 * The output GIF auto-loops inline everywhere the README is shown — GitHub web,
 * GitHub mobile, the HACS panel, and the HA companion app's webviews — which is
 * why GIF (not video) is the target: HACS strips <video> tags.
 *
 * Requirements (dev-only, nothing here ships in the card bundle):
 *   - Playwright:  npm i  (it's a devDependency) and `npx playwright install chromium`
 *   - ffmpeg on PATH:  e.g. `brew install ffmpeg`
 *
 * Run `node scripts/capture-timelapse.mjs --help` for options.
 */

import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HARNESS_DIR = path.join(ROOT, 'harness');

const DEFAULTS = {
  scenario: 'summer-north-highlat',
  theme: 'dark',
  date: null, // null → keep the scenario's own date
  lat: null,
  lon: null,
  start: 0, // minutes since midnight
  end: 1439,
  step: 8, // minutes advanced per frame → (end-start)/step + 1 frames
  fps: 24,
  width: 600, // output GIF width in px
  cardWidth: 520, // rendered card width in px; ≥320 puts the legend right of the compass
  showMoon: true, // overlay the moon on the compass
  showSunPath: null,
  showElevationChart: true, // include the "Sun Today" chart below the compass
  out: path.join('images', 'sky-compass-timelapse.gif'),
  build: true,
  listScenarios: false,
  help: false,
};

const HELP = `
Capture a time-lapse GIF of the sky-compass card from the dev harness.

Usage:
  node scripts/capture-timelapse.mjs [options]
  npm run capture:timelapse -- [options]

One-time setup:
  npm install                     # installs the playwright devDependency
  npx playwright install chromium # downloads the headless browser
  # ffmpeg must be on PATH, e.g.:  brew install ffmpeg

Options:
  --scenario <id>     Harness scenario to base the capture on. This is the main
                      "what's captured" knob — it sets window orientation, FOV,
                      covers and location.            (default: ${DEFAULTS.scenario})
  --list-scenarios    Print the available scenario ids and exit.
  --date <YYYY-MM-DD> Override the day of year (affects the sun's arc height).
  --lat <deg>         Override latitude.
  --lon <deg>         Override longitude.
  --theme <dark|light>                                (default: ${DEFAULTS.theme})
  --start <min>       Span start, minutes since midnight.       (default: ${DEFAULTS.start})
  --end <min>         Span end, minutes since midnight.         (default: ${DEFAULTS.end})
  --step <min>        Minutes advanced per frame.               (default: ${DEFAULTS.step})
  --fps <n>           GIF playback framerate.                   (default: ${DEFAULTS.fps})
  --width <px>        Output GIF width.                         (default: ${DEFAULTS.width})
  --card-width <px>   Rendered card width. ≥320 lays the legend out to the right of
                      the compass; below that it stacks underneath. (default: ${DEFAULTS.cardWidth})
  --show-elevation-chart / --no-show-elevation-chart
                      Show/hide the "Sun Today" elevation chart below the compass.
                                                                (default: shown)
  --show-moon / --no-show-moon          Force the moon overlay on/off.
  --show-sun-path / --no-show-sun-path  Force the 24h sun-path arc on/off.
  --out <path>        Output GIF path.            (default: ${DEFAULTS.out})
  --no-build          Skip rebuilding the harness (use existing harness/dist).
  -h, --help          Show this help.

Examples:
  npm run capture:timelapse
  npm run capture:timelapse -- --scenario winter-morning-east --theme light --step 6 --fps 30
  npm run capture:timelapse -- --scenario multi-window --start 300 --end 1200 --width 520
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
      case '--list-scenarios': o.listScenarios = true; break;
      case '--no-build': o.build = false; break;
      case '--show-elevation-chart': o.showElevationChart = true; break;
      case '--no-show-elevation-chart': o.showElevationChart = false; break;
      case '--show-moon': o.showMoon = true; break;
      case '--no-show-moon': o.showMoon = false; break;
      case '--show-sun-path': o.showSunPath = true; break;
      case '--no-show-sun-path': o.showSunPath = false; break;
      case '--scenario': o.scenario = next(i++); break;
      case '--theme': o.theme = next(i++); break;
      case '--date': o.date = next(i++); break;
      case '--lat': o.lat = Number(next(i++)); break;
      case '--lon': o.lon = Number(next(i++)); break;
      case '--start': o.start = Number(next(i++)); break;
      case '--end': o.end = Number(next(i++)); break;
      case '--step': o.step = Number(next(i++)); break;
      case '--fps': o.fps = Number(next(i++)); break;
      case '--width': o.width = Number(next(i++)); break;
      case '--card-width': o.cardWidth = Number(next(i++)); break;
      case '--out': o.out = next(i++); break;
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
    // Refuse to serve outside the harness directory.
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

function requireFfmpeg() {
  const r = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
  if (r.error || r.status !== 0) {
    console.error('✗ ffmpeg not found on PATH. Install it (e.g. `brew install ffmpeg`) and retry.');
    process.exit(1);
  }
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

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(HELP);
    return;
  }

  requireFfmpeg();
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
  const tmpDir = path.join(ROOT, '.timelapse-frames');
  rmSync(tmpDir, { recursive: true, force: true });
  mkdirSync(tmpDir, { recursive: true });

  try {
    // Viewport must clear the harness's 360px controls sidebar plus stage padding
    // so the card gets its full `cardWidth` (otherwise the container query that
    // moves the legend to the right never trips).
    const viewportW = opts.cardWidth + 460;
    const ctx = await browser.newContext({
      viewport: { width: viewportW, height: 1100 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${port}/?capture`, { waitUntil: 'load' });
    await page.waitForFunction(() => Boolean(window.__acpCapture), null, { timeout: 15000 });

    if (opts.listScenarios) {
      const list = await page.evaluate(() => window.__acpCapture.listScenarios());
      console.log('\nAvailable scenarios:');
      for (const s of list) console.log(`  ${s.id.padEnd(28)} ${s.label}`);
      return;
    }

    // Validate scenario up front for a clean error.
    const ids = await page.evaluate(() => window.__acpCapture.listScenarios().map((s) => s.id));
    if (!ids.includes(opts.scenario)) {
      console.error(`✗ unknown scenario "${opts.scenario}". Available:\n  ${ids.join('\n  ')}`);
      process.exit(1);
    }

    // 1. Base on the chosen scenario, then force a compass-only, themed layout.
    await page.evaluate((o) => window.__acpCapture.loadScenario(o.scenario), opts);
    const compassPartial = { show_elevation_chart: opts.showElevationChart };
    if (opts.showMoon !== null) compassPartial.show_moon = opts.showMoon;
    if (opts.showSunPath !== null) compassPartial.show_sun_path = opts.showSunPath;
    const partial = {
      theme: opts.theme,
      root: { enabled: false },
      tile: { enabled: false },
      compass: { enabled: true, ...compassPartial },
    };
    if (opts.date) partial.date = opts.date;
    if (opts.lat !== null && !Number.isNaN(opts.lat)) partial.latitude = opts.lat;
    if (opts.lon !== null && !Number.isNaN(opts.lon)) partial.longitude = opts.lon;
    // Toggle the compass off→on so card-stage recreates the element. The harness
    // mock never fires entity-registry-updated events, so the card caches the
    // registry from its first mount — a remount is what makes it re-discover the
    // (possibly different) scenario's entry_ids instead of showing "no match".
    await page.evaluate(
      (p) => window.__acpCapture.setConfig({ ...p, compass: { ...p.compass, enabled: false } }),
      partial,
    );
    await page.evaluate((p) => window.__acpCapture.setConfig(p), partial);

    // 2. Frame the card like a real ha-card (the harness stub has no background).
    //    Injected into the card-stage shadow root so it reaches the card host.
    await page.evaluate((cardWidth) => {
      const app = document.querySelector('acp-harness-app');
      const stage = app?.shadowRoot?.querySelector('acp-harness-card-stage');
      if (!stage?.shadowRoot) return;
      const style = document.createElement('style');
      style.textContent =
        `adaptive-cover-pro-sky-compass-card{display:block;width:${cardWidth}px;` +
        'background:var(--card-background-color);border-radius:16px;overflow:hidden}' +
        '.card-host{max-width:none!important}' +
        '.card-heading,.disabled,#root-host,#tile-host{display:none!important}' +
        ':host{padding:0!important}';
      stage.shadowRoot.appendChild(style);
    }, opts.cardWidth);

    // 3. Settle one frame, then pin a fixed clip so every frame is identical size.
    await page.evaluate((o) => window.__acpCapture.setMinutes(o.start), opts);
    const card = page.locator('adaptive-cover-pro-sky-compass-card');
    // Wait for the actual compass SVG — not just the card shell, which is also
    // present when discovery fails and the card renders a "no match" message.
    await card.locator('.compass svg').first().waitFor({ state: 'visible', timeout: 15000 });
    const box = await card.boundingBox();
    if (!box) throw new Error('could not locate the sky-compass card');
    const clip = {
      x: Math.floor(box.x),
      y: Math.floor(box.y),
      width: Math.ceil(box.width),
      height: Math.ceil(box.height),
    };

    // 4. Step time and capture frames.
    const minutes = [];
    for (let m = opts.start; m <= opts.end; m += opts.step) minutes.push(m);
    console.log(
      `▸ Capturing ${minutes.length} frames (${opts.scenario}, ${opts.theme}, ` +
        `${opts.start}–${opts.end} min step ${opts.step})…`,
    );
    for (let i = 0; i < minutes.length; i++) {
      await page.evaluate((m) => window.__acpCapture.setMinutes(m), minutes[i]);
      const frame = path.join(tmpDir, `frame_${String(i).padStart(4, '0')}.png`);
      await page.screenshot({ path: frame, clip, animations: 'disabled' });
      if ((i + 1) % 30 === 0 || i === minutes.length - 1) {
        process.stdout.write(`\r  ${i + 1}/${minutes.length} frames`);
      }
    }
    process.stdout.write('\n');

    // 5. Encode → palette-optimised, infinitely-looping GIF.
    const outPath = path.isAbsolute(opts.out) ? opts.out : path.join(ROOT, opts.out);
    mkdirSync(path.dirname(outPath), { recursive: true });
    const palette = path.join(tmpDir, 'palette.png');
    const scale = `scale=${opts.width}:-1:flags=lanczos`;
    console.log('▸ Encoding GIF…');
    run(
      'ffmpeg',
      ['-y', '-framerate', String(opts.fps), '-i', path.join(tmpDir, 'frame_%04d.png'),
        '-vf', `${scale},palettegen=stats_mode=diff`, palette],
      'ffmpeg palettegen',
    );
    run(
      'ffmpeg',
      ['-y', '-framerate', String(opts.fps), '-i', path.join(tmpDir, 'frame_%04d.png'),
        '-i', palette,
        '-lavfi', `${scale}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3`,
        '-loop', '0', outPath],
      'ffmpeg paletteuse',
    );

    const kb = (statSync(outPath).size / 1024).toFixed(0);
    console.log(`✓ Wrote ${path.relative(ROOT, outPath)} (${kb} KB, ${minutes.length} frames)`);
  } finally {
    await browser.close();
    server.close();
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(`✗ ${err.message ?? err}`);
  process.exit(1);
});
