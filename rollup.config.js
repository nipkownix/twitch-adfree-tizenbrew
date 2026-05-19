import { string } from 'rollup-plugin-string';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

const isDev = process.env.BUILD === 'development';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/userScript.js',

  output: {
    file: 'dist/userScript.js',
    // iife: self-executing bundle — what TizenBrew injects into the page.
    format: 'iife',
    sourcemap: isDev,
  },

  plugins: [
    // Import CSS files as plain strings.
    // ui.js injects them via a <style> element — no style-loader needed.
    string({ include: ['**/*.css', '**/patch_amazon_worker.js'] }),

    // Resolve node_modules imports (core-js-pure, whatwg-fetch, etc.)
    nodeResolve({ browser: true, preferBuiltins: false }),

    // Allow importing CommonJS modules from node_modules
    commonjs({
      include: [/node_modules/],
      transformMixedEsModules: true,
    }),

    babel({
      babelHelpers: 'runtime',
      exclude: /node_modules/,
    }),

    // Copy icons to dist/ for TizenBrew module display
    copy({
      targets: [{ src: 'assets/*.png', dest: 'dist' }],
    }),

    // Minify in production only
    !isDev && terser({ ecma: 5, mangle: true }),
  ].filter(Boolean),
};
