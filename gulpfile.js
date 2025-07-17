const { src, dest, watch, series, parallel } = require('gulp');
// const sass         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer').default;
const cleanCss     = require('gulp-clean-css');
const htmlmin      = require('gulp-htmlmin');
const terser = require('gulp-terser');
const rename       = require('gulp-rename');
const connect      = require('gulp-connect');
const paths = {
  html: {
    src:  'app/**/*.html',
    dest: 'public/'
  },
  styles: {
    src:  'app/css/**/*.css',
    dest: 'public/css/'
  },
  scripts: {
    src:  'app/js/**/*.js',
    dest: 'public/js/'
  }
};
function html() {
  return src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest(paths.html.dest))
    .pipe(connect.reload());
}
function styles() {
  return src(paths.styles.src)
    .pipe(autoprefixer({
      cascade: false,
      grid: 'autoplace'
    }))
    .pipe(cleanCss({ level: 2 }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.styles.dest))
    .pipe(connect.reload());
}
function scripts() {
  return src(paths.scripts.src)
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scripts.dest))
    .pipe(connect.reload());
}
function server(done) {
  connect.server({
    root: 'public',
    port: 3000,
    livereload: true
  });
  done();
}
function watcher() {
  watch(paths.html.src,   html);
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
}
exports.html    = html;
exports.styles  = styles;
exports.scripts = scripts;
exports.watch   = watcher;
exports.server  = server;
exports.default = series(
  parallel(html, styles, scripts),
  parallel(server, watcher)
);
