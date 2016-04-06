var gulp    = require('gulp');
var $       = require('./utils/$');

var compile = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.sourcemaps.init)
  .pipe($.coffee, {bare: true})
  //@ifdef angularjs
  .pipe($.ngAnnotate)
  //@endif
  .pipe($.sourcemaps.write)
  .pipe(gulp.dest, $.paths.scripts.dest)
  .pipe(function () {
    return $.if($.config.live, $.reloadStream())
  });

gulp.task('coffee', ['scripts:clean'], function () {
  return gulp.src($.paths.coffee.all).pipe(compile());
});

gulp.task ('coffee:watch', ['coffee'], function () {
  return $.watch($.paths.coffee.all, {name: 'Coffee'})
    .pipe(compile());
});
