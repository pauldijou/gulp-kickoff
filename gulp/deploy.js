var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('deploy:clean', function () {
  return gulp.src($.paths.deploy.dest, {read: false})
    .pipe($.rimraf());
});

gulp.task('deploy', ['usemin'], function () {
  return gulp.src($.paths.images.final, {base: './'})
    .pipe(gulp.dest($.paths.deploy.dest));
})
