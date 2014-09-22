module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    // basePath: '',

    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '../bower_components/angular/angular.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/angular-animate/angular-animate.js',
      '../bower_components/angular-sanitize/angular-sanitize.js',
      '../scripts/**/*.js',
      '../build/scripts/**/*.js',
      // Loading real JavaScript tests
      '../test/unit/**/*.js',
      // Loading JavaScript files compiled from CoffeeScript tests
      '../build/test/unit/**/*.js'
    ],

    preprocessors: {},

    // list of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: dots || progress || nested || junit
    // use just 'spec' if you need to see the names of specs to be printed out, sometimes useful to find out
    // where warnigns are thrown.
    reporters: ['nested'],

    junitReporter: {
      outputFile: 'build/test/reports/test-results.xml'
    },

    // web server port
    port: 8080,

    // cli runner port
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari
    // - PhantomJS
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
}
