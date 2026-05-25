import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/adaptive-cover-pro-card.ts',
  output: {
    file: 'dist/adaptive-cover-pro-card.js',
    format: 'es',
    sourcemap: dev,
    banner: `/*! adaptive-cover-pro-card v${pkg.version} | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */`,
  },
  // @formatjs/intl-utils (pulled in by custom-card-helpers) ships UMD with
  // top-level `this`; rollup rewrites it to `undefined` and warns. Declare the
  // module context as `window` so the TS `__extends`/`__assign` helpers resolve
  // correctly and the warning goes away.
  moduleContext: (id) => (id.includes('@formatjs/intl-utils') ? 'window' : undefined),
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json', sourceMap: dev, inlineSources: dev }),
    !dev &&
      terser({
        format: { comments: /^!/ },
        compress: { passes: 2 },
      }),
  ].filter(Boolean),
};
