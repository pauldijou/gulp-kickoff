var gulp = require('gulp');

// Load all Gulp tasks
require('require-dir')('./gulp', { recurse: true });

// Let's define our main tasks here
gulp.task('styles:build', ['scss', 'less', 'stylus']);
gulp.task('styles:watch', ['scss:watch', 'less:watch', 'stylus:watch']);

gulp.task('scripts:build', ['coffee', 'typescript']);
gulp.task('scripts:watch', ['coffee:watch', 'typescript:watch']);

gulp.task('build', ['sprites', 'styles:build', 'scripts:build']);
gulp.task('watch', ['sprites', 'styles:watch', 'scripts:watch', 'html:watch']);

gulp.task('default', ['sprites', 'watch', 'serve']);
