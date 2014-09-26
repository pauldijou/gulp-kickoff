regexJs = /js$/;
regexCoffee = /coffee$/;
regexTypescript = /ts$/;

module.exports = {
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  },
  is: {
    js: function (file) {
      return regexJs.test(file.path);
    },
    coffee: function (file) {
      return regexCoffee.test(file.path);
    },
    typescript: function (file) {
      return regexTypescript.test(file.path);
    },
    changed: function (file) {
      return 'changed' === file.event;
    }
  }
};
