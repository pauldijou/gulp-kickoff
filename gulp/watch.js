var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('watch:html', function () {
  return $.watch({
    name: 'Html',
    glob: ['./index.html', $.paths.templates.all]
  }, ['sync:reload']);
});

gulp.task('watch', ['watch:coffee', 'watch:scss', 'watch:html']);
