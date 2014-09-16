var gulp    = require('gulp');
var $       = require('./utils/$');

gulp.task('clean:styles', function () {
  return gulp.src($.paths.styles.all, {read: false})
    .pipe($.rimraf());
});

config = {
  style: 'expanded',
  precision: 10,
  sourcemap: true,
  sourcemapPath: './',
  loadPath: [
    $.paths.scss.bower,
    $.paths.scss.all
  ]
}

gulp.task('scss', ['clean:styles'], function () {
  return gulp.src($.paths.scss.app)
    .pipe($.plumber({errorHandler: $.on.error}))
    .pipe($.rubySass(config))
    .pipe($.filter('**/*.css'))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest($.paths.styles.dest))
    .pipe($.size({title: 'styles'}))
    .pipe($.reloadStream());
});

gulp.task('watch:scss', function () {
  return $.watch({name: 'Scss', glob: $.paths.scss.all}, ['scss'])
});
