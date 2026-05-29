import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const watch = process.env.ROLLUP_WATCH === 'true';
const port = parseInt(process.env.PORT ?? '8080', 10);

export default {
  input: 'harness/harness.ts',
  output: {
    file: 'harness/dist/harness.js',
    format: 'es',
    sourcemap: true,
  },
  moduleContext: (id) => (id.includes('@formatjs/intl-utils') ? 'window' : undefined),
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json', sourceMap: true, inlineSources: true }),
    watch && serve({ contentBase: 'harness', port, host: '0.0.0.0' }),
    watch && livereload({ watch: 'harness/dist' }),
  ].filter(Boolean),
};
