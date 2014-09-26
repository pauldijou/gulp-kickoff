var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {
  paths: [
    $.paths.styles.dir,
    $.paths.bower.dir
  ]
};

gulp.task('less', ['styles:clean'], function () {
  return gulp.src($.paths.less.app)
    .pipe($.plumber({errorHandler: $.on.error}))
    .pipe($.sourcemaps.init())
    .pipe($.less(config))
    .pipe($.filter('**/*.css'))
    .pipe($.autoprefixer($.config.autoprefixer))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest($.paths.styles.dest))
    .pipe($.size({title: 'Less'}))
    .pipe($.if($.config.live, $.reloadStream()));
});

gulp.task('less:watch', ['less'], function () {
  return $.watch($.paths.less.all, {name: 'Less'}, function (files, cb) {
    return gulp.start('less', cb);
  });
});
