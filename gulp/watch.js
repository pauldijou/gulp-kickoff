var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('html:watch', function () {
  return $.watch({
    name: 'Html',
    glob: ['./index.html', $.paths.templates.all]
  }, ['sync:reload']);
});

gulp.task('styles:watch', ['scss:watch', 'less:watch', 'stylus:watch']);

gulp.task('scripts:watch', ['coffee:watch', 'typescript:watch']);

gulp.task('watch', ['sprites', 'styles:watch', 'scripts:watch', 'html:watch']);
