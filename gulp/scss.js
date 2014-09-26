var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {
  style: 'expanded',
  precision: 10,
  'sourcemap=file': true,
  sourcemapPath: '../../scripts',
  loadPath: [
    $.paths.bower.dir,
    $.paths.styles.dir
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

gulp.task('scss:watch', ['scss'], function () {
  return $.watch($.paths.scss.all, {name: 'Scss'}, function (files, cb) {
    return gulp.start('scss', cb);
  });
});
