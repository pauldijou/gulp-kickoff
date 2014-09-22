var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {
  paths: []
};

gulp.task('less', ['styles:clean'], function () {
  return gulp.src($.paths.less.app)
    .pipe($.plumber({errorHandler: $.on.error}))
    .pipe($.less(config))
    .pipe($.filter('**/*.css'))
    .pipe($.autoprefixer($.config.autoprefixer))
    .pipe(gulp.dest($.paths.styles.dest))
    .pipe($.size({title: 'Less'}))
    .pipe($.if($.config.live, $.reloadStream()));
});

gulp.task('less:watch', function () {
  return $.watch({name: 'Scss', glob: $.paths.less.all}, ['less'])
});
