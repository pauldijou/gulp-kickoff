var gulp = require('gulp');

gulp.task('styles:build', ['scss', 'less', 'stylus']);

gulp.task('scripts:build', ['coffee', 'typescript']);

gulp.task('build', ['sprites', 'styles:build', 'scripts:build']);
