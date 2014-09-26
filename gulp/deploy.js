var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('deploy:clean', function () {
  return gulp.src($.paths.deploy.dir, {read: false})
    .pipe($.rimraf());
});

gulp.task('deploy', ['usemin', 'images']);
