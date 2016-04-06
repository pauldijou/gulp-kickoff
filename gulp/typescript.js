var gulp    = require('gulp');
var $       = require('./utils/$');

var compile = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.sourcemaps.init)
  .pipe($.typescript)
  //@ifdef angularjs
  .pipe($.ngAnnotate)
  //@endif
  .pipe($.sourcemaps.write)
  .pipe(gulp.dest, $.paths.scripts.dest)
  .pipe(function () {
    return $.if($.config.live, $.reloadStream())
  });

gulp.task('typescript', ['scripts:clean'], function () {
  return gulp.src($.paths.typescript.all).pipe(compile());
});

gulp.task ('typescript:watch', ['typescript'], function () {
  return $.watch($.paths.typescript.all, {name: 'TypeScript'})
    .pipe(compile());
});
