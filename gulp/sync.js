var gulp = require('gulp');
var $    = require('./utils/$');

gulp.task('sync:reload', function () {
  $.reload();
});
