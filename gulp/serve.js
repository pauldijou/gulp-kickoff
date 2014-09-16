var gulp        = require('gulp');
var $           = require('./utils/$');
var fs          = require('fs');
var browserSync = require('browser-sync');

prefix = '/api/v1';
prefixRegExp = new RegExp(prefix + '(.*)');

function jitterResponse(res, content) {
  setTimeout(function () {
    res.end(content, 'utf-8')
  }, $.utils.randomInt(0.8 * $.aegs.latency, 1.2 * $.aegs.latency));
};

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

var middleware = if ($.args.mocked) {
  return function (req, res, next) {
    path = req._parsedUrl.pathname;

    if (prefixRegExp.test(path)) {
      pathRelative = '.' + path;
      pathCoffee = pathRelative + '.coffee';

      fs.stat(pathCoffee, function (error, stats) {
        if (error) {
          pathJson = pathRelative + '.json';
          fs.readFile(pathJson, function (error, content) {
            if (error) {
              console.log('GET', path, '--> 404');
              console.log(error);
              res.writeHead(404);
              res.end();
            } else {
              console.log('GET', path, '--> 200');
              res.writeHead(200, {'Content-Type': 'application/json'});
              jitterResponse(res, content);
            }
          })
        } else {
          params = parseParams(req._parsedUrl.query);
          console.log('GET', path, '--> 200');
          res.writeHead (200, {'Content-Type': 'application/json'});
          jitterResponse(
            res,
            JSON.stringify(require('.' + pathCoffee)(path, params))
          );
        }
      });
    } else {
      next();
    }
  }
} else {
  return function (req, res, next) {
    next();
  }
};

gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './',
      middleware: middleware
    },
    port: 8000,
    open: false,
    notify: false
  });
});
