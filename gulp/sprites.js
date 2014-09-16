var gulp    = require('gulp');
var $       = require('./utils/$');

gulp.task('sprites', function () {
  return gulp.src('./images/icons/*.svg')
    .pipe $.svgSprites({
      mode: 'symbols',
      preview: false,
      svgId: 'icon-%f',
      svg: {symbols: 'icons.svg'}
    })
    .pipe gulp.dest('./images');
});
