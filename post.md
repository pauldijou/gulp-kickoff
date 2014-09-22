# Gulp kickoff

## TL;DR

All source code is available on [GitHub](https://github.com/pauldijou/gulp-kickoff.git). If you are in a hurry, just clone it and check the README.

## The problem

Here, at Movio, we recently started a brand new project and we needed to install all the build process for front-end at some point. The one used on previously had started to show some limitations so we decided to build a new one from scratch based on [Gulp](http://gulpjs.com). Why not Grunt or Broccoli? No specific reason, Broccoli is a still a bit too much experimental and Grunt could have done the job just fine but we wanted to give it a try to that streaming idea.

First thing first, we decided on a list of features we needed:

* CSS preprocessor
* JavaScript preprocessor
* Incremental compilation
* Live-reloading of resources
* Hot loading when possible (no need for full reload when injecting CSS)
* Multi-devices synchronized
* Unit testing on real browsers
* End to end testing
* Live testing (only test what needs to be when editing files)
* Ability to serve mocked data easily if backend API isn't ready yet
* Build, minify, versionning of all resources for production

In my opinion, that's quite a nice list. Having all that would be really good for productivity. The following post will show example using our languages (like SASS and CoffeeScript) but you can easily replace it with whatever you like (LESS, Stylus, Typescript, Purescript, ...), it's the idea behind that count.

I want to thank [Dan Tello](https://github.com/greypants) for its work on [gulp-starter](https://github.com/greypants/gulp-starter). Lot of inspiration comes from its article and project.

## Gulp

It takes me a bit of time to wrap my head around of Gulp and its streaming system. The core concept is simple: you take a bunch of files, put them on a pipeline, and stream them to a first task. This one will modify them and then stream those new files to the next task in the pipe, and so on. One cool thing about it is that all is virtual during all the pipeline, no read / write to the disk (except if specified). Sometime, you don't even need to read the content of the files. Super fast!

Another concept is that Gulp will try to run as much task in parallel as possible. So if you say to run tasks A, B and C, the three of them will run at the same time. You can, of course, say that B depends on A. This way, Gulp will run both A and C in parallel and start B as soon as A is finished. It starts getting tricky if you want to run A and then C, and some other time, you need to run B and then C. The solution for the 1st first sequence would be that C depends on A, but we will also want C to depend on B for the 2nd sequence... except we don't want it to depend on both... dammit! At this point, you might want to rethink your task organization. No silver bullet here.

## Let's get started!

The first step is how to organize the project. I wanted the project to reflect the final website organization and I didn't want generated resources to bother developers at all. That's why folder names are agnostics: `/styles` will contains whatever you need to write for the design (CSS, SCSS, LESS, Stylus, ...) and same for `/scripts` (JavaScript, CoffeeScript, Typescript, ...). All generated resources will go inside the `/build` folder, keeping the same organization. For example, `/scripts/app.coffee` will be compiled as `/build/scripts/app.js`. This way, you just have to ignore one folder and you can focus on your real source code. At the same time, if you need to reach a compiled resource, it isn't that far away.

Next is Gulp organization. You can start with only one file and put everything on it, but the more complex your project becomes, the less readable your `gulpfile` will be. Why not having one file for each task? (or several very coupled tasks). Thanks to node modules, we just have to require them in order for the tasks to be loaded. Using something like [require-dir](https://www.npmjs.org/package/require-dir), it's super easy to have a `/gulp` folder with all tasks and just import them. Our final `gulpfile` is so small:

~~~ javascript
var gulp = require('gulp');

// Load all Gulp tasks
require('require-dir')('./gulp', { recurse: true });

// Let's define our main tasks here
gulp.task('default', ['sprites', 'watch', 'serve']);
~~~

## Gulp helpers

Before diving into the real stuff (which is managing resources), I will take a bit more time to talk about some helpers we will use with Gulp because there will be all around after that. Some of them are just Gulp plugins, other ones are inside [/gulp/utils](https://github.com/pauldijou/gulp-kickoff/tree/master/gulp/utils).

### The magic $

I am a super lazy guy, each line I write is a terrific pain in my spin (trust me!). That's why I didn't want to have dozen of `require` all around just to load a bunch of plugins. Looks like I'm not the only one because there is a plugin to load plugins! It's called [gulp-load-plugins](https://www.npmjs.org/package/gulp-load-plugins) and it's really cool. It will automatically require all plugins it can found and put them inside an object which keys are the camel case version of the plugin name. You can configure that of course if you want.

~~~ javascript
// plugins.js: load all plugins and expose them
var plugins = require('gulp-load-plugins')();
module.exports = plugins;

// any task.js
var $ = require('./utils/$.js');
// You can now use any plugin with $.pluginName
~~~

That's nice right! But then, I wanted to set all my paths in one place (to stay DRY and do not copy/paste them), and use common filters, and user common functions, and so on... And I was thinking: "Why not put all that stuff inside the same `$` so that everyone can access it?". That's what I did.

~~~ javascript
var plugins     = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var argv        = require('yargs').argv;

// Expose all Gulp plugins found
module.exports = plugins;

// Expose all your paths in one place
module.exports.paths = {
  styles: './styles/**/*.scss',
  styles: './scripts/**/*.coffee'
};

// Expose some functions to manage live reloading
module.exports.reload = browserSync.reload;

module.exports.reloadStream = function () {
  browserSync.reload({stream: true});
};

// Expose util functions
module.exports.utils = {
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
};

// Expose non-plugin modules
module.exports.lazypipe = require('lazypipe');

// Expose event handlers
module.exports.on = {
  error: require('./onError')
};

// Expose common filters
module.exports.filters = {
  log: function (file) {
    console.log(file.event, file.path);
    return true;
  },
  changed: function (file) {
    return file.event == 'changed';
  }
};

// Expose all supported args from command line
module.exports.config = {
  mocked: argv.mocked || argv.m,
  latency: argv.latency || 100
};
~~~

⚠ Obviously, you need to be cautions about one point: not having naming conflict between a Gulp plugin and your own stuff. For example, if I was using a plugin named `gulp-utils`, I couldn't set `module.exports.utils`, otherwise the plugin definition would be overriden.

### Plumber and watch

One thing that quickly bothered me was my `gulp` process crashing each time my watchers was trying to compiled a resource with a syntax error and failing. I want the error to bubble up to me but I also want to keep the process running so that as soon as I fix it, it will grab it and compile it correctly. In order to achieve that, we are using the [gulp-plumber](npmjs.org/package/gulp-plumber) plugin. With that, your stream will never stop on a failure and you can specify an error handler to manage any error. Pretty cool.

Speaking of watchers, since we will now have endless streams and incremental compilation, we decided to use [gulp-watch](https://www.npmjs.org/package/gulp-watch) rather than the "native" `gulp.watch`. We didn't have any problem with the last one, but `gulp-watch` was just fitting our needs better.

### Notifications

Some developers always have their shell displayed in their screen, some don't. It means we need a way to notify developers when something went wrong with the build process. Using the [gulp-notify](https://www.npmjs.org/package/gulp-notify) plugin, it is super easy to do so and have native notifications that will appear in a corner of your screen. We did [customize the default templating](https://github.com/pauldijou/gulp-kickoff/blob/master/gulp/utils/onError.js) to display the actual line in error. Also, we are displaying the full stacktrace in the shell so that you can still read it if necessary.

⚠ Sometimes, when doing crazy code, there are a bit too many notifications (especially if you have something like an auto-save on your text editor), and I couldn't find a way to reduce the display duration (which is actually quite long to be honest). So there is still place for improvement.

## Resources

Now that we can create some Gulp tasks, seems fair to begin with our compiled resources. We will need 3 tasks: one for cleaning compiled files (just to be sure nothing dirty stay around), one for compiling the resources and one for watching the source files in order to compile again each time a file is edited (and if possible, the compilation should be as small as possible).

A cleaning task looks like:

~~~ javascript
gulp.task('clean:scripts', function {
  return gulp.src($.paths.scripts.build, {read: false})
    .pipe($.rimraf())
});
~~~

Since we will remove files, we don't need to read their content: `{read: false}`. After that, it's just a matter of passing it to the [gulp-rimraf](https://www.npmjs.org/package/gulp-rimraf) plugin to delete them.

A compilation task is about taking a bunch of files and compile them, right? So we can actually use the same pipeline for both the full compilation (at startup) and the incremental one, all that matter is the files we pass in entry. To stay DRY, we will define the common pipeline using [lazypipe](https://www.npmjs.org/package/lazypipe) and then pipe in if from different endpoints.

~~~ javascript
// Coffee script main pipeline
compile = $.lazypipe()
  .pipe($.plumber, {errorHandler: $.on.error})
  .pipe($.coffee, {bare: true})
  .pipe(gulp.dest, $.paths.scripts.dest)
  .pipe($.reloadStream);
~~~

This is just a "virtual" pipeline that doesn't do anything by itself. But if you provide it a stream of files, it will do the following:

1. Transform the stream with plumber so that it doesn't stop in case of error
* Add and error handler to notify user if something go wrong
* Compiled all files from CoffeeScript to JavaScript
* Write the new files to the destination `/build` folder
* Live-reload browsers from the stream of new files

As you are reading those line and comparing with the code sample, you can fully grasp why writing streams is so nice: you are coding exactly what you have in mind, a succession of operations to be performed to achieve the final result. And it is extremely readable.

Anyway, once we have this pipeline ready, we can use it in two different configurations:

~~~ javascript
// Compiling all files
gulp.task('coffee', ['scripts:clean'], function () {
  return gulp.src($.paths.coffee.all)
    .pipe(compile());
});

// Compiling only modified files
gulp.task ('coffee:watch', ['scripts:clean'], function () {
  return $.watch({name: 'Coffee', glob: $.paths.coffee.all})
    .pipe(compile());
});
~~~

The first task, `coffee`, will just take all coffee files and stream them to our common pipeline. That's it! It will also clean the old ones since it depends on the `scripts:clean` task. And yeah, we don't really need live-reloading here most of the time, but whatever, if the server isn't running, our last pipeline step will just do nothing.

The second task, `coffee:watch`, will do the exact same thing and then monitor all files and only stream the modified to the pipeline. I guess we can call it incremental compilation with live-reload. By the way, it will indeed perform a full compilation at startup because it will stream every files from the glob when starting to watch them.

It is nearly the same for SCSS files. The only main difference is on the watcher:

~~~ javascript
gulp.task('scss:watch', function () {
  return $.watch({name: 'Scss', glob: $.paths.scss.all}, ['scss'])
});
~~~

We cannot really do incremental compilation for SCSS. You could do one specific compilation for each final CSS file your produce but since we are only generating one CSS file right now, it is easier to just run the full `scss` task each time we detect a modification.

## Server

Now that we got our final resources (CSS and JavaScript), we need to serve them. For that, we will use [BrowserSync](http://www.browsersync.io/) because...

* it can serve files
* it supports live-reloading (refresh browser)
* it supports hot-deploy (CSS is injected and page is repainted without any refresh)
* it supports middleware (talk more about it later for mocked data)
* it automatically sync every browsers connected to the same website, whatever you do in once (scrolling, clicking, ...) will be done in every one
* it is awesome

Look how easy it is to have all those features running:

~~~ javascript
var browserSync = require('browser-sync');

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
~~~

And for live-reloading we have two solutions:

* calling `.pipe($.reloadStream())` in our stream (see coffee example). This one will do hot-deploy if possible.
* running the task `sync:reload`. This one will always refresh the browser.

~~~ javascript
var gulp = require('gulp');
var $    = require('./utils/$');

gulp.task('sync:reload', function () {
  $.reload();
});
~~~

What about that middleware stuff? I will no fully explain it here, but the idea is that if `$.config.mocked` is true, we want the API to return local data rather than targeting the real remote API. By plugin a middleware, we can intercept request and return whatever we want. In the sample, any request starting with `/api` will be intercepted and it will try to load a local node module or JSON file as the response. You can [read the commented code](https://github.com/pauldijou/gulp-kickoff/blob/master/gulp/serve.js) for more infos.

## Tests

Testing is important (come on! of course, it is!). We wanted both unit tests and end to end tests. Both should run on headless and real browsers, just because.

One thing that would have been awesome is to only run tests based on the last modified files... incremental testing! Let's be honest, we can do it when editing test files (only run tests on those files) but there is no way to know which tests should be ran when editing source code... I mean, there is no link saying that this particular feature is actually tested on this test file. We could have tried to use naming convention, but at the end, it didn't seem to be worth it. So we do have "incremental" testing, but only on test files. If editing a source file, we just need to save again the test file that match if (even without any modifications) and it will run again. If someone find a better solution, let me know!

### Unit testing

We are using Karma to run our unit tests. It allows us to easily test on different browsers. I tried to use Gulp watchers to monitor files and run Karma only with the streamed files from the watchers... but finally, I gave up and now using the `autoWatch` feature. We are still using Gulp to do incremental compilation of our tests written in CoffeeScript.

The main problem of this solution is to have to run all tests during startup. When you have thousand of tests, it might take a bit of time. BUT! it assures you that all is fine before you begin doing some new stuff. Which is not that bad... so it's like a trade off. Could be better but finally not so bad.

### End to end testing with Protractor

This section is dedicated to AngularJS since all tests are based on Protractor. At some point, it would be cool to have a more generic section with Selenimum tests.

Not much to say, it's quite the same as unit testing except all files are managed by Gulp since there is not such thing as `autoWatch` in Protractor. Each time a test file is modified, BAM, we stream it to the tool and test it.

## Production

At some point, hopefuly, we need to package and deploy our website. There are two main steps to achieve that. One is minifying and optimizing resources. The other is versionning them (because... browser caching). We will do that by using [gulp-usemin](https://www.npmjs.org/package/gulp-usemin) which allow you to apply a pipeline to some resources extracted from an HTML file and replace them... Let's take an example to understand it better. Let's say you have a bunch of `scripts` tags inside your `index.html`. You want to concatenate them into a single file, minify it and append a version suffix. For that, you only need to wrap the tags inside some specific comments:

~~~ markup
<!-- build:js scripts/app.min.js -->
<script src="build/scripts/file1.js"></script>
<script src="build/scripts/file2.js"></script>
<script src="build/scripts/file3.js"></script>
<!-- endbuild -->
~~~

And then define a `js` pipeline inside `usemin`:

~~~ javascript
gulp.task('usemin', ['clean:build', 'build'], function () {
  return gulp.src(['./index.html', $.paths.templates.all], {base: './'})
    .pipe($.usemin({
      // CSS pipeline: minify, concat, append version
      css: [$.minifyCss(), 'concat', $.rev()],
      // HTML pipeline: only minify
      html: [$.minifyHtml({empty: true})],
      // JS pipeline: uglify (concat + minify), append version
      js: [$.uglify(), $.rev()]
    }))
    .pipe(gulp.dest($.paths.build.dest));
});
~~~

As we can see, all our JavaScript files will be uglified to produced a final `app.min.js` file (1st step of the pipeline) and then, thanks to [gulp-rev](https://www.npmjs.org/package/gulp-rev), it will append a suffix to the filename based on a hash of the file content, like `app.min-06e3ba26.js`, so that each time you change the content, a new name will be assigned. Just perfect for browser caching.

We could use whatever tools we want. If you prefer CSSO than basic CSS minification, just replace `$.minifyCss` with `$.csso` (after installing the plugin) and you're done!

The final result will be inside the `deploy` folder, including the new `index.html` with the new resource imports based on the new generated names. You just need to copy/paste it to your production server, and that's it. Enjoy!

## Final thoughts

We didn't cover all the topics handled by the project (like SVG to icons or image minification) but feel free to [dive into the code](https://github.com/pauldijou/gulp-kickoff) (which isn't really hard), check the [README](https://github.com/pauldijou/gulp-kickoff/blob/master/README.md) and kickoff your next big project using Gulp!
