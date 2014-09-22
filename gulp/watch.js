var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('html:watch', function () {
  return $.watch({
    name: 'Html',
    glob: ['./index.html', $.paths.templates.all]
  }, ['sync:reload']);
});
