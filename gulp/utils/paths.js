module.exports = {
  styles: {
    build: './build/styles/**/*.scss',
    dest: './build/styles'
  },
  scripts: {
    build: './build/scripts/**/*.js',
    dest: './build/scripts'
  },
  coffee: {
    all: './scripts/**/*.coffee',
  },
  typescript: {
    all: './scripts/**/*.ts',
  },
  scss: {
    bower: './bower_components/**/*.scss',
    all: './styles/**/*.scss',
    app: './styles/app-scss.scss'
  },
  less: {
    bower: './bower_components/**/*.less',
    all: './styles/**/*.less',
    app: './styles/app-less.less'
  },
  stylus: {
    bower: './bower_components/**/*.styl',
    all: './styles/**/*.styl',
    app: './styles/app-stylus.styl'
  },
  templates: {
    all: './templates/**/*.html'
  },
  images: {
    final: ['./images/*.svg']
  },
  build: {
    dest: './build'
  },
  deploy: {
    dest: './deploy'
  },
  test: {
    unit: {
      js: './test/unit/**/*.js',
      coffee: './test/unit/**/*.coffee',
      dest: './build/test/unit',
      build: './build/test/unit/**/*.js'
    },
    e2e: {
      js: './test/e2e/**/*.js',
      coffee: './test/e2e/**/*.coffee',
      dest: './build/test/e2e',
      build: './build/test/e2e/**/*.js'
    }
  }
};
