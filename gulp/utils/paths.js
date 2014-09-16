module.exports = {
  styles: {
    all: './build/styles/**/*.scss',
    dest: './build/styles'
  },
  scripts: {
    all: './build/scripts/**/*.js',
    dest: './build/scripts'
  },
  coffee: {
    all: './scripts/**/*.coffee',
  },
  scss: {
    bower: './bower_components/**/*.scss',
    all: './styles/**/*.scss',
    app: './styles/app.scss'
  },
  templates: {
    all: './templates/**/*.html'
  },
  images: {
    final: ['./images/*.svg']
  },
  build: './build'
  test: {
    unit: {
      coffee: './test/unit/**/*.coffee',
      js: './test/unit/**/*.js',
      dest: './test/build/unit',
      build: './test/build/unit/**/*.js'
    },
    e2e: {
      coffee: './test/e2e/**/*.coffee',
      js: './test/e2e/**/*.js',
      dest: './test/build/e2e',
      build: './test/build/e2e/**/*.js'
    }
  }
};
