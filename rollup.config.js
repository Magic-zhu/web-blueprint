import typescript from 'rollup-plugin-typescript2'
import {terser} from 'rollup-plugin-terser'
import reolve from 'rollup-plugin-node-resolve'

export default [
  {
    input: './src/index.ts',
    plugins: [
      reolve(),
      typescript(),
      // terser()
    ],
    output: [
      {
        file: 'dist/blueprint-ems.min.js',
        format: 'es',
      },
      {
        file: 'dist/blueprint-iife.min.js',
        format: 'iife',
        name: 'blueprint',
      },
      {
        file: 'dist/blueprint-umd.min.js',
        format: 'umd',
        name: 'blueprint',
      },
    ],
  },
]
