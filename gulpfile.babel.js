import gulp from 'gulp';
import rollup from 'gulp-rollup';
import uglify from 'gulp-uglify';
import csso from 'gulp-csso';
import inline from 'gulp-inline';
import htmlmin from 'gulp-htmlmin';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';


gulp.task('js', () => {
  gulp.src('src/index.js', { read: false })
    .pipe(rollup({
      format: 'iife',
      plugins: [
        nodeResolve({
          jsnext: true,
        }),
        commonjs({
          include: 'node_modules/**',
        }),
        babel({
          presets: ['es2015-rollup'],
          babelrc: false,
        }),
      ],
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('css', () => {
  gulp.src('styles/index.css')
    .pipe(csso())
    .pipe(gulp.dest('dist'));
});

gulp.task('html', ['js', 'css'], () => {
  gulp.src('html/index.html')
    .pipe(inline({
      base: '.',
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['html'], () => {});

gulp.task('watch', () => {
  gulp
    .watch([
      'src/index.js',
      'styles/index.css',
      'html/index.html',
    ], ['default'])
    .on('change', () => {
      console.log('updated'); // eslint-disable-line
    });
});
