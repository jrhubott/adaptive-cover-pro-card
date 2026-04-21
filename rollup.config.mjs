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
