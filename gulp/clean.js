var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('styles:clean', function () {
  return gulp.src($.paths.styles.build, {read: false})
    .pipe($.rimraf());
});

gulp.task('scripts:clean', function () {
  return gulp.src($.paths.scripts.build, {read: false})
    .pipe($.rimraf())
});

gulp.task('clean', ['scripts:clean', 'styles:clean']);

gulp.task('test:clean', ['unit:clean', 'e2e:clean']);
