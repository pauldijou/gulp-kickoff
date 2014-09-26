var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('html:watch', function () {
  return $.watch(['./index.html', $.paths.templates.all], {name: 'Html'}, function (files, cb) {
    return gulp.start('sync:reload', cb);
  });
});

gulp.task('styles:watch', $.config.styles.map(function (s) { return s + ':watch'; }));

gulp.task('scripts:watch', $.config.scripts.map(function (s) { return s + ':watch'; }));

gulp.task('watch', ['sprites', 'styles:watch', 'scripts:watch', 'html:watch']);
