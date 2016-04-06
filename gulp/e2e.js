var gulp    = require('gulp');
var $       = require('./utils/$');

gulp.task('e2e:clean', function () {
  return gulp.src($.paths.test.e2e.build, {read: false})
    .pipe($.rimraf());
});

var protractor = $.lazypipe()
  .pipe($.protractor.protractor, {
    configFile: './test/protractor.config.js'
  });

var glob = [$.paths.test.e2e.js];

//@ifdef coffee
glob.push($.paths.test.e2e.coffee);

var compileCoffee = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.coffee, {bare: true})
  .pipe($.header, 'require(\'' + process.cwd() + '/test/protractor.adapter.js\');\n\n')
  .pipe(gulp.dest, $.paths.test.e2e.dest);


gulp.task('e2e:scripts:coffee', ['e2e:clean'], function () {
  return gulp.src($.paths.test.e2e.coffee)
    .pipe(compileCoffee());
});
//@endif

//@ifdef typescript
glob.push($.paths.test.e2e.typescript);

var compileTypescript = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.typescript)
  .pipe(gulp.dest, $.paths.test.e2e.dest);

gulp.task('e2e:scripts:typescript', ['e2e:clean'], function () {
  return gulp.src($.paths.test.e2e.typescript)
    .pipe(compileTypescript());
});
//@endif

gulp.task('e2e', ['e2e:scripts'], function () {
  return gulp.src([$.paths.test.e2e.js, $.paths.test.e2e.build])
    .pipe($.plumber({errorHandler: $.on.error}))
    .pipe(protractor());
});

gulp.task('e2e:watch', ['e2e:scripts'], function () {
  return $.watch(glob, {name: 'E2E'}, function (files) {
    return files
      //@ifdef coffee
      .pipe($.if($.utils.is.coffee, compileCoffee()))
      //@endif
      //@ifdef typescript
      .pipe($.if($.utils.is.typescript, compileTypescript()))
      //@endif
      .pipe(protractor());
  });
});
