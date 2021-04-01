const gulp = require('gulp');
const gulpts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const mustache = require('gulp-mustache');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const browserify = require('gulp-browserify');

const JS_FILE = 'matchus.min.js';

gulp.task('clean', () => {
  return gulp.src('dist', { read: false, allowEmpty: true })
    .pipe(clean());
});

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

gulp.task('scripts', () => {
  return gulp.src('cache/index.js')
    .pipe(browserify({ insertGlobals: false }))
    .pipe(uglify())
    .pipe(rename(JS_FILE))
    .pipe(gulp.dest('dist'));
});

gulp.task('html', () => {
  return gulp.src('./public/html.mustache')
    .pipe(mustache({ src: JS_FILE }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series(['clean', 'cache', 'scripts', 'html']), () => {});