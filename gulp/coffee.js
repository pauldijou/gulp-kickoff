var gulp    = require('gulp');
var $       = require('./utils/$');

gulp.task('clean:scripts', function {
  return gulp.src($.paths.scripts.all, {read: false})
    .pipe($.rimraf())
});

compile = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.coffee, {bare: true})
  // Angular specific
  // .pipe($.ngAnnotate)
  .pipe(gulp.dest, $.paths.scripts.dest)
  .pipe($.reloadStream);

gulp.task('coffee', ['clean:scripts'], function () {
  return gulp.src($.paths.coffee.all).pipe(compile());
});

gulp.task ('watch:coffee', ['coffee'], function () {
  return $.watch({name: 'Coffee', glob: $.paths.coffee.all})
    .pipe($.filter($.filters.changed))
    .pipe(compile());
});
