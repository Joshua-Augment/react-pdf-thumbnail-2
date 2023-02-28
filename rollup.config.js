import resolve from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const minifiedOutputs = [
  {
    file: pkg.exports['.'].import,
    format: 'esm',
  },
  {
    file: pkg.exports['.'].require,
    format: 'cjs',
  },
];

const commonPlugins = [
  ts({
    transpiler: 'babel'
  }),
];

export default [
  {
    input: './src/index.ts',
    output: [...minifiedOutputs],
    plugins: [
      ...commonPlugins,
      resolve(),
      // terser({ include: /\.min\.[^.]+$/ }),
    ],
    external: [/^@babel\/runtime\//],
  }
];