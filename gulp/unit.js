var gulp    = require('gulp');
var karma   = require('karma').server;
var $       = require('./utils/$');

gulp.task('unit:clean', function () {
  return gulp.src($.paths.test.unit.build, {read: false})
    .pipe($.rimraf());
});

var compileCoffee = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.coffee, {bare: true})
  .pipe(gulp.dest, $.paths.test.unit.dest);

var compileTypescript = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.typescript)
  .pipe(gulp.dest, $.paths.test.unit.dest);

gulp.task('unit:scripts:coffee', ['unit:clean'], function () {
  return gulp.src($.paths.test.unit.coffee)
    .pipe(compileCoffee());
});

gulp.task('unit:scripts:typescript', ['unit:clean'], function () {
  return gulp.src($.paths.test.unit.typescript)
    .pipe(compileTypescript());
});

gulp.task('unit:scripts', ['unit:scripts:coffee', 'unit:scripts:typescript']);

gulp.task('unit', ['unit:scripts'], function (done) {
  karma.start({
    configFile: process.cwd() + '/test/karma.conf.js'
  }, done);
});

gulp.task('karma:watch', ['unit:scripts'], function (done) {
  karma.start({
    configFile: process.cwd() + '/test/karma.conf.js',
    singleRun: false,
    autoWatch: true
  }, done);
});

gulp.task('unit:watch:coffee', ['unit:scripts:coffee'], function () {
  return $.watch($.paths.test.unit.coffee, {name: 'Unit Coffee'})
    .pipe(compileCoffee());
});

gulp.task('unit:watch:typescript', ['unit:scripts:typescript'], function () {
  return $.watch($.paths.test.unit.typescript, {name: 'Unit Typescript'})
    .pipe(compileTypescript());
});

gulp.task('unit:watch', ['karma:watch', 'unit:watch:coffee', , 'unit:watch:typescript', 'scripts:watch']);
