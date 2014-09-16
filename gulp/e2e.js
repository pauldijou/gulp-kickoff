var gulp    = require('gulp');
var $       = require('./utils/$');

gulp.task('clean:e2e', function () {
  return gulp.src($.paths.test.e2e.build, {read: false})
    .pipe($.rimraf());
});

protractor = $.lazypipe()
  .pipe($.protractor.protractor, {
    configFile: './test/protractor.config.js'
  });

compile = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.coffee, {bare: true})
  .pipe($.header, 'require(\'' + process.cwd() + '/test/protractor.adapter.js\');\n\n')
  .pipe(gulp.dest, $.paths.test.e2e.dest);

gulp.task('coffee:e2e', ['clean:e2e'], function () {
  return gulp.src($.paths.test.e2e.coffee)
    .pipe(compile());
});

gulp.task('e2e', ['coffee:e2e'], function () {
  return gulp.src([$.paths.test.e2e.js, $.paths.test.e2e.build])
    .pipe($.plumber({errorHandler: $.on.error}))
    .pipe(protractor());
});


gulp.task('watch:e2e', ['clean:e2e'], function () {
  return $.watch({
    name: 'E2E',
    glob: [$.paths.test.e2e.js, $.paths.test.e2e.coffee]
  }, function (files) {
    return files
      .pipe($.if($.utils.is.coffee, compile()))
      .pipe(protractor());
  });
});
