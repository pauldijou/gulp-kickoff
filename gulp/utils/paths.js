module.exports = {
  styles: {
    dir: './styles',
    build: './build/styles/**/*.css',
    dest: './build/styles'
  },
  scripts: {
    dir: './scripts',
    build: './build/scripts/**/*.js',
    dest: './build/scripts'
  },
  bower: {
    dir: './bower_components'
  },
  coffee: {
    all: './scripts/**/*.coffee'
  },
  typescript: {
    all: './scripts/**/*.ts'
  },
  scss: {
    all: './styles/**/*.scss',
    app: './styles/app-scss.scss'
  },
  less: {
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
    all: ['./images/**/*', '!./images/icons/**/*.svg']
  },
  build: {
    dir: './build'
  },
  deploy: {
    dir: './deploy'
  },
  test: {
    unit: {
      js: './test/unit/**/*.js',
      coffee: './test/unit/**/*.coffee',
      typescript: './test/unit/**/*.ts',
      dest: './build/test/unit',
      build: './build/test/unit/**/*.js'
    },
    e2e: {
      js: './test/e2e/**/*.js',
      coffee: './test/e2e/**/*.coffee',
      typescript: './test/e2e/**/*.ts',
      dest: './build/test/e2e',
      build: './build/test/e2e/**/*.js'
    }
  }
};
