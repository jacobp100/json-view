import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  format: 'iife',
  plugins: [
    nodeResolve({
      jsnext: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel(),
  ],
  dest: 'dist.js',
};
