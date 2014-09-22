angular.module('app').controller 'HomeCtrl', ($scope, Logger)->
  $scope.welcome = 'Hello there!'
  Logger.debug $scope.welcome
