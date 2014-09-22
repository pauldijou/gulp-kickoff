var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {
  style: 'expanded',
  precision: 10,
  sourcemap: true,
  sourcemapPath: './',
  loadPath: [
    $.paths.scss.bower,
    $.paths.scss.all
  ]
};

gulp.task('scss', ['styles:clean'], function () {
  return gulp.src($.paths.scss.app)
    .pipe($.plumber({errorHandler: $.on.error}))
    .pipe($.rubySass(config))
    .pipe($.filter('**/*.css'))
    .pipe($.autoprefixer($.config.autoprefixer))
    .pipe(gulp.dest($.paths.styles.dest))
    .pipe($.size({title: 'Scss'}))
    .pipe($.if($.config.live, $.reloadStream()));
});

gulp.task('scss:watch', function () {
  return $.watch({name: 'Scss', glob: $.paths.scss.all}, ['scss'])
});
