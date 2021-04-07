const gulp = require('gulp');
const gulpts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const mustache = require('gulp-mustache');
const clean = require('gulp-clean');
const browserify = require('gulp-browserify');
const connect = require('gulp-connect');

const JS_FILE = 'matchus.min.js';

// clean dist & cache & lib
gulp.task('clean', () => {
  return gulp.src(['dist', 'lib'], { read: false, allowEmpty: true })
    .pipe(clean());
});

// clean cache
gulp.task('clean-cache', () => {
  return gulp.src(['cache'], { read: false, allowEmpty: true })
  .pipe(clean());
});

// complie from ts to js & move to cache 
gulp.task('cache', () => {
  return gulp.src('src/**/*.ts')
    .pipe(gulpts({
        target: 'es3',
        lib: [
          'dom',
          'esnext'
        ],
        module: 'commonjs',
    }))
    .pipe(gulp.dest('cache'));
});

// combine & rename & move to dist
gulp.task('scripts', () => {
  return gulp.src('cache/index.js')
    .pipe(browserify({ insertGlobals: false }))
    .pipe(uglify())
    .pipe(rename(JS_FILE))
    .pipe(gulp.dest('dist'));
});

// link scripts to html
gulp.task('html', () => {
  return gulp.src('./public/html.mustache')
    .pipe(mustache({ src: JS_FILE }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});

// production
gulp.task('default', gulp.series(['clean', 'cache', 'scripts', 'html']), () => {});

// configure the server
gulp.task('server', () => {
  connect.server({
    root: 'lib',
    livereload: true,
    port: 1234,
  });
});

gulp.task('scripts-lib', () => {
  return gulp.src('cache/index.js')
    .pipe(browserify({ insertGlobals: false }))
    .pipe(gulp.dest('lib'))
    .pipe(connect.reload());
});

gulp.task('html-lib', () => {
  return gulp.src('./public/html.mustache')
    .pipe(mustache({ src: 'index.js' }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('lib'))
    .pipe(connect.reload());
});

gulp.task('load-scripts', gulp.series(['clean-cache', 'cache', 'scripts-lib']));
gulp.task('load-html', gulp.series(['html-lib']));

// watch html & scripts
gulp.task('watch', () => {
  gulp.watch('public/html.mustache', gulp.series(['load-html']));
  gulp.watch('src/**/*.ts', gulp.series(['load-scripts', 'load-html']));
});

// development
gulp.task('dev', gulp.parallel(gulp.series(['load-scripts', 'load-html', 'server']), 'watch'), () => {});
