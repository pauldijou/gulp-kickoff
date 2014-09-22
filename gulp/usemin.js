var gulp    = require('gulp');
var $       = require('./utils/$');

gulp.task('usemin', ['deploy:clean', 'build'], function () {
  return gulp.src(['./index.html', $.paths.templates.all], {base: './'})
    .pipe($.usemin({
      css: [$.minifyCss(), 'concat', $.rev()],
      html: [$.minifyHtml({empty: true})],
      js: [$.uglify(), $.rev()]
    }))
    .pipe(gulp.dest($.paths.build));
});
