var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {
  sourcemap: {
    inline: true,
    sourceRoot: '.',
    basePath: 'styles'
  }
};

gulp.task('stylus', ['styles:clean'], function () {
  return gulp.src($.paths.stylus.app)
    .pipe($.plumber({errorHandler: $.on.error}))
    .pipe($.stylus(config))
    .pipe($.filter('**/*.css'))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.autoprefixer($.config.autoprefixer))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest($.paths.styles.dest))
    .pipe($.size({title: 'Stylus'}))
    .pipe($.if($.config.live, $.reloadStream()));
});

gulp.task('stylus:watch', ['stylus'], function () {
  return $.watch($.paths.stylus.all, {name: 'Stylus'}, function (files, cb) {
    return gulp.start('stylus', cb);
  });
});
