var gulp    = require('gulp');
var $       = require('./utils/$');

var compile = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.typescript)
  // Angular specific
  // .pipe($.ngAnnotate)
  .pipe(gulp.dest, $.paths.scripts.dest)
  .pipe(function () {
    return $.if($.config.live, $.reloadStream())
  });

gulp.task('typescript', ['scripts:clean'], function () {
  return gulp.src($.paths.typescript.all).pipe(compile());
});

gulp.task ('typescript:watch', ['scripts:clean'], function () {
  return $.watch({name: 'TypeScript', glob: $.paths.typescript.all})
    .pipe(compile());
});
