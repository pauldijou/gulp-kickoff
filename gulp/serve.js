var gulp        = require('gulp');
var $           = require('./utils/$');
var fs          = require('fs');
var browserSync = require('browser-sync');

var prefix = '/api/v1';
var prefixRegExp = new RegExp(prefix + '(.*)');
var middleware;

// Add some random (configurable) latency to mocked server
// so we can simulate more or less slow network
function jitterResponse(res, content) {
  setTimeout(function () {
    res.end(content, 'utf-8')
  }, $.utils.randomInt(0.8 * $.config.latency, 1.2 * $.config.latency));
};

// Parse query string params in a JavaScript object
// "a=1&b=2&b=3" => {a: 1, b: [2, 3]}
function parseParams(query) {
  params = {}
  if (query) {
    query.split('&').forEach(function (paramStr) {
      keyValue = paramStr.split('=');

      if (!params[keyValue[0]]) {
        params[keyValue[0]] = [];
      }

      value = decodeURIComponent(keyValue[1]);

      try {
        value = JSON.parse(value);
      } catch (e) {}

      params[keyValue[0]].push(value);
    });
  }

  for (var key in params) {
    if (params[key].length === 1) {
      params[key] = params[key][0];
    }
  }

  return params;
}

// Will create a middleware if $.config.mocked is true
// If so, it will intercept all requests starting with a prefix
// (here '/api/v1') and return mocked data. It will first try
// to load a JavaScript file as a node module at the same relative
// path. If nothing found, it will try to load a JSON file and use
// its content as the body for the response.
if ($.config.mocked) {
  middleware = function (req, res, next) {
    path = req._parsedUrl.pathname;

    // Test if path start with the prefix
    if (prefixRegExp.test(path)) {
      pathRelative = '.' + path;
      pathJs = pathRelative + '.js';

      // Try to find a JavaScript file at the same relative path
      fs.stat(pathJs, function (error, stats) {
        if (error) {
          // If not, switch to JSON
          pathJson = pathRelative + '.json';
          fs.readFile(pathJson, function (error, content) {
            if (error) {
              // Still not? Return NotFound 404
              console.log('GET', path, '--> 404');
              console.log(error);
              res.writeHead(404);
              res.end();
            } else {
              // If JSON, just return it as the response body
              console.log('GET', path, '--> 200');
              res.writeHead(200, {'Content-Type': 'application/json'});
              jitterResponse(res, content);
            }
          })
        } else {
          // If JavaScript file, load it as node module
          // and then call it with both path and params as arguments
          params = parseParams(req._parsedUrl.query);
          console.log('GET', path, '--> 200');
          res.writeHead (200, {'Content-Type': 'application/json'});
          jitterResponse(
            res,
            JSON.stringify(require('.' + pathJs)(path, params))
          );
        }
      });
    } else {
      // If not starting with prefix, do nothing
      next();
    }
  };
} else {
  // If not mocked, do nothing
  middleware = function (req, res, next) {
    next();
  };
};

gulp.task('serve', function () {
  var config = {
    server: {
      baseDir: './',
      middleware: middleware
    },
    port: $.config.port,
    open: false,
    notify: false
  };

  if (!$.config.sync) {
    config.ghostMode = false;
  }

  browserSync(config);
});
