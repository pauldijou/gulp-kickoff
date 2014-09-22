var gulp = require('gulp');

// Load all Gulp tasks
require('require-dir')('./gulp', { recurse: true });

// Let's define our main tasks here
gulp.task('default', ['sprites', 'watch', 'serve']);
