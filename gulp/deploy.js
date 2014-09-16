var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('deploy', ['usemin'], function () {
  return gulp.src($.paths.images.final, {base: './'})
    .pipe gulp.dest($.paths.build);
})
