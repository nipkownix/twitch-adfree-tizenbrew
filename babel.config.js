import Module from 'node:module';

const require = Module.createRequire(import.meta.url);

const { version: babelruntimeVersion } = require('@babel/runtime-corejs3/package.json');

/** @type {import('@babel/core').ConfigFunction} */
function makeConfig(api) {
  api.cache.invalidate(() => babelruntimeVersion);

  return {
    sourceType: 'unambiguous',
    assumptions: {
      noNewArrows: true
    },
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
          regenerator: false,
          version: babelruntimeVersion
        }
      ],
      [
        'polyfill-regenerator',
        {
          method: 'usage-pure'
        }
      ]
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          bugfixes: true,
          targets: { chrome: 47 }
        }
      ]
    ]
  };
}

export default makeConfig;
