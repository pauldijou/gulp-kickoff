var gulp = require('gulp');
var $    = require('./utils/$');

// Are we using watchify?
var bigBrother = false;

function bundle(b, file, done) {
  var pipeline = b.bundle()
    .on('error', $.on.error)
    .pipe($.source(file.path))
    .pipe(gulp.dest($.paths.build.dir));

  if (!bigBrother) {
    pipeline.on('end', done);
  }

  return pipeline;
}

function browserify(done) {
  return $.through2.obj(function(file, enc, cb) {
    var b = $.browserify({
      cache: {},
      packageCache: {},
      fullPaths: true
    });

    b.add(file);

    if (bigBrother) {
      b = $.watchify(b);
      b.on('update', function () {
        return bundle(b, file, done);
      });
    }

    return bundle(b, file, done);
  });
}

gulp.task('browserify', function (done) {
  bigBrother = false;
  return gulp.src($.paths.browserify.app).pipe(browserify(done));
});

gulp.task('browserify:watch', function (done) {
  bigBrother = true;
  return gulp.src($.paths.browserify.app).pipe(browserify(done));
});
