import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
const terser = require('rollup-plugin-terser').terser

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/v-timers.esm.js',
      format: 'es'
    },
    plugins: [
      resolve(),
      // use own babel config to compile
      babel({
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false
            }
          ]
        ],
        plugins: ['@babel/plugin-external-helpers'],
        babelrc: false
      }),
      terser()
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/v-timers.umd.js',
      format: 'umd',
      name: 'vTimers'
    },
    plugins: [
      resolve(),
      // use own babel config to compile
      babel({
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false
            }
          ]
        ],
        plugins: ['@babel/plugin-external-helpers'],
        babelrc: false
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser()
    ]
  }
]
