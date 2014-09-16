var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('clean', ['clean:scripts', 'clean:styles']);

gulp.task('clean:test', ['clean:test:spec', 'clean:test:e2e']);

gulp.task('clean:build', function () {
  return gulp.src($.paths.build, {read: false})
    .pipe($.rimraf());
});
