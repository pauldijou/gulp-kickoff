# Gulp Kickoff

## Requirements

* Node
* NPM
* Gulp (`npm install -g gulp`)
* Bower (`npm install -g bower`)
* Ruby (only if using SCSS)

## Setup

~~~ shell
git clone git@github.com:pauldijou/gulp-kickoff.git
cd gulp-kickoff
npm install
bower install
~~~

~~~ shell
# Only if using SCSS
gem install sass
# Or, if you have bundler installed
bundle
~~~

~~~ shell
# Only if using Protractor for end to end testing
./node_modules/.bin/webdriver-manager update
~~~

## Run with mocked data

~~~ shell
gulp --mocked
~~~

Then go to [localhost:8000](http://localhost:8000). You will have live-reloading in any open browser at this url and also full synchronization between them when it comes to scrolling, clicking, etc... Also work on mobile devices.

⚠ Live-reloading might not work when you create a new file. This is due to some limitations of [gaze](https://github.com/shama/gaze) on some platforms. In thise case, just kill and relaunch `gulp`.

## Run with real backend

~~~ shell
gulp
~~~

⚠ Obviously, this task will not really work by default since there is no real backend provided.

## Testing

### Unit testing

~~~ shell
# Run all tests once
gulp unit

# Run all tests once and then only changed files
gulp unit:watch
~~~

### End to end testing

You will need 2 shells: one for running the app and one for running the tests.

~~~ shell
# The app
gulp
~~~

~~~ shell
# Run all tests once
gulp e2e

# Run all tests once and then only changed files
gulp e2e:watch
~~~

⚠ If writing tests in CoffeeScript, you need to replace the `by` global variable from Protractor with `from`, which is just an alias. This is due to the fact that `by` is a reserved keyword in CoffeeScript so the compilation would failed if using it as a variable name. All aliases are defined in `test/protractor.adapter.js` and the injection of this file is done automically by Gulp when compiling CoffeeScript to JavaScript.

## Deploy

~~~ shell
# Produce the final app in the /deploy folder
gulp deploy
~~~
