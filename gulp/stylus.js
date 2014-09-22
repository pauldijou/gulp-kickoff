var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {};

gulp.task('stylus', ['styles:clean'], function () {
  return gulp.src($.paths.stylus.app)
    .pipe($.plumber({errorHandler: $.on.error}))
    .pipe($.stylus(config))
    .pipe($.filter('**/*.css'))
    .pipe($.autoprefixer($.config.autoprefixer))
    .pipe(gulp.dest($.paths.styles.dest))
    .pipe($.size({title: 'Stylus'}))
    .pipe($.if($.config.live, $.reloadStream()));
});

gulp.task('stylus:watch', function () {
  return $.watch({name: 'Stylus', glob: $.paths.stylus.all}, ['stylus'])
});
