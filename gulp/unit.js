var gulp    = require('gulp');
var karma   = require('karma').server;
var $       = require('./utils/$');

gulp.task('clean:unit', function () {
  return gulp.src($.paths.test.unit.build, {read: false})
    .pipe($.rimraf());
});

compile = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.coffee, {bare: true})
  .pipe(gulp.dest, $.paths.test.unit.dest);

changedCoffee = function (file) {
  if ($.utils.is.coffee(file)){
    return $.utils.is.changed(file);
  } else {
    return true;
  }
};

gulp.task('coffee:unit', ['clean:unit', 'coffee'], function () {
  return gulp.src($.paths.test.unit.coffee)
    .pipe(compile());
});

gulp.task('unit', ['coffee:unit'], function (done) {
  karma.start({
    configFile: process.cwd() + '/test/karma.conf.js'
  }, done);
});

gulp.task('watch:karma', ['coffee:unit'], function (done) {
  karma.start({
    configFile: process.cwd() + '/test/karma.conf.js',
    singleRun: false,
    autoWatch: true
  }, done)
});

gulp.task('watch:unit:coffee', function () {
  return $.watch({name: 'Unit', glob: $.paths.test.unit.coffee})
    .pipe($.filter($.filters.changed))
    .pipe(compile());
});

gulp.task('watch:unit', ['watch:karma', 'watch:unit:coffee', 'watch:coffee']);
