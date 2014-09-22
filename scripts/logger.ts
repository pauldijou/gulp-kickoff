angular.module('app').factory('Logger', function () {
  return {
    debug: function (message: string) { console.debug(message); },
    log: function (message: string) { console.log(message); }
  }
});
